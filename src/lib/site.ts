export const PRODUCTION_URL = "https://showcase.olishiz.com";

/**
 * Absolute origin for metadata, the sitemap and robots.txt. Production
 * deployments use the custom domain; previews use their own deployment URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production"
    ? PRODUCTION_URL
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:4317");
