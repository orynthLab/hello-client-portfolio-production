import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 04 — Aviation Preparation Academy.
//
// A full-stack aviation theory platform for New Zealand pilot exams. Content
// only: the framework (Arrival, StoryScreen, ResourcesScreen, WorldBackground)
// is the same one every other world uses, and nothing here changes it.
//
// Two rules govern the copy below.
//
// 1. Every fact is verified against the source repository — its README, its
//    package.json and its actual file tree. The stack claims are exact:
//    Next.js 16, React 19, PostgreSQL 16 via Prisma 6, jose + bcryptjs,
//    Razorpay, Resend, pdfkit, zod, Vitest, Playwright. Nothing inferred.
// 2. The disclaimer is carried through in substance: not affiliated with,
//    endorsed by, or acting on behalf of Aspeq or CAANZ. Softening that
//    would be the one genuinely damaging thing this page could do.
//
// The portfolio presents the system, not the client's company name, so it is
// "Aviation Preparation Academy" throughout — including in the README modal.
// ---------------------------------------------------------------------------

export const aviationAcademyTheme: WorldTheme = {
  primaryRGB: "91,159,220", // #5b9fdc — deep aviation blue, lifted to read on the void
  glowPrimaryRGB: "8,22,38", // navy-black, for the volumetric glow
  secondaryRGB: "230,180,92", // a small warm readiness highlight
  numericPool: [
    "PPL · CPL · IR",
    "15 subjects",
    "329 tests",
    "KDR · PDF",
    "HDG 347",
    "Server-side",
    "0 vulns",
    "Mock 10Q",
    "FL 095",
    "Prisma 6",
    "Guarantee",
    "Ready",
  ],
  motif: "instruments",
};

