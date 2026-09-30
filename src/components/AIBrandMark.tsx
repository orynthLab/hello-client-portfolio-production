import Link from "next/link";

const NODES = [
  { x: 6, y: 16 },
  { x: 16, y: 6 },
  { x: 16, y: 26 },
  { x: 26, y: 16 },
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [1, 2],
];

export default function AIBrandMark({ className = "" }: { className?: string }) {
  return (
    // The mark is the only content of this link, and an SVG carries no
    // accessible name — so without the label this reads to a screen reader
    // (and to Lighthouse) as a focusable link with nothing in it.
    <Link
      href="/"
      aria-label="OrynthBuild — home"
      className={`group flex items-center ${className}`}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
      >
        {EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="#52f2ff"
            strokeWidth={0.9}
            strokeOpacity={0.6}
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i === 3 ? 3.4 : 2.4}
            fill={i === 3 ? "#52f2ff" : "#9b6bff"}
            className="animate-pulse-soft"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </svg>
    </Link>
  );
}
