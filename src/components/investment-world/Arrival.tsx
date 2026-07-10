"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion, isMobileViewport } from "./motion";

// ---------------------------------------------------------------------------
// SCREEN 1 — Project Hero.
// Background wakes (WorldBackground, already mounted underneath), then the
// title breathes in, then the subtitle, then a quiet scroll cue. This screen
// is a threshold, not a destination, so nothing here lingers unnecessarily —
// but it also can't rush a visitor past a longer sentence just because a
// shorter one elsewhere reads faster. The two subtitle lines vary from 2-3
// words (e.g. "Seven AI Specialists.") to 6 (e.g. "built for speed, trust
// and accuracy."), so the hold before the scroll cue appears is proportional
// to how much there actually is to read (same philosophy as BootSequence's
// per-beat `hold`), not a fixed 6.8s regardless of content.
//
// Only the copy and the rule/cue accent color change between projects — the
// rhythm and typography are identical everywhere; only the reading-time
// floor scales with the words actually being read.
// ---------------------------------------------------------------------------

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

/** Minimum comfortable hold for a line of this length, at roughly reading pace. */
function readingHold(text: string, floor: number, perWord = 0.32) {
  return Math.max(floor, wordCount(text) * perWord);
}
export default function Arrival({
  titleLines,
  subtitleLines,
  accentRGB,
}: {
  titleLines: string[];
  subtitleLines: [string, string];
  accentRGB: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const sub1Ref = useRef<HTMLParagraphElement>(null);
  const sub2Ref = useRef<HTMLParagraphElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, ruleRef.current, sub1Ref.current, sub2Ref.current, cueRef.current], {
        opacity: 0,
      });
      gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "center center" });

      const tl = gsap.timeline({ defaults: { ease: "sine.out" } });

      // The room is already waking (WorldBackground handles that on mount).
      // Title arrives once the atmosphere has had time to settle — a beat of
      // pure stillness first, so the title reads as arriving into a place,
      // not popping onto a loading screen.
      // filter:blur() is the most expensive part of this reveal to interpolate
      // and lands at the exact moment a project opens — skipped on mobile,
      // where opacity/y alone still read as the same arrival.
      const skipBlur = isMobileViewport();
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 10, ...(skipBlur ? {} : { filter: "blur(5px)" }) },
        { opacity: 1, y: 0, ...(skipBlur ? {} : { filter: "blur(0px)" }), duration: 1.6, ease: "power2.out" },
        1.4
      );

      tl.to(ruleRef.current, { opacity: 1, duration: 0.5 }, 3.4);
      tl.to(ruleRef.current, { scaleX: 1, duration: 1.0, ease: "power2.inOut" }, 3.4);

      // Real breathing space before the subtitle — long enough that the
      // title has fully landed before anything else moves. The gap before
      // the SECOND subtitle line, and before the scroll cue, both scale with
      // how many words there actually are to read — a 2-word line and a
      // 6-word line don't deserve the same hold.
      const sub1Start = 4.8;
      const sub2Start = sub1Start + readingHold(subtitleLines[0], 0.5);
      const cueStart = sub2Start + 1.0 + readingHold(subtitleLines[1], 0.5);

      tl.fromTo(
        sub1Ref.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 1.0, ease: "sine.out" },
        sub1Start
      );
      tl.fromTo(
        sub2Ref.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 1.0, ease: "sine.out" },
        sub2Start
      );

      // The invitation forward — quiet, not a call to action.
      tl.to(cueRef.current, { opacity: 0.5, duration: 1.0 }, cueStart);

      // Camera breath — the whole stage rises and falls almost imperceptibly,
      // continuing for as long as this viewport is on screen. Purely
      // ambient, so it's the one thing here skipped under reduced motion.
      if (!prefersReducedMotion()) {
        tl.call(() => {
          gsap.to(stageRef.current, {
            y: -3,
            duration: 7.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        }, [], 1.4);
      }
    }, stageRef);

    return () => ctx.revert();
    // subtitleLines only ever changes on navigation to a different project world
    // (a full remount, not a prop update in place), so this intentionally still
    // runs once per mount rather than re-running the whole entrance on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-8 text-center">
      <div ref={stageRef} className="flex flex-col items-center" style={{ willChange: "transform" }}>
        <h1
          ref={titleRef}
          style={{
            fontFamily: "var(--font-geist-sans), Arial, sans-serif",
            fontSize: "clamp(2.8rem, 6.8vw, 5.8rem)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 1.06,
            color: "#eef1f9",
            opacity: 0,
            willChange: "transform, opacity, filter",
          }}
        >
          {titleLines.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>

        <div
          ref={ruleRef}
          aria-hidden
          style={{
            marginTop: "clamp(1.8rem, 3.5vw, 2.8rem)",
            width: "clamp(140px, 26vw, 300px)",
            height: "1px",
            background: `linear-gradient(90deg, transparent 0%, rgba(${accentRGB},0.6) 25%, rgba(${accentRGB},0.85) 50%, rgba(${accentRGB},0.6) 75%, transparent 100%)`,
            opacity: 0,
          }}
        />

        <p ref={sub1Ref} className="iw-section-label" style={{ marginTop: "clamp(1.6rem, 3.2vw, 2.4rem)", opacity: 0 }}>
          {subtitleLines[0]}
        </p>
        <p ref={sub2Ref} className="iw-section-label" style={{ marginTop: "0.6rem", opacity: 0 }}>
          {subtitleLines[1]}
        </p>
      </div>

      <div
        ref={cueRef}
        aria-hidden
        className="absolute bottom-10 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-ink-faint">Scroll</span>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M1 1L5 14L9 1" stroke={`rgba(${accentRGB},0.6)`} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
