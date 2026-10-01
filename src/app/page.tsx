"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import BootSequence from "@/components/BootSequence";
import TheCore from "@/components/TheCore";
import HomeIntro from "@/components/HomeIntro";
import { useIsMobile } from "@/components/useIsMobile";

const ParticleField = dynamic(() => import("@/components/ParticleField"), {
  ssr: false,
});

const BOOT_FLAG = "hc-booted";

export default function Home() {
  const [hubMounted, setHubMounted] = useState(false);
  const [heroMounted, setHeroMounted] = useState(true);
  // A continuous WebGL/Three.js render loop (mouse-parallax particles) is
  // the single heaviest thing on this page — fine on desktop (99 Lighthouse
  // performance), but on a 4x-throttled mobile CPU its bundle fetch/eval and
  // per-frame work were the dominant cost behind a 500ms+ TBT and a ~7s TTI.
  // Same treatment as every other purely-ambient effect elsewhere in this
  // codebase (WorldBackground's glow tweens, blur filters, etc.): skip it
  // entirely on mobile rather than trying to make WebGL cheap there.
  // Assumed mobile until the real viewport is known, so a phone never starts
  // fetching the Three.js chunk during hydration only to discard it.
  const showParticles = !useIsMobile(true);

  useEffect(() => {
    // One-time bootstrap read of client-only storage; cannot be known
    // during SSR, so it must be resolved after mount.
    const alreadyBooted = sessionStorage.getItem(BOOT_FLAG) === "true";
    if (alreadyBooted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHubMounted(true);
      setHeroMounted(false);
    }

    // The Hero and the Network live at the same URL with no navigation between
    // them by default, so the browser back button had nothing to return to and
    // could strand the visitor. Pushing a history entry when entering the Network
    // gives back/forward something real to act on in both directions.
    const onPopState = (e: PopStateEvent) => {
      if (e.state?.view === "hub") {
        setHubMounted(true);
        setHeroMounted(false);
      } else {
        setHeroMounted(true);
        setHubMounted(false);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Called the instant the Hero's exit begins (not when it finishes): the Network
  // mounts immediately underneath and starts building its own scene while the Hero's
  // overlay fades on top of it, so the fade itself reveals the next scene — a single
  // continuous motion instead of a hard cut from one screen to another.
  const handleBootReveal = () => {
    sessionStorage.setItem(BOOT_FLAG, "true");
    history.pushState({ view: "hub" }, "");
    setHubMounted(true);
  };

  const handleBootExitComplete = () => {
    setHeroMounted(false);
  };

  return (
    <main className="relative min-h-dvh w-full bg-void">
      {showParticles && <ParticleField />}
      {hubMounted && <TheCore />}
      {heroMounted && (
        <BootSequence onReveal={handleBootReveal} onExitComplete={handleBootExitComplete} />
      )}

      {/* Static, always-rendered, and deliberately outside everything above:
          the Core only mounts after the boot finishes in the browser, so this
          is the only part of the homepage a crawler ever reads. See HomeIntro. */}
      <HomeIntro />
    </main>
  );
}
