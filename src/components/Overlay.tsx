"use client";

import { useEffect, useRef, useState } from "react";
import { pauseWorldForOverlay, resumeWorldForOverlay } from "@/components/investment-world/motion";
import { useModalA11y } from "@/components/useModalA11y";

// ---------------------------------------------------------------------------
// The one overlay every modal on this site is built from.
//
// It replaces framer-motion, which was pulled in for exactly three modals and
// cost 41 KB brotli on every single route — more than the entire Core engine —
// to do a fade and a scale. Both are CSS animations here, composited on the
// GPU, with no library.
//
// Exit still animates: `rendered` is held true through the closing animation
// and released on animationend. The open/close transition is adjusted during
// render rather than in an effect, which is React's own pattern for state
// derived from a prop and avoids the cascading second render an effect causes.
//
// It also folds in what all three modals were each doing by hand: the focus
// trap, Escape-to-close, focus restore, and pausing the world's continuous
// animation while something is covering it.
// ---------------------------------------------------------------------------

export default function Overlay({
  open,
  onClose,
  ariaLabel,
  panelClassName = "",
  scrimClassName = "bg-void/80",
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  panelClassName?: string;
  scrimClassName?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);

  // Derived from `open`, adjusted during render — not in an effect.
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setRendered(true);
  }

  // The world behind an overlay is not visible, but left running it keeps
  // computing every frame and competes with the overlay's own scrolling.
  // Pausing an external system is exactly what an effect is for.
  useEffect(() => {
    if (!open) return;
    pauseWorldForOverlay();
    return () => resumeWorldForOverlay();
  }, [open]);

  useModalA11y(open, onClose, panelRef);

  if (!rendered) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-6"
      onAnimationEnd={(e) => {
        // only the scrim's own closing animation ends the lifecycle
        if (e.target !== e.currentTarget.firstChild) return;
        if (!open) setRendered(false);
      }}
    >
      <div
        className={`absolute inset-0 ${scrimClassName} ${open ? "overlay-scrim-in" : "overlay-scrim-out"}`}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`relative z-10 ${open ? "overlay-panel-in" : "overlay-panel-out"} ${panelClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
