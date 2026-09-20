/**
 * SAHYAK CRM — International Market Intelligence Layer (Phase 4G)
 *
 * Aggregates real country-level search performance from Google Search Console
 * and first-party visitor telemetry to monitor international search visibility without
 * generating doorway or thin localization pages.
 *
 * CLASSIFICATIONS:
 * - observed: Stable organic impressions (>50) and active queries detected.
 * - emerging: Growing impressions (<50, >10) or early click activity.
 * - insufficient_data: Minimal data (<10 impressions).
 */

import { MarketIntelligenceItem } from "./types";
import { getSearchConsoleMetrics } from "./store";
import { getD1Database, executeD1Query, ensureD1Schema } from "@/lib/d1-database";

const COUNTRY_NAMES: Record<string, string> = {
  IND: "India",
  IN: "India",
  ARE: "United Arab Emirates",
  AE: "United Arab Emirates",
  USA: "United States",
  US: "United States",
  GBR: "United Kingdom",
  GB: "United Kingdom",
  SGP: "Singapore",
  SG: "Singapore",
  CAN: "Canada",
  CA: "Canada",
  AUS: "Australia",
  AU: "Australia",
  MYS: "Malaysia",
  MY: "Malaysia",
  SAU: "Saudi Arabia",
  SA: "Saudi Arabia",
  QAT: "Qatar",
  QA: "Qatar",
};

export async function getMarketIntelligence(): Promise<MarketIntelligenceItem[]> {
  const gscMetrics = await getSearchConsoleMetrics();
  const db = getD1Database();

  // Aggregate GSC by country
  const countryGscMap = new Map<
    string,
    {
      impressions: number;
      clicks: number;
      sumCtr: number;
      sumPos: number;
      count: number;
      queries: Map<string, { clicks: number; impressions: number }>;
      pages: Map<string, { clicks: number; impressions: number }>;
    }
  >();

  for (const m of gscMetrics) {
    const rawCountry = (m.country || "IND").toUpperCase();
    const existing = countryGscMap.get(rawCountry);

    if (!existing) {
      const queries = new Map<string, { clicks: number; impressions: number }>();
      queries.set(m.query, { clicks: m.clicks, impressions: m.impressions });
      const pages = new Map<string, { clicks: number; impressions: number }>();
      pages.set(m.page, { clicks: m.clicks, impressions: m.impressions });

      countryGscMap.set(rawCountry, {
        impressions: m.impressions,
        clicks: m.clicks,
        sumCtr: m.ctr,
        sumPos: m.position,
        count: 1,
        queries,
        pages,
      });
    } else {
      existing.impressions += m.impressions;
      existing.clicks += m.clicks;
      existing.sumCtr += m.ctr;
      existing.sumPos += m.position;
      existing.count += 1;

      const q = existing.queries.get(m.query) || { clicks: 0, impressions: 0 };
      q.clicks += m.clicks;
      q.impressions += m.impressions;
      existing.queries.set(m.query, q);

      const p = existing.pages.get(m.page) || { clicks: 0, impressions: 0 };
      p.clicks += m.clicks;
      p.impressions += m.impressions;
      existing.pages.set(m.page, p);
    }
  }

  // Aggregate local visitor and lead telemetry by country if DB available
  const countryVisitorMap = new Map<string, number>();
  const countryLeadMap = new Map<string, number>();

  if (db) {
    try {
      await ensureD1Schema(db);
      const visitorRows = await executeD1Query<{ country: string; count: number }>(
        db,
        "SELECT country, COUNT(*) as count FROM visitors WHERE country != '' GROUP BY country"
      );
      if (visitorRows) {
        for (const row of visitorRows) {
          countryVisitorMap.set(row.country.toUpperCase(), row.count);
        }
      }

      const leadRows = await executeD1Query<{ ip_address: string; count: number }>(
        db,
        "SELECT status, COUNT(*) as count FROM leads GROUP BY status"
      );
      // We don't fabricate country leads unless real country is recorded in lead
    } catch (err) {
      console.warn("[Market Intelligence DB Query Notice]:", err);
    }
  }

  // Build MarketIntelligenceItem array
  const results: MarketIntelligenceItem[] = [];

  for (const [countryCode, data] of countryGscMap.entries()) {
    const avgCtr = parseFloat((data.sumCtr / data.count).toFixed(2));
    const avgPos = parseFloat((data.sumPos / data.count).toFixed(1));
    const visitors = countryVisitorMap.get(countryCode) || 0;
    const leads = countryLeadMap.get(countryCode) || 0;

    let conversionRate = "Insufficient data";
    if (visitors > 0 && leads > 0) {
      conversionRate = `${((leads / visitors) * 100).toFixed(1)}%`;
    }

    // Sort Top Queries
    const topQueries = Array.from(data.queries.entries())
      .map(([query, qData]) => ({ query, clicks: qData.clicks, impressions: qData.impressions }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5);

    // Sort Top Landing Pages
    const topLandingPages = Array.from(data.pages.entries())
      .map(([page, pData]) => ({ page, clicks: pData.clicks, impressions: pData.impressions }))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 5);

    let status: "observed" | "emerging" | "insufficient_data" = "insufficient_data";
    if (data.impressions >= 50 || data.clicks >= 3) {
      status = "observed";
    } else if (data.impressions >= 10) {
      status = "emerging";
    }

    results.push({
      country: countryCode,
      countryName: COUNTRY_NAMES[countryCode] || countryCode,
      organicVisitors: visitors,
      impressions: data.impressions,
      clicks: data.clicks,
      ctr: avgCtr,
      averagePosition: avgPos,
      capturedLeads: leads,
      conversionRate,
      topQueries,
      topLandingPages,
      status,
    });
  }

  // If no GSC data is connected yet, return default baseline indicating unconfigured state
  if (results.length === 0) {
    const defaultCountry = "IN";
    const visitors = countryVisitorMap.get(defaultCountry) || 0;
    results.push({
      country: defaultCountry,
      countryName: "India (Primary Market)",
      organicVisitors: visitors,
      impressions: 0,
      clicks: 0,
      ctr: 0.0,
      averagePosition: 0.0,
      capturedLeads: 0,
      conversionRate: "Insufficient data",
      topQueries: [],
      topLandingPages: [],
      status: "insufficient_data",
    });
  }

  return results.sort((a, b) => b.impressions - a.impressions);
}
