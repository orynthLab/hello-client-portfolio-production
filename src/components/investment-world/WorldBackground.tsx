"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { prefersReducedMotion, isMobileViewport } from "./motion";
import { useIsMobile } from "@/components/useIsMobile";
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

// ---------------------------------------------------------------------------
// corridors motif — Africa One.
//
// A financial network seen from a long way off: markets of differing weight,
// the corridors between them, value travelling those corridors, and the quiet
// settlement marks left behind. Deliberately abstract — no map outline, no
// dashboard, no charts. The point is the topology, not the geography.
// ---------------------------------------------------------------------------

/** Markets. A handful carry more weight than the rest, the way real corridors
 *  concentrate around a few hubs. */
const MARKET_NODES = (() => {
  const rand = seededRandom(614);
  return Array.from({ length: 17 }, (_, i) => ({
    x: 8 + rand() * 84,
    y: 10 + rand() * 78,
    // a few majors, the rest secondary
    r: i % 5 === 0 ? 0.5 + rand() * 0.3 : 0.2 + rand() * 0.2,
    major: i % 5 === 0,
    gold: i % 4 === 1,
    duration: 7 + rand() * 7,
    delay: rand() * 8,
    i,
  }));
})();

/** Which markets are connected.
 *
 *  Nearest-neighbour, with a hard distance cap. Linking markets by index — the
 *  obvious approach — connects nodes that happen to sit at opposite corners and
 *  produces long diagonals straight across the viewport, which read as generic
 *  decorative lines rather than as a network. Short local hops between nearby
 *  markets read as infrastructure. */
const CORRIDOR_LINKS = (() => {
  const rand = seededRandom(2081);
  const MAX_SPAN = 26;
  const out: { a: number; b: number; lift: number }[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < MARKET_NODES.length; i++) {
    const A = MARKET_NODES[i];
    const near = MARKET_NODES.map((B, j) => ({ j, d: Math.hypot(B.x - A.x, B.y - A.y) }))
      .filter((n) => n.j !== i && n.d < MAX_SPAN)
      .sort((p, q) => p.d - q.d)
      .slice(0, A.major ? 3 : 2);

    for (const n of near) {
      const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // curvature scales with span, so short hops stay nearly straight
      out.push({ a: i, b: n.j, lift: n.d * (0.1 + rand() * 0.12) });
    }
  }
  return out;
})();

const CORRIDOR_ARCS = (() => {
  const rand = seededRandom(931);
  return CORRIDOR_LINKS.map((link, i) => {
    const A = MARKET_NODES[link.a];
    const B = MARKET_NODES[link.b];
    return {
      d: `M${A.x},${A.y} Q${(A.x + B.x) / 2},${(A.y + B.y) / 2 - link.lift} ${B.x},${B.y}`,
      opacity: 0.022 + rand() * 0.026,
      gold: i % 4 === 0,
      i,
    };
  });
})();

/** Multi-currency balance stacks.
 *
 *  A few short bars of differing length beside a major market — one account
 *  holding several currencies at once, which is the entire premise of the
 *  product. Reads as structure, not as a chart: no axes, no labels, no scale. */
const BALANCE_STACKS = (() => {
  const rand = seededRandom(8802);
  return MARKET_NODES.filter((n) => n.major).map((n, i) => ({
    i,
    x: n.x + 1.4,
    y: n.y + 1.1,
    duration: 12 + rand() * 9,
    delay: rand() * 11,
    bars: Array.from({ length: 3 + Math.floor(rand() * 2) }, (_, b) => ({
      b,
      w: 0.9 + rand() * 3.2,
      gold: b === 1,
    })),
  }));
})();

/** Double-entry marks.
 *
 *  Every debit has a matching credit — the oldest idea in accounting and the
 *  one thing that actually distinguishes a financial system from a messaging
 *  system. Drawn as a pair of ticks mirrored across a hairline, so the
 *  symmetry is the only thing that registers. */
