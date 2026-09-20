import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import {
  getContentOpportunities,
  updateOpportunityStatus,
  evaluateSearchOpportunities,
} from "@/lib/seo/opportunity-engine";
import { OpportunityClassification, OpportunityStatus } from "@/lib/seo/types";

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
    const classification = (searchParams.get("classification") as OpportunityClassification) || undefined;
    const status = (searchParams.get("status") as OpportunityStatus) || undefined;
    const autoEvaluate = searchParams.get("recalculate") === "true";

    if (autoEvaluate) {
      await evaluateSearchOpportunities();
    }

    const opportunities = await getContentOpportunities({ classification, status });

    return NextResponse.json({
      success: true,
      data: {
        opportunities,
        total: opportunities.length,
        breakdown: {
          optimizeExisting: opportunities.filter((o) => o.classification === "optimize_existing_page").length,
          newPageCandidates: opportunities.filter((o) => o.classification === "new_page_candidate").length,
          internalLinkOps: opportunities.filter((o) => o.classification === "internal_link_opportunity").length,
          metadataOps: opportunities.filter((o) => o.classification === "metadata_opportunity").length,
          cannibalizationRisks: opportunities.filter((o) => o.classification === "cannibalization_risk").length,
        },
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/opportunities error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch content opportunities" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }
    const auth = await verifyAdminSessionToken(token);
    if (!auth.valid) {
      return NextResponse.json({ success: false, error: "Invalid or expired session" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id and status" },
        { status: 400 }
      );
    }

    const validStatuses: OpportunityStatus[] = [
      "opportunity",
      "review",
      "approved",
      "in_progress",
      "updated",
      "dismissed",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await updateOpportunityStatus(id, status);

    return NextResponse.json({
      success: updated,
      message: updated ? `Opportunity status updated to '${status}'.` : "Opportunity not found.",
    });
  } catch (error: any) {
    console.error("PATCH /api/admin/seo/opportunities error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update opportunity status" },
      { status: 500 }
    );
  }
}
