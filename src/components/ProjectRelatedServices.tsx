import Link from "next/link";
import { getServicesForProject } from "@/data/services";

// ---------------------------------------------------------------------------
// The closing link out of a case study, into the service that does this work.
//
// Project pages used to link nowhere but home. That left every service page
// depending on other service pages for its inbound links, and it left a reader
// who had just finished the most persuasive thing on the site — a real build,
// described in detail — with nowhere to go but back.
//
// Rendered on the server, after the world, so the links are in the prerendered
// HTML rather than appearing only once the client has hydrated a canvas.
//
// Which services appear is derived from each service's own
// `relatedProjectSlugs`, so this can never contradict the "Related work" list
// on the service pages: if a service cites this project, this project cites it
// back.
// ---------------------------------------------------------------------------

export default function ProjectRelatedServices({ projectSlug }: { projectSlug: string }) {
  const services = getServicesForProject(projectSlug);
  if (services.length === 0) return null;

  return (
    <section
      aria-labelledby="project-related-services"
      className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24"
    >
      <div className="border-t border-glass-border pt-10">
        <h2
          id="project-related-services"
          // ink-faint is 2.8:1 on the void background — below AA for 11px text.
          // The service pages get away with it because WorldBackground lifts
          // what sits behind them; this section sits on the bare background.
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim"
        >
          Services behind this build
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="glass-panel group flex items-center justify-between gap-4 rounded-2xl p-5 transition-colors hover:border-cyan/40"
            >
              <div className="min-w-0">
                <p className="font-display text-sm font-medium text-ink">{service.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-dim">{service.tagline}</p>
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
      </div>
    </section>
  );
}
