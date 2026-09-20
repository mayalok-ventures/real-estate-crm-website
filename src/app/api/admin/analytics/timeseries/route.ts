export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getTimeseriesData } from "@/lib/analytics-store";

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
    const rawRange = (searchParams.get("range") || "7D").toUpperCase();
    const range = (rawRange === "30D" || rawRange === "6M" || rawRange === "1Y" ? rawRange : "7D") as "7D" | "30D" | "6M" | "1Y";

    const db = getCloudflareD1(request);
    const data = await getTimeseriesData(db, range);

    return NextResponse.json({
      success: true,
      data,
      meta: {
        timeRange: range,
        generatedAt: new Date().toISOString(),
        pointCount: data.length
      }
    });
  } catch (error: any) {
    console.error("GET /api/admin/analytics/timeseries error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch time-series data" },
      { status: 500 }
    );
  }
}
