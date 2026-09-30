"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BOOT_FLAG = "hc-booted";

// Every beat gets its own animation identity — no two consecutive lines should
// arrive the same way. See renderBeatHTML / the BEATS loop for what each does.
type AnimId =
  | "slideUp"
  | "charSpacing"
  | "hardCut"
  | "slowFade"
  | "maskReveal"
  | "lineByLine"
  | "bounceUp"
  | "fadeBlur";

type Beat = {
  lines: string[];
  size?: "big" | "normal";
  accent?: boolean;
  anim?: AnimId;
  /** seconds until the next beat begins arriving — this line's entire time on stage */
  hold: number;
};

// Read-time driven, not a strict duration budget: hold is roughly proportional
// to each line's length, so short lines move quickly and longer ones actually
// get enough time to read. Even "Yes." — one word — gets a real deliberate
// dwell now rather than a blink; it's still the shortest hold on stage, just
// not rushed.
const BEATS: Beat[] = [
  { lines: ["You're probably wondering…"], anim: "slideUp", hold: 1.55 },
  { lines: ["Is this really a portfolio?"], anim: "charSpacing", hold: 2.0 },
  { lines: ["Yes."], size: "big", anim: "hardCut", hold: 1.45 },
  { lines: ["You're right."], anim: "slowFade", hold: 1.55 },
  { lines: ["This is a portfolio."], anim: "maskReveal", hold: 1.7 },
  { lines: ["We just refused", "to make it look like every other one."], anim: "lineByLine", hold: 2.1 },
  { lines: ["Let's skip the promises."], anim: "bounceUp", hold: 1.7 },
  { lines: ["We'll let the work speak."], anim: "fadeBlur", hold: 1.4 },
];

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// A phone screen is a slower reading context (thumb-scroll distance, smaller
// type, more likely a mid-commute glance) — multi-clause beats get ~25% more
// hold there so they're not rushed. Short punchlines ("Yes.") keep their
// snappy timing everywhere; desktop timing is untouched at every length.
function beatHold(beat: Beat) {
  const words = beat.lines.reduce((n, line) => n + wordCount(line), 0);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  return isMobile && words > 4 ? beat.hold * 1.25 : beat.hold;
}

const SKIP_VISIBLE_AT = 1.5;
const BASE_DIALOGUE_CLASS = "mx-auto max-w-2xl px-6 text-center leading-relaxed will-change-transform";

const DOTS = [
  { x: 12, y: 22, size: 3, delay: 0 },
  { x: 82, y: 16, size: 2, delay: 1.1 },
  { x: 24, y: 74, size: 2, delay: 2.4 },
  { x: 90, y: 68, size: 3, delay: 0.6 },
  { x: 55, y: 12, size: 2, delay: 3.2 },
  { x: 68, y: 84, size: 2, delay: 1.8 },
  { x: 8, y: 55, size: 3, delay: 2.9 },
  { x: 45, y: 90, size: 2, delay: 0.3 },
  { x: 32, y: 40, size: 2, delay: 4.1 },
  { x: 74, y: 44, size: 2, delay: 2.1 },
  { x: 60, y: 62, size: 3, delay: 0.9 },
  { x: 18, y: 88, size: 2, delay: 3.6 },
  { x: 95, y: 32, size: 2, delay: 1.6 },
  { x: 40, y: 8, size: 2, delay: 4.6 },
];

