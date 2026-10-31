import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/registry";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Stageshow Gallery",
    short_name: "Stageshow",
    description:
      "Showcase UI by Oliver Sim: bento grids, animated product stills, cards, heroes and micro-interactions. Works offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    categories: ["design", "developer", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: CATEGORIES.slice(0, 4).map((c) => ({
      name: c.label,
      url: `/?category=${c.id}`,
      icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    })),
  };
}
