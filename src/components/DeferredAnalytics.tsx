"use client";

import { useEffect } from "react";

// ---------------------------------------------------------------------------
// Analytics, moved out of the way of the page actually loading.
//
// gtag.js is 163 KB of third-party JavaScript, and on a throttled phone it was
// the second-largest cost on the homepage: two long tasks of 151ms and 120ms,
// 249ms of scripting, blocking the main thread while the visitor was still
// waiting for the site. next/script's `lazyOnload` already held it until the
// load event, but the load event on this page fires early — well inside the
// window that decides whether the site feels fast.
//
// So it waits for a real signal instead: the first touch, click, key or scroll,
// or six seconds of nothing, whichever happens first. Either way it is off the
// critical path, and either way the pageview still fires with the correct URL —
// gtag records it on config, not on parse.
//
// The six-second fallback matters: a visitor who lands, reads, and leaves
// without touching anything is still a visit worth counting.
// ---------------------------------------------------------------------------

const GA_ID = "G-71Y3E7WE85";
const IDLE_FALLBACK_MS = 6000;

export default function DeferredAnalytics() {
  useEffect(() => {
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      cleanup();

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", GA_ID);

      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const cleanup = () => {
      for (const e of events) window.removeEventListener(e, start);
      window.clearTimeout(timer);
    };

    for (const e of events) window.addEventListener(e, start, { passive: true, once: true });
    const timer = window.setTimeout(start, IDLE_FALLBACK_MS);

    return cleanup;
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
