"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import {
  businessDevelopmentAgentTheme,
  businessDevelopmentAgentContent,
} from "./investment-world/configs/businessDevelopmentAgent";

// ---------------------------------------------------------------------------
// The Autonomous Business Development Agent — the portfolio's flagship world
// and the sixth instance of the shared project-world system. Structurally
// identical to InvestmentWorld.tsx (same background, same three screens,
// same collapse-and-reconnect return) — only the theme and content config
// differ.
// ---------------------------------------------------------------------------
export default function BusinessDevelopmentAgentWorld() {
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
      <WorldBackground theme={businessDevelopmentAgentTheme} />
      <Arrival
        titleLines={businessDevelopmentAgentContent.heroTitleLines}
        subtitleLines={businessDevelopmentAgentContent.heroSubtitleLines as [string, string]}
        accentRGB={businessDevelopmentAgentTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={businessDevelopmentAgentContent.videoSrc}
        agentStatusLines={businessDevelopmentAgentContent.agentStatusLines}
        statusBadgeLabel={businessDevelopmentAgentContent.statusBadgeLabel}
        beats={businessDevelopmentAgentContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={businessDevelopmentAgentContent.readme}
        repository={businessDevelopmentAgentContent.repository}
        techStack={businessDevelopmentAgentContent.techStack}
        cta={businessDevelopmentAgentContent.cta}
      />
    </div>
  );
}
