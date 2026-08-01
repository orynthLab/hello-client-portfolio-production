export type ServiceSection = {
  heading: string;
  body: string;
};

export type Service = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  accent: string;
  sections: ServiceSection[];
  relatedProjectSlugs: string[];
};

export const services: Service[] = [
  {
    slug: "ai-agent-development",
    name: "AI Agent Development",
    eyebrow: "AI Agents",
    tagline:
      "Production AI agents that reason through real decisions — not chat widgets, not demos that fall apart outside a sandbox.",
    description:
      "OrynthBuild builds production AI agents — investment advisors, document verifiers, business-development pipelines — with real reasoning, human approval gates, and measurable results. For founders directly, or white-label for agencies.",
    accent: "#52f2ff",
    sections: [
      {
        heading: "What we build",
        body: "AI agents that do real work: reading documents, reasoning through risk, drafting outreach, verifying claims against sources. Every agent we ship is built around the specific decision it needs to make, not a generic chatbot wrapper around a model.",
      },
      {
        heading: "How we work",
        body: "We start with the actual decision a human is making today — what they read, what they weigh, what they'd need to see to trust an answer. The agent is built to reproduce that reasoning, with a citation trail back to its sources and a human approval gate wherever the stakes call for one.",
      },
      {
        heading: "Where a human stays in the loop",
        body: "Every agent we've shipped keeps a human reviewer in front of anything consequential — a trade recommendation, an outbound email, a flagged document. The agent does the reasoning and drafting; a person still approves what actually goes out.",
      },
      {
        heading: "Who this is for",
        body: "Founders and businesses who need an agent built and shipped, not scoped in a deck — and agencies who need AI engineering capacity to offer their own clients under their own brand.",
      },
    ],
    relatedProjectSlugs: [
      "investment-advisory-agent",
      "document-identifier-verifier",
      "autonomous-business-development-agent",
    ],
  },
  {
    slug: "mvp-development",
    name: "MVP Development",
    eyebrow: "MVP Development",
    tagline:
      "A working product, not a prototype — built fast enough to test with real users before the opportunity closes.",
    description:
      "OrynthBuild builds full-stack MVPs for startups and founders — from first line of code to a deployed product real users can try, worldwide.",
    accent: "#4ee6a8",
    sections: [
      {
        heading: "What we build",
        body: "A real, working version of your product — not a clickable mockup. Full-stack: the frontend, the backend, the database, the integrations that make it actually usable, not just demoable.",
      },
      {
        heading: "How we work",
        body: "We scope to the smallest version that proves the actual hypothesis you're testing, then build it properly — production-quality code from the start, so the MVP doesn't need a full rewrite the moment it gets real users.",
      },
      {
        heading: "Speed without shortcuts that break later",
        body: "Fast doesn't mean fragile. Our Autonomous Business Development Agent shipped across 12 independently-approved build phases with 347 passing tests — that's the same discipline we bring to every MVP, scaled to what an MVP actually needs.",
      },
      {
        heading: "Who this is for",
        body: "Founders and startups who need to get a real product in front of users, and agencies who need extra engineering capacity to deliver an MVP under their own name.",
      },
    ],
    relatedProjectSlugs: ["autonomous-business-development-agent", "igc-logistics-platform"],
  },
  {
    slug: "workflow-automation",
    name: "Workflow & Business Automation",
    eyebrow: "Automation",
    tagline:
      "Automation systems that remove the repetitive work between decisions — not fragile scripts that break the first time reality doesn't match the plan.",
    description:
      "OrynthBuild builds workflow and business automation systems — replanning logistics live, verifying documents in seconds, running outreach pipelines — for businesses in any industry, worldwide.",
    accent: "#f3d38a",
    sections: [
      {
        heading: "What we build",
        body: "Systems that handle the manual, repetitive parts of a workflow so people spend their time on the judgment calls — a route optimizer that replans the moment conditions change, a pipeline that qualifies and drafts outreach, a verification layer that flags anomalies instead of rejecting blindly.",
      },
      {
        heading: "How we work",
        body: "We map the actual workflow first — what triggers a change, what a human currently decides, where the bottleneck really is — before automating anything. Automation that doesn't match the real workflow just moves the bottleneck somewhere else.",
      },
      {
        heading: "Built to handle exceptions, not just the happy path",
        body: "Our logistics platform re-solves routes the moment a cancellation or delay happens, instead of waiting for the next planning cycle. Real automation has to handle the exception, not just the clean case that looks good in a demo.",
      },
      {
        heading: "Who this is for",
        body: "Businesses in any industry with a manual process that's outgrown manual handling, and agencies whose clients need automation built under their own brand.",
      },
    ],
    relatedProjectSlugs: ["igc-logistics-platform", "company-financial-report-agent"],
  },
  {
    slug: "full-stack-development",
    name: "Full-Stack Web & App Development",
    eyebrow: "Full-Stack Development",
    tagline:
      "End-to-end web and app development — product design through deployment, for businesses in any industry, worldwide.",
    description:
      "OrynthBuild builds full-stack websites and apps for businesses in any industry — frontend, backend, and everything in between, delivered as working software, not a handoff of loose parts.",
    accent: "#3b82f6",
    sections: [
      {
        heading: "What we build",
        body: "Complete web and app products: the interface users see, the backend logic and data layer behind it, and the integrations that connect it to everything else your business runs on.",
      },
      {
        heading: "How we work",
        body: "One team owns the whole stack, so decisions on the frontend and backend stay consistent instead of getting lost between handoffs. We use Next.js for most builds — fast to ship, fast to run.",
      },
      {
        heading: "Built for what happens after launch",
        body: "Every product we ship is built to be maintained and extended, not just demoed once. That's what let our logistics client add same-day order handling without a rebuild, and our financial-intelligence client expand from 60 tickers to 300+ without added headcount.",
      },
      {
        heading: "Who this is for",
        body: "Any business — from startups to established companies across industries — that needs a website or app built end-to-end, and agencies that need full-stack execution capacity under their own brand.",
      },
    ],
    relatedProjectSlugs: ["company-financial-report-agent", "igc-logistics-platform", "investment-advisory-agent"],
  },
  {
    slug: "white-label-execution",
    name: "White-Label Execution",
    eyebrow: "White-Label Partner",
    tagline:
      "We build it, you deliver it — engineering execution under your own brand, for agencies who need capacity without hiring.",
    description:
      "OrynthBuild is a white-label execution and tech partner for agencies — AI agents, MVPs, automation, and full-stack development, delivered under your brand with no mention of OrynthBuild.",
    accent: "#9b6bff",
    sections: [
      {
        heading: "What white-label execution means here",
        body: "We build the product or feature. You deliver it to your own client, under your own name. Your client never hears about OrynthBuild — the work ships as yours.",
      },
      {
        heading: "How we work",
        body: "We plug into your process as engineering capacity, not a separate vendor your client has to manage. Scope comes from you, updates go through you, and the build quality is the same discipline we bring to every direct client.",
      },
      {
        heading: "What we take off your plate",
        body: "AI agent builds, MVPs, automation systems, and full-stack development — the engineering work agencies don't always have in-house capacity for, especially on tight timelines.",
      },
      {
        heading: "Who this is for",
        body: "Agencies that need extra engineering capacity for a client project without hiring, scaling, or managing a new team.",
      },
    ],
    relatedProjectSlugs: [],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
