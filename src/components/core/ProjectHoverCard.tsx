"use client";

import { forwardRef } from "react";
import type { UniverseNode } from "./universe";

// ---------------------------------------------------------------------------
// The identity card from the concept board: name, what it is, and the verb.
// Three lines, nothing else — the board is explicit that this must not become
// a dashboard card. The world being entered is the event, not this.
//
// Positioned imperatively by CoreUniverse every frame (the cluster it belongs
// to moves as the field is orbited), so it takes a ref and no x/y props.
// ---------------------------------------------------------------------------

const ProjectHoverCard = forwardRef<HTMLDivElement, { node: UniverseNode | null }>(
  function ProjectHoverCard({ node }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30 w-[228px] origin-top-left"
        style={{ opacity: 0, transition: "opacity 180ms ease-out" }}
      >
        {node && (
          <div
            className="rounded-xl border p-4 text-left"
            style={{
              borderColor: `${node.accent}3d`,
              background: "rgba(5,7,12,0.9)",
              boxShadow: "0 20px 54px -24px rgba(0,0,0,0.95)",
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.24em] text-ink-faint">{node.index}</p>
            <p className="mt-1.5 font-display text-[15px] font-medium leading-snug text-ink">
              {node.name}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-dim">{node.subtitle}</p>
            <p
              className="mt-3 font-mono text-[11px] font-medium uppercase tracking-[0.24em]"
              style={{ color: node.accent }}
            >
              {node.verb}
            </p>
          </div>
        )}
      </div>
    );
  }
);

export default ProjectHoverCard;
