"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";
import AIBrandMark from "@/components/AIBrandMark";
import ContactModal from "@/components/ContactModal";
import WorldBackground from "@/components/investment-world/WorldBackground";
import { getServiceTheme } from "@/data/serviceThemes";
import { revealUp, isMobileViewport } from "@/components/investment-world/motion";

// ---------------------------------------------------------------------------
// The service pages, given the same body as everything else on this site.
//
// These pages are not reachable from the Core — they are written to be found in
// search and opened cold, which makes them the likeliest first impression the
// site ever gives. A flat page here would read as a different, cheaper site
// than the one a visitor would see if they clicked through, so they run the
// portfolio's own systems rather than a second set built just for them:
// WorldBackground for the moving background, revealUp for section entrances,
// and the same glass panels, accent badges and typography as the project
// worlds.
//
// Two things are deliberately NOT copied from the production SEO build:
// framer-motion and AINetworkBackground, both removed from this project on
// purpose (41 KB of library for three fades, and a background superseded by
// WorldBackground). Their job is done here by what the site already ships.
//
// The heading is the exception to the motion. It carries `hero-title`, so on a
// phone it is painted with the document and settles by CSS keyframe, exactly as
// the project heroes do — see globals.css. Fading it in with GSAP would hand
// back the Largest Contentful Paint problem that fix exists to solve: Chromium
// only ever considers an element for LCP at its first paint, and an element
// whose first paint is transparent is disqualified for good.
// ---------------------------------------------------------------------------

export default function ServiceExperience({
  service,
  relatedProjects,
  relatedServices,
}: {
  service: Service;
  relatedProjects: Project[];
  relatedServices: Service[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mobile = isMobileViewport();

      // Hero entrance. On desktop the heading fades up with everything else;
      // on mobile it is already on screen and only the supporting lines move.
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (!mobile && titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.05
        );
      }
      if (eyebrowRef.current) {
        tl.fromTo(eyebrowRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
      }
      if (taglineRef.current) {
        tl.fromTo(taglineRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 0.28);
      }
      if (chipsRef.current) {
        tl.fromTo(
          chipsRef.current.children,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
          0.42
        );
      }

      // Everything below the fold arrives on scroll, through the same helper
      // the project worlds use — so the rhythm matches rather than resembles.
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        revealUp(el, el, { y: 22 });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const theme = getServiceTheme(service.slug);

  return (
    <div ref={rootRef} className="relative min-h-dvh w-full overflow-x-hidden bg-void">
      <WorldBackground theme={theme} />

      <div className="safe-top safe-left fixed z-40 flex items-center gap-3">
        <AIBrandMark />
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-cyan"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5m0 0l6-6m-6 6l6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          OrynthBuild
        </Link>
      </div>

      <ContactModal className="safe-top safe-right fixed z-40" />

      {/* The hero is given most of a screen, the way a project world's Arrival
          is. That is not only rhythm: WorldBackground spreads its numeric
          pulses over the page, so a header crammed against the top of a short
          page collects them behind its own text. Room to breathe separates the
          two, and matches how the project pages already read. */}
      <header className="relative z-10 flex min-h-[78svh] flex-col items-center justify-center gap-6 px-6 pb-20 pt-28 text-center sm:min-h-[70svh]">
        <p
          ref={eyebrowRef}
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: service.accent }}
        >
          {service.eyebrow}
        </p>
        <h1
          ref={titleRef}
          className="hero-title font-display max-w-3xl text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl"
        >
          {service.name}
        </h1>
        <p ref={taglineRef} className="max-w-xl text-sm leading-relaxed text-ink-dim sm:text-base">
          {service.tagline}
        </p>
        {service.capabilities && service.capabilities.length > 0 && (
          <ul
            ref={chipsRef}
            aria-label="Areas of focus"
            className="mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            {service.capabilities.map((capability) => (
              <li
                key={capability}
                className="rounded-full border border-glass-border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-faint sm:text-[10px] sm:tracking-[0.14em]"
              >
                {capability}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-20">
        {service.sections.map((section, i) => (
          <section
            key={section.heading}
            data-reveal
            className="glass-panel relative rounded-2xl p-6 sm:p-8"
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px]"
                style={{
                  backgroundColor: `${service.accent}22`,
                  color: service.accent,
                  border: `1px solid ${service.accent}55`,
                }}
              >
                {i + 1}
              </span>
              <h2 className="font-display text-lg font-medium text-ink">{section.heading}</h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-dim">{section.body}</p>
          </section>
        ))}
      </div>

      {service.faqs.length > 0 && (
        <section
          data-reveal
          className="relative z-10 mx-auto mb-20 max-w-2xl px-6"
          aria-labelledby="service-faq-heading"
        >
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 id="service-faq-heading" className="font-display text-lg font-medium text-ink">
              Frequently asked questions
            </h2>
            <div className="mt-5 flex flex-col">
              {service.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="border-t border-glass-border py-5 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <h3 className="font-display text-sm font-medium text-ink">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section
          data-reveal
          className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20"
          aria-labelledby="related-services-heading"
        >
          <h2
            id="related-services-heading"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint"
          >
            Related services
          </h2>
          <div className="flex flex-col gap-3">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.slug}
                href={`/services/${relatedService.slug}`}
                className="glass-panel group flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-cyan/40"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-medium text-ink">{relatedService.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-dim">
                    {relatedService.tagline}
                  </p>
                </div>
                <span
                  className="shrink-0 font-mono text-xs text-ink-faint transition-colors group-hover:text-cyan"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section
          data-reveal
          className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20"
          aria-labelledby="related-work-heading"
        >
          <h2
            id="related-work-heading"
            className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint"
          >
            Related work
          </h2>
          <div className="flex flex-col gap-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="glass-panel group flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-cyan/40"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-medium text-ink">{project.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-dim">{project.tagline}</p>
                </div>
                <span
                  className="shrink-0 font-mono text-xs text-ink-faint transition-colors group-hover:text-cyan"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer
        data-reveal
        className="relative z-10 flex flex-col items-center gap-6 px-6 pb-28 pt-8 text-center"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Need this built?
        </p>
        <ContactModal
          label="Start a Project"
          showIcon={false}
          buttonClassName="rounded-full bg-cyan/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan edge-glow transition-transform hover:scale-105"
        />
      </footer>
    </div>
  );
}
