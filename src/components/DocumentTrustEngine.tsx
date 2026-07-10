"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { isMobileViewport } from "./investment-world/motion";
import { documentTrustEngineTheme, documentTrustEngineContent } from "./investment-world/configs/documentTrustEngine";

// ---------------------------------------------------------------------------
// The Document Trust Engine — Project 03, the third instance of the shared
// project-world system. Structurally identical to InvestmentWorld.tsx and
// FinancialReportWorld.tsx (same background, same three screens, same
// collapse-and-reconnect return) — only the theme and content config differ.
// ---------------------------------------------------------------------------
export default function DocumentTrustEngine() {
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
      scale: 0.92,
      ...(isMobileViewport() ? {} : { filter: "blur(20px)" }),
      duration: 0.9,
      ease: "power2.inOut",
    });
    exit.to(rootRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.35);
  };

  return (
    <div ref={rootRef} className="relative w-full" style={{ willChange: "transform, opacity, filter" }}>
      <WorldBackground theme={documentTrustEngineTheme} />
      <Arrival
        titleLines={documentTrustEngineContent.heroTitleLines}
        subtitleLines={documentTrustEngineContent.heroSubtitleLines as [string, string]}
        accentRGB={documentTrustEngineTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={documentTrustEngineContent.videoSrc}
        agentStatusLines={documentTrustEngineContent.agentStatusLines}
        statusBadgeLabel={documentTrustEngineContent.statusBadgeLabel}
        beats={documentTrustEngineContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={documentTrustEngineContent.readme}
        repository={documentTrustEngineContent.repository}
        techStack={documentTrustEngineContent.techStack}
        cta={documentTrustEngineContent.cta}
      />
    </div>
  );
}
