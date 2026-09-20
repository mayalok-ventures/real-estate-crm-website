export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { syncSearchConsoleData } from "@/lib/seo/gsc-client";
import { evaluateSearchOpportunities } from "@/lib/seo/opportunity-engine";

/**
 * Cloudflare Scheduled Worker / External Cron Trigger Ingress
 *
 * Designed for Cloudflare Pages / Workers Cron Triggers or HTTP-based scheduled jobs.
 * Enforces CRON_SECRET authorization when configured in environment.
 * Executes idempotent incremental search console metrics synchronization.
 */
export async function GET(request: NextRequest) {
  return handleCronSync(request);
}

export async function POST(request: NextRequest) {
  return handleCronSync(request);
}

async function handleCronSync(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7).trim() : null;
      const urlSecret = request.nextUrl.searchParams.get("secret");

      if (bearerToken !== cronSecret && urlSecret !== cronSecret) {
        return NextResponse.json(
          { success: false, error: "Unauthorized cron execution. Invalid or missing secret." },
          { status: 401 }
        );
      }
    }

    // Execute idempotent sync for latest date window
    const syncResult = await syncSearchConsoleData();

    // Trigger opportunity evaluation if metrics were ingested
    let opportunitiesEvaluated = 0;
    if (syncResult.success && syncResult.ingestedCount > 0) {
      try {
        const opps = await evaluateSearchOpportunities();
        opportunitiesEvaluated = opps.length;
      } catch (oppErr) {
        console.warn("[Cron Sync Opportunity Evaluation Notice]:", oppErr);
      }
    }

    return NextResponse.json({
      success: syncResult.success,
      action: "cron_search_console_sync",
      data: syncResult,
      opportunitiesEvaluated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Cron Sync Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal cron execution error" },
      { status: 500 }
    );
  }
}
