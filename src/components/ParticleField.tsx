"use client";

import { useEffect, useRef } from "react";
import { useIsMobile } from "@/components/useIsMobile";

// ---------------------------------------------------------------------------
// The ambient starfield the whole site floats on.
//
// This used to be react-three-fiber: a second WebGL context, the three.js
// render loop, and 420 points — to draw 420 dots. On a phone that second
// context was expensive enough that it was switched off entirely, which left
// mobile visitors looking at a flat black page behind the Core while desktop
// got the atmosphere. That is the wrong thing to have traded away; this
// background is most of the site's character.
//
// So the same scene is drawn on a 2D canvas instead. The points are still
// real 3D positions, still yaw slowly, still perspective-project with
// distance-attenuated size, and still composite additively — the maths below
// is the same maths the WebGL material was doing, at a cost a phone does not
// notice. It runs everywhere now, and desktop loses a WebGL context it never
// needed.
//
// The Core's own sphere (CoreSphere3D) is still real WebGL. That one earns it.
// ---------------------------------------------------------------------------

/** Camera, matching the three.js setup this replaces: position [0,0,5], fov 45. */
const CAM_Z = 5;
const FOCAL = 1 / Math.tan((45 / 2) * (Math.PI / 180)); // 2.414

/** Flat arrays, not an array of objects: this is walked every frame and the
 *  three coordinates want to be next to each other in memory. */
function makeStars(count: number) {
  const x = new Float32Array(count);
  const y = new Float32Array(count);
  const z = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    x[i] = (Math.random() - 0.5) * 18;
    y[i] = (Math.random() - 0.5) * 10;
    z[i] = (Math.random() - 0.5) * 8 - 2;
  }
  return { x, y, z };
}

export default function ParticleField({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Assumed mobile until the viewport is known, so a phone never allocates the
  // larger field and then throws it away.
  const isMobile = useIsMobile(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // The spawn box is fixed in world units, so a narrow viewport sees a much
    // smaller slice of it — at 390px wide only about a tenth of the stars can
    // ever be on screen, against a third at 1440px. Spawning the same 420
    // either way is what made the phone sky look empty. Scaling the count by
    // aspect keeps the density a visitor actually sees the same on both.
    //
    // The extra stars cost almost nothing: they are culled right after the
    // projection, long before anything is drawn, and only ~60 are ever painted.
    const aspect0 = window.innerWidth / Math.max(1, window.innerHeight);
    const spawnScale = Math.max(1, Math.min(4, 1.6 / Math.max(0.2, aspect0)));
    const count = Math.round(420 * spawnScale * density);
    const stars = makeStars(count);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Pointer parallax, desktop only — there is no hovering pointer on a phone,
    // and the listener would just be dead weight.
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });

    let yaw = 0;
    let raf = 0;
    let last = performance.now();
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(64, now - last) / 1000;
      last = now;

      if (!reduced) yaw += dt * 0.015;
      eased.x += (target.x - eased.x) * 0.02;
      eased.y += (target.y - eased.y) * 0.02;

      const pitch = -eased.y * 0.05;
      const cosY = Math.cos(yaw - eased.x * 0.0002);
      const sinY = Math.sin(yaw - eased.x * 0.0002);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      const cx = w / 2;
      const cy = h / 2;
      const half = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Everything below is one fill state for the whole field. Setting
      // fillStyle per star means parsing that colour string a thousand times
      // a frame, which is most of what a canvas starfield can cost; and a
      // 1-2px dot drawn with beginPath/arc/fill is paying for a circle
      // nobody can see the roundness of. Hoisted and squared, this went from
      // the dominant cost on a throttled phone to a rounding error.
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = "#52f2ff";

      const sx = stars.x;
      const sy = stars.y;
      const sz = stars.z;

      for (let i = 0; i < count; i++) {
        const bx = sx[i];
        const by = sy[i];
        const bz = sz[i];
        // yaw about Y, then pitch about X — same order the Points object used
        const x1 = bx * cosY - bz * sinY;
        const z1 = bx * sinY + bz * cosY;
        const y1 = by * cosP - z1 * sinP;
        const z2 = by * sinP + z1 * cosP;

        const depth = CAM_Z - z2;
        if (depth <= 0.1) continue;

        const k = (half * FOCAL) / depth;
        const px = cx + x1 * k;
        const py = cy - y1 * k;
        if (px < -8 || px > w + 8 || py < -8 || py > h + 8) continue;

        // Point size, matching the material this replaces. three.js scales
        // gl_PointSize by (height / 2) / depth — note there is no focal term
        // in it, unlike the position above.
        const d = (0.028 * half) / depth;
        if (d < 0.3) continue;

        ctx.fillRect(px - d * 0.5, py - d * 0.5, d, d);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // A background animating behind a hidden tab is pure waste.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      if (!coarse) window.removeEventListener("pointermove", onPointer);
    };
  }, [density, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
