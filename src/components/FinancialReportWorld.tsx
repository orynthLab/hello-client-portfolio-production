"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { financialReportWorldTheme, financialReportWorldContent } from "./investment-world/configs/financialReportWorld";

// ---------------------------------------------------------------------------
// The Financial Intelligence Workspace — Project 02, the second instance of
// the shared project-world system. Structurally identical to
// InvestmentWorld.tsx (same background, same three screens, same collapse-
// and-reconnect return) — only the theme and content config differ. This is
// the architecture every remaining project in this portfolio will reuse.
// ---------------------------------------------------------------------------
export default function FinancialReportWorld() {
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
      filter: "blur(20px)",
      duration: 0.9,
      ease: "power2.inOut",
    });
    exit.to(rootRef.current, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.35);
  };

  return (
    <div ref={rootRef} className="relative w-full" style={{ willChange: "transform, opacity, filter" }}>
      <WorldBackground theme={financialReportWorldTheme} />
      <Arrival
        titleLines={financialReportWorldContent.heroTitleLines}
        subtitleLines={financialReportWorldContent.heroSubtitleLines as [string, string]}
        accentRGB={financialReportWorldTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={financialReportWorldContent.videoSrc}
        agentStatusLines={financialReportWorldContent.agentStatusLines}
        statusBadgeLabel={financialReportWorldContent.statusBadgeLabel}
        beats={financialReportWorldContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={financialReportWorldContent.readme}
        repository={financialReportWorldContent.repository}
        techStack={financialReportWorldContent.techStack}
        cta={financialReportWorldContent.cta}
      />
    </div>
  );
}
