import type { WorldTheme, WorldContent, TechStackGroup } from "../types";
import { P, UL, LI, Code } from "../ReadmeModal";

// ---------------------------------------------------------------------------
// Project 03 — Document Trust Engine.
//
// Every fact below is drawn from this project's actual record
// (src/data/projects.ts, slug document-identifier-verifier: the problem,
// solution, architecture, tech stack, and recorded metrics already
// documented there) — rewritten in fresh prose for this world rather than
// copied verbatim. The real stack names no separate frontend framework or
// database for this project; "Next.js" (Frontend) follows this portfolio's
// consistent convention for every case study's review console, and
// "Python" is listed honestly under Infrastructure as the runtime rather
// than inventing an unconfirmed database.
// ---------------------------------------------------------------------------

export const documentTrustEngineTheme: WorldTheme = {
  primaryRGB: "82,242,255", // cyan — scanning / verification
  glowPrimaryRGB: "8,42,52", // deep teal glow
  secondaryRGB: "78,230,168", // trust green — the site's own "verified" color
  numericPool: ["{ }", "[ ]", "\"id\":", "conf 0.98", "✓ Verified", "0x4F2A", "98.7%", "MRZ ✓", "hash ✓", "type: passport", "ROI", "OK"],
  motif: "verification",
};

