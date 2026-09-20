import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getPages } from "@/lib/seo/store";
import { siteConfig } from "@/lib/config";


export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const baseUrl = siteConfig.url.replace(/\/+$/, "");
    const pages = await getPages({ status: "published" });
    const indexablePages = pages.filter((p) => p.isIndexable);

    const segments = [
      {
        name: "sitemap.xml (Comprehensive Index)",
        url: `${baseUrl}/sitemap.xml`,
        pageCount: indexablePages.length,
        status: "Active",
        changeFrequency: "daily",
      },
      {
        name: "sitemap-pages.xml (Commercial & Feature)",
        url: `${baseUrl}/sitemap-pages.xml`,
        pageCount: indexablePages.filter((p) => p.pageType === "commercial_landing" || p.pageType === "feature").length,
        status: "Active",
        changeFrequency: "daily",
      },
      {
        name: "sitemap-solutions.xml (Problem / Solution)",
        url: `${baseUrl}/sitemap-solutions.xml`,
        pageCount: indexablePages.filter((p) => p.pageType === "problem_solution" || p.pageType === "industry_solution").length,
        status: "Active",
        changeFrequency: "weekly",
      },
      {
        name: "sitemap-learn.xml (Educational / Playbooks)",
        url: `${baseUrl}/sitemap-learn.xml`,
        pageCount: indexablePages.filter((p) => p.pageType === "educational_learning").length,
        status: "Active",
        changeFrequency: "weekly",
      },
      {
        name: "sitemap-tools.xml (Interactive Calculators)",
        url: `${baseUrl}/sitemap-tools.xml`,
        pageCount: indexablePages.filter((p) => p.pageType === "tool").length,
        status: "Active",
        changeFrequency: "monthly",
      },
      {
        name: "sitemap-comparisons.xml (Category Alternatives)",
        url: `${baseUrl}/sitemap-comparisons.xml`,
        pageCount: indexablePages.filter((p) => p.pageType === "comparison").length,
        status: "Active",
        changeFrequency: "monthly",
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalSitemaps: segments.length,
        totalIndexedUrls: indexablePages.length,
        robotsUrl: `${baseUrl}/robots.txt`,
        segments,
        lastGenerated: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/sitemaps error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch sitemaps status" },
      { status: 500 }
    );
  }
}
