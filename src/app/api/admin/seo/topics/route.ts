export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getTopics, getKeywords, getPages, createTopic } from "@/lib/seo/store";


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

    const [topics, keywords, pages] = await Promise.all([
      getTopics(),
      getKeywords(),
      getPages(),
    ]);

    const enriched = topics.map((topic) => {
      const topicKeywords = keywords.filter((k) => k.topicId === topic.id);
      const topicPages = pages.filter((p) => p.primaryTopicId === topic.id);
      return {
        ...topic,
        keywordsCount: topicKeywords.length,
        pagesCount: topicPages.length,
        keywords: topicKeywords.map((k) => ({
          id: k.id,
          keyword: k.keyword,
          normalizedKeyword: k.normalizedKeyword,
          searchIntent: k.searchIntent,
          priority: k.priority,
          difficulty: k.difficulty,
          commercialValue: k.commercialValue,
          status: k.status,
          source: k.source,
          researchDate: k.researchDate,
          targetUrl: k.targetUrl,
          mappedPageId: k.mappedPageId,
          notes: k.notes,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: enriched,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/topics error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch SEO topics" },
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
    if (!body.title || !body.slug || !body.description) {
      return NextResponse.json(
        { success: false, error: "Title, slug, and description are required" },
        { status: 400 }
      );
    }

    const created = await createTopic({
      title: body.title,
      slug: body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      description: body.description,
      parentTopicId: body.parentTopicId || undefined,
      pillarPageId: body.pillarPageId || undefined,
      clusterOrder: Number(body.clusterOrder) || 10,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    console.error("POST /api/admin/seo/topics error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create SEO topic" },
      { status: 500 }
    );
  }
}
