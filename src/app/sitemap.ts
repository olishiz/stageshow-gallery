import type { MetadataRoute } from "next";
import { SHOWCASES } from "@/lib/registry";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...SHOWCASES.map((s) => ({
      url: `${SITE_URL}/components/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
