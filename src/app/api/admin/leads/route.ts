export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { getAllLeads, LeadStatus } from "@/lib/leads-store";

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
    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get("status");
    const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();

    let leads = await getAllLeads(db);

    const stageCounts: Record<string, number> = {
      All: leads.length,
      New: 0,
      Contacted: 0,
      Qualified: 0,
      "Demo Scheduled": 0,
      Converted: 0,
      Closed: 0
    };

    leads.forEach((l) => {
      const s = l.status || "New";
      if (stageCounts[s] !== undefined) {
        stageCounts[s]++;
      }
    });

    if (statusFilter && statusFilter !== "All") {
      leads = leads.filter((l) => (l.status || "New") === statusFilter);
    }

    if (searchQuery) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery) ||
          l.email.toLowerCase().includes(searchQuery) ||
          l.phone.toLowerCase().includes(searchQuery) ||
          (l.company && l.company.toLowerCase().includes(searchQuery)) ||
          (l.notes && l.notes.toLowerCase().includes(searchQuery))
      );
    }

    return NextResponse.json({
      success: true,
      data: leads,
      meta: {
        totalRecords: leads.length,
        stageCounts,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch leads pipeline" },
      { status: 500 }
    );
  }
}
