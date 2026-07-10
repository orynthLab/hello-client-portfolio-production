"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { revealUp, countUpOnce, screenBlend } from "./motion";
import { FlowNode, FlowConnector } from "./FlowPrimitives";
import VideoLightbox from "./VideoLightbox";
import type { StoryBeat } from "./types";

// ---------------------------------------------------------------------------
// SCREEN 2 — The Story.
//
// A 60/40 split: the product walkthrough stays pinned on the left while a
// data-driven sequence of short editorial beats scrolls past on the right.
// The six beat *kinds* (text / flow / engineering / impact / future / cards)
// and their rhythm are the framework, identical across every project world —
// only the `beats` array's content differs per project. This screen is
// meant to read in about two minutes, not to document the system.
// ---------------------------------------------------------------------------

function BeatShell({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) revealUp(ref.current, ref.current, { y: 22, duration: 0.9 });
  }, []);
  return (
    <div ref={ref}>
      <p className="iw-section-label">{label}</p>
      <h3
        className="mt-3 text-2xl font-light"
        style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif", letterSpacing: "-0.02em", color: "#eef1f9" }}
      >
        {title}
      </h3>
      <div className="mt-3 text-sm leading-relaxed text-ink-dim">{children}</div>
    </div>
  );
}

function FlowBeat({ nodes }: { nodes: Extract<StoryBeat, { kind: "flow" }>["nodes"] }) {
  return (
    <div className="flex flex-col items-center">
      {nodes.map((n, i) => (
        <div key={n.label} className="contents">
          <FlowNode label={n.label} sub={n.sub} accent={n.accent} big={n.big} />
          {i < nodes.length - 1 && <FlowConnector from={[50]} height={44} />}
        </div>
      ))}
    </div>
  );
}

function EngineeringBeat({ items }: { items: Extract<StoryBeat, { kind: "engineering" }>["items"] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((it) => (
        <li key={it.term}>
          <span className="text-ink">{it.term}</span> — {it.body}
        </li>
      ))}
    </ul>
  );
}

function ImpactBeat({ metrics }: { metrics: Extract<StoryBeat, { kind: "impact" }>["metrics"] }) {
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    metrics.forEach((m, i) => {
      const el = numberRefs.current[i];
      if (el && m.target !== undefined) {
        countUpOnce(el, m.target, { suffix: m.suffix, prefix: m.prefix });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <div key={m.label}>
          <p
            ref={(el) => {
              numberRefs.current[i] = el;
            }}
            className="text-glow font-mono text-2xl font-light"
            style={{ color: m.accent }}
          >
            {m.target !== undefined ? "0" : m.display}
          </p>
          <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

// "What I Build" — elegant interactive capability cards, built entirely from
// existing primitives (the same lighter .iw-glass surface used by the video
// frame, the same mono-label + accent-color language every other beat uses).
function CardsBeat({ cards }: { cards: Extract<StoryBeat, { kind: "cards" }>["cards"] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {cards.map((c) => (
        <div
          key={c.title}
          data-cursor="explore"
          className="iw-glass rounded-xl p-4 transition-transform duration-300 hover:-translate-y-0.5"
          style={{ borderTop: `2px solid ${c.accent}` }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: c.accent }}>
            {c.title}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{c.body}</p>
        </div>
      ))}
    </div>
  );
}

function FutureBeat({ milestones }: { milestones: Extract<StoryBeat, { kind: "future" }>["milestones"] }) {
  return (
    <div className="flex flex-col gap-4">
      {milestones.map((m) => (
        <div key={m.tag} className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: m.accent }}>
            {m.tag}
          </span>
          <p className="text-sm leading-relaxed text-ink-dim">{m.body}</p>
        </div>
      ))}
    </div>
  );
}

function Beat({ beat }: { beat: StoryBeat }) {
  switch (beat.kind) {
    case "text":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          {beat.paragraphs.map((p) => (
            <p key={p} className={beat.paragraphs.indexOf(p) > 0 ? "mt-3" : undefined}>
              {p}
            </p>
          ))}
        </BeatShell>
      );
    case "flow":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          <FlowBeat nodes={beat.nodes} />
        </BeatShell>
      );
    case "engineering":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          <EngineeringBeat items={beat.items} />
        </BeatShell>
      );
    case "impact":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          <ImpactBeat metrics={beat.metrics} />
        </BeatShell>
      );
    case "future":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          <FutureBeat milestones={beat.milestones} />
        </BeatShell>
      );
    case "cards":
      return (
        <BeatShell label={beat.label} title={beat.title}>
          <CardsBeat cards={beat.cards} />
        </BeatShell>
      );
  }
}

