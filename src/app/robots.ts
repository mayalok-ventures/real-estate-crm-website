import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/*?*",        // Prevents query parameter URL duplication / crawl traps
          "/*preview*",  // Prevents draft preview exposure
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/*?*"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/*?*"],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-pages.xml`,
      `${baseUrl}/sitemap-solutions.xml`,
      `${baseUrl}/sitemap-learn.xml`,
      `${baseUrl}/sitemap-tools.xml`,
      `${baseUrl}/sitemap-comparisons.xml`,
    ],
  };
}
