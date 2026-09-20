export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getPageById, updatePage, deletePage, getPages } from "@/lib/seo/store";
import { validateSeoQuality } from "@/lib/seo/quality-gate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const { id } = await params;
    const page = await getPageById(id);
    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error: any) {
    console.error("GET /api/admin/seo/pages/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch page" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await getPageById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    const body = await request.json();
    const allPages = await getPages();

    // Check Quality Gate
    const proposed = { ...existing, ...body };
    const validation = validateSeoQuality(proposed, allPages);

    if (body.publicationStatus === "published" && !validation.passed) {
      return NextResponse.json(
        {
          success: false,
          error: "Page cannot be marked published due to quality gate failures.",
          issues: validation.issues,
          warnings: validation.warnings,
          score: validation.score,
        },
        { status: 422 }
      );
    }

    const updated = await updatePage(id, {
      ...body,
      qualityScore: validation.score,
      qualityIssues: [...validation.issues, ...validation.warnings],
    });

    return NextResponse.json({
      success: true,
      data: updated,
      validation,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/seo/pages/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update page" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await deletePage(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Page not found or cannot be deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/admin/seo/pages/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete page" },
      { status: 500 }
    );
  }
}