// The video's only ambient context — one rotating line of "what's happening
// right now," and one static status tag on the frame itself. Two elements,
// not a dashboard: the video stays the thing the eye lands on.
function AgentStatusLine({ lines }: { lines: string[] }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % lines.length;
      gsap.to(el, {
        opacity: 0,
        y: -4,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          el.textContent = lines[i];
          gsap.fromTo(el, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        },
      });
    }, 3200);
    return () => clearInterval(id);
  }, [lines]);

  return (
    <div className="mb-4 flex items-center gap-2.5 px-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-green opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ai-green" />
      </span>
      <span ref={textRef} className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">
        {lines[0]}
      </span>
    </div>
  );
}

export default function StoryScreen({
  videoSrc,
  agentStatusLines,
  statusBadgeLabel,
  beats,
}: {
  videoSrc?: string;
  agentStatusLines: string[];
  statusBadgeLabel: string;
  beats: StoryBeat[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (videoFrameRef.current) revealUp(videoFrameRef.current, videoFrameRef.current, { y: 20, duration: 1.1 });
    // transform:false — this screen holds the sticky video pane; any transform
    // on its ancestor risks freezing the sticky behavior (see motion.ts).
    if (sectionRef.current) screenBlend(sectionRef.current, sectionRef.current, { transform: false });
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 mx-auto w-full max-w-[1400px] px-6 py-28 sm:py-36 lg:px-10">
      {/* No items-start here on purpose: the left column must stretch to match the
         right column's full height, or its sticky child has no room to stick within
         and just scrolls away with a too-short parent. */}
      <div className="flex flex-col gap-16 lg:flex-row lg:gap-14">
        {/* LEFT 60% — the product walkthrough, pinned while the story scrolls past it */}
        <div className="lg:w-[60%]">
          <div className="lg:sticky lg:top-20">
            <AgentStatusLine lines={agentStatusLines} />
            <div className="relative">
              {/* premium ambient halo — a wider, softer glow behind the frame, distinct from edge-glow's crisp inner rim */}
              <span
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-electric/10 blur-3xl"
                aria-hidden
              />
              <div
                ref={videoFrameRef}
                className="iw-glass edge-glow relative aspect-video w-full overflow-hidden rounded-2xl"
              >
                <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-glass-border bg-black/30 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                  <span className="h-1 w-1 rounded-full bg-ai-green" aria-hidden />
                  {statusBadgeLabel}
                </span>
                {videoSrc ? (
                  <>
                    {/* preview only — muted, no controls; clicking play opens the
                       real player below rather than navigating anywhere */}
                    <video
                      src={videoSrc}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 45%, rgba(0,0,0,0.45) 100%)",
                      }}
                      aria-hidden
                    />
                    <button
                      type="button"
                      data-cursor="explore"
                      aria-label="Play walkthrough video"
                      onClick={() => setLightboxOpen(true)}
                      className="group absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_32px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-105">
                        <svg width="20" height="22" viewBox="0 0 18 20" fill="none">
                          <path d="M1 1L17 10L1 19V1Z" fill="rgba(238,241,249,0.7)" />
                        </svg>
                      </span>
                    </button>
                    <VideoLightbox src={videoSrc} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />
                  </>
                ) : (
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-6">
                    {/* inner vignette — a touch of cinematic depth at the frame's edges */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.35) 100%)",
                      }}
                      aria-hidden
                    />
                    <span className="absolute h-48 w-48 animate-pulse-soft rounded-full bg-electric/25 blur-3xl" aria-hidden />
                    <button
                      type="button"
                      disabled
                      aria-label="Walkthrough video coming soon"
                      className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_32px_-8px_rgba(0,0,0,0.6)]"
                    >
                      <svg width="20" height="22" viewBox="0 0 18 20" fill="none">
                        <path d="M1 1L17 10L1 19V1Z" fill="rgba(238,241,249,0.6)" />
                      </svg>
                    </button>
                    <p className="relative font-mono text-[10px] uppercase tracking-[0.28em] text-ink-faint">
                      Walkthrough — coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT 40% — the story, ~2 minutes total */}
        <div className="flex flex-col gap-14 lg:w-[40%]">
          {beats.map((beat) => (
            <Beat key={beat.label} beat={beat} />
          ))}
        </div>
      </div>
    </section>
  );
}
