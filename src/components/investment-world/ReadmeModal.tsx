"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Overlay from "@/components/Overlay";
import type { ReadmeContent } from "./types";

// ---------------------------------------------------------------------------
// A GitHub-style markdown viewer for the README, opened as an overlay rather
// than dumped into the page. The chrome (file bar, heading rhythm, H2/P/UL/
// Code styling) is the framework — identical across every project world.
// Only `content` (passed in) changes.
// ---------------------------------------------------------------------------

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-8 border-b border-glass-border pb-2 text-lg font-semibold text-ink first:mt-0">{children}</h2>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-ink-dim">{children}</p>;
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="mt-3 flex flex-col gap-1.5 text-sm leading-relaxed text-ink-dim">{children}</ul>;
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-ink-faint">—</span>
      <span>{children}</span>
    </li>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-cyan">{children}</code>
  );
}

export default function ReadmeModal({ content }: { content: ReadmeContent }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = () => setOpen(false);

  // Portal target only exists on the client — and rendering the overlay via a
  // portal to document.body (rather than inline) means it's never a descendant
  // of this screen's own animated root, so a scroll-scrubbed transform on that
  // ancestor can never turn into this modal's containing block and misplace it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const overlay = (
    <Overlay
      open={open}
      onClose={close}
      ariaLabel={content.title}
      scrimClassName="bg-void/92"
      panelClassName="flex h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-glass-border bg-[#0a0c12] shadow-2xl"
    >
              {/* file bar — the one deliberate GitHub cue: a filename tab, nothing else borrowed */}
              <div className="flex shrink-0 items-center justify-between border-b border-glass-border bg-white/[0.03] px-5 py-3">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-ink-faint">
                    <path d="M6 2h9l5 5v15H6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M15 2v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                  <span className="font-mono text-xs text-ink-dim">README.md</span>
                </div>
                <button
                  onClick={close}
                  className="text-ink-faint transition-colors hover:text-ink"
                  aria-label="Close documentation"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* data-lenis-prevent: without it, the site-wide Lenis smooth-scroll
                 captures the wheel event on the window and scrolls the page behind
                 the modal instead of this panel's own content. */}
              <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif", letterSpacing: "-0.02em", color: "#eef1f9" }}>
                  {content.title}
                </h1>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  {content.subtitle}
                </p>

                {content.sections.map((section) => (
                  <div key={section.heading}>
                    <H2>{section.heading}</H2>
                    {section.body}
                  </div>
                ))}
              </div>
    </Overlay>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-cyan"
      >
        Open Documentation
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </>
  );
}
