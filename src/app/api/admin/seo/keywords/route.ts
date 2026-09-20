import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getKeywords, createKeyword } from "@/lib/seo/store";


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

    const keywords = await getKeywords();

    return NextResponse.json({
      success: true,
      data: keywords,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/keywords error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch SEO keywords" },
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
    if (!body.keyword || !body.topicId || !body.searchIntent) {
      return NextResponse.json(
        { success: false, error: "Missing required keyword fields (keyword, topicId, searchIntent)" },
        { status: 400 }
      );
    }

    const created = await createKeyword({
      keyword: body.keyword,
      normalizedKeyword: body.normalizedKeyword || body.keyword.toLowerCase().trim(),
      topicId: body.topicId,
      searchIntent: body.searchIntent,
      priority: body.priority || "medium",
      country: body.country || "IN",
      language: body.language || "en",
      locale: body.locale || "en-in",
      source: body.source || "Manual Entry",
      sourceUrl: body.sourceUrl,
      researchDate: body.researchDate || new Date().toISOString().split("T")[0],
      searchVolume: null,
      volumeSource: undefined,
      difficulty: body.difficulty,
      difficultySource: body.difficultySource || "SERP analysis",
      commercialValue: body.commercialValue,
      mappedPageId: body.mappedPageId,
      targetPageId: body.targetPageId,
      targetUrl: body.targetUrl,
      status: body.status || "unmapped",
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST /api/admin/seo/keywords error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create SEO keyword" },
      { status: 500 }
    );
  }
}
