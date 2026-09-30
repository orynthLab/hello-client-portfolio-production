import { projects, metaSystem } from "@/data/projects";

// ---------------------------------------------------------------------------
// The Core's data layer.
//
// Everything the particle universe knows about "a project" comes from here,
// and here reads exclusively from src/data/projects.ts. Nothing in the Core
// is keyed to a project count, a slug, or a position: adding an entry to
// `projects` gives it a cluster, a generated position, an accent, hover and
// click behavior automatically. There is deliberately no per-project branch
// anywhere in src/components/core/.
// ---------------------------------------------------------------------------

export type UniverseNode = {
  slug: string;
  /** zero-padded position, "01".."08" — shown beside the name on the card */
  index: string;
  /** full name, shown in the hover card */
  name: string;
  /** short label rendered under the cluster once the universe settles */
  shortTitle: string;
  /** one line under the name in the hover card */
  subtitle: string;
  /** one verb — GROW, MOVE, VERIFY — the fastest read of what this system does */
  verb: string;
  accent: string;
  href: string;
  /** the portfolio's own closing chapter — rendered quieter than client work */
  isMeta: boolean;
};

/** Last-resort short label for a project whose data doesn't supply one:
 *  keep the final two words, which for this portfolio's naming convention
 *  ("... Intelligence Engine", "... Operations Hub") is the distinctive part. */
function deriveShortTitle(name: string) {
  const words = name.split(/\s+/);
  return words.length <= 2 ? name : words.slice(-2).join(" ");
}

export function buildUniverse(): UniverseNode[] {
  const clientWork: UniverseNode[] = projects.map((p) => ({
    slug: p.slug,
    index: String(p.order).padStart(2, "0"),
    name: p.name,
    shortTitle: p.shortTitle ?? deriveShortTitle(p.name),
    subtitle: p.category,
    verb: p.verb,
    accent: p.accent,
    href: `/projects/${p.slug}`,
    isMeta: false,
  }));

  // `order` is the single source of truth for position — the array's own
  // order is incidental. Reordering the portfolio is a data change.
  return [
    ...clientWork,
    {
      slug: metaSystem.slug,
      index: String(metaSystem.order).padStart(2, "0"),
      name: metaSystem.name,
      shortTitle: metaSystem.shortTitle ?? deriveShortTitle(metaSystem.name),
      subtitle: metaSystem.hoverText,
      verb: metaSystem.verb,
      accent: metaSystem.accent,
      href: `/projects/${metaSystem.slug}`,
      isMeta: true,
    },
  ].sort((a, b) => Number(a.index) - Number(b.index));
}

// ---------------------------------------------------------------------------
// Deterministic organic layout.
//
// A golden-angle (phyllotaxis) distribution: the same arrangement sunflower
// seeds use. It reads as organic rather than arranged, never produces the
// radial spokes / wheel / ring the brief rules out, and is defined purely as
// a function of index and count — so it scales from 6 clusters to 30 with no
// change, and the same project lands in the same region every activation.
// ---------------------------------------------------------------------------

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type LayoutPoint = { x: number; y: number; z: number };

export type LayoutOptions = {
  /** viewport aspect (w/h) — widens the field on desktop, tightens it on phones */
  aspect: number;
  /** how far the outermost cluster may sit from center, in normalized units */
  maxRadius?: number;
  /** keeps the innermost cluster off the exact center, where the Core was */
  minRadius?: number;
  /** minimum normalized gap enforced between any two clusters */
  separation?: number;
};

/**
 * Positions `count` clusters in normalized space, where (0,0) is the Core's
 * origin and 1 is the shorter half-axis of the field. Deterministic: same
 * inputs always produce the same output.
 */