function renderBeatHTML(beat: Beat): string {
  // lineByLine: each line arrives as one whole block, not word-by-word — the
  // technique is about the *line* being the unit of reveal.
  if (beat.anim === "lineByLine") {
    return beat.lines
      .map((line, li) => {
        const isAccentLine = Boolean(beat.accent) && li === beat.lines.length - 1;
        const content = isAccentLine
          ? `<span style="position:relative;display:inline-block">${line}` +
            `<span data-underline style="position:absolute;left:0;right:0;bottom:-0.18em;height:1px;` +
            `background:linear-gradient(90deg,transparent,rgba(82,242,255,0.85),transparent);` +
            `transform:scaleX(0);transform-origin:center"></span></span>`
          : line;
        return `<span data-line style="display:block;opacity:0">${content}</span>`;
      })
      .join("");
  }

  // charSpacing: each character gets its own span so letter-spacing can be
  // animated independently of opacity — the letters breathe apart as they land.
  if (beat.anim === "charSpacing") {
    return beat.lines
      .map((line) => {
        const chars = line
          .split("")
          .map((c) => `<span class="char" style="display:inline-block;opacity:0">${c === " " ? "&nbsp;" : c}</span>`)
          .join("");
        return `<span style="display:block">${chars}</span>`;
      })
      .join("");
  }

  return beat.lines
    .map((line, li) => {
      const isAccentLine = Boolean(beat.accent) && li === beat.lines.length - 1;
      const words = line.split(" ");
      const wordsHtml = words
        .map((w) => `<span class="word" style="display:inline-block;opacity:0">${w}</span>`)
        .join(" ");
      const lineContent = isAccentLine
        ? `<span style="position:relative;display:inline-block">${wordsHtml}` +
          `<span data-underline style="position:absolute;left:0;right:0;bottom:-0.18em;height:1px;` +
          `background:linear-gradient(90deg,transparent,rgba(82,242,255,0.85),transparent);` +
          `transform:scaleX(0);transform-origin:center"></span></span>`
        : wordsHtml;
      return `<span style="display:block">${lineContent}</span>`;
    })
    .join("");
}