const DOUBLE_ENTRIES = (() => {
  const rand = seededRandom(6410);
  return Array.from({ length: 9 }, (_, i) => ({
    i,
    x: 9 + rand() * 78,
    y: 14 + rand() * 68,
    w: 2.2 + rand() * 2.8,
    gap: 0.75 + rand() * 0.5,
    gold: i % 3 === 0,
    duration: 10 + rand() * 9,
    delay: rand() * 11,
  }));
})();

/** Ledger structures — small stacks of short rules, the shape of an account
 *  statement seen from far enough away that only its rhythm survives. */
const LEDGER_BLOCKS = (() => {
  const rand = seededRandom(3312);
  return Array.from({ length: 6 }, (_, b) => {
    const x = 7 + rand() * 78;
    const y = 12 + rand() * 70;
    const rows = 3 + Math.floor(rand() * 4);
    return {
      b,
      gold: b % 3 === 0,
      duration: 13 + rand() * 10,
      delay: rand() * 12,
      rows: Array.from({ length: rows }, (_, r) => ({
        r,
        x,
        y: y + r * 1.5,
        w: 2.6 + rand() * 5.4,
      })),
    };
  });
})();

/** The corridors currently carrying value — a small subset, each with one
 *  travelling mark. Same shape the routes and network motifs use, so the
 *  existing MotionPath loop drives these without knowing what they are. */
const VALUE_FLOWS = (() => {
  const rand = seededRandom(1777);
  return CORRIDOR_LINKS.slice(0, 5).map((link, i) => {
    const A = MARKET_NODES[link.a];
    const B = MARKET_NODES[link.b];
    return {
      d: `M${A.x},${A.y} Q${(A.x + B.x) / 2},${(A.y + B.y) / 2 - link.lift} ${B.x},${B.y}`,
      dashSpeed: 9 + rand() * 6,
      // Slow: a transfer crossing the field should take long enough that the
      // eye never tracks it, only registers that something moved.
      travelDuration: 17 + rand() * 11,
      travelDelay: rand() * 15,
      // Transfers are not all the same size. Varying the travelling mark's
      // radius is the quietest way to say that a corridor carries value of
      // differing weight, without putting a number anywhere near it.
      weight: 0.3 + rand() * 0.34,
      gold: i % 3 === 0,
      i,
    };
  });
})();

/** Settlement ticks: a short mark beside a market, the trace of a corridor
 *  clearing. Static geometry, animated only by opacity. */
const SETTLEMENT_TICKS = (() => {
  const rand = seededRandom(455);
  return MARKET_NODES.filter((_, i) => i % 2 === 0).map((n, i) => ({
    x: n.x + 1.6,
    y: n.y - 1.2,
    w: 1.4 + rand() * 2.2,
    gold: i % 3 === 0,
    duration: 9 + rand() * 8,
    delay: rand() * 9,
    i,
  }));
})();

/** Account/wallet outlines — small rounded rectangles, barely there. */
const ACCOUNT_OUTLINES = (() => {
  const rand = seededRandom(1290);
  return Array.from({ length: 7 }, (_, i) => ({
    x: 6 + rand() * 82,
    y: 12 + rand() * 74,
    w: 3.4 + rand() * 2.6,
    h: 2.2 + rand() * 1.4,
    gold: i % 3 === 0,
    duration: 11 + rand() * 9,
    delay: rand() * 10,
    i,
  }));
})();

// ---------------------------------------------------------------------------
// instruments motif — Aviation Preparation Academy.
//
// The quiet precision of flight training, at a distance: waypoints on gentle
// course lines, heading and altitude reference marks, instrument arc scales,
// and readiness ticks. No aircraft, no runway, no HUD — the discipline of the
// instruments, not a picture of flying.
// ---------------------------------------------------------------------------

/** Waypoints. Sparse and roughly aligned along courses, the way navigation
 *  fixes sit — not scattered at random. */
const WAYPOINTS = (() => {
  const rand = seededRandom(3140);
  return Array.from({ length: 14 }, (_, i) => ({
    i,
    x: 7 + rand() * 82,
    y: 11 + rand() * 76,
    r: i % 4 === 0 ? 0.42 : 0.24,
    major: i % 4 === 0,
    warm: i % 6 === 2,
    duration: 9 + rand() * 8,
    delay: rand() * 9,
  }));
})();

