export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { syncSearchConsoleData, getGscSyncState } from "@/lib/seo/gsc-client";
import { evaluateSearchOpportunities } from "@/lib/seo/opportunity-engine";

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

    const state = await getGscSyncState();
    return NextResponse.json({
      success: true,
      data: state,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/performance/sync error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve sync state" },
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

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const startDate = body?.startDate ? String(body.startDate).trim() : undefined;
    const endDate = body?.endDate ? String(body.endDate).trim() : undefined;
    const backfillDays = body?.backfillDays ? Number(body.backfillDays) : undefined;

    const result = await syncSearchConsoleData({ startDate, endDate, backfillDays });

    // If sync succeeded and ingested metrics, evaluate opportunities automatically
    if (result.success && result.ingestedCount > 0) {
      try {
        await evaluateSearchOpportunities();
      } catch (oppErr) {
        console.warn("[Opportunity Engine Post-Sync Warning]:", oppErr);
      }
    }

    return NextResponse.json({
      success: result.success,
      data: result,
    });
  } catch (error: any) {
    console.error("POST /api/admin/seo/performance/sync error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to synchronize Google Search Console data" },
      { status: 500 }
    );
  }
}

