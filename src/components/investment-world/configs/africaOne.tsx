import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 05 — Cross-Border Transfer Engine.
//
// A multi-currency wallet and cross-border financial platform for 54 African
// markets. Content only: the framework (Arrival, StoryScreen, ResourcesScreen,
// WorldBackground) is the same one every other world uses, and nothing here
// changes it.
//
// One rule governs every line of copy below. This is a clickable,
// stateful prototype — external financial systems are simulated and no real
// money can move. So there are no transaction volumes, no users, no payment
// value, and no claim of live banking, KYC, AML or settlement anywhere in this
// file. The only figures used are the four the project itself verifies.
// ---------------------------------------------------------------------------

export const africaOneTheme: WorldTheme = {
  primaryRGB: "47,216,176", // #2fd8b0 — the product's deep teal
  glowPrimaryRGB: "6,32,28", // teal-black, for the volumetric glow
  secondaryRGB: "226,178,88", // warm gold — the product's second identity color
  numericPool: [
    "NGN → KES",
    "USD 1.00",
    "FX 0.9942",
    "KYC ✓",
    "Corridor 07",
    "GHS ●",
    "Settled",
    "ZAR/USD",
    "Ledger ✓",
    "Recon 100%",
    "XOF",
    "T+1",
  ],
  motif: "corridors",
};

