import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { caseStudies } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.9 },
  ];

  // Placeholder case studies are excluded until real ones are published.
  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies
    .filter((c) => !c.placeholder)
    .map((c) => ({
      url: `${base}/case-studies/${c.slug}`,
      lastModified: new Date(c.date),
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...caseStudyRoutes];
}