/** Course legs between consecutive waypoints — long, shallow, deliberate. */
const COURSE_LEGS = (() => {
  const rand = seededRandom(7705);
  const out: { i: number; d: number[]; warm: boolean; opacity: number }[] = [];
  for (let i = 0; i < WAYPOINTS.length - 1; i += 2) {
    const A = WAYPOINTS[i];
    const B = WAYPOINTS[i + 1];
    out.push({
      i,
      d: [A.x, A.y, B.x, B.y],
      warm: i % 6 === 0,
      opacity: 0.026 + rand() * 0.024,
    });
  }
  return out;
})();

/** Flight paths — a few long, very shallow arcs carrying a travelling mark.
 *  Same shape the other motifs use, so the existing MotionPath loop drives
 *  these without knowing what they are. */
const FLIGHT_PATHS = (() => {
  const rand = seededRandom(9021);
  return Array.from({ length: 4 }, (_, i) => {
    const y = 20 + i * 19 + rand() * 6;
    const x0 = -4 + rand() * 10;
    const x1 = 96 + rand() * 8;
    const lift = 7 + rand() * 10;
    return {
      i,
      d: `M${x0},${y} Q${(x0 + x1) / 2},${y - lift} ${x1},${y - rand() * 8}`,
      travelDuration: 22 + rand() * 14,
      travelDelay: rand() * 18,
      warm: i === 1,
    };
  });
})();

/** Instrument arc scales — a graduated arc with tick marks, the face of a
 *  heading or attitude indicator reduced to its geometry. */
const INSTRUMENT_ARCS = (() => {
  const rand = seededRandom(5560);
  return Array.from({ length: 3 }, (_, i) => {
    const cx = 14 + rand() * 70;
    const cy = 16 + rand() * 64;
    const r = 7 + rand() * 6;
    const start = rand() * Math.PI * 2;
    const span = 1.1 + rand() * 1.3;
    const ticks = 7 + Math.floor(rand() * 5);
    return {
      i,
      cx,
      cy,
      r,
      warm: i === 1,
      duration: 14 + rand() * 10,
      delay: rand() * 12,
      d:
        `M${(cx + Math.cos(start) * r).toFixed(2)},${(cy + Math.sin(start) * r).toFixed(2)} ` +
        `A${r},${r} 0 0 1 ${(cx + Math.cos(start + span) * r).toFixed(2)},${(cy + Math.sin(start + span) * r).toFixed(2)}`,
      ticks: Array.from({ length: ticks }, (_, t) => {
        const a = start + (t / (ticks - 1)) * span;
        const long = t % 3 === 0;
        const inner = r - (long ? 1.5 : 0.8);
        return {
          t,
          x1: cx + Math.cos(a) * inner,
          y1: cy + Math.sin(a) * inner,
          x2: cx + Math.cos(a) * r,
          y2: cy + Math.sin(a) * r,
          long,
        };
      }),
    };
  });
})();

/** Altitude references — stacked horizontal rules with a graduated edge, the
 *  shape of an altimeter tape rather than a chart. */
const ALTITUDE_TAPES = (() => {
  const rand = seededRandom(4471);
  return Array.from({ length: 4 }, (_, i) => {
    const x = 8 + rand() * 78;
    const y = 14 + rand() * 66;
    const rows = 4 + Math.floor(rand() * 4);
    return {
      i,
      warm: i % 3 === 1,
      duration: 12 + rand() * 9,
      delay: rand() * 11,
      rows: Array.from({ length: rows }, (_, r) => ({
        r,
        x,
        y: y + r * 1.4,
        w: r % 2 === 0 ? 2.6 + rand() * 1.8 : 1.3 + rand() * 0.9,
      })),
    };
  });
})();

/** Readiness ticks — a short run of marks where the leading few are filled.
 *  Progress toward ready, stated as geometry and nothing more. */
