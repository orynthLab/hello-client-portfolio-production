"use client";

import { useEffect, useRef } from "react";
import { revealUp, screenBlend } from "./motion";
import ContactModal from "@/components/ContactModal";
import ReadmeModal from "./ReadmeModal";
import type { ReadmeContent, ResourceLink, TechStackGroup } from "./types";

// ---------------------------------------------------------------------------
// SCREEN 3 — Resources.
//
// Four cards, nothing else: documentation, the private repository, the tech
// stack, and a closing invitation to talk. Return to Core closes the screen.
// The layout, spacing, and animation are the framework — identical across
// every project world. Only the content passed in changes.
//
// Two things vary for the closing chapter (Project 05), which isn't a client
// project: pass `links` instead of `readme`/`repository` for a row of direct
// resource links in place of the README/repo pair, and omit `onReturn`
// entirely to end on the CTA card rather than a Return-to-Core button.
// ---------------------------------------------------------------------------

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) revealUp(ref.current, ref.current, { y: 20, duration: 0.9 });
  }, []);
  return (
    <div ref={ref} className={`iw-glass rounded-2xl p-6 sm:p-7 ${className}`}>
      {children}
    </div>
  );
}

// README and Repository read as an editorial spec sheet, not dashboard tiles —
// flat, no border, no backdrop blur, separated only by a hairline (the same
// accent-tinted rule the Arrival uses under the title).
function EditorialResource({
  index,
  label,
  title,
  description,
  action,
  delay = 0,
}: {
  index: string;
  label: string;
  title: string;
  description: React.ReactNode;
  action: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) revealUp(ref.current, ref.current, { y: 18, duration: 0.9, delay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} className="flex-1 px-1 py-10 sm:px-10 sm:py-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">
        {index} — {label}
      </p>
      <h2
        className="mt-4 text-[1.75rem] font-light sm:text-3xl"
        style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif", letterSpacing: "-0.025em", color: "#eef1f9" }}
      >
        {title}
      </h2>
      <div className="mt-3 max-w-xs text-sm leading-relaxed text-ink-dim">{description}</div>
      <div className="mt-6">{action}</div>
    </div>
  );
}

// A lighter-weight sibling of EditorialResource for the closing chapter's row
// of direct links (Resume, GitHub, LinkedIn, Email, Schedule a Call) — same
// hairline-divided, flat editorial language, just proportioned for five short
// items instead of two long ones.
function LinkResource({ index, label, action, delay = 0 }: { index: string; label: string; action: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) revealUp(ref.current, ref.current, { y: 18, duration: 0.9, delay });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={ref} className="flex-1 px-1 py-7 text-center sm:px-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-faint">{index}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-faint">{label}</p>
      <div className="mt-3">{action}</div>
    </div>
  );
}

type ResourcesScreenProps = {
  /** omit entirely for a world that shouldn't loop back to the Core — the closing chapter */
  onReturn?: () => void;
  techStack: TechStackGroup[];
  cta: { heading: string; body: string; buttonLabel: string };
} & (
  | { links: ResourceLink[]; readme?: undefined; repository?: undefined }
  | {
      links?: undefined;
      readme: ReadmeContent;
      repository: { title: string; description: React.ReactNode; requestLabel: string; href?: string };
    }
);

/** The same mono action treatment the contact prompt uses, so a public
 *  repository link and a "request access" prompt read as one system. */
function ExternalAction({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-cyan"
    >
      {label}
    </a>
  );
}

export default function ResourcesScreen(props: ResourcesScreenProps) {
  const { onReturn, techStack, cta } = props;
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headingRef.current) revealUp(headingRef.current, headingRef.current, { y: 16, duration: 0.9 });
    // transform:false — this screen hosts fixed-position overlays (ContactModal,
    // ReadmeModal). A transform on their ancestor becomes those overlays'
    // containing block instead of the viewport, breaking full-screen positioning
    // once the scrub tween settles (confirmed via browser testing, not a
    // hypothetical). Same protective pattern as StoryScreen's sticky video.
    if (sectionRef.current) screenBlend(sectionRef.current, sectionRef.current, { transform: false });
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-28 pt-4 sm:pb-36 sm:pt-8">
      <div ref={headingRef} className="mb-12 text-center">
        <p className="iw-section-label">Resources</p>
      </div>

      {props.links ? (
        <div className="flex flex-col divide-y divide-glass-border sm:grid sm:grid-cols-5 sm:divide-x sm:divide-y-0">
          {props.links.map((l, i) => (
            <LinkResource key={l.label} index={l.index} label={l.label} action={l.action} delay={i * 0.06} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-glass-border sm:flex-row sm:divide-x sm:divide-y-0">
          <EditorialResource
            index="01"
            label="Documentation"
            title="README"
            description="Complete project documentation."
            action={<ReadmeModal content={props.readme} />}
          />
          <EditorialResource
            index="02"
            label="Source"
            title={props.repository.title}
            description={props.repository.description}
            action={
              props.repository.href ? (
                <ExternalAction href={props.repository.href} label={props.repository.requestLabel} />
              ) : (
                <ContactModal
                  label={props.repository.requestLabel}
                  showIcon={false}
                  buttonClassName="group inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-dim transition-colors hover:text-cyan"
                />
              )
            }
            delay={0.15}
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card className="sm:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">Tech Stack</p>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-5">
            {techStack.map((s) => (
              <div key={s.name} className="flex flex-col items-center text-center">
                <span style={{ color: s.accent }}>{s.icon}</span>
                <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">{s.name}</p>
                <p className="mt-1 text-[10px] leading-snug text-ink-faint">{s.items}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="sm:col-span-2 flex flex-col items-center gap-3 text-center">
          <p
            className="text-lg font-light"
            style={{ fontFamily: "var(--font-geist-sans), Arial, sans-serif", letterSpacing: "-0.02em", color: "#eef1f9" }}
          >
            {cta.heading}
          </p>
          <p className="text-sm leading-relaxed text-ink-dim">{cta.body}</p>
          <ContactModal
            label={cta.buttonLabel}
            className="mt-2"
            buttonClassName="group flex items-center gap-2 rounded-full bg-cyan/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan edge-glow transition-transform duration-300 hover:scale-[1.03]"
          />
        </Card>
      </div>

      {onReturn && (
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
          <button
            type="button"
            onClick={onReturn}
            className="group relative flex items-center gap-3 rounded-full border border-glass-border px-8 py-4 font-mono text-xs uppercase tracking-[0.32em] text-ink edge-glow transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <span className="relative">Return to the Core</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="relative transition-transform duration-300 group-hover:-translate-x-1">
              <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
