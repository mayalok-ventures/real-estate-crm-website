export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { updateAlertStatus } from "@/lib/seo/alert-engine";
import { AlertStatus } from "@/lib/seo/types";

export async function PATCH(
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
    const body = await request.json();
    const status = body?.status as AlertStatus;

    if (!status || !["open", "acknowledged", "resolved", "dismissed"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status. Must be open, acknowledged, resolved, or dismissed" },
        { status: 400 }
      );
    }

    const success = await updateAlertStatus(id, status);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Alert not found or failed to update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Alert ${id} updated to ${status}`,
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/seo/alerts/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update alert" },
      { status: 500 }
    );
  }
}
