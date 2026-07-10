"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Project } from "@/data/projects";
import AIBrandMark from "@/components/AIBrandMark";
import ContactModal from "@/components/ContactModal";
import AINetworkBackground from "@/components/AINetworkBackground";

export default function ProjectWorkflow({
  project,
  next,
}: {
  project: Project;
  next?: Project;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const pathProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-dvh w-full bg-void"
    >
      <AINetworkBackground density={16} seed={project.slug.length + 5} accent={project.accent} />

      {/* entry burst */}
      <motion.div
        initial={{ opacity: 0.9, scale: 0.4 }}
        animate={{ opacity: 0, scale: 2.6 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none fixed left-1/2 top-40 z-40 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: project.accent }}
      />

      <div className="fixed left-6 top-6 z-40 flex items-center gap-3">
        <AIBrandMark />
        <Link
          href="/"
          data-cursor="explore"
          className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-cyan"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          All Projects
        </Link>
      </div>

      <ContactModal className="fixed right-6 top-6 z-40" />

      {/* connector spine */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-glass-border sm:block hidden">
        <motion.div
          style={{ scaleY: pathProgress, transformOrigin: "top" }}
          className="h-full w-full"
        >
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(${project.accent}, transparent)` }}
          />
        </motion.div>
      </div>

      <header className="relative z-10 flex flex-col items-center gap-6 px-6 pb-24 pt-32 text-center">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: project.accent }}
        >
          {project.category} · {project.year}
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
          {project.name}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink-dim sm:text-base">
          {project.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-glass-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 sm:gap-10">
          {project.metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-display text-2xl font-semibold sm:text-3xl" style={{ color: project.accent }}>
                {m.value}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-faint">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-32">
        {project.nodes.map((node, i) => (
          <motion.section
            key={node.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel relative rounded-2xl p-6 sm:p-8"
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px]"
                style={{
                  backgroundColor: `${project.accent}22`,
                  color: project.accent,
                  border: `1px solid ${project.accent}55`,
                }}
              >
                {i + 1}
              </span>
              <h2 className="font-display text-lg font-medium text-ink">{node.label}</h2>
            </div>
            <p className="text-sm leading-relaxed text-ink-dim">{node.body}</p>
          </motion.section>
        ))}
      </div>

      <footer className="relative z-10 flex flex-col items-center gap-6 px-6 pb-28 pt-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          Ready to build something like this?
        </p>
        <ContactModal
          label="Start a Project"
          showIcon={false}
          buttonClassName="rounded-full bg-cyan/10 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan edge-glow transition-transform hover:scale-105"
        />

        {next && (
          <Link
            href={`/projects/${next.slug}`}
            data-cursor="open"
            className="group mt-10 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
              Next Node
            </span>
            <span className="font-display text-xl text-ink transition-colors group-hover:text-cyan">
              {next.name} →
            </span>
          </Link>
        )}
      </footer>
    </motion.div>
  );
}
