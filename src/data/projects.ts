export type WorkflowNode = {
  key: string;
  label: string;
  body: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  accent: string;
  year: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  nodes: WorkflowNode[];
};

/** The Core's fifth system — not a client project, so it lives outside the
 * `projects` array below, but it is navigable: its one destination is the
 * portfolio's own closing chapter (Project 05, "Creative Engineering
 * Portfolio"), reached the same way every other system is. */
export type MetaSystem = {
  name: string;
  tagline: string;
  hoverText: string;
  accent: string;
  /** the slug this system opens to — see src/app/projects/[slug]/page.tsx,
   *  which special-cases this slug ahead of the `projects` array lookup */
  slug: string;
};

export const metaSystem: MetaSystem = {
  name: "Creative Engineering Portfolio",
  tagline: "The system you're standing inside right now.",
  hoverText: "The mind behind every system here.",
  accent: "#9fb3c8",
  slug: "creative-engineering-system",
};

export const projects: Project[] = [
  {
    slug: "company-financial-report-agent",
    name: "Financial Intelligence Workspace",
    tagline: "An agent that reads a company's full financial disclosures and turns them into a structured, cited brief an analyst can trust in minutes, not days.",
    category: "Financial Intelligence",
    accent: "#9b6bff",
    year: "2024",
    stack: ["Next.js", "Claude", "Financial Data Parsers", "Vector DB", "Postgres", "XBRL"],
    metrics: [
      { label: "Reports processed", value: "14,000+/mo" },
      { label: "Analyst time saved", value: "-76%" },
      { label: "Insight accuracy", value: "97.8%" },
    ],
    nodes: [
      { key: "intro", label: "Introduction", body: "An equity research team was spending the first two days of every earnings season just reading filings before they could start actually analyzing anything." },
      { key: "problem", label: "Problem", body: "10-Ks, 10-Qs, and earnings call transcripts arrive in wildly inconsistent formats, and the material change from last quarter is usually buried in a footnote, not the headline number." },
      { key: "challenge", label: "Business Challenge", body: "Analysts didn't want a summarizer — they wanted something that could be trusted to find what actually changed and cite exactly where, without hallucinating a number that wasn't in the filing." },
      { key: "solution", label: "Our Solution", body: "An agent that parses structured XBRL data alongside the narrative text, diffs each filing against the company's prior period, and produces a brief where every claim links back to its exact source line." },
      { key: "architecture", label: "Architecture", body: "XBRL parsers extract structured financials; filing text is chunked and embedded into a vector store for retrieval; Claude drafts the brief constrained to only cite retrieved passages, with a verification pass that rejects any unsourced claim." },
      { key: "flow", label: "AI Flow", body: "Filing ingested -> structured data parsed and diffed against prior period -> narrative sections retrieved for context -> brief drafted with citations -> verification pass checks every claim against its source before publishing." },
      { key: "stack", label: "Tech Stack", body: "Next.js for the analyst dashboard, Claude for drafting and verification, purpose-built XBRL and filing parsers, a vector database for retrieval, and Postgres for historical financial state." },
      { key: "demo", label: "Demo", body: "An analyst can click any figure in the generated brief and jump straight to the exact paragraph of the source filing it came from." },
      { key: "screens", label: "Screenshots", body: "The brief view with inline citations, the period-over-period diff view, and the coverage dashboard tracking which tickers are processed each morning." },
      { key: "impact", label: "Business Impact", body: "What used to take two analysts two full days now takes the agent under twenty minutes per filing, with analysts reviewing rather than transcribing." },
      { key: "results", label: "Client Results", body: "The team expanded coverage from 60 tickers to over 300 without adding headcount, and catch rate on material footnote changes improved measurably in internal audits." },
      { key: "future", label: "Future Scope", body: "Adding cross-filing pattern detection to flag unusual language shifts across a company's last several quarters automatically." },
      { key: "live", label: "Live Demo", body: "A sample brief generated from a public company's most recent filing is available to walk through on request." },
      { key: "case", label: "Case Study", body: "Full writeup on the citation-verification pass and why we rejected every draft-and-hope approach we tried before it." },
      { key: "contact", label: "Contact", body: "If earnings season still means two days of reading before any real analysis starts, let's talk about closing that gap." },
    ],
  },
  {
    slug: "investment-advisory-agent",
    name: "Investment Intelligence Engine",
    tagline: "An AI advisor that reasons through portfolio risk and market conditions the way a senior analyst would, and explains every recommendation in plain language.",
    category: "Investment Advisory Agent",
    accent: "#f3d38a",
    year: "2025",
    stack: ["Next.js", "LangGraph", "Claude", "Postgres", "Market Data API", "Portfolio Analytics Engine"],
    metrics: [
      { label: "Portfolios advised", value: "1,200+" },
      { label: "Avg. response time", value: "<4s" },
      { label: "Client retention", value: "+31%" },
    ],
    nodes: [
      { key: "intro", label: "Introduction", body: "A boutique wealth management firm wanted every client, not just the largest accounts, to get the same depth of attention their top-tier analysts gave to seven-figure portfolios." },
      { key: "problem", label: "Problem", body: "Senior advisors could give real, reasoned attention to maybe 40 households each. Everyone else got a templated quarterly email and a rebalancing algorithm with no explanation attached." },
      { key: "challenge", label: "Business Challenge", body: "Growth meant either hiring advisors faster than the firm could train and trust them, or finding a way to scale the actual judgment those advisors exercised — not just the paperwork around it." },
      { key: "solution", label: "Our Solution", body: "An advisory agent that ingests a client's full position, risk profile, and stated goals, then reasons through allocation changes the way a CFA would — and produces a written rationale a client can actually read before any trade is proposed." },
      { key: "architecture", label: "Architecture", body: "LangGraph coordinates a research step, a risk-scoring step, and a drafting step, each auditable independently; Postgres holds full portfolio state; every recommendation carries a citation trail back to the data that produced it." },
      { key: "flow", label: "AI Flow", body: "Market and portfolio data sync nightly -> risk model flags drift from target allocation -> the agent drafts a rationale and proposed trades -> a licensed advisor reviews and approves before anything reaches the client." },
      { key: "stack", label: "Tech Stack", body: "Next.js for the advisor and client consoles, LangGraph orchestrating Claude for reasoning and drafting, Postgres for portfolio state, a licensed market data feed, and an in-house portfolio analytics engine for the actual math." },
      { key: "demo", label: "Demo", body: "An advisor can ask the agent to explain any recommendation in follow-up conversation, in front of the client, and get the same reasoning it used to generate the proposal in the first place." },
      { key: "screens", label: "Screenshots", body: "Advisor review queue, the client-facing rationale document, and the drift-monitoring dashboard that surfaces which portfolios need attention first." },
      { key: "impact", label: "Business Impact", body: "Every client now gets a reasoned quarterly review, not just the top tier — and advisors spend their time on judgment calls and client relationships instead of drafting boilerplate." },
      { key: "results", label: "Client Results", body: "Client retention rose 31% in the first year, and advisors reported reviewing roughly 3x as many portfolios in depth per week." },
      { key: "future", label: "Future Scope", body: "Adding a tax-loss harvesting reasoning step that factors in each client's specific tax situation, not just generic thresholds." },
      { key: "live", label: "Live Demo", body: "A sandboxed advisor console with anonymized sample portfolios is available for qualified prospects." },
      { key: "case", label: "Case Study", body: "Full writeup on how we kept a human advisor in the approval loop without turning the agent into just a faster way to generate paperwork." },
      { key: "contact", label: "Contact", body: "If your advisors are spending more time writing reports than advising, let's talk about what a reasoning layer could take off their plate." },
    ],
  },
  {
    slug: "document-identifier-verifier",
    name: "Document Trust Engine",
    tagline: "A vision system that identifies, reads, and verifies identity documents in seconds, catching forgeries a human reviewer would miss on a tired Tuesday.",
    category: "Document Intelligence",
    accent: "#52f2ff",
    year: "2025",
    stack: ["Python", "PyTorch", "OCR Engine", "FastAPI", "Computer Vision", "Fraud Scoring Model"],
    metrics: [
      { label: "Verification accuracy", value: "99.4%" },
      { label: "Avg. verification time", value: "-88%" },
      { label: "Fraud caught", value: "3.1x" },
    ],
    nodes: [
      { key: "intro", label: "Introduction", body: "A digital bank onboarding thousands of new accounts a week needed identity verification that was both faster than manual review and harder to fool than the manual reviewers doing it." },
      { key: "problem", label: "Problem", body: "Manual document review took an average of six minutes per applicant and still missed a meaningful share of doctored or template-generated fake IDs." },
      { key: "challenge", label: "Business Challenge", body: "The system had to work across dozens of document formats and countries, run fast enough not to lose impatient applicants mid-signup, and produce a defensible audit trail for compliance." },
      { key: "solution", label: "Our Solution", body: "A document identifier that classifies the document type on sight, an OCR layer that extracts every field, and a verification model trained specifically on the forgery patterns real fraud attempts actually use — font mismatches, tampered holograms, inconsistent microprint." },
      { key: "architecture", label: "Architecture", body: "A classification model routes each upload to the right extraction pipeline; OCR results are cross-checked against document-specific layout templates; a fraud-scoring model flags anomalies for human review rather than auto-rejecting." },
      { key: "flow", label: "AI Flow", body: "Document upload -> type classification -> field extraction -> template and security-feature cross-check -> confidence score -> auto-approve, auto-flag, or route to a human reviewer with the specific anomaly highlighted." },
      { key: "stack", label: "Tech Stack", body: "PyTorch for classification and forgery detection, a custom OCR engine tuned for ID documents, FastAPI serving the verification pipeline, and a fraud-scoring model retrained monthly on new attack patterns." },
      { key: "demo", label: "Demo", body: "Live upload demo shows the extracted fields, the confidence score, and exactly which security feature triggered a flag on a sample forged document." },
      { key: "screens", label: "Screenshots", body: "Compliance review queue, the field-extraction overlay used to audit accuracy, and the monthly fraud-pattern dashboard the trust and safety team monitors." },
      { key: "impact", label: "Business Impact", body: "Verification time dropped from six minutes to under 45 seconds, and the fraud team now catches roughly three times as many forged documents as the previous manual process." },
      { key: "results", label: "Client Results", body: "Onboarding completion rate rose 22% simply because fewer applicants abandoned the process waiting on manual review." },
      { key: "future", label: "Future Scope", body: "Extending coverage to business-registration documents for a small-business banking product launching next year." },
      { key: "live", label: "Live Demo", body: "A sandboxed verification flow with sample (non-real) documents is available for qualified prospects to try directly." },
      { key: "case", label: "Case Study", body: "Deep dive on the forgery patterns the model is trained against and how we tuned the false-positive rate without slowing down legitimate applicants." },
      { key: "contact", label: "Contact", body: "If document review is your onboarding bottleneck, let's talk about what's actually slipping through today." },
    ],
  },
  {
    slug: "igc-logistics-platform",
    name: "Logistics Operations Hub",
    tagline: "A live routing and fleet platform that replans a delivery network in real time instead of re-running the plan once a day.",
    category: "Logistics Intelligence Platform",
    accent: "#4ee6a8",
    year: "2024",
    stack: ["Next.js", "Python", "OR-Tools", "Postgres", "Mapbox", "Real-time GPS"],
    metrics: [
      { label: "Route efficiency", value: "+34%" },
      { label: "Fuel cost", value: "-19%" },
      { label: "On-time delivery", value: "97.6%" },
    ],
    nodes: [
      { key: "intro", label: "Introduction", body: "IGC's regional delivery network ran on a route plan generated once every morning — which meant every traffic jam, cancellation, and same-day order after 9am was the driver's problem to solve alone." },
      { key: "problem", label: "Problem", body: "Static routing looked efficient on paper and fell apart in practice: drivers improvised constantly, dispatchers had no real-time visibility, and same-day orders were routinely rejected because the day's plan was already locked." },
      { key: "challenge", label: "Business Challenge", body: "IGC needed routing that could replan continuously without dispatchers babysitting an optimizer all day, on infrastructure that could scale from one region to a national network." },
      { key: "solution", label: "Our Solution", body: "A live platform where the route optimizer re-solves affected routes the moment conditions change — a cancellation, a new order, a vehicle running behind — instead of waiting for the next planning cycle." },
      { key: "architecture", label: "Architecture", body: "OR-Tools solves constrained vehicle-routing problems on a rolling basis; live GPS feeds and Mapbox traffic data stream into the solver; Postgres holds the current state of every route so dispatchers always see what's actually happening, not yesterday's plan." },
      { key: "flow", label: "AI Flow", body: "Event occurs (new order, delay, cancellation) -> affected routes identified -> optimizer re-solves only the impacted portion of the network -> updated routes push to driver apps -> dispatcher sees the change and can override if needed." },
      { key: "stack", label: "Tech Stack", body: "Next.js for the dispatcher console and driver web app, Python and OR-Tools for continuous route optimization, Postgres for live network state, Mapbox for mapping and traffic data, and real-time GPS ingestion from the existing fleet hardware." },
      { key: "demo", label: "Demo", body: "The dispatcher console shows a live map where a new same-day order visibly triggers a route recalculation and reassignment within seconds." },
      { key: "screens", label: "Screenshots", body: "Live fleet map, the route-comparison view showing before/after a replan, and the daily efficiency report dispatchers pull at shift end." },
      { key: "impact", label: "Business Impact", body: "Route efficiency improved 34% and fuel costs dropped 19%, mostly by eliminating the dead miles static routing couldn't see coming." },
      { key: "results", label: "Client Results", body: "On-time delivery rate climbed to 97.6%, and same-day order acceptance more than doubled since the network could actually absorb them mid-day." },
      { key: "future", label: "Future Scope", body: "Adding predictive replanning that anticipates likely delays from traffic pattern history instead of only reacting once they happen." },
      { key: "live", label: "Live Demo", body: "A sandboxed dispatcher console with a simulated regional network is available for qualified prospects." },
      { key: "case", label: "Case Study", body: "Full writeup on solving vehicle routing continuously at fleet scale without the optimizer becoming the bottleneck it was replacing." },
      { key: "contact", label: "Contact", body: "If your routing plan is only accurate at 9am, let's talk about what a live network would actually change." },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
