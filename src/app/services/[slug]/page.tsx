import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { services, getService } from "@/data/services";
import { getProject } from "@/data/projects";
import AIBrandMark from "@/components/AIBrandMark";
import ContactModal from "@/components/ContactModal";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const url = `/services/${service.slug}`;

  return {
    title: service.name,
    description: service.description,
    keywords: [service.name, service.eyebrow, "OrynthBuild", "white label execution agency"],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${service.name} | OrynthBuild`,
      description: service.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | OrynthBuild`,
      description: service.description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedProjects = service.relatedProjectSlugs
    .map((s) => getProject(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const serviceUrl = `https://www.orynthbuild.site/services/${service.slug}`;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: serviceUrl,
    provider: { "@id": "https://www.orynthbuild.site/#organization" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.orynthbuild.site/" },
      { "@type": "ListItem", position: 2, name: service.name, item: serviceUrl },
    ],
  };

  return (
    <div className="relative min-h-dvh w-full bg-void">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="safe-top safe-left fixed z-40 flex items-center gap-3">
        <AIBrandMark />
        <Link
          href="/"
          data-cursor="explore"
          className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-cyan"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5m0 0l6-6m-6 6l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          OrynthBuild
        </Link>
      </div>

      <ContactModal className="safe-top safe-right fixed z-40" />

      <header className="relative z-10 flex flex-col items-center gap-6 px-6 pb-24 pt-32 text-center">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.3em]"
          style={{ color: service.accent }}
        >
          {service.eyebrow}
        </p>
        <h1 className="font-display max-w-3xl text-4xl font-semibold leading-[1.05] text-ink sm:text-6xl">
          {service.name}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink-dim sm:text-base">
          {service.tagline}
        </p>
      </header>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-6 px-6 pb-20">
        {service.sections.map((section, i) => (
          <section key={section.heading} className="glass-panel relative rounded-2xl p-6 sm:p-8">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full font-mono text-[10px]"
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

      {relatedProjects.length > 0 && (
        <div className="relative z-10 mx-auto flex max-w-2xl flex-col gap-4 px-6 pb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            Related work
          </p>
          <div className="flex flex-col gap-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                data-cursor="open"
                className="glass-panel group flex items-center justify-between rounded-2xl p-5 transition-colors hover:border-cyan/40"
              >
                <div>
                  <p className="font-display text-sm font-medium text-ink">{project.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-dim">{project.tagline}</p>
                </div>
                <span className="font-mono text-xs text-ink-faint transition-colors group-hover:text-cyan">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <footer className="relative z-10 flex flex-col items-center gap-6 px-6 pb-28 pt-8 text-center">
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
