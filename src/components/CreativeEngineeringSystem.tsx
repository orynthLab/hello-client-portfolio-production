"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Arrival from "./investment-world/Arrival";
import StoryScreen from "./investment-world/StoryScreen";
import ResourcesScreen from "./investment-world/ResourcesScreen";
import { isMobileViewport } from "./investment-world/motion";
import {
  creativeEngineeringSystemAccentRGB,
  creativeEngineeringSystemContent,
} from "./investment-world/configs/creativeEngineeringSystem";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

// ---------------------------------------------------------------------------
// The Creative Engineering Portfolio — Project 05, the closing chapter of
// the portfolio, not a client project (it's the destination behind the
// Core's fifth, "meta" system — see src/data/projects.ts and TheCore.tsx).
//
// Reuses the exact same three-screen framework (Arrival, StoryScreen,
// ResourcesScreen) as every other world, including Resources (README,
// Repository, Tech Stack, CTA) and Return to the Core — but swaps
// WorldBackground for the site's own persistent ParticleField — the same
// "premium particle universe" the Hero and Core already use — so arriving
// here reads as returning to where the journey began, not a fifth distinct
// product identity.
// ---------------------------------------------------------------------------
export default function CreativeEngineeringSystem() {
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
    <>
      {/* Rendered as a sibling of the animated root, not a child of it: `will-change`
         on rootRef (needed for the Return-to-Core exit tween) establishes a containing
         block for position:fixed descendants, which would stretch this fixed, full-
         viewport canvas across the whole scroll height instead of pinning it to the
         viewport — the same containing-block gotcha documented elsewhere in this
         framework, just triggered by will-change instead of an applied transform.
         Matches how page.tsx itself keeps ParticleField outside anything animated. */}
      <ParticleField />
      <div ref={rootRef} className="relative w-full" style={{ willChange: "transform, opacity, filter" }}>
        <Arrival
          titleLines={creativeEngineeringSystemContent.heroTitleLines}
          subtitleLines={creativeEngineeringSystemContent.heroSubtitleLines as [string, string]}
          accentRGB={creativeEngineeringSystemAccentRGB}
        />
        <StoryScreen
          videoSrc={creativeEngineeringSystemContent.videoSrc}
          agentStatusLines={creativeEngineeringSystemContent.agentStatusLines}
          statusBadgeLabel={creativeEngineeringSystemContent.statusBadgeLabel}
          beats={creativeEngineeringSystemContent.beats}
        />
        <ResourcesScreen
          onReturn={handleReturn}
          readme={creativeEngineeringSystemContent.readme}
          repository={creativeEngineeringSystemContent.repository}
          techStack={creativeEngineeringSystemContent.techStack}
          cta={creativeEngineeringSystemContent.cta}
        />
      </div>
    </>
  );
}
