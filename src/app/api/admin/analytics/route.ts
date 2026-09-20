import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getAllLeads } from "@/lib/leads-store";
import { getAnalyticsOverview } from "@/lib/analytics-store";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const db = getCloudflareD1(request);
    const leads = await getAllLeads(db);
    const overview = await getAnalyticsOverview(db);

    return NextResponse.json({
      success: true,
      leads,
      overview,
      summary: {
        totalLeads: leads.length,
        uniqueVisitors: overview.uniqueVisitors["7D"],
        totalPageViews: overview.totalPageviews,
        avgDwellSeconds: overview.avgDwellSeconds,
        liveActiveVisitors: overview.liveVisitorsNow
      }
    });
  } catch (error: any) {
    console.error("Admin analytics query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch administrative telemetry" },
      { status: 500 }
    );
  }
}
