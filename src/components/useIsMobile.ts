"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

// Same "phone-sized viewport" breakpoint as isMobileViewport() in
// investment-world/motion.ts, which stays the imperative form used inside
// effects and GSAP callbacks. This hook is the render-time form: several
// components need the answer to decide what to *mount* (a WebGL canvas, a
// motif layer), not just what to animate.
//
// Read through useSyncExternalStore rather than useState + a mount effect:
// setting state synchronously in an effect triggers a cascading second
// render on every mount, which React flags (react-hooks/set-state-in-effect).
// Subscribing to the media query is what that pattern was approximating
// anyway, and it makes the value correct across a resize instead of frozen
// at whatever the viewport was on mount. Same shape as CustomCursor.tsx's
// pointer:coarse store.
function subscribe(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

// Stable identities — useSyncExternalStore re-subscribes if these change.
const serverTrue = () => true;
const serverFalse = () => false;

/**
 * True on phone-sized viewports.
 *
 * `serverSnapshot` is what to assume during SSR and the hydration pass, before
 * the real viewport is knowable. It is deliberately per-call-site rather than a
 * single default, because the safe assumption differs by what's being gated:
 *
 * - `true` (assume mobile) for anything whose mobile branch skips expensive
 *   work — a WebGL canvas. Guessing "desktop" here would start fetching and
 *   evaluating the Three.js chunk on a phone before the correction lands,
 *   which is the entire cost the mobile branch exists to avoid.
 * - `false` (assume desktop) for anything whose mobile branch only *reduces*
 *   an already-rendered scene, so first paint should match the fuller desktop
 *   composition and settle down from there rather than popping in.
 */
export function useIsMobile(serverSnapshot: boolean) {
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot ? serverTrue : serverFalse);
}
