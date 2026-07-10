import type { WorldContent, StoryBeat, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 05 — Creative Engineering Portfolio. The closing chapter, not a
// client project: it's the destination behind the Core's fifth, "meta"
// system (see src/data/projects.ts' `metaSystem` and TheCore's handleMetaOpen).
//
// The identity color (#9fb3c8 / 159,179,200) is the same accent the meta
// node already carries in the Core — the one real anchor point, exactly the
// convention every other project world followed. Supporting accents are the
// site's own established tokens (cyan, violet, ai-green, electric — see
// globals.css) rather than a new invented palette, since this chapter is
// meant to feel like a return to the Hero/Core's visual language, not a new
// project identity.
//
// Resources and the ending both follow the exact same framework every other
// project uses — README, Repository, Tech Stack, CTA, Return to the Core —
// no special-cased "closing chapter" variant.
// ---------------------------------------------------------------------------

export const creativeEngineeringSystemAccentRGB = "159,179,200"; // #9fb3c8 — the Core's own meta-system accent

const CYAN = "#52f2ff";
const VIOLET = "#9b6bff";
const GREEN = "#4ee6a8";
const ELECTRIC = "#3b82f6";
const PRIMARY = "#9fb3c8";

const STACK: TechStackGroup[] = [
  {
    name: "Frontend",
    items: "React · Next.js",
    accent: CYAN,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 8h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Backend",
    items: "Node · Python",
    accent: VIOLET,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <rect x="4" y="15" width="16" height="6" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="7.5" cy="6" r="0.8" fill="currentColor" />
        <circle cx="7.5" cy="18" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "AI",
    items: "LLM Orchestration · RAG",
    accent: GREEN,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M7.7 7.2L11 16M16.3 7.2L13 16M8 6h8" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: "Cloud",
    items: "AWS · Vercel",
    accent: ELECTRIC,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.62-1.4A4.5 4.5 0 0 1 17.5 17H7Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    ),
  },
  {
    name: "Database",
    items: "PostgreSQL · MongoDB",
    accent: CYAN,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Automation",
    items: "Workflow Engines",
    accent: VIOLET,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Motion",
    items: "GSAP · Framer Motion",
    accent: GREEN,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 16c3-8 6-8 8 0s5 8 8 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "3D",
    items: "Three.js · WebGL",
    accent: ELECTRIC,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M12 3v9m0 9v-9m0 0L4 7.5m8 4.5l8-4.5" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

const BEATS: StoryBeat[] = [
  {
    kind: "text",
    label: "01 — Design Philosophy",
    title: "Every product is a system before it's a screen.",
    paragraphs: [
      "Good design isn't decoration added at the end — it's the structural decision a product is built on from the first sketch. The interface, the data flow, and the way a system reasons about its own state all come from the same intent, chosen once, early, and carried all the way through.",
    ],
  },
  {
    kind: "flow",
    label: "02 — Creative Workflow",
    title: "From a question to a working system.",
    nodes: [
      { label: "Curiosity", accent: CYAN },
      { label: "Research", accent: ELECTRIC },
      { label: "Concept", accent: VIOLET },
      { label: "Iteration", accent: GREEN },
      { label: "Delivery", accent: PRIMARY, big: true },
    ],
  },
  {
    kind: "cards",
    label: "03 — What I Build",
    title: "Eight shapes the same craft takes.",
    cards: [
      { title: "AI Products", body: "Systems that reason, not just respond — built around a model's real strengths instead of bolted on as a feature.", accent: CYAN },
      { title: "Multi-Agent Systems", body: "Specialized agents that hand off work to each other with an inspectable trail, not one prompt doing everyone's job at once.", accent: VIOLET },
      { title: "Automation", body: "The repetitive parts of a workflow removed entirely, so the people running it spend time on what actually needs judgment.", accent: GREEN },
      { title: "Modern Business Platforms", body: "Admin dashboards, customer portals, and the operational plumbing underneath — built to hold up in production, not just in a demo.", accent: ELECTRIC },
      { title: "3D Experiences", body: "Depth and motion used to make an interface feel like a real space — restrained enough to still load fast.", accent: CYAN },
      { title: "AI Workflows", body: "Multi-step reasoning pipelines with a verification pass at the end, so confidence is earned, not just displayed.", accent: VIOLET },
      { title: "Dashboards", body: "The view a business actually needs to make a decision — not every metric that could technically be shown.", accent: GREEN },
      { title: "Creative UI Systems", body: "A visual language designed once and reused everywhere it applies — consistent by construction, not by discipline.", accent: ELECTRIC },
    ],
  },
  {
    kind: "engineering",
    label: "04 — Design Principles",
    title: "What doesn't change, project to project.",
    items: [
      { term: "Clarity over cleverness", body: "if a user has to think about the interface, the interface has already failed." },
      { term: "Systems, not screens", body: "every screen is one view into a system that has to make sense as a whole." },
      { term: "Motion with purpose", body: "animation explains a state change, or it doesn't ship." },
      { term: "Honest interfaces", body: "a system never claims more confidence than it actually has." },
      { term: "Performance is a feature", body: "a beautiful interface that lags isn't a beautiful interface." },
    ],
  },
  {
    kind: "engineering",
    label: "05 — Engineering Stack",
    title: "The stack behind the craft.",
    items: [
      { term: "Frontend", body: "React and Next.js, built for interfaces that feel instant." },
      { term: "Backend", body: "Node and Python, whichever fits the system being built." },
      { term: "AI", body: "LLM orchestration, retrieval, and multi-agent coordination — reasoned, not just prompted." },
      { term: "Cloud", body: "infrastructure that scales without babysitting." },
      { term: "Database", body: "relational or document-based, chosen by the shape of the data, not by habit." },
      { term: "Automation", body: "workflow engines and scripted pipelines that remove repetitive work entirely." },
      { term: "Motion", body: "GSAP and Framer Motion, used to explain state, not decorate it." },
      { term: "3D", body: "Three.js and WebGL, for the moments depth actually earns its cost." },
    ],
  },
  {
    kind: "flow",
    label: "06 — Product Development Lifecycle",
    title: "Blank canvas to launch.",
    nodes: [
      { label: "Blank Canvas", accent: PRIMARY },
      { label: "Research", accent: CYAN },
      { label: "Wireframe", accent: ELECTRIC },
      { label: "Design System", accent: VIOLET },
      { label: "Prototype", accent: GREEN },
      { label: "Engineering", accent: CYAN },
      { label: "Testing", accent: ELECTRIC },
      { label: "Launch", accent: PRIMARY, big: true },
    ],
  },
];

export const creativeEngineeringSystemContent: WorldContent = {
  heroTitleLines: ["Creative Engineering", "Portfolio"],
  heroSubtitleLines: ["How ideas become products", "through design, engineering and intelligent systems."],
  agentStatusLines: [
    "Design Philosophy — establishing intent",
    "Creative Workflow — question becoming concept",
    "Engineering — building the system underneath",
    "Testing — verifying before anything ships",
    "Launch — shipped, not just demoed",
  ],
  statusBadgeLabel: "Studio nominal",
  videoSrc: "/videos/creative-engineering-portfolio.mp4",
  beats: BEATS,
  readme: {
    title: "Creative Engineering Portfolio",
    subtitle: "How ideas become products through design, engineering and intelligent systems.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            The closing chapter of this portfolio — not a client project, but the practice behind every one of them:
            how an idea becomes a working system, and the principles that don&apos;t change from project to project.
          </P>
        ),
      },
      {
        heading: "Design Philosophy",
        body: (
          <P>
            Good design isn&apos;t decoration added at the end — it&apos;s the structural decision a product is built
            on from the first sketch. The interface, the data flow, and the way a system reasons about its own state
            all come from the same intent, chosen once, early.
          </P>
        ),
      },
      {
        heading: "Creative Workflow",
        body: (
          <UL>
            <LI><Code>Curiosity</Code> — a real question, not a assumption of one.</LI>
            <LI><Code>Research</Code> — understanding the problem before touching a solution.</LI>
            <LI><Code>Concept</Code> — a direction worth building toward.</LI>
            <LI><Code>Iteration</Code> — refined against real use, not just opinion.</LI>
            <LI><Code>Delivery</Code> — shipped, not just demoed.</LI>
          </UL>
        ),
      },
      {
        heading: "What I Build",
        body: (
          <UL>
            <LI>AI Products</LI>
            <LI>Multi-Agent Systems</LI>
            <LI>Automation</LI>
            <LI>Modern Business Platforms</LI>
            <LI>3D Experiences</LI>
            <LI>AI Workflows</LI>
            <LI>Dashboards</LI>
            <LI>Creative UI Systems</LI>
          </UL>
        ),
      },
      {
        heading: "Design Principles",
        body: (
          <UL>
            <LI><Code>Clarity over cleverness</Code> — if a user has to think about the interface, it has already failed.</LI>
            <LI><Code>Systems, not screens</Code> — every screen is one view into a system that has to make sense as a whole.</LI>
            <LI><Code>Motion with purpose</Code> — animation explains a state change, or it doesn&apos;t ship.</LI>
            <LI><Code>Honest interfaces</Code> — a system never claims more confidence than it actually has.</LI>
            <LI><Code>Performance is a feature</Code> — a beautiful interface that lags isn&apos;t a beautiful interface.</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Stack",
        body: (
          <UL>
            <LI><Code>Frontend</Code> — React, Next.js</LI>
            <LI><Code>Backend</Code> — Node, Python</LI>
            <LI><Code>AI</Code> — LLM orchestration, retrieval, multi-agent coordination</LI>
            <LI><Code>Cloud</Code> — AWS, Vercel</LI>
            <LI><Code>Database</Code> — PostgreSQL, MongoDB</LI>
            <LI><Code>Automation</Code> — workflow engines and scripted pipelines</LI>
            <LI><Code>Motion</Code> — GSAP, Framer Motion</LI>
            <LI><Code>3D</Code> — Three.js, WebGL</LI>
          </UL>
        ),
      },
      {
        heading: "Product Development Lifecycle",
        body: (
          <UL>
            <LI>Blank Canvas → Research → Wireframe → Design System</LI>
            <LI>Prototype → Engineering → Testing → Launch</LI>
          </UL>
        ),
      },
      {
        heading: "Access",
        body: <P>Available during technical discussions.</P>,
      },
    ],
  },
  repository: {
    title: "Portfolio Source",
    description: (
      <>
        <p>Private source code.</p>
        <p>Available during technical discussions.</p>
      </>
    ),
    requestLabel: "Request Access →",
  },
  techStack: STACK,
  cta: {
    heading: "Let's build something worth shipping.",
    body: "If you have an idea that needs both design judgment and real engineering behind it, this is where that conversation starts.",
    buttonLabel: "Schedule a Call",
  },
};
