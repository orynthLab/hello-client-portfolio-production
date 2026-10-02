"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import type { CoreVisualState } from "./CoreSphere3D";
import { buildUniverse, type UniverseNode } from "./universe";
import {
  CoreParticleEngine,
  QUALITY,
  coreRadiusPx,
  type ClusterScreenPoint,
  type CorePhase,
} from "./ParticleEngine";
import ProjectHoverCard from "./ProjectHoverCard";

// ---------------------------------------------------------------------------
// The Core — "One Core. Click to awaken. Infinite Worlds emerge."
//
// Division of labour:
//   ParticleEngine  — every particle, every frame, in 3D. Zero React.
//   this component  — phase, hovered slug, and a thin DOM layer of one real
//                     <Link> per project sitting over the canvas.
//
// That DOM layer is what makes the universe accessible: each cluster is a
// genuine focusable link with a real href, so keyboard, screen readers, touch
// and middle-click all work. Its elements are positioned imperatively from the
// engine's per-frame callback — the field can be orbited, and re-rendering
// React sixty times a second to follow it is exactly what the board's
// "no unnecessary React re-renders" rules out.
// ---------------------------------------------------------------------------

const ACTIVATED_KEY = "hc-core-activated";
const SELECTED_KEY = "hc-core-selected";
const VISITED_KEY = "hc-core-visited";

/** sessionStorage can throw outright (Safari private mode, blocked site data) —
 *  the Core must still work when it does. */
const store = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage unavailable — the Core degrades to "first visit" behavior */
    }
  },
};

function pickQuality(w: number, coarse: boolean) {
  if (w < 768 || coarse) return QUALITY.mobile;
  if (w < 1180) return QUALITY.tablet;
  return QUALITY.desktop;
}

/** Past this much pointer travel, the gesture was an orbit drag, not a click. */
const DRAG_SLOP = 6;

// The Core's WebGL layer. Client-only and loaded on demand — it is the one
// heavy import here, and it is never needed once the universe is open.
const CoreSphere3D = dynamic(() => import("./CoreSphere3D"), { ssr: false });

