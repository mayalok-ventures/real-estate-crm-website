export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSessionToken } from "@/lib/security";
import { getSearchConsoleMetrics } from "@/lib/seo/store";
import { isGscConfigured } from "@/lib/seo/gsc-client";
import { SearchConsoleMetric } from "@/lib/seo/types";


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
    const query = searchParams.get("query") || undefined;
    const page = searchParams.get("page") || undefined;
    const timeRange = searchParams.get("timeRange") || "28d"; // 7d, 28d, 3m, 6m, 12m, custom
    const customStart = searchParams.get("startDate") || undefined;
    const customEnd = searchParams.get("endDate") || undefined;

    const gscConnected = isGscConfigured();

    // Determine start date filter
    const now = new Date();
    let startDate: string | undefined = customStart;
    if (!startDate) {
      let days = 28;
      if (timeRange === "7d") days = 7;
      else if (timeRange === "28d") days = 28;
      else if (timeRange === "3m") days = 90;
      else if (timeRange === "6m") days = 180;
      else if (timeRange === "12m") days = 365;

      const d = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      startDate = d.toISOString().split("T")[0];
    }

    let allMetrics = await getSearchConsoleMetrics({ query, page });

    // Filter by date range if present
    if (startDate) {
      allMetrics = allMetrics.filter((m) => m.date >= (startDate as string));
    }
    if (customEnd) {
      allMetrics = allMetrics.filter((m) => m.date <= customEnd);
    }

    const totalClicks = allMetrics.reduce((acc, m) => acc + (m.clicks || 0), 0);
    const totalImpressions = allMetrics.reduce((acc, m) => acc + (m.impressions || 0), 0);
    const avgCtr =
      totalImpressions > 0
        ? ((totalClicks / totalImpressions) * 100).toFixed(2)
        : "0.00";
    const avgPosition =
      allMetrics.length > 0
        ? (allMetrics.reduce((acc, m) => acc + (m.position || 0), 0) / allMetrics.length).toFixed(1)
        : "0.0";

    // 1. Top Queries aggregation
    const queryMap = new Map<string, { query: string; clicks: number; impressions: number; sumPos: number; count: number }>();
    for (const m of allMetrics) {
      const q = m.query;
      const ex = queryMap.get(q) || { query: q, clicks: 0, impressions: 0, sumPos: 0, count: 0 };
      ex.clicks += m.clicks;
      ex.impressions += m.impressions;
      ex.sumPos += m.position;
      ex.count += 1;
      queryMap.set(q, ex);
    }
    const topQueries = Array.from(queryMap.values())
      .map((q) => ({
        query: q.query,
        clicks: q.clicks,
        impressions: q.impressions,
        ctr: q.impressions > 0 ? ((q.clicks / q.impressions) * 100).toFixed(2) : "0.00",
        position: (q.sumPos / q.count).toFixed(1),
      }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, 50);

    // 2. Top Pages aggregation
    const pageMap = new Map<string, { page: string; clicks: number; impressions: number; sumPos: number; count: number }>();
    for (const m of allMetrics) {
      const p = m.page;
      const ex = pageMap.get(p) || { page: p, clicks: 0, impressions: 0, sumPos: 0, count: 0 };
      ex.clicks += m.clicks;
      ex.impressions += m.impressions;
      ex.sumPos += m.position;
      ex.count += 1;
      pageMap.set(p, ex);
    }
    const topPages = Array.from(pageMap.values())
      .map((p) => ({
        page: p.page,
        clicks: p.clicks,
        impressions: p.impressions,
        ctr: p.impressions > 0 ? ((p.clicks / p.impressions) * 100).toFixed(2) : "0.00",
        position: (p.sumPos / p.count).toFixed(1),
      }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, 50);

    // 3. Country aggregation
    const countryMap = new Map<string, { country: string; clicks: number; impressions: number }>();
    for (const m of allMetrics) {
      const c = m.country || "IND";
      const ex = countryMap.get(c) || { country: c, clicks: 0, impressions: 0 };
      ex.clicks += m.clicks;
      ex.impressions += m.impressions;
      countryMap.set(c, ex);
    }
    const topCountries = Array.from(countryMap.values())
      .map((c) => ({
        country: c.country,
        clicks: c.clicks,
        impressions: c.impressions,
        ctr: c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : "0.00",
      }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);

    // 4. Device aggregation
    const deviceMap = new Map<string, { device: string; clicks: number; impressions: number }>();
    for (const m of allMetrics) {
      const d = m.device || "DESKTOP";
      const ex = deviceMap.get(d) || { device: d, clicks: 0, impressions: 0 };
      ex.clicks += m.clicks;
      ex.impressions += m.impressions;
      deviceMap.set(d, ex);
    }
    const deviceBreakdown = Array.from(deviceMap.values()).map((d) => ({
      device: d.device,
      clicks: d.clicks,
      impressions: d.impressions,
      ctr: d.impressions > 0 ? ((d.clicks / d.impressions) * 100).toFixed(2) : "0.00",
    }));

    // 5. Daily Trend
    const trendMap = new Map<string, { date: string; clicks: number; impressions: number }>();
    for (const m of allMetrics) {
      const dt = m.date;
      const ex = trendMap.get(dt) || { date: dt, clicks: 0, impressions: 0 };
      ex.clicks += m.clicks;
      ex.impressions += m.impressions;
      trendMap.set(dt, ex);
    }
    const dailyTrend = Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: {
        connected: gscConnected,
        configurationStatus: gscConnected
          ? "Google Search Console API connected (Live Service Account Authentication Active)"
          : "Search Console not connected",
        timeRange,
        dateFilter: {
          startDate: startDate || null,
          endDate: customEnd || null,
        },
        summary: {
          totalClicks,
          totalImpressions,
          avgCtr: `${avgCtr}%`,
          avgPosition,
          totalRecords: allMetrics.length,
        },
        topQueries,
        topPages,
        topCountries,
        deviceBreakdown,
        dailyTrend,
        rawMetrics: allMetrics.slice(0, 100),
      },
    });
  } catch (error: any) {
    console.error("GET /api/admin/seo/performance error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch search performance" },
      { status: 500 }
    );
  }
}
