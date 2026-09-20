export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getAuditIssues } from "@/lib/seo/store";
import { runSeoAudit } from "@/lib/seo/audit-crawler";


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

    const { issues, lastAuditDate } = await getAuditIssues();

    return NextResponse.json({
      success: true,
      data: {
        issues,
        totalIssues: issues.length,
        criticalCount: issues.filter((i) => i.severity === "critical").length,
        warningCount: issues.filter((i) => i.severity === "warning").length,
        infoCount: issues.filter((i) => i.severity === "info").length,
        lastAuditDate,
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/audit error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch audit issues" },
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

    // Run live audit crawl
    const result = await runSeoAudit();

    return NextResponse.json({
      success: true,
      data: {
        issues: result.issues,
        totalIssues: result.issues.length,
        scannedPages: result.scannedPages,
        passedChecks: result.passedChecks,
        criticalCount: result.issues.filter((i) => i.severity === "critical").length,
        warningCount: result.issues.filter((i) => i.severity === "warning").length,
        infoCount: result.issues.filter((i) => i.severity === "info").length,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/admin/seo/audit error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to run live SEO audit" },
      { status: 500 }
    );
  }
}
