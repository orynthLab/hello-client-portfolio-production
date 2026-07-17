"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { prefersReducedMotion, isMobileViewport } from "./motion";
import type { WorldTheme } from "./types";

// ---------------------------------------------------------------------------
// The persistent atmosphere for a project world. Mounted once and fixed to
// the viewport — it never rebuilds, resets, or scrolls away per-section,
// which is what makes the visitor feel like they're moving through one
// continuous space rather than across stitched-together sections.
//
// Four visual vocabularies live here, chosen by `theme.motif`: "curves" is
// Project 01's market atmosphere (untouched — every value in the CURVES
// section is exactly what shipped before this file supported a second
// motif). "documents" and "verification" are both "paper-like" — they share
// ledger/blueprint lines, bounding-box markers, cell highlights, overlay
// boxes, scan particles, and a scanner sweep (see `isPaperLike` below), but
// each adds its own signature elements: "documents" gets folded page
// rectangles and blurred accounting tables; "verification" gets rounded
// ID-card outlines, confidence badges, and a security-watermark texture.
// "routes" (see the ROUTES section below) is its own top-level vocabulary,
// not a paper-like variant and not a recolor of curves — orthogonal mesh
// lines, rectangular hubs, diamond cargo nodes, container-grid clusters,
// and distribution rings, standing apart from every other motif's shapes.
// "network" (see the NETWORK section below) is the fifth vocabulary — a
// knowledge graph of discovered-company nodes, CRM card outlines, drifting
// email glyphs, and conversation threads carrying a single traveling pulse.
// ---------------------------------------------------------------------------

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const PARTICLES = (() => {
  const rand = seededRandom(417);
  return Array.from({ length: 20 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 0.5 + rand() * 1.4,
    driftX: (rand() - 0.5) * 60,
    driftY: -20 - rand() * 60,
    duration: 18 + rand() * 22,
    delay: rand() * 8,
    opacity: 0.04 + rand() * 0.09,
    layer: rand() > 0.5 ? "near" : "far",
  }));
})();

// =============================================================================
// CURVES motif (Project 01 — markets). Unchanged from the original background.
// =============================================================================

const CURVE_LINES = (() => {
  const rand = seededRandom(317);
  return Array.from({ length: 12 }, (_, i) => {
    const x0 = rand() * 120 - 10;
    const y0 = 10 + rand() * 80;
    const cx = rand() * 100;
    const cy = y0 + (rand() - 0.5) * 28;
    const x1 = rand() * 120 - 10;
    const y1 = 10 + rand() * 80;
    return {
      d: `M ${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}`,
      dashSpeed: 52 + rand() * 60,
      opacity: 0.014 + rand() * 0.014,
      strokeWidth: 0.1 + rand() * 0.12,
      gold: rand() > 0.72,
      i,
    };
  });
})();

const TREND_LINES = (() => {
  const rand = seededRandom(911);
  return Array.from({ length: 4 }, (_, i) => {
    let y = 30 + rand() * 50;
    const points = [{ x: -10, y }];
    const segments = 5;
    for (let s = 1; s <= segments; s++) {
      y += (rand() - 0.38) * 14;
      y = Math.max(10, Math.min(90, y));
      points.push({ x: -10 + (110 / segments) * s, y });
    }
    const d = points.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
    return {
      d,
      opacity: 0.022 + rand() * 0.016,
      strokeWidth: 0.09 + rand() * 0.05,
      gold: i % 3 === 0,
      dashSpeed: 70 + rand() * 40,
      i,
    };
  });
})();

const SIGNAL_TICKS = (() => {
  const rand = seededRandom(771);
  return Array.from({ length: 7 }, () => ({
    x: 5 + rand() * 88,
    y: 8 + rand() * 84,
    width: 10 + rand() * 22,
    delay: rand() * 8,
    opacity: 0.02 + rand() * 0.02,
  }));
})();

const TICKER_PARTICLES = (() => {
  const rand = seededRandom(642);
  return Array.from({ length: 8 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 0.6 + rand() * 1,
    duration: 9 + rand() * 8,
    delay: rand() * 6,
    gold: rand() > 0.7,
  }));
})();

const DATA_PULSES = (() => {
  const rand = seededRandom(384);
  return Array.from({ length: 5 }, () => ({
    x: 10 + rand() * 80,
    y: 10 + rand() * 80,
    duration: 6 + rand() * 5,
    delay: rand() * 10,
    gold: rand() > 0.55,
  }));
})();

const NETWORK_NODES = (() => {
  const rand = seededRandom(203);
  return Array.from({ length: 6 }, (_, i) => ({
    x: 8 + rand() * 84,
    y: 8 + rand() * 84,
    r: 0.35 + rand() * 0.3,
    gold: i % 4 === 0,
  }));
})();
const NETWORK_LINKS = NETWORK_NODES.map((_, i) => [i, (i + 3) % NETWORK_NODES.length]);

// =============================================================================
// DOCUMENTS motif (Project 02 — financial documents). A separate vocabulary:
// ruled ledger lines, stacked pages with a folded corner, OCR bounding-box
// markers, spreadsheet cell highlights, and a scanner sweep. No curves, no
// tickers, no trading motion anywhere in this set.
// =============================================================================

// Ruled ledger lines — near-horizontal, evoking ruled paper or a spreadsheet
// row rather than a market curve.
const LEDGER_LINES = (() => {
  const rand = seededRandom(317);
  return Array.from({ length: 12 }, (_, i) => {
    const y0 = 10 + rand() * 80;
    const y1 = y0 + (rand() - 0.5) * 3;
    const x0 = rand() * 20 - 10;
    const x1 = x0 + 60 + rand() * 50;
    return {
      d: `M ${x0} ${y0} L ${x1} ${y1}`,
      dashSpeed: 60 + rand() * 60,
      opacity: 0.018 + rand() * 0.014,
      strokeWidth: 0.07 + rand() * 0.06,
      paper: rand() > 0.72,
      i,
    };
  });
})();

