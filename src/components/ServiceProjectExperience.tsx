"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Project } from "@/data/projects";
import type { Service } from "@/data/services";
import AIBrandMark from "@/components/AIBrandMark";
import AINetworkBackground from "@/components/AINetworkBackground";
import ContactModal from "@/components/ContactModal";

export default function ServiceProjectExperience({
  service,
  projects,
  relatedServices,
}: {
  service: Service;
  projects: Project[];
  relatedServices: Service[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <motion.main
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-dvh w-full overflow-hidden bg-void"
    >
      <AINetworkBackground density={16} seed={service.slug.length + 5} accent={service.accent} />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0.75, scale: 0.4 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed left-1/2 top-40 z-40 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: service.accent }}
      />

      <div className="safe-top safe-left fixed z-40 flex items-center gap-3">
        <AIBrandMark />
        <Link
          href="/"
          data-cursor="explore"
          className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-cyan"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          OrynthBuild
        </Link>
      </div>

      <ContactModal className="safe-top safe-right fixed z-40" />

      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-glass-border sm:block">
        <motion.div style={{ scaleY: pathProgress, transformOrigin: "top" }} className="h-full w-full">
          <div className="h-full w-full" style={{ background: `linear-gradient(${service.accent}, transparent)` }} />
        </motion.div>
      </div>

      <header className="relative z-10 flex flex-col items-center gap-6 px-6 pb-24 pt-32 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: service.accent }}>
          {service.eyebrow} · OrynthBuild
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
          {service.name}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-ink-dim sm:text-base">{service.tagline}</p>
        {service.capabilities && service.capabilities.length > 0 && (
          <ul aria-label="Areas of focus" className="mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {service.capabilities.map((capability) => (
              <li key={capability} className="rounded-full border border-glass-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                {capability}
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-20">
        {service.sections.map((section, index) => (
          <motion.section
            key={section.heading}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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
                {index + 1}
              </span>
              <h2 className="font-display text-lg font-medium text-ink">{section.heading}</h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-dim">{section.body}</p>
          </motion.section>
        ))}
      </div>

      {projects.length > 0 && (
        <section className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20" aria-labelledby="related-work-heading">
          <h2 id="related-work-heading" className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Related work
          </h2>
          <div className="flex flex-col gap-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                data-cursor="open"
                className="iw-glass group rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: project.accent }}>
                  {project.category} · {project.year}
                </p>
                <h3 className="mt-2 font-display text-base font-medium text-ink transition-colors group-hover:text-cyan">
                  {project.name} <span aria-hidden="true">→</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{project.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20" aria-labelledby="service-faq-heading">
          <h2 id="service-faq-heading" className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Frequently asked questions
          </h2>
          <div className="flex flex-col gap-3">
            {service.faqs.map((faq) => (
              <article key={faq.question} className="glass-panel rounded-2xl p-5 sm:p-6">
                <h3 className="font-display text-base font-medium text-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {relatedServices.length > 0 && (
        <section className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20" aria-labelledby="related-services-heading">
          <h2 id="related-services-heading" className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Related services
          </h2>
          <div className="flex flex-col gap-3">
            {relatedServices.map((relatedService) => (
              <Link
                key={relatedService.slug}
                href={`/services/${relatedService.slug}`}
                data-cursor="open"
                className="iw-glass group flex items-center justify-between rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span>
                  <span className="block font-display text-sm font-medium text-ink transition-colors group-hover:text-cyan">
                    {relatedService.name}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-dim">{relatedService.tagline}</span>
                </span>
                <span className="ml-4 font-mono text-xs text-ink-faint" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <footer className="relative z-10 flex flex-col items-center gap-6 px-6 pb-28 pt-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Ready to explore this work?
        </p>
        <ContactModal
          label="Start a Project"
          showIcon={false}
          buttonClassName="rounded-full bg-cyan/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan edge-glow transition-transform hover:scale-105"
        />
      </footer>
    </motion.main>
  );
}
