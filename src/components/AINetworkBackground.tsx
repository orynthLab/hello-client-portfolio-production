"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function AINetworkBackground({
  accent = "#52f2ff",
  density = 14,
  seed = 7,
  className = "",
}: {
  accent?: string;
  density?: number;
  seed?: number;
  className?: string;
}) {
  const { nodes, edges } = useMemo(() => {
    const rand = seededRandom(seed);
    const nodes = Array.from({ length: density }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: 3 + rand() * 4,
      delay: rand() * 4,
    }));
    const edges: [number, number][] = [];
    nodes.forEach((_, i) => {
      const next = (i + 1 + Math.floor(rand() * 2)) % nodes.length;
      if (next !== i) edges.push([i, next]);
    });
    return { nodes, edges };
  }, [density, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* connecting lines only — safe to stretch to fill any aspect ratio */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`ai-net-grad-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke={`url(#ai-net-grad-${seed})`}
            strokeWidth={0.12}
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.1, 0.35, 0.1] }}
            transition={{ duration: 5 + (i % 4), repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}
      </svg>

      {/* nodes as plain HTML dots, positioned by percentage — stay perfectly round
          regardless of container aspect ratio, animated via transform (not raw attrs) */}
      {nodes.map((n, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <motion.span
            className="block rounded-full"
            style={{ width: n.size, height: n.size, backgroundColor: accent }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.25, 0.85, 0.25], y: [0, -6, 0] }}
            transition={{
              duration: 6 + n.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: n.delay,
            }}
          />
        </div>
      ))}
    </div>
  );
}
