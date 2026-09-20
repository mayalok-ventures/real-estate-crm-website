import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getSeoConversionAttribution } from "@/lib/seo/conversion-attribution";

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

    const data = await getSeoConversionAttribution();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/conversion error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch SEO conversion attribution" },
      { status: 500 }
    );
  }
}
