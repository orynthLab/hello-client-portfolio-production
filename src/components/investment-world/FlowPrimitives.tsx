"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealUp, ensureScrollTrigger } from "./motion";

// ---------------------------------------------------------------------------
// Shared node + connector primitives for every pipeline diagram in this
// world (the decision flow, the system architecture). One visual grammar —
// a glowing dot, a mono uppercase label, a traveling light between nodes —
// reused rather than redrawn per section, and lifted directly from the same
// node/motion-path technique The Core already uses for its own connections.
// ---------------------------------------------------------------------------

export function FlowNode({
  label,
  sub,
  accent,
  big,
}: {
  label: string;
  sub?: string;
  accent: string;
  big?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <span
        className="absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{ backgroundColor: accent, opacity: big ? 0.4 : 0.18 }}
        aria-hidden
      />
      <span
        className="iw-node-dot relative"
        style={{
          width: big ? 14 : 9,
          height: big ? 14 : 9,
          backgroundColor: accent,
          boxShadow: `0 0 ${big ? 26 : 16}px ${accent}`,
        }}
      />
      <p
        className="relative mt-3 whitespace-nowrap text-center font-mono uppercase tracking-[0.16em]"
        style={{ fontSize: big ? 12 : 10, color: big ? "#f3d38a" : "rgba(220,228,245,0.72)" }}
      >
        {label}
      </p>
      {sub && <p className="relative mt-1 max-w-[10rem] text-center text-[10px] leading-snug text-ink-faint">{sub}</p>}
    </div>
  );
}

/** N source x-positions (0-100) converging or running parallel into a target, each carrying a looping light. */
export function FlowConnector({ from, height = 96 }: { from: number[]; height?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    ensureScrollTrigger();
    const ctx = gsap.context(() => {
      if (wrapRef.current) revealUp(wrapRef.current, wrapRef.current, { y: 0, duration: 0.8 });

      // These loop forever (repeat: -1), so left unmanaged they'd keep computing
      // motion-path positions every frame for the rest of the page's life even
      // once scrolled far out of view. Pausing/resuming on visibility keeps the
      // "energy traveling the wire" effect while it's on screen without paying
      // for it everywhere else.
      const tweens: gsap.core.Tween[] = [];
      pathRefs.current.forEach((path, i) => {
        const dot = dotRefs.current[i];
        if (!path || !dot) return;
        gsap.set(dot, { opacity: 0.9 });
        tweens.push(
          gsap.to(dot, {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            duration: 2.2,
            repeat: -1,
            delay: i * 0.5,
            ease: "power1.inOut",
            paused: true,
          })
        );
      });

      if (wrapRef.current) {
        ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top 120%",
          end: "bottom -20%",
          onEnter: () => tweens.forEach((t) => t.play()),
          onEnterBack: () => tweens.forEach((t) => t.play()),
          onLeave: () => tweens.forEach((t) => t.pause()),
          onLeaveBack: () => tweens.forEach((t) => t.pause()),
        });
      }
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  const target = from.length > 1 ? 50 : from[0];

  return (
    <div ref={wrapRef} className="relative mx-auto flex w-full max-w-md items-center justify-center" style={{ height }}>
      <svg ref={svgRef} className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {from.map((x, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={`M ${x} 0 Q ${target} 55 ${target} 100`}
            fill="none"
            stroke="rgba(140,165,205,0.22)"
            strokeWidth="0.6"
          />
        ))}
        {from.map((_, i) => (
          <circle
            key={`d-${i}`}
            ref={(el) => {
              dotRefs.current[i] = el;
            }}
            r="1"
            fill="#f3d38a"
            style={{ filter: "drop-shadow(0 0 3px #f3d38a)" }}
          />
        ))}
      </svg>
    </div>
  );
}
