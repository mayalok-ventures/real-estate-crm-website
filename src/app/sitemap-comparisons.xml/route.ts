export const runtime = "edge";

import { NextResponse } from "next/server";
import { getPages } from "@/lib/seo/store";


export async function GET() {
  const pages = await getPages({ status: "published" });
  const filtered = pages.filter(
    (p) => p.isIndexable && p.pageType === "comparison"
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${filtered
  .map(
    (p) => `  <url>
    <loc>${p.canonicalUrl}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
