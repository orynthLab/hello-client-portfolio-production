import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Shared shape for every "project world" in this portfolio. One framework,
// swapped identity per project — see InvestmentWorld.tsx and
// FinancialReportWorld.tsx for the two config objects that feed these types
// into the same shared components (WorldBackground, Arrival, StoryScreen,
// ResourcesScreen, ReadmeModal, VideoLightbox, FlowPrimitives).
// ---------------------------------------------------------------------------

export type FlowNodeSpec = { label: string; sub?: string; accent: string; big?: boolean };

export type StoryBeat =
  | { kind: "text"; label: string; title: string; paragraphs: string[] }
  | { kind: "flow"; label: string; title: string; nodes: FlowNodeSpec[] }
  | { kind: "engineering"; label: string; title: string; items: { term: string; body: string }[] }
  | {
      kind: "impact";
      label: string;
      title: string;
      metrics: { label: string; accent: string; target?: number; display?: string; prefix?: string; suffix?: string }[];
    }
  | { kind: "future"; label: string; title: string; milestones: { tag: string; body: string; accent: string }[] }
  | { kind: "cards"; label: string; title: string; cards: { title: string; body: string; accent: string }[] };

export type ReadmeSection = { heading: string; body: ReactNode };

export type ReadmeContent = {
  title: string;
  subtitle: string;
  sections: ReadmeSection[];
};

export type TechStackGroup = { name: string; items: string; accent: string; icon: ReactNode };

/**
 * The only thing that's actually allowed to change the background's
 * *identity* — two accent colors and a motif. Everything else about
 * WorldBackground (layer count, layer order, motion) stays fixed.
 */
export type WorldTheme = {
  /** "r,g,b" triple used for the primary accent (lines, ticks, particles, network nodes) */
  primaryRGB: string;
  /** "r,g,b" triple for the volumetric glow specifically — a deeper, darker tone than
   *  primaryRGB (a bright line-accent color would read as a saturated wash at glow size) */
  glowPrimaryRGB: string;
  /** "r,g,b" triple used for the secondary accent (gold's structural role — rules, secondary glow, ~30% of lines) */
  secondaryRGB: string;
  /** abstract fragments for the numeric-pulse layer — flavor only, never real data */
  numericPool: string[];
  /** curves = market bezier lines; documents = ledger/accounting paper; verification = ID
   *  cards, bounding boxes, confidence badges, security watermark; routes = freight
   *  nodes, GPS pulses, traveling shipment dots along gentle route arcs */
  motif: "curves" | "documents" | "verification" | "routes";
};

/** a single direct resource link — Resume, GitHub, LinkedIn, Email, Schedule a
 *  Call — used by ResourcesScreen's `links` prop in place of the README/
 *  repository pair. See ResourcesScreen.tsx. */
export type ResourceLink = { index: string; label: string; action: ReactNode };

export type WorldContent = {
  heroTitleLines: string[];
  heroSubtitleLines: string[];
  agentStatusLines: string[];
  statusBadgeLabel: string;
  videoSrc?: string;
  beats: StoryBeat[];
  readme: ReadmeContent;
  repository: { title: string; description: ReactNode; requestLabel: string };
  techStack: TechStackGroup[];
  cta: { heading: string; body: string; buttonLabel: string };
};
