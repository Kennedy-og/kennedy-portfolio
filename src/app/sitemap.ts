import type { MetadataRoute } from "next";
import { readPortfolioData } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await readPortfolioData();
  const projectUrls = data.projects
    .filter((project) => project.published)
    .map((project) => ({
      url: `${siteUrl}/projects/${project.id}`,
      lastModified: new Date(project.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const staticRoutes = ["", "/about", "/projects", "/contact", "/resume"] as const;

  return [...staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  })), ...projectUrls];
}