export function layoutClusters(count: number, opts: LayoutOptions): LayoutPoint[] {
  if (count === 0) return [];

  const { aspect } = opts;
  const maxRadius = opts.maxRadius ?? 0.86;
  const minRadius = opts.minRadius ?? 0.3;
  const separation = opts.separation ?? 0.42;

  // A wide viewport gets stretched horizontally so clusters use the full
  // field instead of hugging a square in the middle.
  //
  // Portrait needs the opposite, and needs it far harder than the old clamp
  // allowed. On a 390x844 phone the aspect is 0.46, but stretchX bottomed out
  // at 0.82 and stretchY only reached 1.16 — so the field was still laid out
  // wider than it was tall on a screen twice as tall as it is wide. Every
  // cluster crowded into a band across the middle with its label colliding
  // with its neighbour's, while the top and bottom thirds stayed empty.
  //
  // Below, portrait spreads along the axis it has and pulls in along the one
  // it doesn't, which is also what keeps each label inside the side gutters:
  // a label is far wider than the dot it belongs to, so horizontal room is the
  // scarce resource on a phone and vertical room is the free one.
  const portrait = aspect < 0.85;
  const stretchX = portrait
    ? Math.max(0.58, aspect / 0.62)
    : Math.min(1.55, Math.max(0.82, aspect / 1.25));
  const stretchY = portrait ? Math.min(1.75, 0.95 / Math.max(0.3, aspect)) : 1;

  const rand = seeded(9176 + count * 31);
  const points: LayoutPoint[] = [];

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : (i + 0.55) / count;
    const radius = minRadius + (maxRadius - minRadius) * Math.sqrt(t);
    // Rank has to reach the screen, not just the spiral index. The base angle
    // puts index 0 — the strongest project — in the upper-left, the position
    // a reader's eye lands on first; the golden angle then spirals the rest
    // outward from there, so importance falls away naturally in both radius
    // and reading order. Without this the spiral is rank-blind and the
    // closing chapter can land dead centre-top, which reads as the headline.
    const angle = i * GOLDEN_ANGLE + 3.93 + (rand() - 0.5) * 0.22;
    const r = radius * (1 + (rand() - 0.5) * 0.1);
    points.push({
      x: Math.cos(angle) * r * stretchX,
      y: Math.sin(angle) * r * stretchY,
      // Real depth, so the field can be orbited and zoomed rather than being a
      // flat plane with a depth effect painted on. Kept shallow relative to the
      // x/y spread — this is a slab the visitor looks into, not a sphere they
      // are inside, so nothing ever swings behind the camera.
      z: (rand() - 0.5) * 0.85,
    });
  }

  // A few relaxation passes so no two clusters crowd each other at counts
  // where the spiral happens to place neighbours close together.
  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = points[j].x - points[i].x;
        const dy = points[j].y - points[i].y;
        const d = Math.hypot(dx, dy) || 0.0001;
        if (d >= separation) continue;
        const push = (separation - d) / 2;
        const ux = (dx / d) * push;
        const uy = (dy / d) * push;
        points[i].x -= ux;
        points[i].y -= uy;
        points[j].x += ux;
        points[j].y += uy;
      }
    }
  }

  // Re-center, so the composition stays balanced around the Core's origin
  // no matter how the relaxation shifted things.
  const cx = points.reduce((a, p) => a + p.x, 0) / count;
  const cy = points.reduce((a, p) => a + p.y, 0) / count;
  for (const p of points) {
    p.x -= cx;
    p.y -= cy;
  }

  return points;
}

// ---------------------------------------------------------------------------
// Projection
//
// "3D look in a 2D environment" — the scene is genuinely three-dimensional and
// gets projected here, rather than being a 2D scene with depth faked through
// size and opacity. That is what lets the visitor orbit and zoom it, and what
// makes a cluster's orbit rings read as tilted circles rather than drawn
// ellipses.
// ---------------------------------------------------------------------------

export type Camera = { yaw: number; pitch: number; zoom: number };

export type Projected = { x: number; y: number; scale: number; depth: number };

/** Perspective distance, in the same units as the normalized layout space. */
const FOCAL = 3.2;

export function project(
  x: number,
  y: number,
  z: number,
  cam: Camera,
  cx: number,
  cy: number,
  unit: number
): Projected {
  const cosY = Math.cos(cam.yaw);
  const sinY = Math.sin(cam.yaw);
  const cosP = Math.cos(cam.pitch);
  const sinP = Math.sin(cam.pitch);

  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const y1 = y * cosP - z1 * sinP;
  const z2 = y * sinP + z1 * cosP;

  // Clamped so a point can never land on or behind the focal plane, which
  // would invert it across the screen.
  const denom = Math.max(0.35, FOCAL + z2);
  const scale = (FOCAL / denom) * cam.zoom;

  return { x: cx + x1 * unit * scale, y: cy + y1 * unit * scale, scale, depth: z2 };
}
