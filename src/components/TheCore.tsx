"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { projects, metaSystem, type Project } from "@/data/projects";
import AIBrandMark from "@/components/AIBrandMark";
import ContactModal from "@/components/ContactModal";
import CoreEmblem, { FACET_AXES } from "@/components/CoreEmblem";
import { prefersReducedMotion } from "@/components/investment-world/motion";

const UNFOLD_KEY = "hc-core-unfolded";
const VISITED_KEY = "hc-core-visited";

// The Core sits slightly above true center — composition weight favors the
// systems, not the emblem itself.
const CENTER = { x: 50, y: 52.3 };

// Hand-placed, not formulaic: the flagship dominates upper-left, the rest
// cascade down-right in decreasing size, and the meta system stays small and
// close. No symmetry, no equal spacing, no perfect circle.
//
// Slot order follows priority (flagship first): Financial Report Agent ->
// Investment Advisory Agent -> Document Identifier & Verifier -> IGC
// Logistics Platform -> the meta system (always last, always quiet).
const LAYOUT: Record<string, { x: number; y: number; path: string; flagship?: boolean }> = {
  "company-financial-report-agent": { x: 23.75, y: 25, path: "M50,52.3 Q35,31.8 23.75,25", flagship: true },
  "investment-advisory-agent": { x: 76.25, y: 38.6, path: "M50,52.3 Q65,38.6 76.25,38.6" },
  "document-identifier-verifier": { x: 80, y: 72.7, path: "M50,52.3 Q67.5,63.6 80,72.7" },
  "igc-logistics-platform": { x: 32.5, y: 81.8, path: "M50,52.3 Q40,72.7 32.5,81.8" },
};
const META_LAYOUT = { x: 52.5, y: 65, path: "M50,52.3 Q51,60.2 52.5,65" };

function panelPlacement(x: number, y: number) {
  const vertical = y < 50 ? "top-full mt-4" : "bottom-full mb-4";
  const horizontal = x < 35 ? "left-0" : x > 65 ? "right-0" : "left-1/2 -translate-x-1/2";
  return `${vertical} ${horizontal}`;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Subtle neural motes, not a starfield — fewer, smaller, cooler, slower.
// "Do NOT create outer space. Do NOT create stars." Depth through restraint.
const MOTES_NEAR = (() => {
  const rand = seededRandom(41);
  return Array.from({ length: 12 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 1 + rand() * 1.1,
    delay: rand() * 6,
    duration: 6 + rand() * 6,
    opacity: 0.15 + rand() * 0.25,
  }));
})();
const MOTES_FAR = (() => {
  const rand = seededRandom(97);
  return Array.from({ length: 16 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 0.5 + rand() * 0.7,
    delay: rand() * 7,
    duration: 7 + rand() * 7,
    opacity: 0.08 + rand() * 0.14,
  }));
})();

