import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getPages, createPage } from "@/lib/seo/store";
import { validateSeoQuality } from "@/lib/seo/quality-gate";


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

    const { searchParams } = new URL(request.url);
    const pageType = searchParams.get("pageType") || undefined;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const pages = await getPages({ pageType, status, search });

    return NextResponse.json({
      success: true,
      data: pages,
      count: pages.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/pages error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch SEO pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const body = await request.json();
    const existingPages = await getPages();

    // Run Quality Gate Validation
    const validation = validateSeoQuality(body, existingPages);
    if (!validation.passed && body.publicationStatus === "published") {
      return NextResponse.json(
        {
          success: false,
          error: "Page cannot be published due to SEO quality gate failures.",
          issues: validation.issues,
          warnings: validation.warnings,
          score: validation.score,
        },
        { status: 422 }
      );
    }

    const created = await createPage({
      slug: body.slug,
      pageType: body.pageType || "commercial_landing",
      primaryTopicId: body.primaryTopicId || "",
      searchIntent: body.searchIntent || "commercial_investigation",
      primaryKeyword: body.primaryKeyword || "",
      secondaryKeywords: Array.isArray(body.secondaryKeywords) ? body.secondaryKeywords : [],
      country: body.country || "IN",
      language: body.language || "en",
      locale: body.locale || "en-in",
      title: body.title || "",
      metaDescription: body.metaDescription || "",
      h1: body.h1 || "",
      bodyContent: body.bodyContent || "",
      canonicalUrl: body.canonicalUrl || `https://sahyak.com/${body.slug}`,
      hreflangReferences: Array.isArray(body.hreflangReferences) ? body.hreflangReferences : [],
      schemaType: body.schemaType || "WebSite",
      schemaConfig: body.schemaConfig || {},
      isIndexable: Boolean(body.isIndexable),
      publicationStatus: body.publicationStatus || "draft",
      breadcrumbHierarchy: Array.isArray(body.breadcrumbHierarchy) ? body.breadcrumbHierarchy : [],
      parentTopic: body.parentTopic || undefined,
      relatedPages: Array.isArray(body.relatedPages) ? body.relatedPages : [],
      qualityScore: validation.score,
      qualityIssues: [...validation.issues, ...validation.warnings],
    });

    return NextResponse.json({
      success: true,
      data: created,
      validation,
    });
  } catch (error: any) {
    console.error("POST /api/admin/seo/pages error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create SEO page" },
      { status: 500 }
    );
  }
}
