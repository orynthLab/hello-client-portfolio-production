"use client";

/**
 * The Core's locked geometry: one irregular, asymmetric hexagon (six unevenly
 * sized facets meeting at a shared center) rather than N identical
 * rotationally-symmetric blades — a symmetric fan reads as a camera-aperture
 * icon or a star; this reads as a single ownable silhouette. Strip every glow
 * and every animation and the shape alone should still be recognizable.
 *
 * Each facet is a triangle (center, vertex[i], vertex[i+1]) that can shift a
 * few px outward along its own independent axis on activation — a precise
 * separation, never a rotation. The center stays a dark void with a faint
 * cold rim: depth behind the mechanism, not light escaping from it.
 */

const CENTER = { x: 100, y: 100 };

const VERTICES = [
  { x: 168, y: 100 },
  { x: 129, y: 141 },
  { x: 66, y: 149 },
  { x: 56, y: 104 },
  { x: 62, y: 46 },
  { x: 127, y: 53 },
];

// Each facet's own outward axis for the activated state — independent
// per-plate direction, not a shared radial expansion. Magnitudes are sized
// for the emblem's 0-200 viewBox so the separation still reads clearly once
// scaled down to its on-page display size (it stays modest on the page).
export const FACET_AXES = [
  { x: 14, y: -10 },
  { x: 5, y: 17 },
  { x: -15, y: 8 },
  { x: -16, y: -4 },
  { x: -5, y: -17 },
  { x: 13, y: -11 },
];

export const FACET_COUNT = VERTICES.length;

export default function CoreEmblem({
  facetRef,
  voidRef,
  rimRef,
  groupRef,
  className = "",
}: {
  facetRef: (el: SVGPolygonElement | null, i: number) => void;
  voidRef: (el: SVGCircleElement | null) => void;
  rimRef: (el: SVGCircleElement | null) => void;
  groupRef?: (el: SVGGElement | null) => void;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id="core-facet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9fc3de" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#141d2b" stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="core-void" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000103" />
          <stop offset="60%" stopColor="#04070d" />
          <stop offset="100%" stopColor="#0a1220" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g ref={groupRef}>
        {VERTICES.map((v, i) => {
          const next = VERTICES[(i + 1) % VERTICES.length];
          return (
            <polygon
              key={i}
              ref={(el) => facetRef(el, i)}
              points={`${CENTER.x},${CENTER.y} ${v.x},${v.y} ${next.x},${next.y}`}
              fill="url(#core-facet)"
              stroke="#bcd8ea"
              strokeWidth={0.5}
              strokeOpacity={0.45}
            />
          );
        })}
        <circle ref={voidRef} cx={CENTER.x} cy={CENTER.y} r={7} fill="url(#core-void)" />
        <circle
          ref={rimRef}
          cx={CENTER.x}
          cy={CENTER.y}
          r={7.3}
          fill="none"
          stroke="#52f2ff"
          strokeWidth={0.35}
          strokeOpacity={0.35}
        />
      </g>
    </svg>
  );
}