// Stacked document pages — large, near-rectangular outlines with one corner
// folded (a dog-ear), breathing very slowly in place. The single most
// literal "this is about documents" cue in the whole scene. Each page also
// carries a faint vertical margin rule, inset from the left edge, the way a
// ruled page or legal pad marks its margin.
const PAGE_RECTANGLES = (() => {
  const rand = seededRandom(558);
  return Array.from({ length: 3 }, (_, i) => {
    const w = 16 + rand() * 10;
    const h = w * (1.32 + rand() * 0.15);
    const x = 10 + rand() * 70;
    const y = 8 + rand() * 65;
    const fold = 2.2 + rand() * 1.2;
    const rotation = (rand() - 0.5) * 6;
    const d = `M ${x} ${y} L ${x + w - fold} ${y} L ${x + w} ${y + fold} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    const foldD = `M ${x + w - fold} ${y} L ${x + w - fold} ${y + fold} L ${x + w} ${y + fold}`;
    const marginD = `M ${x + w * 0.16} ${y + h * 0.1} L ${x + w * 0.16} ${y + h * 0.9}`;
    return {
      d,
      foldD,
      marginD,
      cx: x + w / 2,
      cy: y + h / 2,
      rotation,
      opacity: 0.02 + rand() * 0.008,
      duration: 26 + rand() * 14,
      delay: rand() * 6,
      paper: i === 1,
      i,
    };
  });
})();

// Blurred accounting tables — a small grid of rows and columns rendered
// through a much heavier blur than everything else, so it reads as an
// out-of-focus financial statement glimpsed at a distance, never as
// legible content.
const BLURRED_TABLES = (() => {
  const rand = seededRandom(629);
  return Array.from({ length: 2 }, (_, i) => {
    const w = 22 + rand() * 14;
    const h = 13 + rand() * 9;
    const x = 8 + rand() * 66;
    const y = 12 + rand() * 66;
    const rows = 3 + Math.floor(rand() * 2);
    const cols = 2 + Math.floor(rand() * 2);
    return {
      x,
      y,
      w,
      h,
      rows,
      cols,
      opacity: 0.022 + rand() * 0.008,
      duration: 30 + rand() * 16,
      delay: rand() * 9,
      paper: i === 0,
      i,
    };
  });
})();

// OCR bounding-box markers — a pair of corner brackets (top-left,
// bottom-right) rather than a full rectangle, the way a document scanner
// marks a field it just recognized. Not connected to one another — this
// isn't a network/graph metaphor, it's independent field extraction.
const FIELD_MARKERS = (() => {
  const rand = seededRandom(203);
  return Array.from({ length: 6 }, (_, i) => ({
    x: 10 + rand() * 78,
    y: 10 + rand() * 78,
    size: 3.5 + rand() * 2.5,
    corner: 0.9 + rand() * 0.5,
    paper: i % 3 === 0,
    duration: 5 + (i % 5),
    delay: i * 0.7,
  }));
})();

// Spreadsheet cell highlights — small rectangle outlines that fade in, hold,
// and fade out, as if a cell were briefly being read.
const CELL_HIGHLIGHTS = (() => {
  const rand = seededRandom(771);
  return Array.from({ length: 8 }, () => ({
    x: 6 + rand() * 84,
    y: 8 + rand() * 84,
    w: 3 + rand() * 3,
    h: 1.4 + rand() * 1,
    delay: rand() * 9,
    duration: 7 + rand() * 4,
  }));
})();

// Highlighted rows — wider, flatter bands than a cell highlight, as if a
// full spreadsheet row (or a line of a statement) were briefly selected.
const HIGHLIGHTED_ROWS = (() => {
  const rand = seededRandom(883);
  return Array.from({ length: 3 }, () => ({
    x: 4 + rand() * 10,
    y: 10 + rand() * 78,
    w: 45 + rand() * 30,
    h: 2 + rand() * 0.8,
    delay: rand() * 10,
    duration: 9 + rand() * 5,
    paper: rand() > 0.5,
  }));
})();

// OCR overlay boxes — a filled block, the way a scanner highlights a
// recognized paragraph or field rather than just its corners.
const OCR_OVERLAY_BOXES = (() => {
  const rand = seededRandom(917);
  return Array.from({ length: 4 }, () => ({
    x: 8 + rand() * 74,
    y: 8 + rand() * 74,
    w: 8 + rand() * 8,
    h: 4 + rand() * 4,
    delay: rand() * 11,
    duration: 8 + rand() * 5,
    paper: rand() > 0.6,
  }));
})();

// Blueprint dimension lines — a short horizontal run with small
// perpendicular ticks at each end, the way a technical drawing annotates a
// measurement. The one deliberately "blueprint" cue in the scene.
const BLUEPRINT_TICKS = (() => {
  const rand = seededRandom(414);
  return Array.from({ length: 4 }, (_, i) => {
    const y = 10 + rand() * 78;
    const x0 = 6 + rand() * 40;
    const x1 = x0 + 10 + rand() * 14;
    return { x0, x1, y, tick: 1.1, delay: i * 1.3, duration: 5 + i, paper: i % 2 === 0 };
  });
})();

// OCR recognition particles — flash in place; deliberately no directional
// drift, so this never reads as "ticker movement."
const OCR_PARTICLES = (() => {
  const rand = seededRandom(642);
  return Array.from({ length: 8 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 1.6 + rand() * 1.6,
    duration: 6 + rand() * 6,
    delay: rand() * 8,
    paper: rand() > 0.7,
  }));
})();

// =============================================================================
// VERIFICATION motif (Project 03 — document verification). Shares the
// "paper-like" layers above (ledger/blueprint lines, bounding-box markers,
// cell highlights, overlay boxes, scan particles, scanner sweep — see
// isPaperLike below) but adds three signature elements of its own: rounded
// ID-card outlines with a chip detail, confidence badges with a checkmark,
// and a diagonal security-watermark texture. No page folds, no accounting
// tables — those stay exclusive to the documents motif.
// =============================================================================

const ID_CARD_OUTLINES = (() => {
  const rand = seededRandom(558);
  return Array.from({ length: 3 }, (_, i) => {
    const w = 18 + rand() * 10;
    const h = w * 0.63; // ID-card aspect ratio, ~1.586:1
    const x = 10 + rand() * 64;
    const y = 10 + rand() * 64;
    const rotation = (rand() - 0.5) * 8;
    const chipW = w * 0.16;
    const chipH = h * 0.22;
    const chipX = x + w * 0.08;
    const chipY = y + h * 0.26;
    const lineY1 = y + h * 0.72;
    const lineY2 = y + h * 0.85;
    return {
      x,
      y,
      w,
      h,
      chipX,
      chipY,
      chipW,
      chipH,
      lineD: `M ${x + w * 0.08} ${lineY1} L ${x + w * 0.55} ${lineY1} M ${x + w * 0.08} ${lineY2} L ${x + w * 0.4} ${lineY2}`,
      cx: x + w / 2,
      cy: y + h / 2,
      rotation,
      opacity: 0.02 + rand() * 0.008,
      duration: 26 + rand() * 14,
      delay: rand() * 6,
      paper: i === 1,
      i,
    };
  });
})();

const CONFIDENCE_BADGES = (() => {
  const rand = seededRandom(275);
  return Array.from({ length: 5 }, (_, i) => {
    const x = 10 + rand() * 78;
    const y = 10 + rand() * 78;
    const r = 1.7 + rand() * 0.6;
    return {
      x,
      y,
      r,
      checkD: `M ${x - r * 0.45} ${y} L ${x - r * 0.1} ${y + r * 0.4} L ${x + r * 0.5} ${y - r * 0.4}`,
      delay: rand() * 9,
      duration: 7 + rand() * 4,
      paper: i % 2 === 0,
    };
  });
})();

// =============================================================================
// ROUTES motif (Project 04 — logistics). Deliberately a different geometric
// vocabulary from every other motif here, not a recolor of one: orthogonal
// (elbow-routed) mesh lines instead of smooth bezier curves, rectangular
// warehouse-hub markers and diamond cargo nodes instead of plain circles,
// stacked container-grid clusters, and slow concentric "distribution reach"
// rings anchored on the largest hubs. The signature motion is a handful of
// traveling lights along a subset of the mesh (GSAP MotionPathPlugin, same
// technique as FlowConnector — folded into this component's existing
// gsap.context so pauseWorldForOverlay() stops it for free), reading as
// shipments moving through the network rather than data ticking on a
// market. Deliberately not a map: no coastline, no borders, no roads, no
// vehicle iconography — just abstract infrastructure and movement.
// =============================================================================

function elbowPath(x0: number, y0: number, x1: number, y1: number, bend: "h" | "v") {
  return bend === "h" ? `M ${x0} ${y0} L ${x1} ${y0} L ${x1} ${y1}` : `M ${x0} ${y0} L ${x0} ${y1} L ${x1} ${y1}`;
}

const WAREHOUSE_HUBS = (() => {
  const rand = seededRandom(812);
  return Array.from({ length: 5 }, () => {
    const w = 3.2 + rand() * 1.6;
    return {
      x: 8 + rand() * 84,
      y: 12 + rand() * 76,
      w,
      h: w * 0.66,
      gold: rand() > 0.6,
      duration: 7 + rand() * 5,
      delay: rand() * 6,
    };
  });
})();

const CARGO_NODES = (() => {
  const rand = seededRandom(344);
  return Array.from({ length: 10 }, () => ({
    x: 6 + rand() * 88,
    y: 8 + rand() * 84,
    size: 0.9 + rand() * 0.7,
    gold: rand() > 0.75,
    duration: 6 + rand() * 5,
    delay: rand() * 6,
  }));
})();

const MESH_NODE_POSITIONS = [...WAREHOUSE_HUBS, ...CARGO_NODES].map((n) => ({ x: n.x, y: n.y }));

const MESH_LINKS: { a: number; b: number; bend: "h" | "v" }[] = (() => {
  const rand = seededRandom(967);
  const n = MESH_NODE_POSITIONS.length;
  const links: { a: number; b: number; bend: "h" | "v" }[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1 + Math.floor(rand() * 3)) % n;
    if (i !== j) links.push({ a: i, b: j, bend: rand() > 0.5 ? "h" : "v" });
  }
  return links;
})();

const SHIPMENT_ROUTES = (() => {
  const rand = seededRandom(521);
  return MESH_LINKS.slice(0, 5).map((link, i) => {
    const A = MESH_NODE_POSITIONS[link.a];
    const B = MESH_NODE_POSITIONS[link.b];
    return {
      d: elbowPath(A.x, A.y, B.x, B.y, link.bend),
      dashSpeed: 9 + rand() * 6,
      travelDuration: 7 + rand() * 5,
      travelDelay: rand() * 6,
      gold: i % 3 === 0,
      i,
    };
  });
})();

const GPS_PULSE_RINGS = (() => {
  const rand = seededRandom(129);
  return WAREHOUSE_HUBS.map((h) => ({
    x: h.x,
    y: h.y,
    gold: h.gold,
    duration: 5 + rand() * 4,
    delay: rand() * 8,
  }));
})();

// Abstract stacks of shipping containers, seen from above — small grids of
// rectangles, static but breathing gently via the shared iw-page-drift class.
const CONTAINER_GRID_CLUSTERS = (() => {
  const rand = seededRandom(683);
  return Array.from({ length: 4 }, () => ({
    x: 10 + rand() * 78,
    y: 12 + rand() * 74,
    cols: 2 + Math.floor(rand() * 2),
    rows: 2,
    cellW: 1.6,
    cellH: 1.1,
    gap: 0.25,
    gold: rand() > 0.6,
    duration: 20 + rand() * 12,
    delay: rand() * 8,
  }));
})();

// Slow concentric "distribution reach" rings anchored on the two largest hubs.
const DISTRIBUTION_RINGS = (() => {
  const rand = seededRandom(758);
  return [...WAREHOUSE_HUBS]
    .sort((a, b) => b.w - a.w)
    .slice(0, 2)
    .map((h) => ({
      x: h.x,
      y: h.y,
      duration: 14 + rand() * 8,
      delay: rand() * 6,
      gold: h.gold,
    }));
})();

// Ambient particles drifting with a predominant direction (rather than
// flashing in place or oscillating sideways) — reads as small packets of
// motion passing through the network, reusing the shared .iw-particle drift.
const SHIPMENT_FLOW_PARTICLES = (() => {
  const rand = seededRandom(940);
  return Array.from({ length: 10 }, () => ({
    x: rand() * 100,
    y: rand() * 100,
    size: 1.4 + rand() * 1.4,
    driftX: 30 + rand() * 40,
    driftY: (rand() - 0.5) * 20,
    duration: 10 + rand() * 10,
    delay: rand() * 8,
    gold: rand() > 0.7,
  }));
})();

// Theme-independent (just positions/timings, colored later via theme at
// render time), so — like every other seeded array in this file — it's
// computed once at module scope rather than re-generated on every render.
const NUMERIC_PULSES_SEED = (() => {
  const rand = seededRandom(552);
  return Array.from({ length: 6 }, (_, i) => ({
    x: 6 + rand() * 88,
    y: 6 + rand() * 88,
    index: i,
    delay: rand() * 14,
    duration: 6 + rand() * 5,
    gold: rand() > 0.6,
  }));
})();

// =============================================================================
// NETWORK motif (Autonomous Business Development Agent). Not a dashboard —
// a quiet knowledge graph of discovered companies, a mesh of decision/
// outreach connections between them, small CRM card outlines, drifting
// email glyphs, and a handful of conversation threads carrying a single
// traveling pulse — the same "freight network" mechanic the routes motif
// uses, recast as companies/emails/CRM records instead of warehouses/
// cargo/shipments.
// =============================================================================

const COMPANY_NODES = (() => {
  const rand = seededRandom(614);
  return Array.from({ length: 9 }, () => ({
    x: 10 + rand() * 80,
    y: 10 + rand() * 80,
    r: 0.9 + rand() * 0.6,
    gold: rand() > 0.65,
    duration: 5 + rand() * 5,
    delay: rand() * 8,
  }));
})();

const KNOWLEDGE_GRAPH_LINKS: { a: number; b: number }[] = (() => {
  const rand = seededRandom(233);
  const n = COMPANY_NODES.length;
  const links: { a: number; b: number }[] = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1 + Math.floor(rand() * 2)) % n;
    if (i !== j) links.push({ a: i, b: j });
  }
  return links;
})();

const OUTREACH_THREADS = (() => {
  const rand = seededRandom(777);
  return KNOWLEDGE_GRAPH_LINKS.slice(0, 4).map((link, i) => {
    const A = COMPANY_NODES[link.a];
    const B = COMPANY_NODES[link.b];
    return {
      d: `M${A.x},${A.y} Q${(A.x + B.x) / 2},${(A.y + B.y) / 2 - 6} ${B.x},${B.y}`,
      dashSpeed: 8 + rand() * 6,
      travelDuration: 6 + rand() * 5,
      travelDelay: rand() * 6,
      gold: i % 3 === 0,
      i,
    };
  });
})();

const CRM_CARD_OUTLINES = (() => {
  const rand = seededRandom(348);
  return Array.from({ length: 6 }, (_, i) => ({
    x: 8 + rand() * 76,
    y: 8 + rand() * 76,
    w: 6 + rand() * 3,
    h: 4 + rand() * 2,
    gold: rand() > 0.6,
    duration: 16 + rand() * 10,
    delay: rand() * 8,
    i,
  }));
})();

const DECISION_PULSE_RINGS = (() => {
  const rand = seededRandom(902);
  return COMPANY_NODES.filter((_, i) => i % 2 === 0).map((n) => ({
    x: n.x,
    y: n.y,
    gold: n.gold,
    duration: 6 + rand() * 5,
    delay: rand() * 8,
  }));
})();

const EMAIL_GLYPHS = (() => {
  const rand = seededRandom(465);
  return Array.from({ length: 5 }, () => ({
    x: 12 + rand() * 76,
    y: 12 + rand() * 76,
    size: 2.2 + rand() * 0.8,
    gold: rand() > 0.6,
    duration: 18 + rand() * 10,
    delay: rand() * 8,
  }));
})();

export default function WorldBackground({ theme }: { theme: WorldTheme }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowGoldRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const routePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const routeDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Checked once on mount (same convention as prefersReducedMotion elsewhere
  // in this world) — starts false so SSR/first paint matches desktop, then
  // settles before the entrance timeline below actually starts animating.
  const [isMobile, setIsMobile] = useState(false);

  const { primaryRGB, glowPrimaryRGB, secondaryRGB, numericPool, motif } = theme;
  const isDocuments = motif === "documents";
  const isVerification = motif === "verification";
  const isRoutes = motif === "routes";
  const isNetwork = motif === "network";
  const routeSpecs = isRoutes ? SHIPMENT_ROUTES : isNetwork ? OUTREACH_THREADS : [];
  // Elements shared by both "paper" motifs (ledger/blueprint lines, bounding-box
  // markers, cell highlights, overlay boxes, scan particles, scanner sweep) —
  // only the documents-only (page fold, accounting tables) and
  // verification-only (ID cards, confidence badges, watermark) pieces diverge.
  const isPaperLike = isDocuments || isVerification;

  useEffect(() => {
    setIsMobile(isMobileViewport());
  }, []);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);
    const ctx = gsap.context(() => {
      gsap.set(particleRefs.current, { opacity: 0, scale: 0.4 });
      gsap.to(particleRefs.current.filter(Boolean), {
        opacity: (i: number) => PARTICLES[i]?.opacity ?? 0.06,
        scale: 1,
        duration: 2.2,
        stagger: { amount: 2.4, from: "random" },
        ease: "sine.out",
        delay: 0.4,
      });

      // The breathing glow and traveling shipment lights are purely ambient —
      // skip them entirely for a visitor who has asked for reduced motion,
      // rather than merely pausing them (they'd otherwise run for the whole
      // time this background is mounted, which is most of the site). Same
      // treatment on mobile: these are two infinite, always-on tweens (plus
      // a MotionPath loop on the routes motif) stacked on top of everything
      // else this background renders — the single biggest ongoing cost to a
      // phone GPU, for an effect that reads as barely-there even on a laptop.
      if (!prefersReducedMotion() && !isMobileViewport()) {
        gsap.to(glowRef.current, {
          opacity: 0.78,
          scale: 1.05,
          duration: 16,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(glowGoldRef.current, {
          opacity: 0.6,
          x: 40,
          duration: 22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        if (isRoutes || isNetwork) {
          routePathRefs.current.forEach((path, i) => {
            const dot = routeDotRefs.current[i];
            const spec = routeSpecs[i];
            if (!path || !dot || !spec) return;
            gsap.set(dot, { opacity: 0.85 });
            gsap.to(dot, {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
              duration: spec.travelDuration,
              delay: spec.travelDelay,
              repeat: -1,
              ease: "power1.inOut",
            });
          });
        }
      }
    }, rootRef);

    const parallaxEnabled = window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion();
    const xTo = glowRef.current ? gsap.quickTo(glowRef.current, "x", { duration: 2.4, ease: "power3.out" }) : null;
    const yTo = glowRef.current ? gsap.quickTo(glowRef.current, "y", { duration: 2.4, ease: "power3.out" }) : null;
    const handleMove = (e: MouseEvent) => {
      if (!parallaxEnabled) return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo?.(nx * -28);
      yTo?.(ny * -16);
    };
    window.addEventListener("mousemove", handleMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", handleMove);
    };
  }, [isRoutes]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: "#030407" }}
    >
      {/* Layer 1: depth atmosphere — shared, neutral room depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 20%, rgba(8,15,30,0.95) 0%, transparent 70%),
            radial-gradient(ellipse 65% 80% at 20% 75%, rgba(6,11,22,0.85) 0%, transparent 65%),
            radial-gradient(ellipse 55% 45% at 80% 55%, rgba(9,14,24,0.75) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(4,8,18,0.6) 0%, rgba(3,4,7,0) 100%)
          `,
        }}
      />

      {/* Layer 2: faint grid — a coarser second pass for paper-like motifs,
         evoking ledger/blueprint column groupings rather than a plain crosshatch */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140,160,200,0.016) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140,160,200,0.016) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {isPaperLike && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(${primaryRGB},0.022) 1px, transparent 1px),
              linear-gradient(90deg, rgba(${primaryRGB},0.022) 1px, transparent 1px)
            `,
            backgroundSize: "240px 240px",
          }}
        />
      )}
      {/* verification only — a diagonal security-watermark texture, the way
         secure paper or an ID card has a faint repeating micro-pattern */}
      {isVerification && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, rgba(${primaryRGB},0.018) 0px, rgba(${primaryRGB},0.018) 1px, transparent 1px, transparent 46px)`,
          }}
        />
      )}

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="wb-line-blur">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
          <filter id="wb-table-blur">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {isPaperLike ? (
          <>
            {/* ruled ledger / blueprint lines — shared across both paper motifs */}
            {LEDGER_LINES.map(({ d, dashSpeed, opacity, strokeWidth, paper, i }) => (
              <path
                key={`ledger-${i}`}
                d={d}
                fill="none"
                stroke={paper ? `rgba(${secondaryRGB},${opacity})` : `rgba(${primaryRGB},${opacity})`}
                strokeWidth={strokeWidth}
                filter={isMobile ? undefined : "url(#wb-line-blur)"}
                strokeDasharray="2 5"
                className="iw-data-drift"
                style={{ animationDuration: `${dashSpeed}s` }}
              />
            ))}

            {isDocuments && (
              <>
                {/* stacked document pages, each with a folded corner and a faint margin rule */}
                {PAGE_RECTANGLES.map((p) => (
                  <g
                    key={`page-${p.i}`}
                    className="iw-page-drift"
                    style={{
                      transformOrigin: `${p.cx}px ${p.cy}px`,
                      transform: `rotate(${p.rotation}deg)`,
                      animationDuration: `${p.duration}s`,
                      animationDelay: `${p.delay}s`,
                    }}
                  >
                    <path
                      d={p.d}
                      fill="none"
                      stroke={p.paper ? `rgba(${secondaryRGB},${p.opacity})` : `rgba(${primaryRGB},${p.opacity})`}
                      strokeWidth={0.1}
                    />
                    <path
                      d={p.foldD}
                      fill="none"
                      stroke={p.paper ? `rgba(${secondaryRGB},${p.opacity * 1.2})` : `rgba(${primaryRGB},${p.opacity * 1.2})`}
                      strokeWidth={0.09}
                    />
                    <path
                      d={p.marginD}
                      fill="none"
                      stroke={p.paper ? `rgba(${secondaryRGB},${p.opacity * 0.8})` : `rgba(${primaryRGB},${p.opacity * 0.8})`}
                      strokeWidth={0.06}
                    />
                  </g>
                ))}

                {/* blurred accounting tables — out-of-focus row/column structure */}
                {BLURRED_TABLES.map((t) => (
                  <g key={`table-${t.i}`} filter={isMobile ? undefined : "url(#wb-table-blur)"} className="iw-page-drift" style={{ animationDuration: `${t.duration}s`, animationDelay: `${t.delay}s` }}>
                    <rect
                      x={t.x}
                      y={t.y}
                      width={t.w}
                      height={t.h}
                      fill="none"
                      stroke={t.paper ? `rgba(${secondaryRGB},${t.opacity})` : `rgba(${primaryRGB},${t.opacity})`}
                      strokeWidth={0.12}
                    />
                    {Array.from({ length: t.rows - 1 }, (_, r) => (
                      <line
                        key={`row-${r}`}
                        x1={t.x}
                        x2={t.x + t.w}
                        y1={t.y + (t.h / t.rows) * (r + 1)}
                        y2={t.y + (t.h / t.rows) * (r + 1)}
                        stroke={t.paper ? `rgba(${secondaryRGB},${t.opacity})` : `rgba(${primaryRGB},${t.opacity})`}
                        strokeWidth={0.1}
                      />
                    ))}
                    {Array.from({ length: t.cols - 1 }, (_, c) => (
                      <line
                        key={`col-${c}`}
                        y1={t.y}
                        y2={t.y + t.h}
                        x1={t.x + (t.w / t.cols) * (c + 1)}
                        x2={t.x + (t.w / t.cols) * (c + 1)}
                        stroke={t.paper ? `rgba(${secondaryRGB},${t.opacity})` : `rgba(${primaryRGB},${t.opacity})`}
                        strokeWidth={0.1}
                      />
                    ))}
                  </g>
                ))}

                {/* blueprint dimension ticks */}
                {BLUEPRINT_TICKS.map((t, i) => (
                  <g
                    key={`tick-${i}`}
                    className="animate-pulse-soft"
                    style={{ animationDuration: `${t.duration}s`, animationDelay: `${t.delay}s` }}
                  >
                    <line x1={t.x0} x2={t.x1} y1={t.y} y2={t.y} stroke={t.paper ? `rgba(${secondaryRGB},0.026)` : `rgba(${primaryRGB},0.022)`} strokeWidth="0.07" />
                    <line x1={t.x0} x2={t.x0} y1={t.y - t.tick / 2} y2={t.y + t.tick / 2} stroke={t.paper ? `rgba(${secondaryRGB},0.026)` : `rgba(${primaryRGB},0.022)`} strokeWidth="0.07" />
                    <line x1={t.x1} x2={t.x1} y1={t.y - t.tick / 2} y2={t.y + t.tick / 2} stroke={t.paper ? `rgba(${secondaryRGB},0.026)` : `rgba(${primaryRGB},0.022)`} strokeWidth="0.07" />
                  </g>
                ))}
              </>
            )}

            {isVerification && (
              <>
                {/* rounded ID-card outlines with a chip detail and two field lines */}
                {ID_CARD_OUTLINES.map((c) => (
                  <g
                    key={`idcard-${c.i}`}
                    className="iw-page-drift"
                    style={{
                      transformOrigin: `${c.cx}px ${c.cy}px`,
                      transform: `rotate(${c.rotation}deg)`,
                      animationDuration: `${c.duration}s`,
                      animationDelay: `${c.delay}s`,
                    }}
                  >
                    <rect
                      x={c.x}
                      y={c.y}
                      width={c.w}
                      height={c.h}
                      rx={1.6}
                      fill="none"
                      stroke={c.paper ? `rgba(${secondaryRGB},${c.opacity})` : `rgba(${primaryRGB},${c.opacity})`}
                      strokeWidth={0.1}
                    />
                    <rect
                      x={c.chipX}
                      y={c.chipY}
                      width={c.chipW}
                      height={c.chipH}
                      rx={0.3}
                      fill="none"
                      stroke={c.paper ? `rgba(${secondaryRGB},${c.opacity * 1.3})` : `rgba(${primaryRGB},${c.opacity * 1.3})`}
                      strokeWidth={0.08}
                    />
                    <path
                      d={c.lineD}
                      stroke={c.paper ? `rgba(${secondaryRGB},${c.opacity * 0.85})` : `rgba(${primaryRGB},${c.opacity * 0.85})`}
                      strokeWidth={0.06}
                    />
                  </g>
                ))}

                {/* confidence badges — a circle with a checkmark, fading in/hold/out */}
                {CONFIDENCE_BADGES.map((b, i) => (
                  <g key={`badge-${i}`} className="iw-cell-fade" style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}>
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={b.r}
                      fill="none"
                      stroke={b.paper ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                      strokeWidth="0.09"
                    />
                    <path
                      d={b.checkD}
                      fill="none"
                      stroke={b.paper ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                      strokeWidth="0.09"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                ))}
              </>
            )}

            {/* OCR bounding-box markers — independent field markers, not a graph */}
            {FIELD_MARKERS.map((m, i) => (
              <g
                key={`field-${i}`}
                className="animate-pulse-soft"
                style={{ animationDuration: `${m.duration}s`, animationDelay: `${m.delay}s` }}
              >
                <path
                  d={`M ${m.x} ${m.y + m.corner} L ${m.x} ${m.y} L ${m.x + m.corner} ${m.y}`}
                  fill="none"
                  stroke={m.paper ? `rgba(${secondaryRGB},0.028)` : `rgba(${primaryRGB},0.024)`}
                  strokeWidth="0.11"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${m.x + m.size - m.corner} ${m.y + m.size} L ${m.x + m.size} ${m.y + m.size} L ${m.x + m.size} ${m.y + m.size - m.corner}`}
                  fill="none"
                  stroke={m.paper ? `rgba(${secondaryRGB},0.028)` : `rgba(${primaryRGB},0.024)`}
                  strokeWidth="0.11"
                  strokeLinecap="round"
                />
              </g>
            ))}

            {/* spreadsheet cell highlights */}
            {CELL_HIGHLIGHTS.map((c, i) => (
              <rect
                key={`cell-${i}`}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                fill="none"
                stroke={`rgba(${secondaryRGB},0.026)`}
                strokeWidth="0.08"
                className="iw-cell-fade"
                style={{ animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
              />
            ))}

            {/* highlighted rows — a full row briefly selected */}
            {HIGHLIGHTED_ROWS.map((r, i) => (
              <rect
                key={`row-${i}`}
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={r.paper ? `rgba(${secondaryRGB},0.024)` : `rgba(${primaryRGB},0.02)`}
                className="iw-cell-fade"
                style={{ animationDuration: `${r.duration}s`, animationDelay: `${r.delay}s` }}
              />
            ))}

            {/* OCR overlay boxes — a recognized block, filled rather than just cornered */}
            {OCR_OVERLAY_BOXES.map((b, i) => (
              <rect
                key={`ocrbox-${i}`}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={b.paper ? `rgba(${secondaryRGB},0.022)` : `rgba(${primaryRGB},0.018)`}
                className="iw-cell-fade"
                style={{ animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
              />
            ))}
          </>
        ) : isRoutes ? (
          <>
            {/* distribution network overlays — slow concentric reach rings from the largest hubs */}
            {DISTRIBUTION_RINGS.map((r, i) => (
              <circle
                key={`dist-ring-${i}`}
                cx={r.x}
                cy={r.y}
                r={9}
                fill="none"
                stroke={r.gold ? `rgba(${secondaryRGB},0.05)` : `rgba(${primaryRGB},0.045)`}
                strokeWidth="0.15"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${r.duration}s`, animationDelay: `${r.delay}s` }}
              />
            ))}

            {/* container grid patterns — abstract stacks of shipping containers, seen from above */}
            {CONTAINER_GRID_CLUSTERS.map((c, i) => (
              <g
                key={`container-${i}`}
                className="iw-page-drift"
                style={{ transformOrigin: `${c.x}px ${c.y}px`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
              >
                {Array.from({ length: c.rows }, (_, row) =>
                  Array.from({ length: c.cols }, (_, col) => (
                    <rect
                      key={`container-${i}-${row}-${col}`}
                      x={c.x + col * (c.cellW + c.gap)}
                      y={c.y + row * (c.cellH + c.gap)}
                      width={c.cellW}
                      height={c.cellH}
                      fill="none"
                      stroke={c.gold ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                      strokeWidth="0.07"
                    />
                  ))
                )}
              </g>
            ))}

            {/* freight network mesh — orthogonal routing between hubs and cargo
               nodes, the way a logistics network diagram traces connections,
               deliberately not a flowing market line */}
            {MESH_LINKS.map((link, i) => {
              const A = MESH_NODE_POSITIONS[link.a];
              const B = MESH_NODE_POSITIONS[link.b];
              return (
                <path
                  key={`mesh-${i}`}
                  d={elbowPath(A.x, A.y, B.x, B.y, link.bend)}
                  fill="none"
                  stroke={`rgba(${primaryRGB},0.045)`}
                  strokeWidth="0.07"
                />
              );
            })}

            {/* warehouse topology — hub markers with an internal shelving tick */}
            {WAREHOUSE_HUBS.map((h, i) => (
              <g key={`hub-${i}`} className="animate-pulse-soft" style={{ animationDuration: `${h.duration}s`, animationDelay: `${h.delay}s` }}>
                <rect
                  x={h.x - h.w / 2}
                  y={h.y - h.h / 2}
                  width={h.w}
                  height={h.h}
                  rx={0.3}
                  fill="none"
                  stroke={h.gold ? `rgba(${secondaryRGB},0.2)` : `rgba(${primaryRGB},0.16)`}
                  strokeWidth="0.1"
                />
                <line
                  x1={h.x - h.w / 2 + 0.4}
                  x2={h.x + h.w / 2 - 0.4}
                  y1={h.y}
                  y2={h.y}
                  stroke={h.gold ? `rgba(${secondaryRGB},0.16)` : `rgba(${primaryRGB},0.13)`}
                  strokeWidth="0.06"
                />
              </g>
            ))}

            {/* cargo / distribution nodes — diamond geometry, distinct from the hub rectangles */}
            {CARGO_NODES.map((n, i) => (
              <rect
                key={`cargo-${i}`}
                x={n.x - n.size / 2}
                y={n.y - n.size / 2}
                width={n.size}
                height={n.size}
                transform={`rotate(45 ${n.x} ${n.y})`}
                fill={n.gold ? `rgba(${secondaryRGB},0.2)` : `rgba(${primaryRGB},0.15)`}
                className="animate-pulse-soft"
                style={{ animationDuration: `${n.duration}s`, animationDelay: `${n.delay}s` }}
              />
            ))}

            {/* GPS pulse rings at each warehouse hub */}
            {GPS_PULSE_RINGS.map((p, i) => (
              <circle
                key={`gps-${i}`}
                cx={p.x}
                cy={p.y}
                r={0.7}
                fill="none"
                stroke={p.gold ? `rgba(${secondaryRGB},0.18)` : `rgba(${primaryRGB},0.15)`}
                strokeWidth="0.12"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
              />
            ))}

            {/* shipment routes — a subset of the mesh, each carrying a single
               traveling light (GSAP motion-path, wired in the effect above) */}
            {SHIPMENT_ROUTES.map((r, i) => (
              <g key={`shipment-${r.i}`}>
                <path
                  ref={(el) => {
                    routePathRefs.current[i] = el;
                  }}
                  d={r.d}
                  fill="none"
                  stroke={r.gold ? `rgba(${secondaryRGB},0.06)` : `rgba(${primaryRGB},0.055)`}
                  strokeWidth="0.09"
                  strokeDasharray="1.2 2.4"
                  className="iw-data-drift"
                  style={{ animationDuration: `${r.dashSpeed}s` }}
                />
                <circle
                  ref={(el) => {
                    routeDotRefs.current[i] = el;
                  }}
                  r="0.5"
                  fill={r.gold ? `rgba(${secondaryRGB},0.6)` : `rgba(${primaryRGB},0.55)`}
                  style={{ opacity: 0 }}
                />
              </g>
            ))}
          </>
        ) : isNetwork ? (
          <>
            {/* knowledge-graph mesh — quiet curved connections between discovered companies */}
            {KNOWLEDGE_GRAPH_LINKS.map((link, i) => {
              const A = COMPANY_NODES[link.a];
              const B = COMPANY_NODES[link.b];
              return (
                <path
                  key={`kg-${i}`}
                  d={`M${A.x},${A.y} Q${(A.x + B.x) / 2},${(A.y + B.y) / 2 - 5} ${B.x},${B.y}`}
                  fill="none"
                  stroke={`rgba(${primaryRGB},0.035)`}
                  strokeWidth="0.07"
                />
              );
            })}

            {/* discovered-company nodes */}
            {COMPANY_NODES.map((n, i) => (
              <circle
                key={`company-${i}`}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="none"
                stroke={n.gold ? `rgba(${secondaryRGB},0.2)` : `rgba(${primaryRGB},0.16)`}
                strokeWidth="0.1"
                className="animate-pulse-soft"
                style={{ animationDuration: `${n.duration}s`, animationDelay: `${n.delay}s` }}
              />
            ))}

            {/* AI decision pulses at a subset of company nodes */}
            {DECISION_PULSE_RINGS.map((p, i) => (
              <circle
                key={`decision-${i}`}
                cx={p.x}
                cy={p.y}
                r={0.6}
                fill="none"
                stroke={p.gold ? `rgba(${secondaryRGB},0.18)` : `rgba(${primaryRGB},0.15)`}
                strokeWidth="0.11"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
              />
            ))}

            {/* CRM card outlines — small rounded records drifting gently */}
            {CRM_CARD_OUTLINES.map((c) => (
              <rect
                key={`crm-${c.i}`}
                x={c.x}
                y={c.y}
                width={c.w}
                height={c.h}
                rx={0.3}
                fill="none"
                stroke={c.gold ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                strokeWidth="0.07"
                className="iw-page-drift"
                style={{ animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
              />
            ))}

            {/* email glyphs — a simple envelope stroke, marking outreach in flight */}
            {EMAIL_GLYPHS.map((e, i) => (
              <path
                key={`email-${i}`}
                d={`M${e.x - e.size / 2},${e.y - e.size / 3} h${e.size} v${(e.size * 2) / 3} h-${e.size} Z M${e.x - e.size / 2},${e.y - e.size / 3} L${e.x},${e.y} L${e.x + e.size / 2},${e.y - e.size / 3}`}
                fill="none"
                stroke={e.gold ? `rgba(${secondaryRGB},0.16)` : `rgba(${primaryRGB},0.13)`}
                strokeWidth="0.08"
                className="animate-pulse-soft"
                style={{ animationDuration: `${e.duration}s`, animationDelay: `${e.delay}s` }}
              />
            ))}

            {/* conversation threads — a subset of the graph carrying a single traveling pulse */}
            {OUTREACH_THREADS.map((r, i) => (
              <g key={`thread-${r.i}`}>
                <path
                  ref={(el) => {
                    routePathRefs.current[i] = el;
                  }}
                  d={r.d}
                  fill="none"
                  stroke={r.gold ? `rgba(${secondaryRGB},0.06)` : `rgba(${primaryRGB},0.05)`}
                  strokeWidth="0.08"
                  strokeDasharray="1.2 2.4"
                  className="iw-data-drift"
                  style={{ animationDuration: `${r.dashSpeed}s` }}
                />
                <circle
                  ref={(el) => {
                    routeDotRefs.current[i] = el;
                  }}
                  r="0.5"
                  fill={r.gold ? `rgba(${secondaryRGB},0.6)` : `rgba(${primaryRGB},0.55)`}
                  style={{ opacity: 0 }}
                />
              </g>
            ))}
          </>
        ) : (
          <>
            {CURVE_LINES.map(({ d, dashSpeed, opacity, strokeWidth, gold, i }) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke={gold ? `rgba(${secondaryRGB},${opacity})` : `rgba(${primaryRGB},${opacity})`}
                strokeWidth={strokeWidth}
                filter={isMobile ? undefined : "url(#wb-line-blur)"}
                strokeDasharray="3 9"
                className="iw-data-drift"
                style={{ animationDuration: `${dashSpeed}s` }}
              />
            ))}
            {TREND_LINES.map(({ d, dashSpeed, opacity, strokeWidth, gold, i }) => (
              <path
                key={`trend-${i}`}
                d={d}
                fill="none"
                stroke={gold ? `rgba(${secondaryRGB},${opacity})` : `rgba(${primaryRGB},${opacity})`}
                strokeWidth={strokeWidth}
                strokeDasharray="1 6"
                className="iw-data-drift"
                style={{ animationDuration: `${dashSpeed}s` }}
              />
            ))}

            {SIGNAL_TICKS.map((t, i) => (
              <line
                key={`t-${i}`}
                x1={`${t.x}%`}
                y1={`${t.y}%`}
                x2={`${t.x + t.width * 0.01 * 100}%`}
                y2={`${t.y}%`}
                stroke={`rgba(${primaryRGB},${t.opacity})`}
                strokeWidth="0.1"
                style={{
                  animation: `iw-tick-pulse 8s ease-in-out ${t.delay}s infinite, iw-ticker-drift ${7 + (i % 4)}s ease-in-out infinite`,
                }}
              />
            ))}

            {NETWORK_LINKS.map(([a, b], i) => {
              const A = NETWORK_NODES[a];
              const B = NETWORK_NODES[b];
              return (
                <line
                  key={`link-${i}`}
                  x1={`${A.x}%`}
                  y1={`${A.y}%`}
                  x2={`${B.x}%`}
                  y2={`${B.y}%`}
                  stroke={`rgba(${primaryRGB},0.05)`}
                  strokeWidth="0.08"
                />
              );
            })}
            {NETWORK_NODES.map((n, i) => (
              <circle
                key={`node-${i}`}
                cx={`${n.x}%`}
                cy={`${n.y}%`}
                r={n.r}
                fill={n.gold ? `rgba(${secondaryRGB},0.22)` : `rgba(${primaryRGB},0.16)`}
                className="animate-pulse-soft"
                style={{ animationDuration: `${6 + (i % 5)}s`, animationDelay: `${i * 0.6}s` }}
              />
            ))}

            {DATA_PULSES.map((p, i) => (
              <circle
                key={`pulse-${i}`}
                cx={`${p.x}%`}
                cy={`${p.y}%`}
                r={0.6}
                fill="none"
                stroke={p.gold ? `rgba(${secondaryRGB},0.16)` : `rgba(${primaryRGB},0.14)`}
                strokeWidth="0.12"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
              />
            ))}
          </>
        )}
      </svg>

      {/* Layer 4: occasional numeric pulses — computation happening just out of focus (shared) */}
      <div className="absolute inset-0">
        {NUMERIC_PULSES_SEED.map((n, i) => (
          <span
            key={i}
            className="iw-numeric-pulse absolute font-mono"
            style={{
              left: `${n.x}%`,
              top: `${n.y}%`,
              fontSize: "10px",
              letterSpacing: "0.08em",
              color: n.gold ? `rgba(${secondaryRGB},0.5)` : `rgba(${primaryRGB},0.5)`,
              animationDelay: `${n.delay}s`,
              animationDuration: `${n.duration}s`,
            }}
          >
            {numericPool[n.index % numericPool.length]}
          </span>
        ))}
      </div>

      {/* Layer 4b: paper-like motifs = OCR/scan recognition particles (flash in
         place, no directional drift); curves = ticker particles (sideways drift) */}
      <div className="absolute inset-0">
        {isPaperLike
          ? OCR_PARTICLES.map((t, i) => (
              <span
                key={`ocr-${i}`}
                className="iw-ocr-particle absolute"
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                  background: t.paper ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`,
                  animationDuration: `${t.duration}s`,
                  animationDelay: `${t.delay}s`,
                }}
              />
            ))
          : isRoutes
          ? SHIPMENT_FLOW_PARTICLES.map((t, i) => (
              <span
                key={`flow-${i}`}
                className="iw-particle absolute rounded-full"
                style={
                  {
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: `${t.size}px`,
                    height: `${t.size}px`,
                    background: t.gold ? `rgba(${secondaryRGB},0.32)` : `rgba(${primaryRGB},0.28)`,
                    animationDuration: `${t.duration}s`,
                    animationDelay: `${t.delay}s`,
                    "--dx": `${t.driftX}px`,
                    "--dy": `${t.driftY}px`,
                  } as React.CSSProperties
                }
              />
            ))
          : TICKER_PARTICLES.map((t, i) => (
              <span
                key={`ticker-${i}`}
                className="iw-ticker-particle absolute rounded-full"
                style={{
                  left: `${t.x}%`,
                  top: `${t.y}%`,
                  width: `${t.size}px`,
                  height: `${t.size}px`,
                  background: t.gold ? `rgba(${secondaryRGB},0.35)` : `rgba(${primaryRGB},0.3)`,
                  animationDuration: `${t.duration}s`,
                  animationDelay: `${t.delay}s`,
                }}
              />
            ))}
      </div>

      {/* Layer 4c: paper-like motifs — a slow vertical scanner sweep */}
      {isPaperLike && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="iw-scan-line absolute inset-x-0"
            style={{
              height: "160px",
              background: `linear-gradient(to bottom, transparent, rgba(${primaryRGB},0.022) 45%, rgba(${secondaryRGB},0.028) 50%, rgba(${primaryRGB},0.022) 55%, transparent)`,
            }}
          />
        </div>
      )}

      {/* Layer 5: depth particles — shared, neutral ambient dust */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            ref={(el) => {
              particleRefs.current[i] = el;
            }}
            className="iw-particle absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.layer === "near" ? `rgba(${primaryRGB},0.9)` : `rgba(${primaryRGB},0.7)`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              filter: p.layer === "far" ? "blur(0.5px)" : "none",
              opacity: 0,
              transform: "scale(0.4)",
              "--dx": `${p.driftX}px`,
              "--dy": `${p.driftY}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Layer 6: volumetric glow — primary + secondary accent (shared mechanic) */}
      <div
        ref={glowRef}
        className="absolute"
        style={{
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: "min(95vw, 1000px)",
          height: "min(95vw, 900px)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 45%, rgba(${glowPrimaryRGB},0.5) 0%, rgba(${glowPrimaryRGB},0.28) 38%, transparent 68%)`,
          filter: isMobile ? "blur(40px)" : "blur(90px)",
        }}
      />
      <div
        ref={glowGoldRef}
        className="absolute opacity-30"
        style={{
          left: "62%",
          top: "62%",
          transform: "translate(-50%, -50%)",
          width: "min(60vw, 640px)",
          height: "min(60vw, 560px)",
          borderRadius: "50%",
          background: `radial-gradient(ellipse at 50% 50%, rgba(${secondaryRGB},0.05) 0%, transparent 60%)`,
          filter: isMobile ? "blur(45px)" : "blur(100px)",
        }}
      />
    </div>
  );
}