export default function CoreUniverse() {
  const router = useRouter();
  const nodes = useMemo<UniverseNode[]>(() => buildUniverse(), []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CoreParticleEngine | null>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pointsRef = useRef<ClusterScreenPoint[]>([]);
  const navigatingRef = useRef(false);
  const activeRef = useRef<string | null>(null);
  const draggedRef = useRef(false);

  const [phase, setPhase] = useState<CorePhase>("idle");
  const [active, setActive] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [coreR, setCoreR] = useState(96);

  // Shared, mutable, and deliberately outside React: the engine writes the
  // Core's compression and opacity here every frame and the 3D sphere reads it
  // in its own render loop, so neither drives a re-render.
  const visualRef = useRef<CoreVisualState>({ energy: 0, alpha: 1 });

  const activeNode = nodes.find((n) => n.slug === active) ?? null;
  const universeOpen = phase === "universe" || phase === "reorganizing";

  // ---- engine lifecycle --------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTouch(coarse);
    setReduced(prefersReduced);
    setCoreR(coreRadiusPx(window.innerWidth, window.innerHeight));

    const engine = new CoreParticleEngine(canvas, {
      nodes,
      quality: pickQuality(window.innerWidth, coarse),
      reducedMotion: prefersReduced,
      visual: visualRef.current,
      onPhase: setPhase,
      onHover: (slug) => {
        activeRef.current = slug;
        setActive(slug);
      },
      // Per frame: move the DOM straight, never through React.
      onFrame: (pts) => {
        pointsRef.current = pts;
        for (let i = 0; i < pts.length; i++) {
          const el = hotspotRefs.current[i];
          if (!el) continue;
          const p = pts[i];
          el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
          el.style.width = `${p.radius * 2}px`;
          el.style.height = `${p.radius * 2}px`;
        }
        const card = cardRef.current;
        if (card) {
          const slug = activeRef.current;
          const p = slug ? pts.find((q) => q.slug === slug) : null;
          if (p) {
            const below = p.y < window.innerHeight * 0.45;
            const left = Math.min(Math.max(p.x - 114, 12), Math.max(12, window.innerWidth - 240));
            const top = below ? p.y + p.radius + 16 : p.y - p.radius - 16;
            card.style.transform = `translate3d(${left}px, ${top}px, 0)${below ? "" : " translateY(-100%)"}`;
            card.style.opacity = "1";
          } else {
            card.style.opacity = "0";
          }
        }
      },
    });
    engineRef.current = engine;
    engine.setHighlight(store.get(SELECTED_KEY));
    engine.start();

    // Returning from a project inside this session: the board asks that the
    // universe stay alive rather than replaying the whole opening.
    if (store.get(ACTIVATED_KEY) === "true") engine.enterUniverseImmediately();

    const onResize = () => {
      engine.resize();
      setCoreR(coreRadiusPx(window.innerWidth, window.innerHeight));
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engine.destroy();
      engineRef.current = null;
    };
  }, [nodes]);

  // ---- orbit / zoom ------------------------------------------------------
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let downX = 0;
    let downY = 0;

    const localPoint = (e: { clientX: number; clientY: number }) => {
      const rect = wrap.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      draggedRef.current = false;
      lastX = downX = e.clientX;
      lastY = downY = e.clientY;
    };

    const onMove = (e: PointerEvent) => {
      const p = localPoint(e);
      engineRef.current?.setPointer(p.x, p.y);
      if (!dragging) return;
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > DRAG_SLOP) draggedRef.current = true;
      engineRef.current?.orbitBy(e.clientX - lastX, e.clientY - lastY);
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onUp = () => {
      dragging = false;
      // let the click handler see the drag flag, then clear it
      window.setTimeout(() => {
        draggedRef.current = false;
      }, 0);
    };

    const onLeave = () => engineRef.current?.setPointer(-9999, -9999);

    const onWheel = (e: WheelEvent) => {
      // Only claim the gesture once the universe exists; before that the page
      // should scroll normally.
      if (engineRef.current?.getPhase() !== "universe") return;
      e.preventDefault();
      // Canvas-relative, so the zoom anchors on whatever the pointer is over.
      const r = wrap.getBoundingClientRect();
      engineRef.current.zoomBy(e.deltaY, e.clientX - r.left, e.clientY - r.top);
    };

    wrap.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      wrap.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("wheel", onWheel);
    };
  }, []);

  // ---- interactions ------------------------------------------------------
  const handleActivate = () => {
    if (phase !== "idle") return;
    store.set(ACTIVATED_KEY, "true");
    engineRef.current?.activate();
  };

  const enter = useCallback(
    (node: UniverseNode) => {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      store.set(SELECTED_KEY, node.slug);
      let visited: string[] = [];
      try {
        const raw = JSON.parse(store.get(VISITED_KEY) ?? "[]");
        if (Array.isArray(raw)) visited = raw;
      } catch {
        visited = [];
      }
      store.set(VISITED_KEY, JSON.stringify(Array.from(new Set([...visited, node.slug]))));

      // The original Core's transition, unchanged: a circular wipe in the
      // project's accent, expanding from the cluster that was clicked.
      const flash = flashRef.current;
      const point = pointsRef.current.find((p) => p.slug === node.slug);
      if (!flash || !point) {
        router.push(node.href);
        return;
      }
      const cx = (point.x / window.innerWidth) * 100;
      const cy = (point.y / window.innerHeight) * 100;
      flash.style.backgroundColor = node.accent;
      gsap.set(flash, { clipPath: `circle(0% at ${cx}% ${cy}%)`, opacity: 1 });
      gsap.to(flash, {
        clipPath: `circle(140% at ${cx}% ${cy}%)`,
        duration: 0.75,
        ease: "power3.in",
        onComplete: () => router.push(node.href),
      });
    },
    [router]
  );

  const handleClusterClick = (e: React.MouseEvent, node: UniverseNode) => {
    e.preventDefault();
    if (draggedRef.current) return; // that gesture was an orbit, not a click
    // Touch has no hover: first tap reveals the card, second enters.
    if (isTouch && activeRef.current !== node.slug) {
      activeRef.current = node.slug;
      setActive(node.slug);
      return;
    }
    enter(node);
  };

  return (
    // select-none: this surface is dragged, not read. Without it a drag to
    // orbit also starts a native text selection, and every project label on
    // screen lights up blue behind the gesture. Nothing in here is text anyone
    // needs to copy — it is a navigation canvas with labels drawn over it.
    <div
      ref={wrapRef}
      className="absolute inset-0 select-none overflow-hidden"
      style={{ touchAction: "pan-y" }}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

      {/* the accent wipe that carries the visitor into a project world */}
      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] opacity-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />

      {/* ---- 01 · idle state — the Core as a real 3D object ---- */}
      {phase !== "universe" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {/* The WebGL layer. Sized in vmin so the orb keeps its proportion of
              the screen at any viewport, and transparent so the site's own
              background is completely untouched behind it. */}
          {/* The canvas is given room beyond the body so the soft edge light
              has somewhere to fall off; the orb itself fills the inner ~72%. */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500"
            style={{
              width: coreR * 2.8,
              height: coreR * 2.8,
              opacity: phase === "disintegrating" || phase === "reorganizing" ? 0 : 1,
            }}
          >
            <CoreSphere3D stateRef={visualRef} reduced={reduced} />
          </div>

          <button
            type="button"
            onClick={handleActivate}
            aria-label="Open the Core"
            disabled={phase !== "idle"}
            className="pointer-events-auto relative flex items-center justify-center rounded-full transition-opacity duration-500"
            style={{
              width: coreR * 2,
              height: coreR * 2,
              opacity: phase === "idle" ? 1 : 0,
            }}
          >
            <span className="flex flex-col items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-[0.5em] text-ink/70">The</span>
              <span className="font-mono text-[13px] uppercase tracking-[0.34em] text-ink/90">Core</span>
            </span>
          </button>

          {phase === "idle" && (
            <p
              aria-hidden
              className="animate-pulse-soft pointer-events-none absolute font-mono text-[9px] uppercase tracking-[0.42em] text-ink-faint"
              style={{ top: `calc(50% + ${coreR + 46}px)` }}
            >
              Click to enter
            </p>
          )}
        </div>
      )}

      {/* ---- 05 · explore & select ---- */}
      <div className="absolute inset-0" style={{ pointerEvents: universeOpen ? "auto" : "none" }}>
        {universeOpen && (
          <p
            aria-hidden
            className="absolute left-1/2 top-[4.75rem] -translate-x-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.3em] text-ink-faint/70 sm:top-10 sm:text-[9px] sm:tracking-[0.44em]"
          >
            Project Worlds
          </p>
        )}

        {nodes.map((node, i) => (
          <Link
            key={node.slug}
            href={node.href}
            tabIndex={universeOpen ? 0 : -1}
            aria-label={`${node.name} — ${node.subtitle} — ${node.verb}`}
            ref={(el) => {
              hotspotRefs.current[i] = el;
            }}
            className="group absolute left-0 top-0 flex flex-col items-center justify-center rounded-full outline-none"
            style={{
              opacity: universeOpen ? 1 : 0,
              transition: "opacity 700ms ease-out",
              willChange: "transform",
            }}
            onFocus={() => {
              activeRef.current = node.slug;
              setActive(node.slug);
            }}
            onBlur={() => {
              activeRef.current = null;
              setActive(null);
            }}
            onClick={(e) => handleClusterClick(e, node)}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border border-transparent transition-colors group-focus-visible:border-cyan/70"
            />
            <span
              className="pointer-events-none absolute top-[calc(50%+1.45rem)] flex flex-col items-center gap-1 whitespace-nowrap text-center sm:top-[calc(50%+1.7rem)]"
            >
              <span
                className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 sm:text-[11px] sm:tracking-[0.2em]"
                style={{
                  color: active === node.slug ? node.accent : "#e8eefb",
                  opacity: active && active !== node.slug ? 0.45 : 0.92,
                  textShadow: "0 2px 10px rgba(0,0,0,0.95)",
                }}
              >
                {node.shortTitle}
              </span>
              <span
                className="font-mono text-[7.5px] font-medium uppercase tracking-[0.14em] transition-opacity duration-300 sm:text-[9px] sm:tracking-[0.28em]"
                style={{
                  color: node.accent,
                  opacity: active === node.slug ? 1 : active ? 0.3 : 0.62,
                  textShadow: "0 2px 10px rgba(0,0,0,0.95)",
                }}
              >
                {node.verb}
              </span>
            </span>
          </Link>
        ))}

        <ProjectHoverCard ref={cardRef} node={activeNode} />
      </div>

      {/* ---- the three gestures, stated plainly ---- */}
      {universeOpen && (
        <div
          aria-hidden
          // inset-x-0, not left-1/2 with a -translate-x-1/2. The translate
          // centres this visually but leaves its layout width running from the
          // middle of the screen to the right edge — half the viewport. At 390px
          // that is 195px, narrower than the line itself, so one line wrapped to
          // two and the block grew into the space the lowest cluster's label
          // occupies. Spanning the full width and centring with justify-center
          // does what the translate was reaching for.
          className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 px-6 font-mono text-[9px] uppercase tracking-[0.26em] text-ink-faint/70"
        >
          {/* One line on a phone. All three read fine on a wide screen, but at
              390px they wrap to two or three lines and become a 50-60px block
              sitting exactly where the lowest cluster's label wants to be.
              Dragging to look around is the obvious gesture on a touch screen;
              the part worth saying is what a tap does. */}
          {!isTouch && <span>Drag to explore</span>}
          {!isTouch && <span>Scroll to zoom</span>}
          <span>{isTouch ? "Tap a world to enter" : "Click a world to enter"}</span>
        </div>
      )}
    </div>
  );
}
