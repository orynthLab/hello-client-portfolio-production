"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type CursorMode = "default" | "explore" | "open" | "demo" | "launch" | "expand" | "connect";

const LABELS: Record<CursorMode, string> = {
  default: "",
  explore: "Explore",
  open: "Open",
  demo: "View Demo",
  launch: "Launch",
  expand: "Expand",
  connect: "Connect",
};

const RING_SCALE_INACTIVE = 9 / 20;
const RING_SCALE_ACTIVE = 1;

function subscribeCoarse(callback: () => void) {
  const mq = window.matchMedia("(pointer: coarse)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCoarseSnapshot() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function getCoarseServerSnapshot() {
  return true;
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const isCoarse = useSyncExternalStore(subscribeCoarse, getCoarseSnapshot, getCoarseServerSnapshot);
  const targetScaleRef = useRef(RING_SCALE_INACTIVE);

  // The ring used to grow from h-9 w-9 to h-20 w-20 via a width/height CSS
  // transition — animating width/height forces a layout+paint pass every
  // single frame of that 300ms transition, which is exactly the moment a
  // visitor hovers something interactive (like the video's play button).
  // Keeping the box a fixed size and scaling it via transform instead means
  // the resize is fully GPU-composited, no layout involved.
  useEffect(() => {
    targetScaleRef.current = mode !== "default" ? RING_SCALE_ACTIVE : RING_SCALE_INACTIVE;
  }, [mode]);

  useEffect(() => {
    if (isCoarse) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = 0;
    let ringY = 0;
    let ringScale = RING_SCALE_INACTIVE;
    let mouseX = 0;
    let mouseY = 0;
    let raf = 0;
    let seenMove = false;
    let lastCheckedX = -1;
    let lastCheckedY = -1;
    let forceRecheck = false;

    // elementFromPoint forces a synchronous layout/hit-test — genuinely expensive
    // on a page this visually busy, and the loop below used to call it every
    // single animation frame even while the mouse sat still. Only re-deriving it
    // when the position actually moved since the last check cuts that cost to
    // near zero while idle, without losing the "DOM changed under a stationary
    // cursor" self-correction (forceRecheck below covers that case explicitly).
    const updateMode = () => {
      const el = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const target = el?.closest("[data-cursor]") as HTMLElement | null;
      setMode((target?.dataset.cursor as CursorMode) || "default");
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!seenMove) {
        seenMove = true;
        setVisible(true);
      }
      // updateMode() runs a forced-layout hit test (elementFromPoint) — the rAF
      // loop below already re-derives it once per frame, so calling it again here
      // on every raw mousemove (which can fire far faster than the frame rate on
      // high-poll-rate mice) was doubling the hit-test cost for no visible benefit.
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ringScale += (targetScaleRef.current - ringScale) * 0.22;
      if (ring) {
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }
      if (seenMove && (forceRecheck || mouseX !== lastCheckedX || mouseY !== lastCheckedY)) {
        lastCheckedX = mouseX;
        lastCheckedY = mouseY;
        forceRecheck = false;
        updateMode();
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    // Low-frequency safety net for the stationary-cursor-over-changing-DOM case
    // (e.g. a button gets replaced right after being clicked) — far cheaper than
    // re-testing every frame just to cover a rare edge case.
    const safetyInterval = window.setInterval(() => {
      forceRecheck = true;
    }, 400);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      window.clearInterval(safetyInterval);
    };
  }, [isCoarse]);

  if (isCoarse) return null;

  const label = LABELS[mode];
  const active = mode !== "default";

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan will-change-transform"
      />
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 flex h-20 w-20 items-center justify-center rounded-full border will-change-transform transition-[background-color,border-color] duration-300 ease-out ${
          active ? "border-cyan/70 bg-cyan/10" : "border-white/25 bg-transparent"
        }`}
      >
        <span
          className={`font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-opacity duration-200 ${
            active ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