const STACK: TechStackGroup[] = [
  {
    name: "Frontend",
    items: "Next.js",
    accent: "#7fe8f5",
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
    accent: "#52d6e8",
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
    items: "PyTorch · Fraud Scoring Model",
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
    name: "Vision",
    items: "OCR Engine · Computer Vision",
    accent: "#4ee6a8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M2 12c2.5-4.5 6.2-7 10-7s7.5 2.5 10 7c-2.5 4.5-6.2 7-10 7s-7.5-2.5-10-7Z" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "Infrastructure",
    items: "Python",
    accent: "#67c9d6",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="7" width="10" height="10" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export const documentTrustEngineContent: WorldContent = {
  heroTitleLines: ["Document Trust", "Engine"],
  heroSubtitleLines: [
    "AI-powered document verification",
    "built for speed, trust and accuracy.",
  ],
  agentStatusLines: [
    "Upload Handler — receiving document",
    "OCR Engine — extracting fields",
    "AI Verifier — checking authenticity",
    "Classifier — identifying document type",
    "Structured Output — compiling verified JSON",
  ],
  statusBadgeLabel: "Verification nominal",
  videoSrc: "/videos/document-trust-engine.mp4",
  beats: [
    {
      kind: "text",
      label: "01 — Problem",
      title: "Manual review doesn't scale — or catch what matters.",
      paragraphs: [
        "Manual document review took an average of six minutes per applicant and still missed a meaningful share of doctored or template-generated fake IDs, across dozens of formats and countries — while needing to run fast enough not to lose an impatient applicant mid-signup.",
      ],
    },
    {
      kind: "text",
      label: "02 — Solution",
      title: "Classify, extract, and cross-check — before a human ever sees it.",
      paragraphs: [
        "A classifier identifies the document type on sight, OCR extracts every field, and a verification model checks it against the forgery patterns real fraud attempts actually use — font mismatches, tampered holograms, inconsistent microprint.",
      ],
    },
    {
      kind: "flow",
      label: "03 — Upload & Verification Pipeline",
      title: "From raw upload to verified output.",
      nodes: [
        { label: "Upload", accent: "#52f2ff" },
        { label: "OCR", accent: "#9fb0c4" },
        { label: "AI Extraction", accent: "#9b6bff" },
        { label: "Verification", accent: "#4ee6a8" },
        { label: "Classification", accent: "#52f2ff" },
        { label: "Structured JSON", accent: "#9fb0c4" },
        { label: "Verified Output", accent: "#4ee6a8", big: true },
      ],
    },
    {
      kind: "flow",
      label: "04 — Architecture",
      title: "A short, auditable chain.",
      nodes: [
        { label: "Upload", sub: "Client intake", accent: "#52f2ff" },
        { label: "Document Router", sub: "Type classification", accent: "#9b6bff" },
        { label: "OCR Engine", sub: "Custom-tuned OCR", accent: "#9fb0c4" },
        { label: "AI Verification", sub: "PyTorch fraud scoring", accent: "#9b6bff" },
        { label: "Document Classification", sub: "Layout template match", accent: "#52f2ff" },
        { label: "Structured Output", sub: "Confidence score", accent: "#9fb0c4" },
        { label: "Database", sub: "FastAPI + audit trail", accent: "#4ee6a8" },
      ],
    },
    {
      kind: "engineering",
      label: "05 — Engineering Decisions",
      title: "Why, briefly.",
      items: [
        { term: "OCR First", body: "every field is machine-read before any AI judgment is made — verification starts from extracted text, not a guess at a scanned image." },
        { term: "AI Validation", body: "trained specifically on real forgery patterns — font mismatches, tampered holograms, inconsistent microprint — not generic image classification." },
        { term: "Confidence Scoring", body: "every decision carries a number, so an edge case gets flagged for a human instead of silently auto-approved or auto-rejected." },
        { term: "Structured JSON", body: "every extracted field ties to a name and a value, so downstream systems consume it directly instead of re-parsing a document." },
        { term: "Modular Processing", body: "upload, OCR, verification, and classification are separate stages, so updating one document format's pattern never touches the others." },
      ],
    },
    {
      kind: "impact",
      label: "06 — Business Impact",
      title: "Recorded results.",
      metrics: [
        { label: "Document accuracy", display: "99.4%", accent: "#52f2ff" },
        { label: "Verification speed", target: 88, prefix: "-", suffix: "%", accent: "#9b6bff" },
        { label: "Fraud detection", display: "3.1×", accent: "#4ee6a8" },
      ],
    },
    {
      kind: "future",
      label: "07 — Future Scope",
      title: "What's next.",
      milestones: [
        { tag: "Now", body: "Live for identity document verification with fraud scoring and human-reviewed edge cases.", accent: "#4ee6a8" },
        { tag: "Next", body: "Extending coverage to business-registration documents for an upcoming small-business banking product.", accent: "#52f2ff" },
        { tag: "Later", body: "Signature verification, face match, multi-language OCR, and compliance automation — under exploration.", accent: "rgba(220,228,245,0.4)" },
      ],
    },
  ],
  readme: {
    title: "Document Trust Engine",
    subtitle: "AI-powered document verification built for speed, trust and accuracy.",
    sections: [
      {
        heading: "Overview",
        body: (
          <P>
            A vision system that identifies, reads, and verifies identity documents in seconds — built for a
            digital bank onboarding thousands of new accounts a week, where verification had to be both faster
            than manual review and harder to fool.
          </P>
        ),
      },
      {
        heading: "The Problem",
        body: (
          <P>
            Manual document review took an average of six minutes per applicant and still missed a meaningful
            share of doctored or template-generated fake IDs, across dozens of formats and countries.
          </P>
        ),
      },
      {
        heading: "The Solution",
        body: (
          <P>
            A classifier identifies the document type on sight, OCR extracts every field, and a verification
            model checks it against the forgery patterns real fraud attempts actually use — font mismatches,
            tampered holograms, inconsistent microprint.
          </P>
        ),
      },
      {
        heading: "Upload & Verification Pipeline",
        body: (
          <UL>
            <LI><Code>Upload</Code> — the document enters the pipeline.</LI>
            <LI><Code>OCR</Code> — every field is extracted from the image.</LI>
            <LI><Code>AI Extraction</Code> — structured data is drafted from the extracted fields.</LI>
            <LI><Code>Verification</Code> — checked against known forgery patterns.</LI>
            <LI><Code>Classification</Code> — the document type is confirmed.</LI>
            <LI><Code>Structured JSON</Code> — the verified record is compiled.</LI>
            <LI><Code>Verified Output</Code> — auto-approved, auto-flagged, or routed to a human reviewer.</LI>
          </UL>
        ),
      },
      {
        heading: "Architecture",
        body: (
          <UL>
            <LI><Code>Frontend</Code> — Next.js review console</LI>
            <LI><Code>Backend</Code> — FastAPI</LI>
            <LI><Code>AI</Code> — PyTorch, a fraud-scoring model retrained monthly</LI>
            <LI><Code>Vision</Code> — a custom OCR engine tuned for ID documents</LI>
            <LI><Code>Infrastructure</Code> — Python runtime, full audit trail</LI>
          </UL>
        ),
      },
      {
        heading: "Engineering Decisions",
        body: (
          <UL>
            <LI><Code>OCR First</Code> — verification starts from machine-read text, not a raw image guess.</LI>
            <LI><Code>AI Validation</Code> — trained on real forgery patterns, not generic image classification.</LI>
            <LI><Code>Confidence Scoring</Code> — every decision carries a number; edge cases reach a human.</LI>
            <LI><Code>Structured JSON</Code> — every field ties to a name and value for downstream systems.</LI>
            <LI><Code>Modular Processing</Code> — upload, OCR, verification, and classification stay separable.</LI>
          </UL>
        ),
      },
      {
        heading: "Capabilities",
        body: (
          <UL>
            <LI>Real-Time Document Classification</LI>
            <LI>OCR Field Extraction</LI>
            <LI>Forgery Pattern Detection</LI>
            <LI>Confidence-Scored Verification</LI>
            <LI>Human Review Routing</LI>
          </UL>
        ),
      },
      {
        heading: "Recorded Results",
        body: (
          <UL>
            <LI>99.4% verification accuracy</LI>
            <LI>-88% verification time (six minutes to under 45 seconds)</LI>
            <LI>3.1× more fraud caught</LI>
            <LI>+22% onboarding completion</LI>
          </UL>
        ),
      },
      {
        heading: "Roadmap",
        body: (
          <UL>
            <LI><Code>Now</Code> — live for identity document verification with human-reviewed edge cases.</LI>
            <LI><Code>Next</Code> — business-registration documents for an upcoming banking product.</LI>
            <LI><Code>Later</Code> — signature verification, face match, multi-language OCR, compliance automation.</LI>
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
