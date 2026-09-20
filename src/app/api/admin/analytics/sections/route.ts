export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getSectionDwellMetrics } from "@/lib/analytics-store";

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

    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get("days") || "30", 10);

    const db = getCloudflareD1(request);
    const data = await getSectionDwellMetrics(db, days);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        instrumentation: "IntersectionObserver Client Telemetry",
        timeRange: `Past ${days} Days`,
        generatedAt: new Date().toISOString(),
        sectionCount: data.length
      }
    });
  } catch (error: any) {
    console.error("GET /api/admin/analytics/sections error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch section engagement metrics" },
      { status: 500 }
    );
  }
}
