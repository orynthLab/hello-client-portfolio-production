import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 00 (flagship) — Autonomous Business Development Agent. The sixth
// world, and the first one grounded entirely in a real, currently-running
// personal codebase rather than an illustrative case study — every claim
// below traces back to README.md, CHANGELOG.md, and docs/00-decision-log.md
// in the project's own repository. There is no dashboard UI in the real
// code (it's a backend pipeline behind one HTTP route), so nothing here
// claims one — the "signature experience" is the real seven-stage pipeline.
// ---------------------------------------------------------------------------

export const businessDevelopmentAgentTheme: WorldTheme = {
  primaryRGB: "170,185,205",
  glowPrimaryRGB: "42,32,26",
  secondaryRGB: "255,138,92",
  numericPool: ["Δ+1", "0.94", "μ", "Σ", "12ms", "0.87β", "→", "97%", "λ", "0.91", "Ω", "R² 0.89"],
  motif: "network",
};

const STACK: TechStackGroup[] = [
  {
    name: "Runtime",
    items: "TypeScript · Node.js",
    accent: "#ff8a5c",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "AI Providers",
    items: "Claude · Gemini",
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
    name: "Research",
    items: "Cheerio · tldts",
    accent: "#52f2ff",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Communication & CRM",
    items: "Gmail API · Google Sheets · Telegram Bot API",
    accent: "#4ee6a8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Deployment",
    items: "n8n · OS Scheduler",
    accent: "#f3d38a",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="18" cy="12" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="6" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 7l8 4M8 17l8-4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
];

export const businessDevelopmentAgentContent: WorldContent = {
  heroTitleLines: ["Autonomous Business", "Development Agent"],
  heroSubtitleLines: ["One AI Employee.", "The Full Outreach Lifecycle."],
  agentStatusLines: [
    "Discovery — matching companies against the ICP",
    "Website Research — reading the real site",
    "Business Analysis — qualifying and matching a service",
    "Decision Maker Discovery — finding a named, verified contact",
    "Email Generation — drafting one personalized email",
    "Gmail Integration — sending, sequentially, never in parallel",
    "Follow-up Engine — checking for a reply before trying again",
  ],
  statusBadgeLabel: "DRY_RUN — safe by default",
  videoSrc: "/videos/business-development-agent.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — Problem",
      title: "Manual prospecting doesn't scale with one person's hours.",
      paragraphs: [
        "Finding companies worth pitching, reading every one of their websites, writing a personal email instead of a template, and remembering to follow up — every single day — is five jobs for one person. The moment it gets rushed, outreach turns into the generic email everyone already ignores.",
      ],
    },
    {
      kind: "text",
      label: "02 — Solution",
      title: "An AI employee, not a mail blaster.",
      paragraphs: [
        "A daily pipeline discovers candidate companies, researches each one's real website, decides whether it's a genuine fit and for which service, finds a named decision maker, and drafts one personalized email — all logged to a Google Sheet CRM, with DRY_RUN safety on by default and Manual Action able to pull any company out of automation at any time.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Autonomous Workflow",
      title: "Seven stages, one accountable pipeline.",
      nodes: [
        { label: "Discovery", sub: "ICP-matched candidates", accent: "#ff8a5c" },
        { label: "Website Research", sub: "Cheerio + structured summary", accent: "#52f2ff" },
        { label: "Business Analysis", sub: "Qualify + service match", accent: "#9b6bff" },
        { label: "Decision Maker Discovery", sub: "Verified contact only", accent: "#f3d38a" },
        { label: "Email Generation", sub: "One email, one CTA", accent: "#ff8a5c" },
        { label: "Gmail Integration", sub: "Sequential, DRY_RUN-safe", accent: "#4ee6a8" },
        { label: "Follow-up + Telegram", sub: "Reply check, daily summary", accent: "#52f2ff" },
      ],
    },
    {
      kind: "flow",
      label: "04 — System Architecture",
      title: "One composition root, real clients underneath.",
      nodes: [
        { label: "Scheduler / n8n", sub: "POST /run-pipeline", accent: "#ff8a5c" },
        { label: "Pipeline Orchestrator", sub: "7 stages, unconditional order", accent: "#9b6bff" },
        { label: "Claude + Gemini", sub: "AI provider interface", accent: "#52f2ff" },
        { label: "Gmail · Sheets · Telegram", sub: "Real, working integrations", accent: "#4ee6a8" },
      ],
    },
    {
      kind: "engineering",
      label: "05 — Engineering Decisions",
      title: "Why, briefly.",
      items: [
        { term: "AI provider abstraction", body: "Claude and Gemini sit behind one interface — switching providers is a config change, never a code change." },
        { term: "Manual Action overrides everything", body: "Pause, Contact Personally, or Do Not Contact fully holds automation for a company across every module that can act on it." },
        { term: "DRY_RUN defaults to true", body: "the entire pipeline runs, validates, and updates the CRM exactly as a real send would — until DRY_RUN is explicitly turned off." },
        { term: "Sequential Gmail sending", body: "a plain loop, never Promise.all — no parallel sends, by explicit design." },
        { term: "Never invents a fact", body: "a malformed or under-evidenced AI response is rejected and the company is marked Needs Review, not guessed at." },
      ],
    },
    {
      kind: "impact",
      label: "06 — Business Impact",
      title: "Recorded results.",
      metrics: [
        { label: "Tests passing", target: 347, accent: "#52f2ff" },
        { label: "Phases shipped", display: "12/12", accent: "#9b6bff" },
        { label: "Documented decisions", target: 72, accent: "#ff8a5c" },
      ],
    },
    {
      kind: "future",
      label: "07 — Future Scope",
      title: "What's next.",
      milestones: [
        { tag: "Now", body: "Live end-to-end in DRY_RUN mode: Discovery through Telegram, one real Google Sheet CRM, no real email sent until explicitly enabled.", accent: "#4ee6a8" },
        { tag: "Next", body: "Connecting the remaining discovery sources (Clutch, Wellfound, LinkedIn) and CRM sync into HubSpot or Salesforce once a team, not just one operator, needs to see the pipeline.", accent: "#f3d38a" },
      ],
    },
  ],
  readme: {
    title: "Autonomous Business Development Agent",
    subtitle: "One AI Employee. The Full Outreach Lifecycle.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            A personal, single-user automation that discovers companies, researches their websites, decides whether
            each is a genuine opportunity and which service to pitch, finds a decision maker, writes and sends a
            personalized outreach email, follows up if there&apos;s no reply, and reports a daily operational summary
            to Telegram — all against a Google Sheet as the CRM.
          </P>
        ),
      },
      {
        heading: "The Problem",
        body: (
          <P>
            Manual business development means one person doing five jobs — discovery, research, writing, sending,
            and follow-up — every day. It doesn&apos;t scale, and the moment it&apos;s rushed, outreach turns into
            the generic email everyone already ignores.
          </P>
        ),
      },
      {
        heading: "The Solution",
        body: (
          <P>
            Seven independently-tested stages — Discovery, Website Research, Business Analysis, Decision Maker
            Discovery, Email Generation, Gmail Integration, and Follow-up — run behind a single composition root,
            each isolated so one company&apos;s failure never halts the rest of the run. A human stays in control:
            Manual Action can pull any company out of automation at any time, and DRY_RUN mode lets the entire
            pipeline run safely with no real email ever sent.
          </P>
        ),
      },
      {
        heading: "Architecture",
        body: (
          <UL>
            <LI><Code>Runtime</Code> — TypeScript, Node.js, a minimal HTTP server with no framework</LI>
            <LI><Code>AI</Code> — Claude and Gemini behind one provider interface</LI>
            <LI><Code>Research</Code> — Cheerio for HTML parsing, tldts for public-suffix-aware domain matching</LI>
            <LI><Code>CRM</Code> — Google Sheets, via a single reusable upsert service</LI>
            <LI><Code>Communication</Code> — Gmail API (sequential sends), Telegram Bot API (daily summary)</LI>
            <LI><Code>Integration seam</Code> — <Code>POST /run-pipeline</Code>, callable by a scheduler or an n8n workflow</LI>
            <LI><Code>Ops dashboard</Code> — a lightweight static HTML view (<Code>/dashboard</Code>) reading live stats and companies from the CRM, with a manual pipeline-run trigger — not a framework app, just the server's own static file plus two read-only JSON routes</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Decisions",
        body: (
          <UL>
            <LI><Code>AI provider abstraction</Code> — switching Claude for Gemini (or back) is a config change, never a code change.</LI>
            <LI><Code>Manual Action</Code> — overrides automation across every module that can change CRM state or contact a company, not just the one it was first built into.</LI>
            <LI><Code>DRY_RUN</Code> — defaults to true; the real Gmail API call is the only thing swapped for a no-op.</LI>
            <LI><Code>Sequential sends</Code> — a plain loop, never parallel, by explicit design.</LI>
            <LI><Code>Structured, validated AI output</Code> — a response with no evidence, an invented fact, or a malformed field is rejected, not accepted partially.</LI>
          </UL>
        ),
      },
      {
        heading: "Capabilities",
        body: (
          <UL>
            <LI>7-stage autonomous pipeline</LI>
            <LI>Claude + Gemini provider abstraction</LI>
            <LI>Google Sheets CRM with append-only AI Notes</LI>
            <LI>Verified-only decision maker discovery — never guesses an email</LI>
            <LI>DRY_RUN safety mode</LI>
            <LI>Manual Action override on every automated module</LI>
            <LI>Daily Telegram operational summary</LI>
          </UL>
        ),
      },
      {
        heading: "Recorded Results",
        body: (
          <UL>
            <LI>347 tests across 50 test files, all passing</LI>
            <LI>12 phases shipped, each independently tested and approved</LI>
            <LI>72 documented decisions reconciling every requirement gap found</LI>
          </UL>
        ),
      },
      {
        heading: "Roadmap",
        body: (
          <UL>
            <LI><Code>Now</Code> — live end-to-end in DRY_RUN mode against one real Google Sheet CRM.</LI>
            <LI><Code>Next</Code> — connecting the remaining discovery sources and CRM sync into HubSpot/Salesforce for team use.</LI>
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