const READINESS_MARKS = (() => {
  const rand = seededRandom(6152);
  return Array.from({ length: 5 }, (_, i) => {
    const total = 5 + Math.floor(rand() * 4);
    const filled = 2 + Math.floor(rand() * (total - 2));
    const x = 10 + rand() * 74;
    const y = 16 + rand() * 66;
    return {
      i,
      x,
      y,
      warm: i % 2 === 0,
      duration: 11 + rand() * 9,
      delay: rand() * 10,
      marks: Array.from({ length: total }, (_, m) => ({ m, on: m < filled })),
    };
  });
})();

export default function WorldBackground({ theme }: { theme: WorldTheme }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowGoldRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const routePathRefs = useRef<(SVGPathElement | null)[]>([]);
  const routeDotRefs = useRef<(SVGCircleElement | null)[]>([]);
  // Assumed desktop for SSR/first paint, then settles before the entrance
  // timeline below actually starts animating. The mobile branch here only
  // thins out an already-rendered scene, so starting from the fuller desktop
  // composition and reducing is the right way round — see useIsMobile.
  const isMobile = useIsMobile(false);

  const { primaryRGB, glowPrimaryRGB, secondaryRGB, numericPool, motif } = theme;
  const isDocuments = motif === "documents";
  const isVerification = motif === "verification";
  const isRoutes = motif === "routes";
  const isNetwork = motif === "network";
  const isCorridors = motif === "corridors";
  const isInstruments = motif === "instruments";
  // Memoized so it can be a real dependency of the entrance effect below
  // without the empty-array branch producing a new identity every render.
  const routeSpecs = useMemo(
    () =>
      isRoutes
        ? SHIPMENT_ROUTES
        : isNetwork
        ? OUTREACH_THREADS
        : isCorridors
        ? VALUE_FLOWS
        : isInstruments
        ? FLIGHT_PATHS
        : [],
    [isRoutes, isNetwork, isCorridors, isInstruments]
  );
  // Elements shared by both "paper" motifs (ledger/blueprint lines, bounding-box
  // markers, cell highlights, overlay boxes, scan particles, scanner sweep) —
  // only the documents-only (page fold, accounting tables) and
  // verification-only (ID cards, confidence badges, watermark) pieces diverge.
  const isPaperLike = isDocuments || isVerification;

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

        if (isRoutes || isNetwork || isCorridors || isInstruments) {
          routePathRefs.current.forEach((path, i) => {
            const dot = routeDotRefs.current[i];
            const spec = routeSpecs[i];
            if (!path || !dot || !spec) return;
            gsap.set(dot, { opacity: 0.85 });
            gsap.to(dot, {
              motionPath: {
                path,
                align: path,
                alignOrigin: [0.5, 0.5],
                // Instruments alone banks its travelling mark to face the
                // direction of travel: the mark is a delta, and a delta that
                // doesn't point where it's going reads as a bug. Every other
                // motif's mark is a circle, where rotation is invisible.
                autoRotate: isInstruments,
              },
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
  }, [isRoutes, isNetwork, isCorridors, isInstruments, routeSpecs]);

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
        ) : isInstruments ? (
          <>
            {/* course legs — long, shallow, deliberate */}
            {COURSE_LEGS.map((l) => (
              <line
                key={`leg-${l.i}`}
                x1={l.d[0]}
                y1={l.d[1]}
                x2={l.d[2]}
                y2={l.d[3]}
                stroke={l.warm ? `rgba(${secondaryRGB},${l.opacity})` : `rgba(${primaryRGB},${l.opacity})`}
                strokeWidth="0.06"
                strokeDasharray="2.4 3.2"
              />
            ))}

            {/* instrument arc scales — a graduated arc reduced to geometry */}
            {INSTRUMENT_ARCS.map((a) => (
              <g
                key={`arc-${a.i}`}
                className="iw-page-drift"
                style={{ animationDuration: `${a.duration}s`, animationDelay: `${a.delay}s` }}
              >
                <path
                  d={a.d}
                  fill="none"
                  stroke={a.warm ? `rgba(${secondaryRGB},0.05)` : `rgba(${primaryRGB},0.04)`}
                  strokeWidth="0.08"
                />
                {a.ticks.map((t) => (
                  <line
                    key={`arc-${a.i}-${t.t}`}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={a.warm ? `rgba(${secondaryRGB},${t.long ? 0.07 : 0.04})` : `rgba(${primaryRGB},${t.long ? 0.06 : 0.034})`}
                    strokeWidth="0.07"
                  />
                ))}
              </g>
            ))}

            {/* altitude tapes — graduated stacks, not charts */}
            {ALTITUDE_TAPES.map((tape) => (
              <g
                key={`alt-${tape.i}`}
                className="iw-page-drift"
                style={{ animationDuration: `${tape.duration}s`, animationDelay: `${tape.delay}s` }}
              >
                {tape.rows.map((row) => (
                  <line
                    key={`alt-${tape.i}-${row.r}`}
                    x1={row.x}
                    y1={row.y}
                    x2={row.x + row.w}
                    y2={row.y}
                    stroke={tape.warm ? `rgba(${secondaryRGB},0.032)` : `rgba(${primaryRGB},0.028)`}
                    strokeWidth="0.07"
                  />
                ))}
              </g>
            ))}

            {/* readiness — a short run of marks, the leading few filled */}
            {READINESS_MARKS.map((r) => (
              <g
                key={`ready-${r.i}`}
                className="iw-cell-fade"
                style={{ animationDuration: `${r.duration}s`, animationDelay: `${r.delay}s` }}
              >
                {r.marks.map((m) => (
                  <rect
                    key={`ready-${r.i}-${m.m}`}
                    x={r.x + m.m * 1.15}
                    y={r.y}
                    width={0.55}
                    height={0.55}
                    fill={
                      m.on
                        ? r.warm
                          ? `rgba(${secondaryRGB},0.13)`
                          : `rgba(${primaryRGB},0.11)`
                        : "none"
                    }
                    stroke={r.warm ? `rgba(${secondaryRGB},0.06)` : `rgba(${primaryRGB},0.05)`}
                    strokeWidth="0.05"
                  />
                ))}
              </g>
            ))}

            {/* waypoints — navigation fixes, a few weighted heavier */}
            {WAYPOINTS.map((w) => (
              <g key={`wp-${w.i}`}>
                <path
                  d={`M${w.x},${w.y - w.r * 1.7} L${w.x + w.r * 1.7},${w.y} L${w.x},${w.y + w.r * 1.7} L${w.x - w.r * 1.7},${w.y} Z`}
                  fill="none"
                  stroke={w.warm ? `rgba(${secondaryRGB},${w.major ? 0.17 : 0.1})` : `rgba(${primaryRGB},${w.major ? 0.15 : 0.09})`}
                  strokeWidth="0.08"
                  className="animate-pulse-soft"
                  style={{ animationDuration: `${w.duration}s`, animationDelay: `${w.delay}s` }}
                />
              </g>
            ))}

            {/* position pulses — a slow expanding ring at the major fixes,
               the way a position report registers and fades */}
            {WAYPOINTS.filter((w) => w.major).map((w) => (
              <circle
                key={`ping-${w.i}`}
                cx={w.x}
                cy={w.y}
                r={1.5}
                fill="none"
                stroke={w.warm ? `rgba(${secondaryRGB},0.1)` : `rgba(${primaryRGB},0.085)`}
                strokeWidth="0.07"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${8 + w.i * 1.4}s`, animationDelay: `${w.delay}s` }}
              />
            ))}

            {/* heading needle — one arc carries a needle that sweeps its
               scale, slowly and continuously, the way a heading indicator
               settles rather than snaps */}
            {INSTRUMENT_ARCS.slice(0, 1).map((a) => (
              <g key={`needle-${a.i}`} style={{ transformOrigin: `${a.cx}px ${a.cy}px` }}>
                <line
                  x1={a.cx}
                  y1={a.cy}
                  x2={a.cx}
                  y2={a.cy - a.r * 0.82}
                  stroke={`rgba(${secondaryRGB},0.1)`}
                  strokeWidth="0.09"
                  strokeLinecap="round"
                  className="iw-heading-needle"
                  style={{ transformOrigin: `${a.cx}px ${a.cy}px` }}
                />
                <circle cx={a.cx} cy={a.cy} r={0.22} fill={`rgba(${secondaryRGB},0.12)`} />
              </g>
            ))}

            {/* flight paths — long shallow arcs, each carrying one aircraft
               mark. A delta rather than a dot, banked to its heading by the
               MotionPath autoRotate above: abstract, never a cartoon plane. */}
            {FLIGHT_PATHS.map((p, i) => (
              <g key={`fp-${p.i}`}>
                <path
                  ref={(el) => {
                    routePathRefs.current[i] = el;
                  }}
                  d={p.d}
                  fill="none"
                  stroke={p.warm ? `rgba(${secondaryRGB},0.04)` : `rgba(${primaryRGB},0.032)`}
                  strokeWidth="0.07"
                  strokeDasharray="1.6 2.2"
                />
                <path
                  ref={(el) => {
                    routeDotRefs.current[i] = el as unknown as SVGCircleElement;
                  }}
                  d="M0.85,0 L-0.55,0.5 L-0.28,0 L-0.55,-0.5 Z"
                  fill={p.warm ? `rgba(${secondaryRGB},0.55)` : `rgba(${primaryRGB},0.48)`}
                  style={{ opacity: 0 }}
                />
              </g>
            ))}
          </>
        ) : isCorridors ? (
          <>
            {/* Corridor arcs — the relationships between markets. Deliberately
               static hairlines: the network is standing infrastructure, and
               animating the lines themselves is what made them read as
               decorative streaks. The only motion here is value in transit,
               travelling a handful of them below. */}
            {CORRIDOR_ARCS.map((c) => (
              <path
                key={`corridor-${c.i}`}
                d={c.d}
                fill="none"
                stroke={c.gold ? `rgba(${secondaryRGB},${c.opacity})` : `rgba(${primaryRGB},${c.opacity})`}
                strokeWidth="0.06"
              />
            ))}

            {/* ledger blocks — the rhythm of a statement, not its contents */}
            {LEDGER_BLOCKS.map((blk) => (
              <g
                key={`ledger-${blk.b}`}
                className="iw-page-drift"
                style={{ animationDuration: `${blk.duration}s`, animationDelay: `${blk.delay}s` }}
              >
                {blk.rows.map((row) => (
                  <line
                    key={`ledger-${blk.b}-${row.r}`}
                    x1={row.x}
                    y1={row.y}
                    x2={row.x + row.w}
                    y2={row.y}
                    stroke={blk.gold ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                    strokeWidth="0.07"
                  />
                ))}
              </g>
            ))}

            {/* account outlines — wallets held in those markets */}
            {ACCOUNT_OUTLINES.map((a) => (
              <rect
                key={`acct-${a.i}`}
                x={a.x}
                y={a.y}
                width={a.w}
                height={a.h}
                rx={0.35}
                fill="none"
                stroke={a.gold ? `rgba(${secondaryRGB},0.03)` : `rgba(${primaryRGB},0.026)`}
                strokeWidth="0.07"
                className="iw-page-drift"
                style={{ animationDuration: `${a.duration}s`, animationDelay: `${a.delay}s` }}
              />
            ))}

            {/* balance stacks — one account, several currencies at once */}
            {BALANCE_STACKS.map((s) => (
              <g
                key={`bal-${s.i}`}
                className="iw-page-drift"
                style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
              >
                {s.bars.map((bar) => (
                  <line
                    key={`bal-${s.i}-${bar.b}`}
                    x1={s.x}
                    y1={s.y + bar.b * 0.9}
                    x2={s.x + bar.w}
                    y2={s.y + bar.b * 0.9}
                    stroke={bar.gold ? `rgba(${secondaryRGB},0.10)` : `rgba(${primaryRGB},0.082)`}
                    strokeWidth="0.32"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            ))}

            {/* double entry — a debit and its matching credit, mirrored */}
            {DOUBLE_ENTRIES.map((d) => (
              <g
                key={`entry-${d.i}`}
                className="iw-cell-fade"
                style={{ animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }}
              >
                <line
                  x1={d.x}
                  y1={d.y - d.gap}
                  x2={d.x + d.w}
                  y2={d.y - d.gap}
                  stroke={d.gold ? `rgba(${secondaryRGB},0.12)` : `rgba(${primaryRGB},0.10)`}
                  strokeWidth="0.09"
                />
                <line
                  x1={d.x}
                  y1={d.y}
                  x2={d.x + d.w * 1.25}
                  y2={d.y}
                  stroke={`rgba(${primaryRGB},0.022)`}
                  strokeWidth="0.05"
                />
                <line
                  x1={d.x}
                  y1={d.y + d.gap}
                  x2={d.x + d.w}
                  y2={d.y + d.gap}
                  stroke={d.gold ? `rgba(${secondaryRGB},0.12)` : `rgba(${primaryRGB},0.10)`}
                  strokeWidth="0.09"
                />
              </g>
            ))}

            {/* settlement ticks — the mark a cleared corridor leaves behind */}
            {SETTLEMENT_TICKS.map((s) => (
              <line
                key={`settle-${s.i}`}
                x1={s.x}
                y1={s.y}
                x2={s.x + s.w}
                y2={s.y}
                stroke={s.gold ? `rgba(${secondaryRGB},0.15)` : `rgba(${primaryRGB},0.13)`}
                strokeWidth="0.08"
                className="iw-cell-fade"
                style={{ animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s` }}
              />
            ))}

            {/* transaction pulses — a ring expanding out of a major market as
               value lands there. The same device the logistics world uses for
               a GPS ping; here it is money arriving, and it is what makes the
               network read as live rather than drawn. */}
            {MARKET_NODES.filter((n) => n.major).map((n) => (
              <circle
                key={`tx-${n.i}`}
                cx={n.x}
                cy={n.y}
                r={1.7}
                fill="none"
                stroke={n.gold ? `rgba(${secondaryRGB},0.13)` : `rgba(${primaryRGB},0.11)`}
                strokeWidth="0.08"
                className="iw-data-pulse-ring"
                style={{ animationDuration: `${7 + n.i * 1.1}s`, animationDelay: `${n.delay}s` }}
              />
            ))}

            {/* markets — a few majors carrying the weight, the rest secondary */}
            {MARKET_NODES.map((n) => (
              <circle
                key={`market-${n.i}`}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={n.gold ? `rgba(${secondaryRGB},${n.major ? 0.2 : 0.11})` : `rgba(${primaryRGB},${n.major ? 0.18 : 0.1})`}
                className="animate-pulse-soft"
                style={{ animationDuration: `${n.duration}s`, animationDelay: `${n.delay}s` }}
              />
            ))}

            {/* value in flight — the corridors currently carrying a transfer */}
            {VALUE_FLOWS.map((r, i) => (
              <g key={`flow-${r.i}`}>
                <path
                  ref={(el) => {
                    routePathRefs.current[i] = el;
                  }}
                  d={r.d}
                  fill="none"
                  stroke={r.gold ? `rgba(${secondaryRGB},0.055)` : `rgba(${primaryRGB},0.045)`}
                  strokeWidth="0.08"
                />
                <circle
                  ref={(el) => {
                    routeDotRefs.current[i] = el;
                  }}
                  r={r.weight}
                  fill={r.gold ? `rgba(${secondaryRGB},0.5)` : `rgba(${primaryRGB},0.44)`}
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
          : isRoutes || isCorridors || isInstruments
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

      {/* Layer 4d: corridors — the settlement window.
         A batch clearing cycle passing over the network: everything it crosses
         is, for that moment, being settled. Reuses the same sweep the paper
         motifs use for scanning, at roughly a third of the speed and half the
         intensity, so it reads as a cycle rather than as a scanner. */}
      {isCorridors && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="iw-scan-line absolute inset-x-0"
            style={{
              height: "300px",
              animationDuration: "68s",
              background: `linear-gradient(to bottom, transparent, rgba(${primaryRGB},0.012) 40%, rgba(${secondaryRGB},0.016) 50%, rgba(${primaryRGB},0.012) 60%, transparent)`,
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
