import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { projects, getProject, metaSystem } from "@/data/projects";
import { jsonLd } from "@/lib/jsonLd";

// ---------------------------------------------------------------------------
// One dynamic route serves every project world, so a static import of all of
// them puts ALL of them in the bundle of EVERY project page — eight worlds,
// eight backgrounds, eight content configs, downloaded and parsed to render
// one. That was measurably the single largest cost on these pages.
//
// Loading each through next/dynamic splits them into their own chunks, so a
// visitor opening one project downloads that project. They still render on
// the server (no `ssr: false`), so the HTML and the SEO are unchanged.
// ---------------------------------------------------------------------------
const WORLDS: Record<string, React.ComponentType> = {
  "aviation-preparation-academy": dynamic(() => import("@/components/AviationAcademyWorld")),
  "company-financial-report-agent": dynamic(() => import("@/components/FinancialReportWorld")),
  "investment-advisory-agent": dynamic(() => import("@/components/InvestmentWorld")),
  "autonomous-business-development-agent": dynamic(
    () => import("@/components/BusinessDevelopmentAgentWorld")
  ),
  "cross-border-transfer-engine": dynamic(() => import("@/components/AfricaOneWorld")),
  "document-identifier-verifier": dynamic(() => import("@/components/DocumentTrustEngine")),
  "igc-logistics-platform": dynamic(() => import("@/components/LogisticsOperationsHub")),
  [metaSystem.slug]: dynamic(() => import("@/components/CreativeEngineeringSystem")),
};

const SITE_URL = "https://www.orynthbuild.site";

/** The root opengraph-image. Pages that declare their own `openGraph` replace
 *  the inherited one wholesale, so each has to name it again or share with no
 *  image at all. */
const OG_IMAGE = "/opengraph-image";

// The name a world is presented under, where it differs from the raw project
// record. Module scope on purpose: the page metadata and the structured data
// below both read it, and a project that is called one thing in <title> and
// another in its schema is worse than either name alone.
const WORLD_TITLES: Record<string, string> = {
  "autonomous-business-development-agent": "Autonomous Business Development Agent",
  "cross-border-transfer-engine": "Cross-Border Transfer Engine",
  "aviation-preparation-academy": "Aviation Preparation Academy",
  "investment-advisory-agent": "Investment Intelligence Engine",
  "company-financial-report-agent": "Financial Intelligence Workspace",
  "document-identifier-verifier": "Document Trust Engine",
  "igc-logistics-platform": "Logistics Operations Hub",
};

/** How a slug is named and summarised, for both <title> and schema. */
function projectIdentity(slug: string) {
  if (slug === metaSystem.slug) {
    return {
      name: "Creative Engineering Portfolio",
      description:
        "How ideas become products through design, engineering and intelligent systems.",
    };
  }
  const project = getProject(slug);
  if (!project) return null;
  return { name: WORLD_TITLES[slug] ?? project.name, description: project.tagline };
}

/** CreativeWork + BreadcrumbList for a project world.
 *
 *  Both point at the Organization's @id in layout.tsx rather than restating
 *  the company, so a crawler reads one entity with work attached to it. */
function ProjectStructuredData({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  const url = `${SITE_URL}/projects/${slug}`;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(projectJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />
    </>
  );
}

export function generateStaticParams() {
  return [...projects.map((p) => ({ slug: p.slug })), { slug: metaSystem.slug }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const url = `/projects/${slug}`;

  // The meta system isn't in the `projects` array — it's not a client
  // project — so it's special-cased here, ahead of the getProject lookup.
  if (slug === metaSystem.slug) {
    const title = "Creative Engineering Portfolio";
    const description = "How ideas become products through design, engineering and intelligent systems.";
    return {
      title,
      description,
      keywords: ["OrynthBuild", "Hello Client", "creative engineering", "white label execution agency"],
      alternates: { canonical: url },
      openGraph: { type: "article", url, title: `${title} | OrynthBuild`, description, images: [OG_IMAGE] },
      twitter: { card: "summary_large_image", title: `${title} | OrynthBuild`, description, images: [OG_IMAGE] },
    };
  }
  const project = getProject(slug);
  if (!project) return {};
  const title = WORLD_TITLES[slug] ?? project.name;
  return {
    title,
    description: project.tagline,
    keywords: [
      project.name,
      project.category,
      "white label execution agency",
      "OrynthBuild case study",
      ...project.stack,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${title} | OrynthBuild`,
      description: project.tagline,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | OrynthBuild`,
      description: project.tagline,
      images: [OG_IMAGE],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // The closing chapter isn't in the `projects` array — it's not a client
  // project — so the registry is consulted before that lookup.
  const World = WORLDS[slug];
  if (!World) notFound();
  const identity = projectIdentity(slug);
  if (!identity) notFound();

  return (
    <>
      <ProjectStructuredData
        slug={slug}
        name={identity.name}
        description={identity.description}
      />
      <World />
    </>
  );
}