export default function TheCore() {
  const router = useRouter();
  const layout = useMemo(
    () => projects.map((project) => ({ project, ...LAYOUT[project.slug] })),
    []
  );

  const stageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const interactHintRef = useRef<HTMLParagraphElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const motesNearRef = useRef<HTMLDivElement>(null);
  const motesFarRef = useRef<HTMLDivElement>(null);

  const facetRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const voidRef = useRef<SVGCircleElement | null>(null);
  const rimRef = useRef<SVGCircleElement | null>(null);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const pathBreathTweens = useRef<(gsap.core.Tween | null)[]>([]);
  const particleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const particleTweens = useRef<(gsap.core.Tween | null)[]>([]);
  const trailParticleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const burstRefs = useRef<(SVGCircleElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const metaPathRef = useRef<SVGPathElement | null>(null);
  const metaParticleRef = useRef<SVGCircleElement | null>(null);
  const metaBurstRef = useRef<SVGCircleElement | null>(null);
  const metaNodeRef = useRef<HTMLDivElement | null>(null);

  const activeSlugRef = useRef<string | null>(null);

  const [hovered, setHovered] = useState<string | null>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [unfolded, setUnfolded] = useState(false);
  const [unfoldDone, setUnfoldDone] = useState(false);
  const [visitedSlugs, setVisitedSlugs] = useState<string[]>([]);

  // Connections breathe continuously once the world is open. Hover never
  // fights this tween for opacity — it PAUSES the exact instance and takes
  // over itself, then hands control back on resume. Under reduced motion,
  // the connecting lines stay visible at their resting opacity (they carry
  // real information — which systems connect to the Core) but the traveling
  // light particles, which are purely decorative, simply never animate.
  const startAmbientLoop = useCallback(() => {
    const reduceMotion = prefersReducedMotion();
    layout.forEach((_, i) => {
      const path = pathRefs.current[i];
      const particle = particleRefs.current[i];
      if (path) {
        gsap.set(path, { opacity: 0.5 });
        if (!reduceMotion) {
          pathBreathTweens.current[i] = gsap.to(path, {
            opacity: 0.75,
            duration: 4 + i * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.4,
          });
        }
      }
      if (particle && path && !reduceMotion) {
        gsap.set(particle, { opacity: 1 });
        particleTweens.current[i] = gsap.to(particle, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
          duration: 4.2 + i * 0.7,
          repeat: -1,
          ease: "power1.inOut",
          delay: i * 0.8,
        });
      }
      const trail = trailParticleRefs.current[i];
      if (trail && path && !reduceMotion) {
        gsap.set(trail, { opacity: 0.5 });
        gsap.to(trail, {
          motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
          duration: 4.2 + i * 0.7,
          repeat: -1,
          ease: "power1.inOut",
          delay: i * 0.8 + (4.2 + i * 0.7) / 2,
        });
      }
    });
    if (metaPathRef.current && metaParticleRef.current) {
      gsap.set(metaPathRef.current, { opacity: 0.4 });
      if (!reduceMotion) {
        gsap.set(metaParticleRef.current, { opacity: 0.8 });
        gsap.to(metaParticleRef.current, {
          motionPath: { path: metaPathRef.current, align: metaPathRef.current, alignOrigin: [0.5, 0.5] },
          duration: 5.5,
          repeat: -1,
          ease: "power1.inOut",
        });
      }
    }
  }, [layout]);

  // Hovering the still-closed Core is a subtle acknowledgment, not the main
  // event — the rim's stroke thickens a touch. It never touches the same
  // properties as the idle breathing loop (opacity), so the two never fight.
  const handleCoreEnter = () => {
    if (unfolded) return;
    gsap.to(rimRef.current, { attr: { strokeWidth: 0.7 }, duration: 0.4, ease: "power2.out" });
  };
  const handleCoreLeave = () => {
    if (unfolded) return;
    gsap.to(rimRef.current, { attr: { strokeWidth: 0.35 }, duration: 0.5, ease: "power2.out" });
  };

  // The signature moment: facets separate along their own precise axes (no
  // rotation, no bounce, no overshoot), and the five systems settle in one
  // at a time — a boot sequence, not a burst.
  const handleUnfoldCore = () => {
    if (unfolded || activeSlugRef.current) return;
    setUnfolded(true);
    sessionStorage.setItem(UNFOLD_KEY, "true");

    // A fast click (before the title/subtitle/hint's own delayed entrance
    // tweens have fired) would otherwise leave those tweens pending — they'd
    // fire on their original schedule regardless of unfold, undoing this
    // fade-out moments later. Killing them first guarantees this fade-out
    // is the last word no matter how early the click happened.
    gsap.killTweensOf([titleRef.current, subtitleRef.current, interactHintRef.current]);
    gsap.to(titleRef.current, { opacity: 0.4, duration: 1, ease: "power2.out" });
    gsap.to(subtitleRef.current, { opacity: 0, duration: 1, ease: "power2.out" });
    gsap.to(interactHintRef.current, { opacity: 0, duration: 0.6, ease: "power2.out" });

    const tl = gsap.timeline();
    facetRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, { x: FACET_AXES[i].x, y: FACET_AXES[i].y, duration: 1.1, ease: "power2.inOut" }, 0);
    });
    tl.to(voidRef.current, { attr: { r: 11 }, duration: 1.1, ease: "power2.inOut" }, 0);
    tl.to(rimRef.current, { attr: { r: 11.4 }, opacity: 0.55, duration: 1.1, ease: "power2.inOut" }, 0);

    let t = 0.6;
    layout.forEach((_, i) => {
      const path = pathRefs.current[i];
      const node = nodeRefs.current[i];
      if (path) {
        tl.to(path, { opacity: 0.7, duration: 0.3, ease: "power2.out" }, t);
        tl.to(path, { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, t);
      }
      tl.to(node, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, t + 0.65);
      t += 0.55;
    });
    if (metaPathRef.current) {
      tl.to(metaPathRef.current, { opacity: 0.45, duration: 0.3, ease: "power2.out" }, t);
      tl.to(metaPathRef.current, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, t);
    }
    tl.to(metaNodeRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, t + 0.5);

    tl.call(
      () => {
        startAmbientLoop();
        setUnfoldDone(true);
      },
      [],
      t + 1.0
    );
  };

  useEffect(() => {
    const stage = stageRef.current;
    const glow = glowRef.current;
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!stage || !glow || !title || !subtitle) return;

    gsap.registerPlugin(MotionPathPlugin);

    setActiveSlug(null);
    activeSlugRef.current = null;
    setHovered(null);
    if (flashRef.current) gsap.set(flashRef.current, { opacity: 0, clipPath: "circle(0% at 50% 50%)" });
    nodeRefs.current.forEach((n) => n && gsap.set(n, { scale: 1 }));

    const wasUnfolded = sessionStorage.getItem(UNFOLD_KEY) === "true";
    let visited: string[] = [];
    try {
      visited = JSON.parse(sessionStorage.getItem(VISITED_KEY) ?? "[]");
    } catch {
      visited = [];
    }
    setVisitedSlugs(visited);

    const ctx = gsap.context(() => {
      // These breathing loops are pure ambience — skip them for a visitor who
      // has asked their OS for reduced motion; the Core reads as waiting
      // rather than sleeping either way, it just holds its resting state.
      if (!prefersReducedMotion()) {
        // deep matte black, soft volumetric blue atmosphere — one glow, not a sky
        gsap.to(glow, { opacity: 0.4, scale: 1.08, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" });

        // The Core is alive even before it's touched — a near-imperceptible
        // breathing, not a spin. It should read as waiting, not sleeping.
        gsap.to(facetRefs.current, {
          opacity: 0.96,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(rimRef.current, { opacity: 0.55, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      }

      if (wasUnfolded) {
        // returning within this session — the world is already open, and the
        // title has already done its job of inviting a click
        gsap.set(title, { opacity: 0.4 });
        gsap.set(subtitle, { opacity: 0 });
        gsap.set(interactHintRef.current, { opacity: 0 });
        facetRefs.current.forEach((el, i) => el && gsap.set(el, { x: FACET_AXES[i].x, y: FACET_AXES[i].y }));
        gsap.set(voidRef.current, { attr: { r: 11 } });
        gsap.set(rimRef.current, { attr: { r: 11.4 }, opacity: 0.55 });
        layout.forEach((_, i) => {
          const path = pathRefs.current[i];
          const node = nodeRefs.current[i];
          if (path) gsap.set(path, { opacity: 0.5, strokeDasharray: path.getTotalLength(), strokeDashoffset: 0 });
          gsap.set(node, { opacity: 1, scale: 1 });
        });
        if (metaPathRef.current) {
          gsap.set(metaPathRef.current, {
            opacity: 0.45,
            strokeDasharray: metaPathRef.current.getTotalLength(),
            strokeDashoffset: 0,
          });
        }
        gsap.set(metaNodeRef.current, { opacity: 1, scale: 1 });
        gsap.from(stage, { opacity: 0, duration: 0.7, ease: "power2.out" });
        startAmbientLoop();
        setUnfolded(true);
        setUnfoldDone(true);
        return;
      }

      // First impression: darkness, atmosphere, and one object. Nothing
      // else — no title yet, no systems, no hint of what's behind it.
      gsap.set([title, subtitle, interactHintRef.current], { opacity: 0 });
      facetRefs.current.forEach((el) => el && gsap.set(el, { x: 0, y: 0 }));
      layout.forEach((_, i) => {
        gsap.set(nodeRefs.current[i], { opacity: 0, scale: 0.6 });
        const path = pathRefs.current[i];
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        }
      });
      if (metaNodeRef.current) gsap.set(metaNodeRef.current, { opacity: 0, scale: 0.6 });
      if (metaPathRef.current) {
        const len = metaPathRef.current.getTotalLength();
        gsap.set(metaPathRef.current, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
      }

      // The title breathes in quietly after a beat of stillness with just
      // the Core — long enough to read as intentional, not a loading delay.
      gsap.to(title, { opacity: 1, duration: 1.3, delay: 1.5, ease: "sine.out" });
      gsap.to(subtitle, { opacity: 0.6, duration: 1.3, delay: 1.8, ease: "sine.out" });

      // A quiet nudge that the Core itself is the thing to click — arrives
      // last, after the visitor has had a moment to look, then settles into
      // the same soft breathing loop as the rim/facets above.
      gsap.to(interactHintRef.current, {
        opacity: 0.55,
        duration: 1.2,
        delay: 2.5,
        ease: "sine.out",
        onComplete: () => {
          // the breathing loop is the ambient part — reduced motion still
          // gets the hint itself, just held steady rather than pulsing
          if (!prefersReducedMotion()) {
            gsap.to(interactHintRef.current, {
              opacity: 0.85,
              duration: 2.4,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }
        },
      });
    }, stage);

    return () => ctx.revert();
  }, [layout, startAmbientLoop]);

  // Near-invisible camera presence — tiny breathing, tiny parallax. Depth,
  // not motion. Suspended once a transition to a project begins, and skipped
  // entirely under reduced motion (parallax tied to mouse movement is
  // exactly the kind of non-essential motion that setting asks to avoid).
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || prefersReducedMotion()) return;
    const stage = stageRef.current;
    const glow = glowRef.current;
    const near = motesNearRef.current;
    const far = motesFarRef.current;
    if (!stage || !glow) return;
    const stageTo = gsap.quickTo(stage, "x", { duration: 1.4, ease: "power3.out" });
    const stageToY = gsap.quickTo(stage, "y", { duration: 1.4, ease: "power3.out" });
    const glowTo = gsap.quickTo(glow, "x", { duration: 1.6, ease: "power3.out" });
    const glowToY = gsap.quickTo(glow, "y", { duration: 1.6, ease: "power3.out" });
    const nearTo = near ? gsap.quickTo(near, "x", { duration: 1.5, ease: "power3.out" }) : null;
    const nearToY = near ? gsap.quickTo(near, "y", { duration: 1.5, ease: "power3.out" }) : null;
    const farTo = far ? gsap.quickTo(far, "x", { duration: 2, ease: "power3.out" }) : null;
    const farToY = far ? gsap.quickTo(far, "y", { duration: 2, ease: "power3.out" }) : null;
    const onMove = (e: MouseEvent) => {
      if (activeSlugRef.current) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      stageTo(nx * 5);
      stageToY(ny * 5);
      glowTo(nx * -14);
      glowToY(ny * -14);
      nearTo?.(nx * -3);
      nearToY?.(ny * -3);
      farTo?.(nx * -1.5);
      farToY?.(ny * -1.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Hover activates the whole ecosystem, not just the one line touched: the
  // Core responds, the chosen path lights, neighbors softly acknowledge
  // rather than being punished for not being the target.
  useEffect(() => {
    if (!unfoldDone) return;
    const idx = hovered && hovered !== "meta" ? layout.findIndex((l) => l.project.slug === hovered) : -1;
    const metaHovered = hovered === "meta";
    const anyHover = idx !== -1 || metaHovered;

    layout.forEach((_, i) => {
      const path = pathRefs.current[i];
      const node = nodeRefs.current[i];
      const particle = particleRefs.current[i];
      const isTarget = i === idx;
      const dim = anyHover && !isTarget;

      if (path) {
        gsap.to(path, { strokeWidth: isTarget ? 0.55 : 0.35, duration: 0.45, ease: "power2.out" });
        if (isTarget || dim) {
          pathBreathTweens.current[i]?.pause();
          gsap.to(path, { opacity: isTarget ? 1 : 0.32, duration: 0.45, ease: "power2.out" });
        } else {
          gsap.to(path, {
            opacity: 0.5,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => pathBreathTweens.current[i]?.resume(),
          });
        }
      }
      if (node) {
        gsap.to(node, {
          scale: isTarget ? 1.15 : dim ? 0.96 : 1,
          opacity: dim ? 0.72 : 1,
          duration: 0.45,
          ease: "power2.out",
        });
      }
      if (particle) gsap.to(particle, { attr: { r: isTarget ? 0.95 : 0.55 }, duration: 0.4, ease: "power2.out" });
      particleTweens.current[i]?.timeScale(isTarget ? 1.8 : 1);
    });

    if (metaPathRef.current) {
      const dim = anyHover && !metaHovered;
      gsap.to(metaPathRef.current, {
        opacity: metaHovered ? 0.85 : dim ? 0.22 : 0.4,
        strokeWidth: metaHovered ? 0.4 : 0.25,
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (metaNodeRef.current) {
      const dim = anyHover && !metaHovered;
      gsap.to(metaNodeRef.current, {
        scale: metaHovered ? 1.15 : dim ? 0.96 : 1,
        opacity: dim ? 0.72 : 1,
        duration: 0.45,
        ease: "power2.out",
      });
    }

    // the Core acknowledges the visitor — the rim brightens, a single spark
    // races the active pathway once
    gsap.to(rimRef.current, { opacity: anyHover ? 0.85 : 0.55, duration: 0.5, ease: "power2.out" });
    if (anyHover) {
      const path = metaHovered ? metaPathRef.current : pathRefs.current[idx];
      const burst = metaHovered ? metaBurstRef.current : burstRefs.current[idx];
      if (burst && path) {
        gsap.killTweensOf(burst);
        gsap.fromTo(
          burst,
          { opacity: 1, attr: { r: 0.9 } },
          {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            duration: 0.55,
            ease: "power1.in",
            onComplete: () => gsap.set(burst, { opacity: 0 }),
          }
        );
      }
    }
  }, [hovered, layout, unfoldDone]);

  const handleOpen = (project: Project, index: number) => {
    if (activeSlugRef.current || !unfoldDone) return;
    const node = nodeRefs.current[index];
    const path = pathRefs.current[index];
    const flash = flashRef.current;
    if (!node || !flash) {
      router.push(`/projects/${project.slug}`);
      return;
    }

    setActiveSlug(project.slug);
    activeSlugRef.current = project.slug;
    setHovered(project.slug);
    pathBreathTweens.current.forEach((t) => t?.pause());

    const nextVisited = Array.from(new Set([...visitedSlugs, project.slug]));
    setVisitedSlugs(nextVisited);
    sessionStorage.setItem(VISITED_KEY, JSON.stringify(nextVisited));

    const rect = node.getBoundingClientRect();
    const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    flash.style.backgroundColor = project.accent;
    gsap.set(flash, { clipPath: `circle(0% at ${cx}% ${cy}%)`, opacity: 1 });

    const others = nodeRefs.current.filter((_, i) => i !== index).filter(Boolean) as HTMLDivElement[];
    const otherPaths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    const target = layout[index];
    const camDx = (target.x - 50) * 0.12;
    const camDy = (target.y - CENTER.y) * 0.12;

    const tl = gsap.timeline({ onComplete: () => router.push(`/projects/${project.slug}`) });

    // the energy travels the pathway first
    const burst = burstRefs.current[index];
    if (burst && path) {
      gsap.set(burst, { opacity: 1, attr: { r: 1.1 } });
      tl.to(
        burst,
        { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 0.45, ease: "power1.in" },
        0
      );
    }
    // the camera follows — a small, precise nudge toward the destination
    tl.to(stageRef.current, { scale: 1.05, x: `+=${camDx}`, y: `+=${camDy}`, duration: 0.55, ease: "power2.inOut" }, 0.1);

    tl.to(others, { opacity: 0, scale: 0.7, duration: 0.4, ease: "power2.out" }, 0.25);
    tl.to(otherPaths, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(metaNodeRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(metaPathRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(
      [facetRefs.current, voidRef.current, rimRef.current, titleRef.current, subtitleRef.current],
      { opacity: 0, duration: 0.3, ease: "power2.out" },
      0.3
    );
    tl.to(node, { scale: 1.6, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(flash, { clipPath: `circle(140% at ${cx}% ${cy}%)`, duration: 0.75, ease: "power3.in" }, 0.4);
  };

  // "This Portfolio" now has somewhere to go — its own closing chapter. The
  // transition mirrors handleOpen's (energy travels the pathway, the rest of
  // the Core dissolves, the flash carries the visitor through) but drives off
  // the meta node's own singular refs rather than the indexed project arrays.
  const handleMetaOpen = () => {
    if (activeSlugRef.current || !unfoldDone) return;
    const node = metaNodeRef.current;
    const path = metaPathRef.current;
    const flash = flashRef.current;
    if (!node || !flash) {
      router.push(`/projects/${metaSystem.slug}`);
      return;
    }

    setActiveSlug(metaSystem.slug);
    activeSlugRef.current = metaSystem.slug;
    setHovered("meta");
    pathBreathTweens.current.forEach((t) => t?.pause());

    const rect = node.getBoundingClientRect();
    const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    flash.style.backgroundColor = metaSystem.accent;
    gsap.set(flash, { clipPath: `circle(0% at ${cx}% ${cy}%)`, opacity: 1 });

    const others = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
    const otherPaths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    const camDx = (META_LAYOUT.x - 50) * 0.12;
    const camDy = (META_LAYOUT.y - CENTER.y) * 0.12;

    const tl = gsap.timeline({ onComplete: () => router.push(`/projects/${metaSystem.slug}`) });

    const burst = metaBurstRef.current;
    if (burst && path) {
      gsap.killTweensOf(burst);
      gsap.set(burst, { opacity: 1, attr: { r: 1.1 } });
      tl.to(burst, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5] }, duration: 0.45, ease: "power1.in" }, 0);
    }
    tl.to(stageRef.current, { scale: 1.05, x: `+=${camDx}`, y: `+=${camDy}`, duration: 0.55, ease: "power2.inOut" }, 0.1);

    tl.to(others, { opacity: 0, scale: 0.7, duration: 0.4, ease: "power2.out" }, 0.25);
    tl.to(otherPaths, { opacity: 0, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(
      [facetRefs.current, voidRef.current, rimRef.current, titleRef.current, subtitleRef.current],
      { opacity: 0, duration: 0.3, ease: "power2.out" },
      0.3
    );
    tl.to(node, { scale: 1.6, duration: 0.3, ease: "power2.out" }, 0.25);
    tl.to(flash, { clipPath: `circle(140% at ${cx}% ${cy}%)`, duration: 0.75, ease: "power3.in" }, 0.4);
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-void">
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={glowRef}
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/15 opacity-0 blur-[200px]"
        />
        <div ref={motesFarRef} className="absolute inset-0">
          {MOTES_FAR.map((s, i) => (
            <span
              key={i}
              className="animate-pulse-soft absolute rounded-full bg-cyan"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
        <div ref={motesNearRef} className="absolute inset-0">
          {MOTES_NEAR.map((s, i) => (
            <span
              key={i}
              className="animate-pulse-soft absolute rounded-full bg-cyan"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                opacity: s.opacity,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        ref={flashRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] opacity-0"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      />

      <div ref={headerRef}>
        <AIBrandMark className="fixed left-6 top-6 z-40" />
        <ContactModal className="fixed right-6 top-6 z-40" />
      </div>

      <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-6 py-12">
        <div
          ref={stageRef}
          className="relative aspect-square w-[min(94vw,80dvh,760px)]"
          style={{ pointerEvents: unfoldDone && !activeSlug ? "auto" : "none" }}
        >
          <div className="pointer-events-none absolute left-1/2 top-[8%] flex -translate-x-1/2 flex-col items-center gap-2 text-center">
            <h1
              ref={titleRef}
              className="font-mono text-xs uppercase tracking-[0.5em] text-ink opacity-0 sm:text-sm"
            >
              The Core
            </h1>
            <p
              ref={subtitleRef}
              className="max-w-xs text-[10px] uppercase tracking-[0.2em] text-ink-faint opacity-0 sm:text-[11px]"
            >
              Every system starts with an idea. Choose one to explore.
            </p>
          </div>

          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
            {layout.map((l, i) => (
              <path
                key={l.project.slug}
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={l.path}
                fill="none"
                stroke={l.project.accent}
                strokeWidth={0.35}
                strokeLinecap="round"
              />
            ))}
            <path
              ref={metaPathRef}
              d={META_LAYOUT.path}
              fill="none"
              stroke={metaSystem.accent}
              strokeWidth={0.22}
              strokeLinecap="round"
            />
            {layout.map((l, i) => (
              <circle
                key={`p-${l.project.slug}`}
                ref={(el) => {
                  particleRefs.current[i] = el;
                }}
                r={0.55}
                fill={l.project.accent}
                opacity={0}
                style={{ filter: `drop-shadow(0 0 2px ${l.project.accent})` }}
              />
            ))}
            <circle ref={metaParticleRef} r={0.35} fill={metaSystem.accent} opacity={0} />
            {layout.map((l, i) => (
              <circle
                key={`t-${l.project.slug}`}
                ref={(el) => {
                  trailParticleRefs.current[i] = el;
                }}
                r={0.32}
                fill={l.project.accent}
                opacity={0}
              />
            ))}
            {layout.map((l, i) => (
              <circle
                key={`b-${l.project.slug}`}
                ref={(el) => {
                  burstRefs.current[i] = el;
                }}
                r={1}
                fill="#ffffff"
                opacity={0}
                style={{ filter: `drop-shadow(0 0 3px ${l.project.accent})` }}
              />
            ))}
            <circle ref={metaBurstRef} r={0.7} fill="#ffffff" opacity={0} />
          </svg>

          {/* The Core — a gateway, not the hero. Small and quiet on purpose. */}
          <button
            type="button"
            onClick={handleUnfoldCore}
            onMouseEnter={handleCoreEnter}
            onMouseLeave={handleCoreLeave}
            aria-label="Open the Core"
            data-cursor={unfolded ? undefined : "open"}
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 sm:h-24 sm:w-24"
            style={{ cursor: unfolded ? "default" : "pointer", pointerEvents: unfolded ? "none" : "auto" }}
          >
            <CoreEmblem
              className="h-full w-full"
              facetRef={(el, i) => {
                facetRefs.current[i] = el;
              }}
              voidRef={(el) => {
                voidRef.current = el;
              }}
              rimRef={(el) => {
                rimRef.current = el;
              }}
            />
          </button>

          {/* a quiet nudge that the Core itself is clickable — fades in after
             the title/subtitle, fades out the instant it's opened */}
          <p
            ref={interactHintRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.4em] text-ink-faint"
            style={{ marginTop: "3.6rem", opacity: 0 }}
          >
            Click to open
          </p>

          {/* project systems — discovered, not displayed */}
          {layout.map((l, i) => (
            <Link
              key={l.project.slug}
              href={`/projects/${l.project.slug}`}
              data-cursor="open"
              // Invisible (opacity:0) and inert until the Core unfolds — without
              // this, a keyboard user tabbing through the page lands on links
              // they can't see yet, with no visible focus target on screen.
              tabIndex={unfoldDone ? 0 : -1}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${l.x}%`, top: `${l.y}%` }}
              onMouseEnter={() => setHovered(l.project.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.preventDefault();
                handleOpen(l.project, i);
              }}
            >
              <div
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                className="relative flex flex-col items-center"
              >
                <span
                  className="absolute rounded-full blur-lg transition-opacity duration-300"
                  style={{
                    width: l.flagship ? 44 : 32,
                    height: l.flagship ? 44 : 32,
                    backgroundColor: l.project.accent,
                    opacity: hovered === l.project.slug ? 0.65 : visitedSlugs.includes(l.project.slug) ? 0.35 : 0.2,
                  }}
                />
                <span
                  className="relative rounded-full backdrop-blur-sm"
                  style={{
                    width: l.flagship ? 12 : 9,
                    height: l.flagship ? 12 : 9,
                    backgroundColor: l.project.accent,
                    boxShadow: `0 0 ${l.flagship ? 22 : 16}px ${l.project.accent}`,
                  }}
                />
                {visitedSlugs.includes(l.project.slug) && (
                  <span
                    className="absolute rounded-full border"
                    style={{
                      width: (l.flagship ? 12 : 9) + 8,
                      height: (l.flagship ? 12 : 9) + 8,
                      borderColor: `${l.project.accent}55`,
                    }}
                  />
                )}
                <p
                  className={`mt-3 whitespace-nowrap font-mono uppercase tracking-[0.2em] text-ink-dim ${
                    l.flagship ? "text-[11px]" : "text-[10px]"
                  }`}
                  style={l.flagship ? { color: l.project.accent } : undefined}
                >
                  {l.project.name}
                </p>

                <div
                  className={`glass-panel absolute z-20 w-64 rounded-xl p-4 text-left transition-all duration-300 ${panelPlacement(
                    l.x,
                    l.y
                  )} ${hovered === l.project.slug ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-1 opacity-0"}`}
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: l.project.accent }}>
                    {l.project.category} · {l.project.year}
                  </p>
                  <p className="mt-1.5 font-display text-sm font-medium text-ink">{l.project.name}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{l.project.tagline}</p>
                  <p className="mt-2.5 text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                    {l.project.stack.slice(0, 4).join(" · ")}
                  </p>
                  <p className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em]">
                    <span className="text-ai-green">{visitedSlugs.includes(l.project.slug) ? "Visited" : "Live"}</span>
                    <span style={{ color: l.project.accent }}>Open Project →</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {/* the fifth system — not a client project, the portfolio's own closing chapter */}
          <Link
            href={`/projects/${metaSystem.slug}`}
            data-cursor="open"
            tabIndex={unfoldDone ? 0 : -1}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${META_LAYOUT.x}%`, top: `${META_LAYOUT.y}%`, pointerEvents: unfoldDone && !activeSlug ? "auto" : "none" }}
            onMouseEnter={() => setHovered("meta")}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              e.preventDefault();
              handleMetaOpen();
            }}
          >
            <div ref={metaNodeRef} className="relative flex flex-col items-center">
              <span
                className="absolute h-6 w-6 rounded-full blur-lg transition-opacity duration-300"
                style={{ backgroundColor: metaSystem.accent, opacity: hovered === "meta" ? 0.5 : 0.15 }}
              />
              <span
                className="relative h-2 w-2 rounded-full backdrop-blur-sm"
                style={{ backgroundColor: metaSystem.accent, boxShadow: `0 0 10px ${metaSystem.accent}` }}
              />
              <p className="mt-2.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint opacity-70">
                {metaSystem.name}
              </p>

              <div
                className={`glass-panel absolute z-20 w-56 rounded-xl p-4 text-left transition-all duration-300 ${panelPlacement(
                  META_LAYOUT.x,
                  META_LAYOUT.y
                )} ${hovered === "meta" ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-1 opacity-0"}`}
                style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                <p className="font-display text-sm font-medium text-ink">{metaSystem.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{metaSystem.hoverText}</p>
                <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: metaSystem.accent }}>
                  Open →
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
