export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { clearLeads } from "@/lib/leads-store";
import { clearAnalyticsStore } from "@/lib/analytics-store";

export async function POST(request: NextRequest) {
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
    await clearLeads(db);
    await clearAnalyticsStore(db);

    return NextResponse.json({
      success: true,
      message: "All test leads and telemetry records have been purged. Clean state active."
    });
  } catch (error: any) {
    console.error("Admin data reset error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to reset administrative data." },
      { status: 500 }
    );
  }
}
