export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getAllLeads } from "@/lib/leads-store";
import { getAdminAnalytics } from "@/lib/analytics-store";
import {
  generateLeadsCsv,
  generateLeadsJson,
  generateAnalyticsCsv,
  generateAnalyticsJson
} from "@/lib/analytics-export";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return new NextResponse("Unauthorized access", { status: 401 });
    }

    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return new NextResponse("Invalid or expired session", { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const exportType = searchParams.get("type") || "leads";
    const format = searchParams.get("format") || "csv";

    const db = getCloudflareD1(request);
    const dateStr = new Date().toISOString().split("T")[0];

    if (exportType === "analytics") {
      const analytics = await getAdminAnalytics(db, 30);
      if (format === "json") {
        const jsonContent = generateAnalyticsJson(analytics);
        return new NextResponse(jsonContent, {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="sahyak-analytics-${dateStr}.json"`,
            "Cache-Control": "no-store, no-cache, must-revalidate"
          }
        });
      } else {
        const csvContent = generateAnalyticsCsv(analytics);
        return new NextResponse(csvContent, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="sahyak-telemetry-${dateStr}.csv"`,
            "Cache-Control": "no-store, no-cache, must-revalidate"
          }
        });
      }
    }

    // Default: Leads export
    const leads = await getAllLeads(db);
    if (format === "json") {
      const jsonContent = generateLeadsJson(leads);
      return new NextResponse(jsonContent, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="sahyak-leads-${dateStr}.json"`,
          "Cache-Control": "no-store, no-cache, must-revalidate"
        }
      });
    }

    const csvContent = generateLeadsCsv(leads);
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="sahyak-leads-${dateStr}.csv"`,
        "Cache-Control": "no-store, no-cache, must-revalidate"
      }
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return new NextResponse("Failed to export administrative data", { status: 500 });
  }
}
