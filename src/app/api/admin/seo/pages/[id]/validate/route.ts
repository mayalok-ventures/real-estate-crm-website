import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getPageById, getPages } from "@/lib/seo/store";
import { validateSeoQuality } from "@/lib/seo/quality-gate";

export async function POST(
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

    const allPages = await getPages();
    const result = validateSeoQuality(page, allPages);

    return NextResponse.json({
      success: true,
      data: {
        pageId: id,
        slug: page.slug,
        title: page.title,
        ...result,
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/seo/pages/[id]/validate error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to validate page" },
      { status: 500 }
    );
  }
}
