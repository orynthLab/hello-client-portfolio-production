import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ---------------------------------------------------------------------------
// Shared motion primitives for the Investment Intelligence World.
// One rhythm, reused across every section, so nothing introduces a new
// animation vocabulary halfway through the world.
// ---------------------------------------------------------------------------

let registered = false;
export function ensureScrollTrigger() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

/** True when the visitor has told their OS they don't want non-essential
 *  motion. Checked once at call time (not reactive) — every call site using
 *  this is inside a mount-time effect anyway, so a live OS-setting change
 *  mid-session simply takes effect on the next navigation/remount. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fade + rise into place once its trigger crosses into view. Reverses on scroll back up so revisiting a section never finds it half-collapsed. */
export function revealUp(
  el: gsap.TweenTarget,
  trigger: Element,
  opts: { y?: number; delay?: number; duration?: number; start?: string } = {}
) {
  ensureScrollTrigger();
  return gsap.fromTo(
    el,
    { opacity: 0, y: opts.y ?? 26, filter: "blur(4px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: opts.duration ?? 1.1,
      delay: opts.delay ?? 0,
      ease: "power2.out",
      scrollTrigger: { trigger, start: opts.start ?? "top 78%", toggleActions: "play none none reverse" },
    }
  );
}

/** Draws a connecting line's height/opacity in as the flow enters view — the "energy arriving" beat shared by every pipeline diagram in this world. */
export function revealLine(el: gsap.TweenTarget, trigger: Element, opts: { start?: string } = {}) {
  ensureScrollTrigger();
  return gsap.fromTo(
    el,
    { scaleY: 0, opacity: 0 },
    {
      scaleY: 1,
      opacity: 1,
      duration: 0.9,
      ease: "power2.inOut",
      scrollTrigger: { trigger, start: opts.start ?? "top 82%", toggleActions: "play none none reverse" },
    }
  );
}

/**
 * A whole-screen depth blend, scrubbed to scroll position rather than played once —
 * the screen rises out of depth and settles as it enters, so the boundary between
 * screens reads as one continuous camera move rather than a stack of independently
 * revealing sections. Deliberately avoids filter/blur (expensive to interpolate on
 * every scroll tick); scale + y + opacity carry the same depth cue far more cheaply.
 * Call once per screen root, not per element.
 */
export function screenBlend(el: gsap.TweenTarget, trigger: Element, opts: { transform?: boolean } = {}) {
  ensureScrollTrigger();
  // `transform: false` skips y/scale entirely — for a screen that contains a
  // `position: sticky` child, any transform on an ancestor (even one that settles
  // at scale(1)) risks becoming the sticky element's containing block and freezing
  // it in place. Opacity alone carries most of the depth cue without that risk.
  const from = opts.transform === false ? { opacity: 0.4 } : { opacity: 0.4, y: 60, scale: 0.986 };
  const to = opts.transform === false ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 };
  return gsap.fromTo(el, from, {
    ...to,
    ease: "none",
    scrollTrigger: { trigger, start: "top 100%", end: "top 45%", scrub: 0.6 },
  });
}

// Reference-counted so two overlays opening/closing in any order can never
// leave the world paused forever or resume it while one is still open.
let overlayCount = 0;

/**
 * Call when a full-screen overlay (README, video lightbox) opens. Pauses every
 * GSAP-driven tween site-wide (the background's glow breathing and parallax,
 * FlowConnector's traveling lights, etc.) and stops the CSS-driven layers
 * (particles, data lines, ticks — see the [data-overlay-open] rules in
 * globals.css) via a root attribute. None of that motion is visible behind a
 * full-screen overlay anyway, but without this it keeps computing every frame,
 * competing for the same main thread the overlay's own scrolling/dragging needs.
 */
export function pauseWorldForOverlay() {
  overlayCount += 1;
  gsap.globalTimeline.pause();
  document.documentElement.setAttribute("data-overlay-open", "true");
}

/** Call when that overlay closes — undoes pauseWorldForOverlay. */
export function resumeWorldForOverlay() {
  overlayCount = Math.max(0, overlayCount - 1);
  if (overlayCount === 0) {
    gsap.globalTimeline.resume();
    document.documentElement.removeAttribute("data-overlay-open");
  }
}

/** Counts a number up once, the first time it enters view. Numbers only ever count once — re-triggering a metric every scroll pass would read as glitchy, not alive. */
export function countUpOnce(el: HTMLElement, target: number, opts: { decimals?: number; suffix?: string; prefix?: string; duration?: number } = {}) {
  ensureScrollTrigger();
  const counter = { value: 0 };
  const decimals = opts.decimals ?? 0;
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(counter, {
        value: target,
        duration: opts.duration ?? 1.6,
        ease: "power2.out",
        onUpdate: () => {
          const formatted =
            decimals === 0 ? Math.round(counter.value).toLocaleString("en-US") : counter.value.toFixed(decimals);
          el.textContent = `${opts.prefix ?? ""}${formatted}${opts.suffix ?? ""}`;
        },
      });
    },
  });
}