const STACK: TechStackGroup[] = [
  {
    name: "Interface",
    items: "HTML, CSS",
    accent: "#7ff0d4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Logic",
    items: "JavaScript",
    accent: "#2fd8b0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Structure",
    items: "Modular screens, hash routing",
    accent: "#e2b258",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.4" />
        <rect x="14" y="3" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3" y="14" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.4" />
        <rect x="14" y="14" width="7" height="7" rx="1.3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Charts",
    items: "Hand-built SVG",
    accent: "#7ff0d4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7 15l3.5-4 3 2.5L20 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Tooling",
    items: "Python build & test",
    accent: "#e2b258",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14.5 4.5a4 4 0 00-5.66 5.66l-4.6 4.6a1.5 1.5 0 002.12 2.12l4.6-4.6a4 4 0 005.66-5.66l-2.3 2.3-1.42-1.41 2.3-2.3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const africaOneContent: WorldContent = {
  heroTitleLines: ["Cross-Border", "Transfer Engine"],
  heroSubtitleLines: ["Fifty-four markets.", "One financial system beneath them."],
  agentStatusLines: [
    "Modelling corridor NGN → KES",
    "Separating display currency from exchange",
    "Advancing KYC state transitions",
    "Routing through provider abstraction",
    "Reconciling the ledger",
    "Appending to the audit trail",
  ],
  statusBadgeLabel: "Prototype",
  videoSrc: "/videos/cross-border-transfer-engine.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — The Problem",
      title: "A wallet is the easy half",
      paragraphs: [
        "A cross-border financial product cannot just be a wallet UI. Behind a single transfer sit multiple currencies, exchange rates, payment corridors, KYC, risk controls, provider routing, settlement, reconciliation and auditability.",
        "That system — not the screen — is the actual engineering problem. It was built to model that honestly, end to end, before a single real rail is connected.",
      ],
    },
    {
      kind: "text",
      label: "02 — The Solution",
      title: "Both halves of the product",
      paragraphs: [
        "The customer app: a local-currency-first wallet, with USD, EUR, GBP and CNY alongside it. Add money, withdraw, send, receive, exchange, transfer across borders, and read the history of all of it. A visitor in Lagos sees naira first — not dollars converted for them.",
        "The operational console behind it: customer operations, KYC review, AML and fraud, reconciliation, countries, fees and limits, and an audit trail. One system, two surfaces — because in a real financial product neither one works without the other.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Value Flow",
      title: "What actually happens to a transfer",
      nodes: [
        { label: "Country", sub: "54 modelled", accent: "#2fd8b0" },
        { label: "Wallet", sub: "multi-currency", accent: "#2fd8b0" },
        { label: "Currency", sub: "display vs actual", accent: "#7ff0d4" },
        { label: "Exchange", sub: "real conversion", accent: "#e2b258", big: true },
        { label: "Transfer", sub: "cross-border", accent: "#e2b258", big: true },
        { label: "Verification", sub: "KYC / risk", accent: "#7ff0d4" },
        { label: "Provider", sub: "routing", accent: "#2fd8b0" },
        { label: "Settlement", sub: "simulated", accent: "#2fd8b0" },
        { label: "Reconciliation", sub: "ledger match", accent: "#e2b258" },
        { label: "Complete", sub: "audited", accent: "#7ff0d4" },
      ],
    },
    {
      kind: "engineering",
      label: "04 — Engineering Decisions",
      title: "Where the thinking went",
      items: [
        {
          term: "Display currency ≠ exchange",
          body: "switching what a balance is displayed in is a viewing change, not a financial transaction. Actual conversion lives only in the Exchange flow. Collapsing the two is the classic way a wallet quietly lies to its user.",
        },
        {
          term: "54-country data model",
          body: "each country carries its flag, ISO code, local currency and symbol, dialing code, payment methods, payout partner and corridor status — so visibility and live connectivity are separate facts, never conflated.",
        },
        {
          term: "Multi-currency ledger",
          body: "balances are modelled per currency rather than converted into one base at rest, which is what keeps the exchange path honest.",
        },
        {
          term: "Provider abstraction",
          body: "routing sits behind one interface, so a corridor's payout partner is configuration rather than a branch in the transfer code.",
        },
        {
          term: "Passport KYC as state transitions",
          body: "verification is a state machine with reviewable transitions, not a boolean — which is what makes the review queue in the console possible at all.",
        },
        {
          term: "Append-only audit trail",
          body: "operational actions are written, never edited. Reconciliation reads that record rather than the mutable state.",
        },
      ],
    },
    {
      kind: "impact",
      label: "05 — Impact",
      title: "Verified prototype figures",
      metrics: [
        { label: "Countries modelled", accent: "#2fd8b0", target: 54 },
        { label: "Phase-1 corridors", accent: "#e2b258", target: 13 },
        { label: "Screens / flows", accent: "#7ff0d4", target: 27, suffix: "+" },
        { label: "Verification checks", accent: "#2fd8b0", target: 132 },
      ],
    },
    {
      kind: "cards",
      label: "06 — What It Is",
      title: "A prototype, stated plainly",
      cards: [
        {
          title: "Simulated, not live",
          body: "External financial systems are simulated. No real money moves. There is no live banking, payment processing, KYC, sanctions screening, AML or settlement behind this.",
          accent: "#e2b258",
        },
        {
          title: "Stateful, not static",
          body: "It is clickable and it remembers: balances, transfers, KYC states and operational actions persist across the flows the way they would in the real product.",
          accent: "#2fd8b0",
        },
        {
          title: "Two real surfaces",
          body: "The customer app and the admin console are both built, not mocked — the console reviews the same records the app creates.",
          accent: "#7ff0d4",
        },
        {
          title: "Visibility ≠ connectivity",
          body: "All 54 countries are modelled. Thirteen are Phase-1 corridors. The prototype never pretends those are the same number.",
          accent: "#e2b258",
        },
      ],
    },
    {
      kind: "future",
      label: "07 — Future Scope",
      title: "What production would add",
      milestones: [
        { tag: "Rails", body: "Real payment gateway integrations, and live banking and settlement rails behind the corridors already modelled.", accent: "#2fd8b0" },
        { tag: "Compliance", body: "Production identity and KYC providers, with actual AML and sanctions screening in place of the simulated checks.", accent: "#e2b258" },
        { tag: "Platform", body: "A React and TypeScript production implementation on a real API backend, carrying the same models this prototype proved out.", accent: "#7ff0d4" },
      ],
    },
  ],
  readme: {
    title: "Cross-Border Transfer Engine",
    subtitle: "Multi-currency wallet & cross-border financial platform — 54 African markets",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            A clickable, stateful prototype of a multi-currency wallet and cross-border transfer
            platform for 54 African countries, covering both the customer app and the operational
            console that sits behind it.
          </P>
        ),
      },
      {
        heading: "Customer App",
        body: (
          <UL>
            <LI>Dashboard and multi-currency wallet</LI>
            <LI>Local currency account plus <Code>USD</Code>, <Code>EUR</Code>, <Code>GBP</Code>, <Code>CNY</Code></LI>
            <LI>Add money, withdraw, send, receive</LI>
            <LI>Exchange, and cross-border transfer</LI>
            <LI>Transactions, security, and KYC</LI>
          </UL>
        ),
      },
      {
        heading: "Admin Console",
        body: (
          <UL>
            <LI>Overview and users</LI>
            <LI>KYC review queue</LI>
            <LI>AML &amp; fraud</LI>
            <LI>Reconciliation</LI>
            <LI>Countries, fees and limits</LI>
            <LI>Audit trail</LI>
          </UL>
        ),
      },
      {
        heading: "Country Model",
        body: (
          <>
            <P>Each of the 54 countries carries:</P>
            <UL>
              <LI>Flag, ISO code, dialing code</LI>
              <LI>Local currency, code and symbol</LI>
              <LI>Payment methods and payout partner</LI>
              <LI>Corridor status</LI>
            </UL>
            <P>
              Country visibility and live corridor connectivity are deliberately separate: 54
              modelled, 13 Phase-1 corridors.
            </P>
          </>
        ),
      },
      {
        heading: "Display Currency",
        body: (
          <P>
            Switching display currency changes how a balance is shown — it is not a financial
            transaction. Actual conversion happens only in the Exchange flow.
          </P>
        ),
      },
      {
        heading: "Stack",
        body: (
          <P>
            <Code>HTML</Code>, <Code>CSS</Code> and <Code>JavaScript</Code> with a modular screen
            architecture, custom DOM/component-style functions, SVG-based charts, hash routing and
            local/mock state. Python utilities handle build and test. No framework, no bundler.
          </P>
        ),
      },
      {
        heading: "Status",
        body: (
          <P>
            Demonstration prototype. External financial systems are simulated — no real money can
            move, and there is no live banking, payment processing, KYC, sanctions screening, AML or
            settlement behind it.
          </P>
        ),
      },
    ],
  },
  repository: {
    title: "Open Repository",
    description: (
      <>
        <p>Public source code on GitHub.</p>
        <p>The prototype, both surfaces, in full.</p>
      </>
    ),
    requestLabel: "View Repository →",
    href: "https://github.com/orynthLab/Africa_One-Wallet",
  },
  techStack: STACK,
  cta: {
    heading: "Building cross-border financial infrastructure?",
    body: "The wallet is the easy half. Let's talk about the system beneath it.",
    buttonLabel: "Start a Conversation",
  },
};
