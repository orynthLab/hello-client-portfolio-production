import type { MetadataRoute } from "next";
import { projects, metaSystem } from "@/data/projects";
import { services } from "@/data/services";

const SITE_URL = "https://www.orynthbuild.site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...projects.map((project) => ({
      url: `${SITE_URL}/projects/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/projects/${metaSystem.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