const STACK: TechStackGroup[] = [
  {
    name: "Application",
    items: "Next.js 16, React 19",
    accent: "#8cc4f0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 9h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Language",
    items: "TypeScript, strict",
    accent: "#5b9fdc",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Data",
    items: "PostgreSQL 16, Prisma 6",
    accent: "#8cc4f0",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Commerce",
    items: "Razorpay, Resend, pdfkit",
    accent: "#e6b45c",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Assurance",
    items: "Vitest, Playwright, zod",
    accent: "#5b9fdc",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7.5 3v6c0 4.4-3.1 7.9-7.5 9-4.4-1.1-7.5-4.6-7.5-9V6L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8.8 12.2l2.2 2.2 4.2-4.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export const aviationAcademyContent: WorldContent = {
  heroTitleLines: ["Aviation", "Preparation Academy"],
  heroSubtitleLines: ["NZ Pilot Theory Preparation Platform.", "Three audiences. One codebase."],
  videoSrc: "/videos/aviation-preparation-academy.mp4",
  agentStatusLines: [
    "Serving CPL Meteorology, chapter 4",
    "Timing a mock exam at exam pace",
    "Generating a Knowledge Deficiency Report",
    "Verifying a Razorpay signature server-side",
    "Checking guarantee eligibility",
    "Running the 30-check security suite",
  ],
  statusBadgeLabel: "Live Platform",
  beats: [
    {
      kind: "text",
      label: "01 — The Problem",
      title: "Material is not preparation",
      paragraphs: [
        "A student pilot can have all the material and still not know what actually matters, why a correct answer is correct, or how they will hold up under exam timing.",
        "And behind them, someone has to actually run the business: examinations, products, orders, coupons, guarantee claims, refunds, student access. If that needs a developer every time, it isn't a platform — it's a website with a bill attached.",
      ],
    },
    {
      kind: "text",
      label: "02 — The Solution",
      title: "Three audiences, one codebase",
      paragraphs: [
        "A public marketing site, a student learning platform and an admin CMS in one Next.js application. Prospective students get pricing transparency and a free ten-question mock exam before they commit to anything.",
        "Active learners get syllabus-indexed study material across PPL, CPL and IR — fifteen theory subjects plus flight-test groundwork — chapter-based practice, timed mock exams at real exam pace, automated Knowledge Deficiency Reports delivered as PDFs by email, and progress tracked per student.",
      ],
    },
    {
      kind: "flow",
      label: "03 — The Journey",
      title: "From syllabus to a measured read",
      nodes: [
        { label: "Learn", sub: "syllabus-indexed", accent: "#5b9fdc" },
        { label: "Practice", sub: "chapter-based", accent: "#5b9fdc" },
        { label: "Mock", sub: "real exam timing", accent: "#8cc4f0", big: true },
        { label: "KDR", sub: "emailed as PDF", accent: "#8cc4f0", big: true },
        { label: "Track", sub: "per student", accent: "#e6b45c" },
        { label: "Ready", sub: "guarantee-backed", accent: "#e6b45c" },
      ],
    },
    {
      kind: "text",
      label: "04 — The Security Model",
      title: "The browser is never trusted",
      paragraphs: [
        "Everything that decides money or access — prices, discounts, entitlements, payment verification, guarantee eligibility — is computed server-side. None of it is taken on the client's word.",
        "That is not a posture statement; it is tested. A dedicated suite runs thirty checks across access control, IDOR, authentication integrity, payment tampering and XSS. The last audit recorded zero vulnerabilities.",
      ],
    },
    {
      kind: "engineering",
      label: "05 — Engineering Decisions",
      title: "Where the thinking went",
      items: [
        {
          term: "Server-side money and access",
          body: "prices, discounts, entitlements and guarantee eligibility are all computed on the server. A price that can be edited in a devtools panel is not a price.",
        },
        {
          term: "Verified payments, not reported ones",
          body: "Razorpay callbacks are checked by server-side signature verification before anything is granted — the client saying a payment succeeded is not evidence that it did.",
        },
        {
          term: "Signed sessions",
          body: "JWT sessions signed with jose, passwords hashed with bcryptjs. Input validated with zod at the boundary rather than trusted inward.",
        },
        {
          term: "Reports as artefacts",
          body: "Knowledge Deficiency Reports are generated server-side as PDFs with pdfkit and delivered by email through Resend — something a student keeps, not a page they have to be logged in to re-read.",
        },
        {
          term: "A content pipeline, not hand-keying",
          body: "dedicated tooling extracts, imports, maps, audits and changelogs PPL, CPL and IR syllabus content, with coverage and visibility reports — so fifteen subjects stay in sync with their source syllabi instead of drifting.",
        },
        {
          term: "Own design system",
          body: "a custom CSS design system carrying light and dark themes, rather than a UI framework — the interface is the product's, not a library's defaults.",
        },
      ],
    },
    {
      kind: "impact",
      label: "06 — Impact",
      title: "What is actually built",
      metrics: [
        { label: "Theory subjects", accent: "#5b9fdc", target: 15 },
        { label: "Unit tests", accent: "#8cc4f0", target: 329 },
        { label: "Assertions", accent: "#8cc4f0", target: 1500, prefix: "~" },
        { label: "Security checks", accent: "#e6b45c", target: 30 },
      ],
    },
    {
      kind: "cards",
      label: "07 — The Operator's Half",
      title: "A platform someone can actually run",
      cards: [
        {
          title: "Full CMS",
          body: "Examinations, products, orders, coupons, guarantee claims, refunds and student access — all managed without touching code.",
          accent: "#5b9fdc",
        },
        {
          title: "A guarantee with a workflow",
          body: "The first-attempt pass guarantee is not a marketing line: claims and eligibility are modelled, and refunds are handled.",
          accent: "#8cc4f0",
        },
        {
          title: "Tested where it counts",
          body: "Around 1,500 assertions across purchase flows, payments, guarantee workflows, accessibility and security — Vitest for units, Playwright and custom Node suites for the rest.",
          accent: "#e6b45c",
        },
        {
          title: "Independent, and says so",
          body: "Built against the NZ Privacy Act and India's DPDP Act. Not affiliated with, endorsed by, or acting on behalf of Aspeq or CAANZ.",
          accent: "#e6b45c",
        },
      ],
    },
    {
      kind: "future",
      label: "08 — Future Scope",
      title: "Where it goes next",
      milestones: [
        { tag: "Insight", body: "Deeper readiness analytics on top of the progress data the platform already captures per student and per subject.", accent: "#5b9fdc" },
        { tag: "Content", body: "Wider syllabus coverage through the same extraction and audit pipeline that keeps the current fifteen subjects current.", accent: "#8cc4f0" },
        { tag: "Scale", body: "Instructor and school accounts — cohort visibility over the same entitlement model that already governs individual access.", accent: "#e6b45c" },
      ],
    },
  ],
  readme: {
    title: "Aviation Preparation Academy",
    subtitle: "A full-stack aviation learning platform for NZ pilot theory exams",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            A public marketing site, a student learning platform and an admin CMS in one{" "}
            <Code>Next.js</Code> application — covering fifteen theory subjects across PPL, CPL and
            IR, plus flight-test groundwork.
          </P>
        ),
      },
      {
        heading: "Disclaimer",
        body: (
          <P>
            Not affiliated with, endorsed by, or acting on behalf of Aspeq or CAANZ.
          </P>
        ),
      },
      {
        heading: "For Students",
        body: (
          <UL>
            <LI>Syllabus-indexed study material — PPL, CPL, IR</LI>
            <LI>Chapter-based practice questions</LI>
            <LI>Timed mock exams at realistic exam pace</LI>
            <LI>Knowledge Deficiency Reports, generated as PDFs and emailed</LI>
            <LI>Individual progress tracking</LI>
            <LI>A free 10-question mock exam before purchase</LI>
            <LI>First-attempt pass guarantee</LI>
          </UL>
        ),
      },
      {
        heading: "For Administrators",
        body: (
          <UL>
            <LI>Examinations and products</LI>
            <LI>Orders, coupons and refunds</LI>
            <LI>Guarantee claims</LI>
            <LI>Student access and entitlements</LI>
          </UL>
        ),
      },
      {
        heading: "Security",
        body: (
          <>
            <P>
              Everything that decides money or access — prices, discounts, entitlements, payment
              verification, guarantee eligibility — is computed <strong>server-side</strong> and
              never trusted from the browser.
            </P>
            <P>
              A dedicated suite runs 30 checks across access control, IDOR, authentication
              integrity, payment tampering and XSS. Last audit: zero vulnerabilities.
            </P>
          </>
        ),
      },
      {
        heading: "Testing",
        body: (
          <P>
            329 unit tests in <Code>Vitest</Code>, plus roughly 20 integration and end-to-end
            suites using <Code>Playwright</Code> and custom Node runners — around 1,500 assertions
            covering purchase flows, payments, guarantee workflows, accessibility and security.
          </P>
        ),
      },
      {
        heading: "Stack",
        body: (
          <UL>
            <LI><Code>Next.js 16</Code> — App Router, React Server Components</LI>
            <LI><Code>React 19</Code> with a custom CSS design system, light and dark themes</LI>
            <LI><Code>TypeScript</Code> in strict mode</LI>
            <LI><Code>PostgreSQL 16</Code> via <Code>Prisma 6</Code></LI>
            <LI><Code>jose</Code> signed JWT sessions, <Code>bcryptjs</Code> hashing</LI>
            <LI><Code>Razorpay</Code> with server-side signature verification</LI>
            <LI><Code>Resend</Code> for transactional email, <Code>pdfkit</Code> for reports</LI>
            <LI><Code>zod</Code> for validation</LI>
          </UL>
        ),
      },
      {
        heading: "Compliance",
        body: (
          <P>
            Built against the NZ Privacy Act and India&apos;s DPDP Act, with privacy, terms, refund
            and cookie policies in place.
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
        <p>The full platform — all three surfaces.</p>
      </>
    ),
    requestLabel: "View Repository →",
    href: "https://github.com/KiwiPilotPrep/kiwipilotprep",
  },
  techStack: STACK,
  cta: {
    heading: "Building something where readiness is the real question?",
    body: "Measuring whether someone is ready — and getting money and access right every time — is the hard part. Let's talk.",
    buttonLabel: "Start a Conversation",
  },
};
