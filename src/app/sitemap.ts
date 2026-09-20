import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getPages } from "@/lib/seo/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/+$/, "");
  const pages = await getPages();

  // Strictly filter only indexable, published, non-draft, non-admin pages
  const indexablePages = pages.filter(
    (page) =>
      page.isIndexable &&
      page.publicationStatus === "published" &&
      !page.slug.startsWith("admin") &&
      !page.slug.startsWith("api")
  );

  return indexablePages.map((page) => {
    const route = page.slug === "" ? "" : `/${page.slug}`;
    let priority = 0.7;
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly";

    if (page.slug === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (page.pageType === "commercial_landing" || page.pageType === "feature") {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (page.pageType === "problem_solution" || page.pageType === "tool") {
      priority = 0.8;
      changeFrequency = "weekly";
    }

    return {
      url: page.canonicalUrl || `${baseUrl}${route}`,
      lastModified: new Date(page.updatedAt || Date.now()),
      changeFrequency,
      priority,
    };
  });
}
