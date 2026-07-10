import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 04 — Logistics Operations Hub.
//
// The brief for this project describes a customer-inquiry and admin-operations
// platform (React + Vite, Express, MongoDB, JWT auth) rather than the
// AI-routing description currently in src/data/projects.ts for this slug —
// treated here as the current, authoritative account of the real project,
// the same way this system has always taken fresh input over stale records.
// The one real anchor kept from projects.ts is the accent color, #4ee6a8.
// Nothing here is invented beyond what the brief actually described.
// ---------------------------------------------------------------------------

export const logisticsOperationsHubTheme: WorldTheme = {
  primaryRGB: "78,230,168", // #4ee6a8 — the project's real accent
  glowPrimaryRGB: "10,36,28", // deep green-black glow
  secondaryRGB: "247,181,86", // warm amber — dispatch / motion
  numericPool: ["ETA 02:14", "HUB-07", "✓ Delivered", "GPS ●", "Route #42", "SLA 98%", "Node A-12", "In Transit", "POD ✓", "Dispatch", "km 214", "OK"],
  motif: "routes",
};

const STACK: TechStackGroup[] = [
  {
    name: "Frontend",
    items: "React + Vite",
    accent: "#7ff0c2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 8h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Backend",
    items: "Express",
    accent: "#4ee6a8",
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
    name: "Database",
    items: "MongoDB",
    accent: "#f7b556",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Authentication",
    items: "JWT",
    accent: "#f2c879",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="15.5" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Deployment",
    items: "Cloud Hosting",
    accent: "#9fd6bf",
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
];

export const logisticsOperationsHubContent: WorldContent = {
  heroTitleLines: ["Logistics Operations", "Hub"],
  heroSubtitleLines: [
    "Connecting logistics operations",
    "through a modern digital platform.",
  ],
  agentStatusLines: [
    "Inquiry Handler — receiving customer request",
    "Auth Service — verifying session",
    "Admin Dashboard — routing to operations",
    "Notification Engine — dispatching update",
    "Response System — closing the loop",
  ],
  statusBadgeLabel: "Operations nominal",
  videoSrc: "/videos/logistics-operations-hub.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — Problem",
      title: "Customer inquiries had no operational home.",
      paragraphs: [
        "For a logistics business built over 24 years mostly through phone calls and word of mouth, a customer inquiry had nowhere structured to land — no dashboard, no queue, no record of who was supposed to respond, or whether they had.",
      ],
    },
    {
      kind: "text",
      label: "02 — Solution",
      title: "One platform for inquiry, admin, and response.",
      paragraphs: [
        "A customer-facing site captures every inquiry directly, an authenticated admin dashboard gives the operations team a single place to see, assign, and respond to it, and a notification layer closes the loop back to the customer — the same request, tracked start to finish.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Customer Journey",
      title: "From a question to an owner.",
      nodes: [
        { label: "Customer", accent: "#7ff0c2" },
        { label: "Website", sub: "React + Vite", accent: "#9fd6bf" },
        { label: "Inquiry Submitted", accent: "#f2c879" },
        { label: "Admin Dashboard", accent: "#4ee6a8", big: true },
      ],
    },
    {
      kind: "flow",
      label: "04 — Operations Workflow",
      title: "From an owner to a resolution.",
      nodes: [
        { label: "Admin Dashboard", accent: "#4ee6a8" },
        { label: "Operations Team", accent: "#9fd6bf" },
        { label: "Response Dispatched", accent: "#f2c879" },
        { label: "Notification Sent", accent: "#f7b556" },
        { label: "Resolution Complete", accent: "#7ff0c2", big: true },
      ],
    },
    {
      kind: "flow",
      label: "05 — Architecture",
      title: "A short, auditable chain.",
      nodes: [
        { label: "Website", sub: "React + Vite", accent: "#7ff0c2" },
        { label: "Backend API", sub: "Express", accent: "#4ee6a8" },
        { label: "Authentication", sub: "JWT", accent: "#f2c879" },
        { label: "Contact System", sub: "Inquiry intake", accent: "#9fd6bf" },
        { label: "Admin Dashboard", sub: "Operations console", accent: "#4ee6a8" },
        { label: "Database", sub: "MongoDB", accent: "#f7b556" },
        { label: "Operations", sub: "Response + resolution", accent: "#7ff0c2", big: true },
      ],
    },
    {
      kind: "engineering",
      label: "06 — Engineering Decisions",
      title: "Why, briefly.",
      items: [
        { term: "React + Vite", body: "a fast build pipeline and instant reloads kept iteration quick on a customer-facing site that needed to ship changes often, not just once." },
        { term: "Express", body: "a lightweight backend that stays out of the way — routing inquiries and dashboard requests without carrying framework weight the project didn't need." },
        { term: "MongoDB", body: "inquiries and operational records don't share one rigid shape; a document store let the schema flex as new fields appeared instead of migrating a table every time." },
        { term: "JWT Authentication", body: "the admin dashboard is the one surface handling real operational data, so every session is verified by a stateless token, not a cookie trusted by default." },
        { term: "Responsive Architecture", body: "customers reach the inquiry form from a phone as often as a desktop, so the same layout had to hold up at every width, not just the admin side." },
        { term: "SEO Optimization", body: "most inquiries start with a search, not a bookmark — so the customer-facing site was built to be found, not just to work once someone arrived." },
      ],
    },
    {
      kind: "impact",
      label: "07 — Business Impact",
      title: "Recorded results.",
      metrics: [
        { label: "Business history", display: "24+ Years", accent: "#4ee6a8" },
        { label: "Coverage", display: "Pan-India", accent: "#f7b556" },
        { label: "Platform", display: "Fully Responsive", accent: "#7ff0c2" },
      ],
    },
    {
      kind: "future",
      label: "08 — Future Scope",
      title: "What's next.",
      milestones: [
        { tag: "Now", body: "Live handling customer inquiries end-to-end through the admin dashboard, from submission to resolution.", accent: "#4ee6a8" },
        { tag: "Next", body: "A live shipment-tracking view and a customer portal, so a customer can follow their own request instead of waiting on a reply.", accent: "#f7b556" },
        { tag: "Later", body: "A fleet dashboard, a driver mobile app, and real-time analytics — extending the same operational core to the people actually moving freight.", accent: "rgba(220,228,245,0.4)" },
      ],
    },
  ],
  readme: {
    title: "Logistics Operations Hub",
    subtitle: "Connecting logistics operations through a modern digital platform.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            A customer-inquiry and admin-operations platform for a logistics business built over 24 years —
            giving every incoming request a structured, trackable home instead of a phone call no one logged.
          </P>
        ),
      },
      {
        heading: "The Problem",
        body: (
          <P>
            A logistics business built mostly through phone calls and word of mouth had no operational home for a
            customer inquiry — no dashboard, no queue, no record of who was supposed to respond, or whether they had.
          </P>
        ),
      },
      {
        heading: "The Solution",
        body: (
          <P>
            A customer-facing site captures every inquiry directly, an authenticated admin dashboard gives the
            operations team one place to see, assign, and respond to it, and a notification layer closes the loop
            back to the customer.
          </P>
        ),
      },
      {
        heading: "Customer Journey",
        body: (
          <UL>
            <LI><Code>Customer</Code> — arrives with a question or a request.</LI>
            <LI><Code>Website</Code> — a responsive React + Vite front end.</LI>
            <LI><Code>Inquiry Submitted</Code> — captured directly, not routed through a phone line.</LI>
            <LI><Code>Admin Dashboard</Code> — the request now has a visible owner.</LI>
          </UL>
        ),
      },
      {
        heading: "Operations Workflow",
        body: (
          <UL>
            <LI><Code>Admin Dashboard</Code> — the operations team sees the inquiry land.</LI>
            <LI><Code>Operations Team</Code> — reviews and assigns it.</LI>
            <LI><Code>Response Dispatched</Code> — a reply is drafted and sent.</LI>
            <LI><Code>Notification Sent</Code> — the customer is informed automatically.</LI>
            <LI><Code>Resolution Complete</Code> — the request closes with a record behind it.</LI>
          </UL>
        ),
      },
      {
        heading: "Architecture",
        body: (
          <UL>
            <LI><Code>Frontend</Code> — React + Vite</LI>
            <LI><Code>Backend</Code> — Express</LI>
            <LI><Code>Authentication</Code> — JWT-secured sessions</LI>
            <LI><Code>Database</Code> — MongoDB</LI>
            <LI><Code>Deployment</Code> — cloud hosting</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Decisions",
        body: (
          <UL>
            <LI><Code>React + Vite</Code> — fast builds and instant reloads for frequent iteration.</LI>
            <LI><Code>Express</Code> — a lightweight backend that stays out of the way.</LI>
            <LI><Code>MongoDB</Code> — a flexible schema for records that don&apos;t share one rigid shape.</LI>
            <LI><Code>JWT Authentication</Code> — every admin session verified by a stateless token.</LI>
            <LI><Code>Responsive Architecture</Code> — the same layout holds up at every width.</LI>
            <LI><Code>SEO Optimization</Code> — built to be found by a search, not just bookmarked.</LI>
          </UL>
        ),
      },
      {
        heading: "Capabilities",
        body: (
          <UL>
            <LI>Customer Inquiry Intake</LI>
            <LI>JWT-Secured Admin Dashboard</LI>
            <LI>Automated Customer Notifications</LI>
            <LI>Responsive, SEO-Optimized Front End</LI>
          </UL>
        ),
      },
      {
        heading: "Recorded Results",
        body: (
          <UL>
            <LI>24+ years of business history brought onto one platform</LI>
            <LI>Pan-India customer coverage</LI>
            <LI>Fully responsive across every device</LI>
          </UL>
        ),
      },
      {
        heading: "Roadmap",
        body: (
          <UL>
            <LI><Code>Now</Code> — live handling customer inquiries end-to-end through the admin dashboard.</LI>
            <LI><Code>Next</Code> — live shipment tracking and a customer portal.</LI>
            <LI><Code>Later</Code> — fleet dashboard, driver mobile app, real-time analytics.</LI>
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
