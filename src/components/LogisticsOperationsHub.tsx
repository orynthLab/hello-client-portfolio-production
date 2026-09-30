"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { logisticsOperationsHubTheme, logisticsOperationsHubContent } from "./investment-world/configs/logisticsOperationsHub";

// ---------------------------------------------------------------------------
// The Logistics Operations Hub — Project 04, the fourth instance of the
// shared project-world system. Structurally identical to InvestmentWorld.tsx,
// FinancialReportWorld.tsx, and DocumentTrustEngine.tsx (same background,
// same three screens, same collapse-and-reconnect return) — only the theme
// and content config differ.
// ---------------------------------------------------------------------------
export default function LogisticsOperationsHub() {
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
      <WorldBackground theme={logisticsOperationsHubTheme} />
      <Arrival
        titleLines={logisticsOperationsHubContent.heroTitleLines}
        subtitleLines={logisticsOperationsHubContent.heroSubtitleLines as [string, string]}
        accentRGB={logisticsOperationsHubTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={logisticsOperationsHubContent.videoSrc}
        agentStatusLines={logisticsOperationsHubContent.agentStatusLines}
        statusBadgeLabel={logisticsOperationsHubContent.statusBadgeLabel}
        beats={logisticsOperationsHubContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={logisticsOperationsHubContent.readme}
        repository={logisticsOperationsHubContent.repository}
        techStack={logisticsOperationsHubContent.techStack}
        cta={logisticsOperationsHubContent.cta}
      />
    </div>
  );
}
