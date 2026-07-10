import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 02 — Financial Intelligence Workspace.
//
// Every fact below is drawn from this project's actual record
// (src/data/projects.ts, slug company-financial-report-agent: the problem,
// solution, architecture, tech stack, and recorded metrics already
// documented there) — rewritten in fresh prose for this world rather than
// copied verbatim. Nothing here is invented: no fabricated technology, no
// made-up numbers. Where the real stack doesn't name a separate backend
// framework, the Backend category is filled honestly with what the stack
// actually uses for that role (Next.js API routes), not a stand-in borrowed
// from Project 01.
// ---------------------------------------------------------------------------

export const financialReportWorldTheme: WorldTheme = {
  primaryRGB: "165,180,200", // slate / ice
  glowPrimaryRGB: "28,34,46", // executive charcoal-slate
  secondaryRGB: "216,201,176", // paper / parchment
  numericPool: ["XBRL", "10-K", "Note 7", "✓ Cited", "Rev +4.2%", "Δ YoY", "§12.4", "p. 44", "97.8%", "Ref. 3B", "FY24", "n/a"],
  motif: "documents",
};

const STACK: TechStackGroup[] = [
  {
    name: "Frontend",
    items: "Next.js",
    accent: "#a5b4cc",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 8h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Backend",
    items: "Next.js API Routes",
    accent: "#8fa3bd",
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
    items: "Claude",
    accent: "#b7c3d6",
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
    name: "Finance",
    items: "XBRL · Financial Data Parsers",
    accent: "#d8c9b0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V11M11 19V5M18 19V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Infrastructure",
    items: "PostgreSQL · Vector DB",
    accent: "#9fb0a8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export const financialReportWorldContent: WorldContent = {
  heroTitleLines: ["Financial Intelligence", "Workspace"],
  heroSubtitleLines: [
    "Transforming audited financial statements",
    "into structured business intelligence.",
  ],
  agentStatusLines: [
    "Filing Reader — parsing XBRL tags",
    "Narrative Extractor — chunking disclosure text",
    "Citation Engine — linking claims to source",
    "Diff Analyst — comparing against prior period",
    "Verification Pass — rejecting unsourced claims",
  ],
  statusBadgeLabel: "Pipeline nominal",
  videoSrc: "/videos/financial-report-agent.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — Problem",
      title: "Filings arrive readable. Insight doesn't.",
      paragraphs: [
        "Every 10-K, 10-Q, and earnings transcript lands in its own format, and the line that actually matters is usually a footnote, not the headline number. An equity team can lose the first two days of earnings season just reading, before any real analysis starts.",
      ],
    },
    {
      kind: "text",
      label: "02 — Solution",
      title: "Structured data and narrative text, cross-checked.",
      paragraphs: [
        "The agent parses each filing's XBRL alongside its full narrative text, diffs it against the prior period, and drafts a brief where every claim carries a citation back to its exact source line — nothing reaches an analyst unsourced.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Extraction Pipeline",
      title: "From raw filing to structured claim.",
      nodes: [
        { label: "Filing Intake", sub: "10-K · 10-Q · Transcripts", accent: "#a5b4cc" },
        { label: "Structured Parse", sub: "XBRL", accent: "#8fa3bd" },
        { label: "Narrative Extraction", sub: "Chunk + Embed", accent: "#b7c3d6" },
        { label: "Retrieval Index", sub: "Vector DB", accent: "#d8c9b0" },
      ],
    },
    {
      kind: "flow",
      label: "04 — Architecture",
      title: "A short, citable chain.",
      nodes: [
        { label: "Analyst Console", sub: "Next.js", accent: "#a5b4cc" },
        { label: "Retrieval + Drafting", sub: "Claude", accent: "#b7c3d6" },
        { label: "Citation Verification", sub: "rejects unsourced claims", accent: "#d8c9b0" },
        { label: "Historical State", sub: "Postgres", accent: "#9fb0a8" },
      ],
    },
    {
      kind: "engineering",
      label: "05 — Engineering Decisions",
      title: "Why, briefly.",
      items: [
        { term: "Claude", body: "constrained to cite only retrieved passages — verification rejects anything it can't source, rather than let a plausible number slip through." },
        { term: "Vector DB", body: "narrative sections are retrieved by meaning, not keyword, so a phrase like “headcount reduction” still surfaces a filing that says “workforce optimization.”" },
        { term: "XBRL", body: "reads the same structured tags regulators themselves validate, so every figure ties back to a machine-checked source, not screen-scraped text." },
      ],
    },
    {
      kind: "impact",
      label: "06 — Business Impact",
      title: "Recorded results.",
      metrics: [
        { label: "Reports processed", target: 14000, suffix: "+/mo", accent: "#a5b4cc" },
        { label: "Analyst time saved", target: 76, prefix: "-", suffix: "%", accent: "#b7c3d6" },
        { label: "Insight accuracy", target: 97.8, suffix: "%", accent: "#d8c9b0" },
      ],
    },
    {
      kind: "future",
      label: "07 — Future Scope",
      title: "What's next.",
      milestones: [
        { tag: "Now", body: "Live for citation-verified briefs across 300+ tracked tickers, expanded from 60 without adding headcount.", accent: "#9fb0a8" },
        { tag: "Next", body: "Cross-filing pattern detection to flag unusual language shifts across a company's last several quarters automatically.", accent: "#d8c9b0" },
      ],
    },
  ],
  readme: {
    title: "Financial Intelligence Workspace",
    subtitle: "Transforming audited financial statements into structured business intelligence.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            An agent that reads a company&apos;s full financial disclosures — 10-Ks, 10-Qs, earnings transcripts —
            and turns them into a structured, cited brief an analyst can trust in minutes, not days.
          </P>
        ),
      },
      {
        heading: "The Problem",
        body: (
          <P>
            Every filing arrives in its own format, and the change that actually matters is usually buried in a
            footnote, not the headline number. Analysts didn&apos;t want a summarizer — they wanted something
            that could be trusted to find what changed and cite exactly where.
          </P>
        ),
      },
      {
        heading: "The Solution",
        body: (
          <P>
            The agent parses structured XBRL data alongside the narrative text, diffs each filing against the
            company&apos;s prior period, and produces a brief where every claim links back to its exact source
            line.
          </P>
        ),
      },
      {
        heading: "Extraction Pipeline",
        body: (
          <UL>
            <LI><Code>Filing Intake</Code> — 10-Ks, 10-Qs, and transcripts, whatever format they arrive in.</LI>
            <LI><Code>Structured Parse</Code> — XBRL tags extract the machine-checked financial figures.</LI>
            <LI><Code>Narrative Extraction</Code> — filing text is chunked and embedded for retrieval.</LI>
            <LI><Code>Retrieval Index</Code> — a vector store holds it all for citation-backed drafting.</LI>
          </UL>
        ),
      },
      {
        heading: "Architecture",
        body: (
          <UL>
            <LI><Code>Frontend</Code> — Next.js analyst console</LI>
            <LI><Code>Backend</Code> — Next.js API routes</LI>
            <LI><Code>AI</Code> — Claude, drafting and verification</LI>
            <LI><Code>Finance</Code> — XBRL and purpose-built filing parsers</LI>
            <LI><Code>Infrastructure</Code> — PostgreSQL for historical state, a vector database for retrieval</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Decisions",
        body: (
          <UL>
            <LI><Code>Claude</Code> — constrained to cite only retrieved passages; a verification pass rejects any unsourced claim.</LI>
            <LI><Code>Vector DB</Code> — retrieval by meaning, not keyword, so paraphrased disclosures still surface.</LI>
            <LI><Code>XBRL</Code> — the same structured tags regulators validate, not screen-scraped text.</LI>
          </UL>
        ),
      },
      {
        heading: "Capabilities",
        body: (
          <UL>
            <LI>Citation-Linked Briefs</LI>
            <LI>XBRL + Narrative Parsing</LI>
            <LI>Period-over-Period Diffing</LI>
            <LI>Claim Verification Pass</LI>
            <LI>300+ Tickers Tracked</LI>
          </UL>
        ),
      },
      {
        heading: "Recorded Results",
        body: (
          <UL>
            <LI>14,000+ reports processed monthly</LI>
            <LI>-76% analyst time per filing</LI>
            <LI>97.8% insight accuracy</LI>
          </UL>
        ),
      },
      {
        heading: "Roadmap",
        body: (
          <UL>
            <LI><Code>Now</Code> — live for citation-verified briefs across 300+ tracked tickers.</LI>
            <LI><Code>Next</Code> — cross-filing pattern detection across a company&apos;s recent quarters.</LI>
          </UL>
        ),
      },
      {
        heading: "Access",
        body: <P>Production source code is private. Available during technical discussions.</P>,
      },
    ],
  },
  repository: {
    title: "Production Repository",
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
    heading: "Interested in this project?",
    body: "Let's discuss it — schedule a live walkthrough.",
    buttonLabel: "Schedule a Walkthrough",
  },
};
