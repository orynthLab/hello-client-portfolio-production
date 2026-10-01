"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Touch devices scroll natively and well; smoothing them only adds lag.
    // Reduced-motion asks for the real scrollbar, and honouring it here is
    // the whole of what that preference means for a page like this.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // lerp, not duration.
    //
    // `duration: 1.15` started a fresh 1.15s tween on every wheel tick, so a
    // single notch took roughly 730ms to come to rest and a continuous scroll
    // was always chasing a tween that had just been restarted. Measured, one
    // tick moved 50% of its distance in ~100ms and spent the next 600 drifting
    // — which is exactly the part that reads as the page lagging behind the
    // hand.
    //
    // lerp is frame-rate-independent exponential smoothing toward a target
    // the wheel keeps moving, so repeated input accumulates instead of
    // restarting. 0.14 keeps the glide this site wants without the tail.
    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
