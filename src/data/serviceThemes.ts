import type { WorldTheme } from "@/components/investment-world/types";

// ---------------------------------------------------------------------------
// A world theme per service page.
//
// The service pages are not linked from the Core — they exist to be found in
// search and opened cold. That makes them the most likely first impression the
// site ever gives, and the one place it cannot afford to look like a different,
// cheaper website. So they run the same WorldBackground the project worlds run,
// with the same shape of theme: an accent, a deep tone for the volumetric glow,
// gold in its structural role, a motif, and a pool of abstract fragments for the
// numeric layer.
//
// The motif is chosen for what the service actually is, the way each project's
// is — documents for document work, corridors for cross-border money, routes
// for a pipeline, network for systems that connect things.
//
// `numericPool` is flavor only and never real data (see WorldTheme).
// ---------------------------------------------------------------------------

const GOLD = "226,178,88";

export const serviceThemes: Record<string, WorldTheme> = {
  "ai-agent-development": {
    primaryRGB: "82,242,255",
    glowPrimaryRGB: "6,30,36",
    secondaryRGB: GOLD,
    motif: "network",
    numericPool: [
      "tool.call",
      "scope ✓",
      "retrieval",
      "handoff",
      "approve?",
      "context 8k",
      "policy ✓",
      "agent 03",
      "grounded",
      "review →",
    ],
  },

  "mvp-development": {
    primaryRGB: "78,230,168",
    glowPrimaryRGB: "6,32,26",
    secondaryRGB: GOLD,
    motif: "curves",
    numericPool: [
      "v0.1",
      "scope ✓",
      "build 14d",
      "deploy",
      "signup",
      "retention",
      "iterate",
      "ship →",
      "feedback",
      "v0.4",
    ],
  },

  "workflow-automation": {
    primaryRGB: "243,211,138",
    glowPrimaryRGB: "34,26,8",
    secondaryRGB: "82,242,255",
    motif: "routes",
    numericPool: [
      "trigger",
      "step 04",
      "queued",
      "retry ×2",
      "approve",
      "webhook",
      "12m saved",
      "exception",
      "routed",
      "done ✓",
    ],
  },

  "full-stack-development": {
    primaryRGB: "59,130,246",
    glowPrimaryRGB: "6,16,38",
    secondaryRGB: GOLD,
    motif: "network",
    numericPool: [
      "api/v1",
      "200 OK",
      "cache hit",
      "schema",
      "migrate",
      "p95 120ms",
      "deploy ✓",
      "edge",
      "index",
      "build ✓",
    ],
  },

  "white-label-execution": {
    primaryRGB: "155,107,255",
    glowPrimaryRGB: "20,10,38",
    secondaryRGB: GOLD,
    motif: "documents",
    numericPool: [
      "under NDA",
      "your brand",
      "sprint 06",
      "handover",
      "spec ✓",
      "unbranded",
      "review",
      "shipped",
      "scope",
      "delivery",
    ],
  },

  "document-ai": {
    primaryRGB: "82,242,255",
    glowPrimaryRGB: "6,30,36",
    secondaryRGB: GOLD,
    motif: "verification",
    numericPool: [
      "OCR ✓",
      "field 12",
      "conf 0.94",
      "classify",
      "extract",
      "flagged",
      "page 3/9",
      "source →",
      "review",
      "verified",
    ],
  },

  "fintech-software-development": {
    primaryRGB: "243,211,138",
    glowPrimaryRGB: "34,26,8",
    secondaryRGB: "82,242,255",
    motif: "corridors",
    numericPool: [
      "ledger ✓",
      "recon",
      "settled",
      "KYC ✓",
      "audit log",
      "double-entry",
      "FX 0.9942",
      "hold",
      "balance",
      "cleared",
    ],
  },

  "ai-product-development": {
    primaryRGB: "155,107,255",
    glowPrimaryRGB: "20,10,38",
    secondaryRGB: GOLD,
    motif: "curves",
    numericPool: [
      "eval set",
      "baseline",
      "prompt v7",
      "accuracy",
      "fallback",
      "guardrail",
      "cost/req",
      "latency",
      "ship ✓",
      "measure",
    ],
  },
};

/** Falls back to the AI-agent theme so a service added without one still gets a
 *  world rather than a blank page. */
export function getServiceTheme(slug: string): WorldTheme {
  return serviceThemes[slug] ?? serviceThemes["ai-agent-development"];
}
