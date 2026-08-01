import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject, metaSystem } from "@/data/projects";
import ProjectWorkflow from "@/components/ProjectWorkflow";
import BusinessDevelopmentAgentWorld from "@/components/BusinessDevelopmentAgentWorld";
import InvestmentWorld from "@/components/InvestmentWorld";
import FinancialReportWorld from "@/components/FinancialReportWorld";
import DocumentTrustEngine from "@/components/DocumentTrustEngine";
import LogisticsOperationsHub from "@/components/LogisticsOperationsHub";
import CreativeEngineeringSystem from "@/components/CreativeEngineeringSystem";

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
      openGraph: { type: "article", url, title: `${title} | OrynthBuild`, description },
      twitter: { card: "summary_large_image", title: `${title} | OrynthBuild`, description },
    };
  }
  const project = getProject(slug);
  if (!project) return {};
  const worldTitles: Record<string, string> = {
    "autonomous-business-development-agent": "Autonomous Business Development Agent",
    "investment-advisory-agent": "Investment Intelligence Engine",
    "company-financial-report-agent": "Financial Intelligence Workspace",
    "document-identifier-verifier": "Document Trust Engine",
    "igc-logistics-platform": "Logistics Operations Hub",
  };
  const title = worldTitles[slug] ?? project.name;
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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | OrynthBuild`,
      description: project.tagline,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // The closing chapter — not a client project, so it's checked before the
  // `projects` array lookup below (it deliberately isn't in that array).
  if (slug === metaSystem.slug) {
    return <CreativeEngineeringSystem />;
  }

  const project = getProject(slug);
  if (!project) notFound();

  // Phase 3 — each project is its own world, built on the same shared
  // project-world system (see src/components/investment-world/).
  if (slug === "autonomous-business-development-agent") {
    return <BusinessDevelopmentAgentWorld />;
  }
  if (slug === "investment-advisory-agent") {
    return <InvestmentWorld />;
  }
  if (slug === "company-financial-report-agent") {
    return <FinancialReportWorld />;
  }
  if (slug === "document-identifier-verifier") {
    return <DocumentTrustEngine />;
  }
  if (slug === "igc-logistics-platform") {
    return <LogisticsOperationsHub />;
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return <ProjectWorkflow project={project} next={next.slug === project.slug ? undefined : next} />;
}