export default function BootSequence({
  onReveal,
  onExitComplete,
}: {
  /** fired the instant the exit begins, so the next scene can start building underneath */
  onReveal: () => void;
  /** fired once this overlay has fully finished fading, so it can be unmounted */
  onExitComplete: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowFarRef = useRef<HTMLDivElement>(null);
  const streaksRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dialogueRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const dotsWrapRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    const glow = glowRef.current;
    const glowFar = glowFarRef.current;
    const wordmark = wordmarkRef.current;
    const text = textRef.current;

    const cursor = cursorRef.current;
    const subtitle = subtitleRef.current;
    const dialogue = dialogueRef.current;
    const dim = dimRef.current;
    const cta = ctaRef.current;
    const skip = skipRef.current;
    if (
      !root ||
      !glow ||
      !glowFar ||
      !wordmark ||
      !text ||
      !cursor ||
      !subtitle ||
      !dialogue ||
      !dim ||
      !cta ||
      !skip
    ) {
      return;
    }

    let removeParallaxListener: (() => void) | null = null;
    const alreadyBooted = sessionStorage.getItem(BOOT_FLAG) === "true";

    const ctx = gsap.context(() => {
      // ambient glow, breathing slowly for the entire sequence — two layers at
      // different depths and speeds so the space feels like it's drifting, not static
      gsap.to(glow, { opacity: 0.55, scale: 1.12, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(glowFar, {
        opacity: 0.35,
        x: 60,
        y: -40,
        duration: 17,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // near-invisible light streaks drifting across, ultra subtle
      const streaks = streaksRef.current ? Array.from(streaksRef.current.children) : [];
      streaks.forEach((el, i) => {
        gsap.fromTo(
          el,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 15 + i * 5, delay: i * 2, repeat: -1, ease: "none" }
        );
      });

      // desktop-only parallax on the ambient layer
      if (!window.matchMedia("(pointer: coarse)").matches && parallaxRef.current) {
        const el = parallaxRef.current;
        const xTo = gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 22);
          yTo((e.clientY / window.innerHeight - 0.5) * 22);
        };
        window.addEventListener("mousemove", onMove);
        removeParallaxListener = () => window.removeEventListener("mousemove", onMove);
      }

      // a returning visitor (browser back from the Network) lands here instantly at
      // rest — the conversation already happened once this session, it shouldn't replay
      if (alreadyBooted) {
        // The characters render at opacity 0 and are revealed by the timeline
        // below — which never runs for a returning visitor, so the wordmark
        // has to be shown outright here.
        gsap.set(text, { clipPath: "none" });
        gsap.set([cursor, subtitle, dialogue, skip], { opacity: 0 });
        gsap.set(cta, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(cursor, { opacity: 0 });
      gsap.set([subtitle, dialogue, cta], { opacity: 0 });
      gsap.set(skip, { opacity: 0 });

      const blink = gsap.to(cursor, {
        opacity: 0,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        paused: true,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tlRef.current = tl;

      // 0.05s — cursor fades in and begins its soft blink
      tl.to(cursor, { opacity: 1, duration: 0.15 }, 0.05);
      tl.call(() => blink.play(), [], 0.05);

      // Where each character ends, measured once from the laid-out text
      // rather than guessed — a single Range walk, not a read per frame.
      const WORDMARK = "HELLO CLIENT";
      const textNode = text.firstChild;
      const stops: number[] = [];
      if (textNode) {
        const range = document.createRange();
        for (let i = 1; i <= WORDMARK.length; i++) {
          range.setStart(textNode, 0);
          range.setEnd(textNode, i);
          stops.push(range.getBoundingClientRect().width);
        }
      }
      const fullWidth = stops.length ? stops[stops.length - 1] : 0;

      // The caret is sized and placed from the real text box, so it sits on
      // the glyphs at any font size instead of at a guessed offset.
      const lineHeight = text.offsetHeight;
      gsap.set(cursor, { x: 0, top: lineHeight * 0.17, height: lineHeight * 0.72 });

      const FIRST = 0.12;
      const PER = 0.075;
      // a breath after "HELLO", the way the original paused before the
      // second word landed
      const GAP_AT = 6;
      const GAP = 0.18;

      // Only the right edge of the clip does any revealing. The other three sit
      // just outside the box so the text-stroke, which paints slightly proud of
      // the glyph outline, isn't shaved off against the line box.
      const BLEED = "-0.15em";
      const revealedTo = (edge: number) =>
        `inset(${BLEED} ${Math.max(0, fullWidth - edge)}px ${BLEED} ${BLEED})`;

      stops.forEach((edge, i) => {
        const at = FIRST + i * PER + (i >= GAP_AT ? GAP : 0);
        // the last character drops the clip entirely, so the settled wordmark
        // carries no clip at all
        const last = i === stops.length - 1;
        tl.set(text, { clipPath: last ? "none" : revealedTo(edge) }, at);
        tl.to(cursor, { x: edge, duration: PER * 0.55, ease: "none" }, at);
      });

      const typedThrough = FIRST + (stops.length - 1) * PER + GAP + 0.24;

      // The caret's work is done, and the wordmark settles. Transform only:
      // animating `filter` here meant repainting a gradient-clipped headline
      // every frame, at the worst possible moment in the page's life.
      tl.call(() => blink.pause(), [], typedThrough);
      tl.to(cursor, { opacity: 0, duration: 0.22 }, typedThrough);
      tl.fromTo(
        wordmark,
        { scale: 0.965 },
        { scale: 1, duration: 0.5, ease: "back.out(1.5)" },
        typedThrough - 0.06
      );

      // 1.3 — subtitle breathes in beneath the wordmark, and now gets a real
      // plateau (~0.7s) fully-formed before it dissolves — seven words need
      // more than a glance.
      tl.fromTo(
        subtitle,
        { opacity: 0, filter: "blur(6px)" },
        { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
        1.3
      );

      // 2.85 — wordmark and subtitle dissolve together; the conversation begins
      const dialogueStart = 2.85;
      tl.to(
        [wordmark, subtitle],
        { opacity: 0, y: -12, filter: "blur(10px)", duration: 0.45, ease: "power2.out" },
        dialogueStart - 0.35
      );

      let t = dialogueStart;
      let prevHadContent = false;
      BEATS.forEach((beat) => {
        if (prevHadContent) {
          tl.to(dialogue, { opacity: 0, y: -10, filter: "blur(10px)", duration: 0.5, ease: "power2.out" }, t - 0.5);
        }

        tl.call(
          () => {
            if (beat.lines.length === 0) {
              dialogue.innerHTML = "";
              return;
            }
            const sizeClass =
              beat.size === "big"
                ? "font-display text-glow text-4xl sm:text-6xl"
                : "font-mono uppercase tracking-[0.22em] text-ink text-base sm:text-2xl";
            dialogue.className = `${BASE_DIALOGUE_CLASS} ${sizeClass}`;
            dialogue.innerHTML = renderBeatHTML(beat);
          },
          [],
          t
        );

        if (beat.lines.length > 0) {
          tl.set(dialogue, { opacity: 1, y: 0, filter: "blur(0px)" }, t);

          const anim = beat.anim ?? "fadeBlur";
          let underlineDelay = 0.5;

          if (anim === "hardCut") {
            // the emotional peak: everything else dims and stills, "Yes." lands in
            // total silence, then the world exhales back to normal — all inside 0.8s.
            tl.set(dialogue, { opacity: 0 }, t - 0.001);
            tl.to(dim, { opacity: 0.85, duration: 0.08, ease: "power2.in" }, t - 0.08);
            tl.set(dialogue, { opacity: 1 }, t);
            // the word itself is rendered at inline opacity:0 (same as every other
            // beat's markup) — a hard cut means it snaps straight to visible, no fade
            tl.call(
              () => {
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.set(words, { opacity: 1 });
              },
              [],
              t
            );
            tl.to(dim, { opacity: 0, duration: 0.35, ease: "power2.out" }, t + 0.05);
            // the world itself holds its breath, not just a dark overlay on top of it —
            // the drifting dust recedes for the same window the dim occupies, then
            // returns on resume (the ambient glow tweens are left alone: they're
            // infinite yoyo loops, and a competing tween on the same property would
            // permanently steal opacity control from them via GSAP's auto-overwrite)
            tl.to(dotsWrapRef.current, { opacity: 0.15, duration: 0.08, ease: "power2.in" }, t - 0.08);
            tl.to(dotsWrapRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, t + 0.05);
          } else if (anim === "charSpacing") {
            tl.call(
              () => {
                const chars = dialogue.querySelectorAll<HTMLElement>(".char");
                gsap.fromTo(
                  chars,
                  { opacity: 0, letterSpacing: "-0.05em" },
                  { opacity: 1, letterSpacing: "0.02em", duration: 0.4, stagger: 0.02, ease: "power2.out" }
                );
              },
              [],
              t
            );
          } else if (anim === "slowFade") {
            // "Opacity only" — no blur, no motion, just presence arriving. Animates
            // the word spans themselves (not just the container) — the words are
            // rendered at inline opacity:0 by default and nothing else clears that.
            tl.call(
              () => {
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.fromTo(words, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut" });
              },
              [],
              t
            );
          } else if (anim === "maskReveal") {
            tl.call(
              () => {
                // the words need to actually be visible for the clip-path wipe to
                // reveal anything — the wipe supplies the motion, not the words' own opacity
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.set(words, { opacity: 1 });
                gsap.fromTo(
                  dialogue,
                  { clipPath: "inset(0 100% 0 0)" },
                  { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.inOut" }
                );
              },
              [],
              t
            );
          } else if (anim === "lineByLine") {
            tl.call(
              () => {
                const lines = dialogue.querySelectorAll<HTMLElement>("[data-line]");
                gsap.to(lines, {
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.3,
                  ease: "power2.out",
                });
              },
              [],
              t
            );
            underlineDelay = 0.3 * (beat.lines.length - 1) + 0.4;
          } else if (anim === "bounceUp") {
            tl.call(
              () => {
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.fromTo(
                  words,
                  { opacity: 0, y: 18 },
                  { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: "back.out(2.4)" }
                );
              },
              [],
              t
            );
          } else if (anim === "slideUp") {
            tl.call(
              () => {
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.fromTo(
                  words,
                  { opacity: 0, y: 22 },
                  { opacity: 1, y: 0, duration: 0.45, stagger: 0.03, ease: "power3.out" }
                );
              },
              [],
              t
            );
          } else {
            // fadeBlur default
            tl.call(
              () => {
                const words = dialogue.querySelectorAll<HTMLElement>(".word");
                gsap.fromTo(
                  words,
                  { opacity: 0, y: 14, filter: "blur(8px)" },
                  { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, stagger: 0.05, ease: "power3.out" }
                );
              },
              [],
              t
            );
          }

          if (beat.accent) {
            tl.call(
              () => {
                const underline = dialogue.querySelector<HTMLElement>("[data-underline]");
                if (underline) gsap.to(underline, { scaleX: 1, duration: 0.9, ease: "power2.out" });
              },
              [],
              t + underlineDelay
            );
          }
          prevHadContent = true;
          t += beatHold(beat);
        } else {
          prevHadContent = false;
          t += beatHold(beat);
        }
      });

      // the last line — "We'll let the work speak." — stays on screen rather than
      // dissolving into a blank pause; a short silence sits before the CTA so it
      // feels earned rather than automatic. Trimmed from 0.4s to keep total runtime
      // inside the 10-12s ceiling now that the dialogue beats hold longer.
      const ctaSilence = 0.1;
      const ctaTime = t + ctaSilence;
      tl.fromTo(
        cta,
        { opacity: 0, y: 14, scale: 0.97, filter: "blur(8px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
        ctaTime
      );

      gsap.to(skip, { opacity: 0.4, duration: 1, delay: SKIP_VISIBLE_AT, ease: "power1.out" });
    }, root);

    return () => {
      tlRef.current = null;
      removeParallaxListener?.();
      ctx.revert();
    };
  }, []);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    tlRef.current?.kill();
    onReveal();

    // The handoff should read as travelling forward into the Core, not a hard
    // cut: the ambient glow blooms, the Hero pushes toward the viewer, then
    // dissolves — one continuous move rather than two clips stitched together.
    //
    // Transform and opacity only, deliberately. This used to animate
    // `filter: blur(22px)` across the entire full-screen Hero, which makes the
    // browser re-rasterise the whole viewport through a large blur kernel on
    // every frame for a second — and it ran at exactly the moment the Core is
    // mounting its WebGL context and allocating the particle engine underneath.
    // Two of the heaviest things the site can do, competing for the same frame.
    // That was the stutter on "Explore Projects". The same applies to the glows:
    // they carry a static 160–200px blur, so scaling them re-rasterises that
    // blur too — they brighten now instead of growing.
    //
    // This is the exit and the component unmounts right after
    // (onExitComplete), so overriding the glows' infinite breathing tween here
    // is safe — nothing resumes it afterwards.
    const exit = gsap.timeline({ onComplete: onExitComplete });
    exit.to([glowRef.current, glowFarRef.current], { opacity: 0.95, duration: 0.9, ease: "power2.out" }, 0);
    exit.to(rootRef.current, { scale: 1.06, duration: 1.05, ease: "power2.inOut" }, 0);
    exit.to(rootRef.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.35);
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-void will-change-transform"
    >
      <div ref={parallaxRef} aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-radial-shift absolute inset-0 opacity-60" />
        <div
          ref={glowFarRef}
          className="absolute left-1/2 top-1/2 h-[85vh] w-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/10 opacity-0 blur-[200px]"
        />
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 opacity-0 blur-[160px]"
        />
        <div className="animate-beam absolute left-[15%] top-0 h-full w-[18vw] bg-gradient-to-b from-cyan/[0.05] via-cyan/[0.02] to-transparent blur-[60px]" />
        <div
          className="animate-beam absolute right-[12%] top-0 h-full w-[22vw] bg-gradient-to-b from-violet/[0.05] via-violet/[0.02] to-transparent blur-[70px]"
          style={{ animationDelay: "-6s" }}
        />
        <div className="animate-fog absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(82,242,255,0.05),transparent)]" />
        <div ref={streaksRef} className="absolute inset-0">
          <span className="absolute left-0 top-[28%] h-px w-1/3 bg-gradient-to-r from-transparent via-cyan/40 to-transparent blur-[1px]" />
          <span className="absolute left-0 top-[52%] h-px w-1/4 bg-gradient-to-r from-transparent via-violet/30 to-transparent blur-[1px]" />
          <span className="absolute left-0 top-[71%] h-px w-1/5 bg-gradient-to-r from-transparent via-cyan/30 to-transparent blur-[1px]" />
          <span className="absolute left-0 top-[38%] h-px w-1/4 bg-gradient-to-r from-transparent via-cyan/25 to-transparent blur-[1px]" />
        </div>
        <div ref={dotsWrapRef} className="absolute inset-0">
          {DOTS.map((d, i) => (
            <span
              key={i}
              className="animate-drift absolute rounded-full bg-cyan/50"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                animationDelay: `${d.delay}s`,
                animationDuration: `${7 + d.delay}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={dimRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] bg-void opacity-0"
      />

      <div className="relative z-10 flex w-full min-w-0 flex-col items-center px-6 text-center">
        <h1
          ref={wordmarkRef}
          className="min-h-[1.2em] whitespace-nowrap text-[clamp(1.55rem,7.6vw,3.6rem)] leading-none will-change-transform sm:text-[6.2vw]"
        >
          <span className="sr-only">
            OrynthBuild — Hello Client, a white-label execution agency for AI, web &amp; full-stack
            development
          </span>
          {/* A real left-to-right typewriter, made cheap.

              The whole wordmark is one text node, laid out once, and the
              reveal is a clip-path walking across it a character at a time
              with the caret riding the same edge. It looks exactly like the
              text being written out, because visually that is what it is.

              Two earlier attempts are worth recording so they aren't retried:

              Rewriting textContent per keystroke — the original — forces a
              re-layout AND a full re-rasterisation of a gradient clipped to
              the text plus its stroke, twelve times, right on first
              contentful paint. That was the glitch.

              Fading in per-character spans does not work at all here: with
              `background-clip: text` the glyphs are transparent and the
              PARENT paints the gradient through their shape, so a child's
              opacity never gets a say and the whole wordmark just appears.

              Clipping the element that carries the gradient itself is the
              one approach that both looks right and stays on the compositor. */}
          <span aria-hidden="true" className="relative inline-block align-baseline">
            <span
              ref={textRef}
              className="text-glossy block whitespace-nowrap"
              style={{ clipPath: "inset(-0.15em 100% -0.15em -0.15em)" }}
            >
              HELLO CLIENT
            </span>
            <span ref={cursorRef} aria-hidden className="absolute left-0 top-0 w-[0.055em] bg-cyan" />
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 max-w-lg px-4 font-mono text-sm uppercase tracking-[0.32em] text-ink-dim sm:text-base"
        >
          We&apos;ve been expecting someone like you.
        </p>

        <div ref={dialogueRef} className={BASE_DIALOGUE_CLASS} />

        <div ref={ctaRef} className="mt-4 flex flex-col items-center gap-7">
          <p className="max-w-md text-xs uppercase tracking-[0.25em] text-cyan/80">
            You are already exploring one of our products.
          </p>
          <button
            onClick={finish}
            className="group relative flex items-center gap-3 rounded-full border border-glass-border px-8 py-4 font-mono text-xs uppercase tracking-[0.32em] text-ink edge-glow transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_24px_-8px_rgba(59,130,246,0.45)]"
          >
            <span className="absolute inset-0 animate-pulse-soft rounded-full bg-cyan/10" />
            <span className="relative">Explore Projects</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M5 12h14m0 0l-6-6m6 6l-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <button
        ref={skipRef}
        type="button"
        aria-label="Skip introduction"
        onClick={finish}
        className="absolute z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint transition-opacity duration-300 hover:!opacity-100"
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom))", right: "calc(2rem + env(safe-area-inset-right))" }}
      >
        Skip →
      </button>
    </div>
  );
}
