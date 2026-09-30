"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { investmentWorldTheme, investmentWorldContent } from "./investment-world/configs/investmentWorld";

// ---------------------------------------------------------------------------
// The Investment Intelligence World — Project 01, and the master instance of
// the shared project-world system. One fixed atmosphere (WorldBackground)
// sits behind: the Project Hero, the Story (a pinned walkthrough beside
// short editorial beats), and Resources. This file owns only what's shared
// across all three — the persistent background, and the collapse-and-
// reconnect exit that hands the visitor back to The Core rather than
// routing away from it. All content/theme lives in configs/investmentWorld.tsx.
// ---------------------------------------------------------------------------
export default function InvestmentWorld() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const returningRef = useRef(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350);
    return () => {
      window.clearTimeout(id);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleReturn = () => {
    if (returningRef.current || !rootRef.current) return;
    returningRef.current = true;

    // The world folds inward on itself rather than cutting to a new page —
    // the same "one continuous motion" principle as the Hero's own hand-off,
    // just running in reverse: this scene collapses instead of a new one blooming.
    const exit = gsap.timeline({
      onComplete: () => router.push("/"),
    });
    exit.to(rootRef.current, {
      // Transform and opacity only — animating a blur across the whole
      // viewport re-rasterises every pixel of it on every frame, and this
      // runs while the next route is already being prepared.
      scale: 0.92,
      duration: 0.9,
      ease: "power2.inOut",
    });
    exit.to(rootRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.35);
  };

  return (
    <div ref={rootRef} className="relative w-full" style={{ willChange: "transform, opacity, filter" }}>
      <WorldBackground theme={investmentWorldTheme} />
      <Arrival
        titleLines={investmentWorldContent.heroTitleLines}
        subtitleLines={investmentWorldContent.heroSubtitleLines as [string, string]}
        accentRGB={investmentWorldTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={investmentWorldContent.videoSrc}
        agentStatusLines={investmentWorldContent.agentStatusLines}
        statusBadgeLabel={investmentWorldContent.statusBadgeLabel}
        beats={investmentWorldContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={investmentWorldContent.readme}
        repository={investmentWorldContent.repository}
        techStack={investmentWorldContent.techStack}
        cta={investmentWorldContent.cta}
      />
    </div>
  );
}
