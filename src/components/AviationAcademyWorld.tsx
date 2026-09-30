"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorldBackground from "./investment-world/WorldBackground";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { aviationAcademyTheme, aviationAcademyContent } from "./investment-world/configs/aviationAcademy";

// ---------------------------------------------------------------------------
// Aviation Preparation Academy — Project 04.
//
// Structurally identical to every other project world: the same background,
// the same three screens, the same collapse-and-reconnect return. Only the
// theme and content config differ. See configs/aviationAcademy.tsx.
// ---------------------------------------------------------------------------
export default function AviationAcademyWorld() {
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

    const exit = gsap.timeline({ onComplete: () => router.push("/") });
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
      <WorldBackground theme={aviationAcademyTheme} />
      <Arrival
        titleLines={aviationAcademyContent.heroTitleLines}
        subtitleLines={aviationAcademyContent.heroSubtitleLines as [string, string]}
        accentRGB={aviationAcademyTheme.secondaryRGB}
      />
      <StoryScreen
        videoSrc={aviationAcademyContent.videoSrc}
        agentStatusLines={aviationAcademyContent.agentStatusLines}
        statusBadgeLabel={aviationAcademyContent.statusBadgeLabel}
        beats={aviationAcademyContent.beats}
      />
      <ResourcesScreen
        onReturn={handleReturn}
        readme={aviationAcademyContent.readme}
        repository={aviationAcademyContent.repository}
        techStack={aviationAcademyContent.techStack}
        cta={aviationAcademyContent.cta}
      />
    </div>
  );
}
