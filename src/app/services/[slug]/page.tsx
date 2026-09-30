import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getService } from "@/data/services";
import { getProject } from "@/data/projects";
import ServiceExperience from "@/components/ServiceExperience";
import { jsonLd } from "@/lib/jsonLd";

const SITE_URL = "https://www.orynthbuild.site";

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

  // `seoTitle` is the search-facing name and is deliberately not `name`: the
  // page can be headed "AI Agent Development" while the title tag competes as
  // "AI Agent Development Services". No `keywords` meta — it carries no weight
  // and the SEO pass removed it everywhere.
  return {
    title: service.seoTitle,
    description: service.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${service.seoTitle} | OrynthBuild`,
      description: service.description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.seoTitle} | OrynthBuild`,
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
  const relatedServices = service.relatedServiceSlugs
    .map((relatedSlug) => services.find((candidate) => candidate.slug === relatedSlug))
    .filter((relatedService): relatedService is (typeof services)[number] => Boolean(relatedService));

  // Service + BreadcrumbList + FAQPage, all pointing at the Organization
  // declared once in layout.tsx rather than re-describing the company here.
  //
  // The FAQ markup is emitted only alongside the FAQ section ServiceExperience
  // renders: Google requires FAQ structured data to match FAQs a visitor can
  // actually see, which is why this schema lives here and not on the homepage.
  //
  // Schema stays in this server component while the page body is a client one,
  // so it is in the prerendered HTML a crawler reads without waiting on React.
  const serviceUrl = `${SITE_URL}/services/${service.slug}`;
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: serviceUrl,
    provider: { "@id": `${SITE_URL}/#organization` },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: service.name, item: serviceUrl },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbJsonLd) }}
      />
      {service.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd) }}
        />
      )}
      <ServiceExperience
        service={service}
        relatedProjects={relatedProjects}
        relatedServices={relatedServices}
      />
    </>
  );
}
