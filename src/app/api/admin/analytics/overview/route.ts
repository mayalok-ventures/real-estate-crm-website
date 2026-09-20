import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getAnalyticsOverview } from "@/lib/analytics-store";

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

    const db = getCloudflareD1(request);
    const data = await getAnalyticsOverview(db);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        timeRange: "All Active Windows",
        generatedAt: new Date().toISOString(),
        liveWindowMinutes: 5
      }
    });
  } catch (error: any) {
    console.error("GET /api/admin/analytics/overview error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch analytics overview" },
      { status: 500 }
    );
  }
}
