import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 01 — Investment Intelligence Engine.
// This is the master config: every value here is exactly what was already
// live before the project-world system was extracted. Zero content or
// color changes — only the *shape* moved from hardcoded JSX into this object.
// ---------------------------------------------------------------------------

export const investmentWorldTheme: WorldTheme = {
  primaryRGB: "150,175,220",
  glowPrimaryRGB: "20,40,80",
  secondaryRGB: "201,168,76",
  numericPool: ["0.042", "+1.8%", "σ 0.31", "Δ", "12ms", "0.97β", "Σ", "-0.6%", "1,204", "0.88", "μ", "R² 0.94"],
  motif: "curves",
};

const STACK: TechStackGroup[] = [
  {
    name: "Frontend",
    items: "Next.js",
    accent: "#52f2ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 8h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Backend",
    items: "FastAPI",
    accent: "#3b82f6",
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
    items: "LangGraph · Claude · FinBERT",
    accent: "#9b6bff",
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
    items: "Black-Litterman",
    accent: "#f3d38a",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V11M11 19V5M18 19V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Infrastructure",
    items: "PostgreSQL · Redis",
    accent: "#4ee6a8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
];

export const investmentWorldContent: WorldContent = {
  heroTitleLines: ["Investment", "Intelligence Engine"],
  heroSubtitleLines: ["Seven AI Specialists.", "One Investment Decision."],
  agentStatusLines: [
    "Technical Analyst — reading momentum",
    "Sentiment Analyst — parsing headlines",
    "Fundamental Analyst — checking valuation",
    "Bull Researcher — building the case for",
    "Bear Researcher — building the case against",
    "Portfolio Manager — sizing the position",
    "Risk Manager — checking exposure",
  ],
  statusBadgeLabel: "System nominal",
  videoSrc: "/videos/robo-advisor.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — Problem",
      title: "Attention doesn't scale with headcount.",
      paragraphs: [
        "Senior advisors could give real, reasoned attention to maybe forty households each. Everyone else got a templated quarterly email and a rebalancing algorithm with no explanation attached.",
      ],
    },
    {
      kind: "text",
      label: "02 — Solution",
      title: "Seven specialists, one accountable decision.",
      paragraphs: [
        "A technical, sentiment, and fundamental analyst each read the market independently. A bull and a bear researcher argue the position. A portfolio manager sizes it, a risk manager checks it — and a human signs off before a client ever sees it.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Architecture",
      title: "A short, auditable chain.",
      nodes: [
        { label: "Agents", sub: "LangGraph", accent: "#9b6bff" },
        { label: "LLMs", sub: "Claude + FinBERT", accent: "#52f2ff" },
        { label: "Portfolio + Risk Engine", sub: "Black-Litterman", accent: "#f3d38a" },
        { label: "Human Review", accent: "#4ee6a8" },
      ],
    },
    {
      kind: "engineering",
      label: "04 — Engineering Decisions",
      title: "Why, briefly.",
      items: [
        { term: "LangGraph", body: "every hand-off between specialists is an inspectable node, not a buried prompt." },
        { term: "Claude", body: "reasoning long enough to explain itself in language a client can read." },
        { term: "Black-Litterman", body: "blends every view so no single confident agent can dominate the portfolio." },
      ],
    },
    {
      kind: "impact",
      label: "05 — Impact",
      title: "Recorded results.",
      metrics: [
        { label: "Portfolios advised", target: 1200, suffix: "+", accent: "#52f2ff" },
        { label: "Avg. response time", display: "<4s", accent: "#9b6bff" },
        { label: "Client retention", target: 31, prefix: "+", suffix: "%", accent: "#f3d38a" },
      ],
    },
    {
      kind: "future",
      label: "06 — Future Scope",
      title: "What's next.",
      milestones: [
        { tag: "Now", body: "Live for paper trading, backtesting, and human-approved recommendations.", accent: "#4ee6a8" },
        { tag: "Next", body: "Tax-loss harvesting that factors in each client's specific tax situation.", accent: "#f3d38a" },
      ],
    },
  ],
  readme: {
    title: "Investment Intelligence Engine",
    subtitle: "Seven AI Specialists. One Investment Decision.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            An AI advisory system in which seven independent specialist agents reason through market conditions
            and portfolio risk, debate the position, and hand a single accountable recommendation to a human
            advisor for approval before it ever reaches a client.
          </P>
        ),
      },
      {
        heading: "The Problem",
        body: (
          <P>
            Senior advisors could give real, reasoned attention to maybe forty households each. Everyone else
            got a templated quarterly email and a rebalancing algorithm with no explanation attached.
          </P>
        ),
      },
      {
        heading: "The Solution",
        body: (
          <P>
            Seven specialists — a Technical Analyst, Sentiment Analyst, Fundamental Analyst, Bull Researcher,
            Bear Researcher, Portfolio Manager, and Risk Manager — each reason independently, debate the
            position, size it, and check it before a human signs off.
          </P>
        ),
      },
      {
        heading: "Architecture",
        body: (
          <UL>
            <LI><Code>Frontend</Code> — Next.js</LI>
            <LI><Code>Backend</Code> — FastAPI</LI>
            <LI><Code>Agents</Code> — LangGraph orchestration</LI>
            <LI><Code>LLMs</Code> — Claude (reasoning) + FinBERT (sentiment)</LI>
            <LI><Code>Portfolio Engine</Code> — Black-Litterman optimisation</LI>
            <LI><Code>Risk Engine</Code> — exposure &amp; drawdown limits</LI>
            <LI><Code>Database</Code> — PostgreSQL + Redis</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Decisions",
        body: (
          <UL>
            <LI><Code>LangGraph</Code> — every hand-off between specialists is an inspectable node, not a buried prompt.</LI>
            <LI><Code>Claude</Code> — reasoning long enough to explain itself in language a client can read.</LI>
            <LI><Code>Black-Litterman</Code> — blends every view so no single confident agent can dominate the portfolio.</LI>
            <LI><Code>FinBERT</Code> — trained on financial language rather than general-purpose sentiment.</LI>
            <LI><Code>FastAPI</Code> — async-first, so an LLM call and a market-data fetch never block each other.</LI>
            <LI><Code>PostgreSQL</Code> — transactional integrity for portfolio state.</LI>
            <LI><Code>Redis</Code> — sub-second access to market data and shared agent state.</LI>
          </UL>
        ),
      },
      {
        heading: "Capabilities",
        body: (
          <UL>
            <LI>7 AI Agents</LI>
            <LI>6 Asset Classes</LI>
            <LI>Black-Litterman Optimisation</LI>
            <LI>Paper Trading</LI>
            <LI>Backtesting</LI>
            <LI>Human Approval System</LI>
            <LI>Live Market Analysis</LI>
          </UL>
        ),
      },
      {
        heading: "Recorded Results",
        body: (
          <UL>
            <LI>1,200+ portfolios advised</LI>
            <LI>&lt;4s average response time</LI>
            <LI>+31% client retention</LI>
          </UL>
        ),
      },
      {
        heading: "Roadmap",
        body: (
          <UL>
            <LI><Code>Now</Code> — live for paper trading, backtesting, and human-approved recommendations.</LI>
            <LI><Code>Next</Code> — tax-loss harvesting that factors in each client&apos;s specific tax situation.</LI>
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
