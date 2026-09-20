import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getSeoAlerts, evaluateSeoAlerts } from "@/lib/seo/alert-engine";
import { AlertStatus, AlertSeverity } from "@/lib/seo/types";

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

    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") as AlertStatus) || undefined;
    const severity = (searchParams.get("severity") as AlertSeverity) || undefined;

    const alerts = await getSeoAlerts({ status, severity });

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/alerts error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve SEO alerts" },
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
    } catch {}

    const customThresholds = body?.thresholds || {};
    const evaluated = await evaluateSeoAlerts(customThresholds);

    return NextResponse.json({
      success: true,
      data: evaluated,
      count: evaluated.length,
      message: `Evaluated system metrics against active thresholds. Generated ${evaluated.length} alerts.`,
    });
  } catch (error: any) {
    console.error("POST /api/admin/seo/alerts error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to evaluate SEO alerts" },
      { status: 500 }
    );
  }
}
