/**
 * Sahyak Production Analytics Engine
 * Provides privacy-conscious, real telemetry aggregation across D1 SQLite
 * and unified in-memory fallback store with zero fabricated data.
 */

import { executeD1Query, executeD1Run, verifyD1Connection, D1Database, D1ConnectionHealth } from "@/lib/d1-database";
import { getAllLeads } from "@/lib/leads-store";

export interface IngestEvent {
  type: "pageview" | "page_duration" | "section_engagement" | "heartbeat" | "cta_click";
  visitorId: string;
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landingPage?: string;
  durationSec?: number;
  sectionId?: string;
  isEntry?: boolean;
  isExit?: boolean;
  country?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  locale?: string;
  ts: number;
}

export interface TrafficDataPoint {
  date: string;
  visitors: number;
  pageviews: number;
  leads: number;
}

export interface ChannelMetrics {
  channel: string;
  visitors: number;
  share: string;
  leads: number;
  conversionRate: string;
}

export interface SectionDwellMetrics {
  sectionId: string;
  sectionName: string;
  views: number;
  engagedVisits: number;
  avgDwellSec: number;
}

export interface TopPageMetrics {
  path: string;
  views: number;
  visitors: number;
  share: string;
}

export interface CountryMetrics {
  countryCode: string;
  countryName: string;
  visitors: number;
  share: string;
}

export interface PlatformMetrics {
  devices: { device: string; count: number; share: string }[];
  browsers: { browser: string; count: number; share: string }[];
}

export interface LiveVisitorRecord {
  sessionId: string;
  visitorId: string;
  currentPath: string;
  lastSeen: number;
  country: string;
  city: string;
  device: string;
}

export interface AnalyticsOverview {
  liveVisitorsNow: number;
  liveWindowMinutes: number;
  uniqueVisitors: {
    "7D": number;
    "30D": number;
    "6M": number;
    "1Y": number;
  };
  totalPageviews: number;
  totalSessions: number;
  totalLeads: number;
  conversionRate: string;
  avgDwellSeconds: number;
  bounceRate: string;
  connectionHealth: D1ConnectionHealth;
  lastRefreshedAt: string;
}

export interface AdminAnalyticsData {
  timeWindow: string;
  summary: {
    totalVisitors: number;
    totalPageviews: number;
    totalSessions: number;
    bounceRate: string;
    avgSessionDurationSec: number;
    totalLeads: number;
    conversionRate: string;
    liveActiveVisitors: number;
  };
  trafficSeries: TrafficDataPoint[];
  topPages: TopPageMetrics[];
  sectionEngagement: SectionDwellMetrics[];
  channels: ChannelMetrics[];
  geo: CountryMetrics[];
  devices: { device: string; visitors: number; share: string }[];
  liveVisitorsList: LiveVisitorRecord[];
  connectionHealth?: D1ConnectionHealth;
}

// Global fallback storage for environments where Cloudflare D1 is not bound
interface GlobalAnalyticsState {
  events: IngestEvent[];
  liveVisitors: Map<string, LiveVisitorRecord>;
}

declare global {
  // eslint-disable-next-line no-var
  var __sahyakAnalyticsStore: GlobalAnalyticsState | undefined;
}

function getGlobalAnalyticsStore(): GlobalAnalyticsState {
  if (!globalThis.__sahyakAnalyticsStore) {
    globalThis.__sahyakAnalyticsStore = {
      events: [],
      liveVisitors: new Map()
    };
  }
  return globalThis.__sahyakAnalyticsStore;
}

export async function recordAnalyticsEvent(
  event: IngestEvent,
  db?: D1Database | null
): Promise<void> {
  const store = getGlobalAnalyticsStore();
  const nowIso = new Date(event.ts).toISOString();

  // 1. In-memory fallback recording
  try {
    store.events.push(event);
    if (store.events.length > 5000) {
      store.events.splice(0, store.events.length - 5000);
    }

    // Update live visitor record on any active event
    store.liveVisitors.set(event.sessionId, {
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      currentPath: event.path,
      lastSeen: event.ts,
      country: event.country || "IN",
      city: event.city || "",
      device: event.device || "Desktop"
    });

    // Prune live visitors older than 10 minutes from memory
    const cutoff = Date.now() - 10 * 60 * 1000;
    for (const [sid, visitor] of store.liveVisitors.entries()) {
      if (visitor.lastSeen < cutoff) {
        store.liveVisitors.delete(sid);
      }
    }
  } catch (err) {
    console.error("[Memory recordAnalyticsEvent Error]:", err);
  }

  // 2. Persist to Cloudflare D1 if available
  if (db) {
    try {
      if (event.type === "pageview") {
        await executeD1Run(
          db,
          `INSERT INTO visitors (
            visitor_id, first_seen, last_seen, total_sessions, total_pageviews,
            first_source, first_referrer, first_landing_page, country, city, device, browser, os, created_at, updated_at
          ) VALUES (?, ?, ?, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(visitor_id) DO UPDATE SET
            last_seen = excluded.last_seen,
            total_pageviews = visitors.total_pageviews + 1,
            updated_at = excluded.updated_at`,
          [
            event.visitorId,
            event.ts,
            event.ts,
            event.source || "Direct",
            event.referrer || "",
            event.landingPage || event.path,
            event.country || "IN",
            event.city || "",
            event.device || "Desktop",
            event.browser || "Other",
            event.os || "Other",
            nowIso,
            nowIso,
          ]
        );

        await executeD1Run(
          db,
          `INSERT INTO sessions (
            session_id, visitor_id, start_time, last_active, page_count, duration_sec,
            entry_page, exit_page, referrer, source, medium, campaign, term, content,
            country, city, device, browser, os, is_bounce, created_at
          ) VALUES (?, ?, ?, ?, 1, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
          ON CONFLICT(session_id) DO UPDATE SET
            last_active = excluded.last_active,
            page_count = sessions.page_count + 1,
            exit_page = excluded.exit_page,
            is_bounce = 0`,
          [
            event.sessionId,
            event.visitorId,
            event.ts,
            event.ts,
            event.landingPage || event.path,
            event.path,
            event.referrer || "",
            event.source || "Direct",
            event.medium || "",
            event.campaign || "",
            event.term || "",
            event.content || "",
            event.country || "IN",
            event.city || "",
            event.device || "Desktop",
            event.browser || "Other",
            event.os || "Other",
            nowIso,
          ]
        );

        const pvId = `pv_${event.ts.toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
        await executeD1Run(
          db,
          `INSERT INTO page_views (
            id, visitor_id, session_id, path, title, referrer, source,
            utm_campaign, duration_sec, entry_page, country, city, device,
            browser, os, is_entry, is_exit, ts, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
          [
            pvId,
            event.visitorId,
            event.sessionId,
            event.path,
            event.title || "",
            event.referrer || "",
            event.source || "Direct",
            event.campaign || "",
            event.landingPage || event.path,
            event.country || "IN",
            event.city || "",
            event.device || "Desktop",
            event.browser || "Other",
            event.os || "Other",
            event.isEntry ? 1 : 0,
            event.ts,
            nowIso,
          ]
        );
      } else if (event.type === "page_duration") {
        if (event.durationSec && event.durationSec > 0) {
          await executeD1Run(
            db,
            `UPDATE sessions SET 
              duration_sec = duration_sec + ?,
              last_active = ?
             WHERE session_id = ?`,
            [event.durationSec, event.ts, event.sessionId]
          );
        }
      } else if (event.type === "section_engagement") {
        if (event.sectionId && event.durationSec && event.durationSec >= 2) {
          const seId = `se_${event.ts.toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
          await executeD1Run(
            db,
            `INSERT INTO section_engagements (
              id, visitor_id, session_id, page_path, section_id, duration_sec, ts, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              seId,
              event.visitorId,
              event.sessionId,
              event.path,
              event.sectionId,
              event.durationSec,
              event.ts,
              nowIso,
            ]
          );
        }
      } else if (event.type === "heartbeat") {
        await executeD1Run(
          db,
          `INSERT INTO live_visitors (
            session_id, visitor_id, current_path, last_seen, country, city, device, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(session_id) DO UPDATE SET
            current_path = excluded.current_path,
            last_seen = excluded.last_seen`,
          [
            event.sessionId,
            event.visitorId,
            event.path,
            event.ts,
            event.country || "IN",
            event.city || "",
            event.device || "Desktop",
            nowIso,
          ]
        );
      } else if (event.type === "cta_click") {
        const ctaId = `cta_${event.ts.toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
        await executeD1Run(
          db,
          `INSERT INTO section_engagements (
            id, visitor_id, session_id, page_path, section_id, duration_sec, ts, created_at
          ) VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
          [
            ctaId,
            event.visitorId,
            event.sessionId,
            event.path,
            `cta_click:${(event.content || "action").substring(0, 30)}`,
            event.ts,
            nowIso,
          ]
        );
      }
    } catch (err) {
      console.error("[D1 recordAnalyticsEvent Error]:", err);
    }
  }
}

// Country code to display name normalizer
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
export function normalizeCountryName(code: string): string {
  if (!code || code.length !== 2) return "Direct / Unspecified";
  try {
    return countryNames.of(code.toUpperCase()) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

// Human readable section names
const SECTION_NAMES: Record<string, string> = {
  hero: "Hero Product Sandbox",
  "hero-sandbox": "Hero Product Sandbox",
  problem: "Lead Leakage Breakdown",
  conduit: "Real Estate WhatsApp Conduit",
  "mobile-closer": "Mobile Sales Closer OS",
  inventory: "Live Inventory & Unit Allocation",
  "site-visit": "Property Visit Moments",
  "roi-calculator": "Pipeline ROI Calculator",
  security: "Enterprise Security Architecture",
  pricing: "Interactive Pricing Configurator"
};

export function formatSectionName(id: string): string {
  if (SECTION_NAMES[id]) return SECTION_NAMES[id];
  return id
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * 1. GET /api/admin/analytics/overview
 * Returns high-level metrics with 5-minute live visitor window and 7D/30D/6M/1Y unique visitors
 */
export async function getAnalyticsOverview(db?: D1Database | null): Promise<AnalyticsOverview> {
  const health = await verifyD1Connection(db);
  const now = Date.now();
  const liveWindowMs = 5 * 60 * 1000; // 5 minutes active window
  const liveCutoff = now - liveWindowMs;

  const cutoffs = {
    "7D": now - 7 * 86400000,
    "30D": now - 30 * 86400000,
    "6M": now - 180 * 86400000,
    "1Y": now - 365 * 86400000
  };

  const leads = await getAllLeads(db);
  const totalLeads = leads.length;

  if (db && health.connected) {
    try {
      const [liveRow] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(DISTINCT visitor_id) as count FROM live_visitors WHERE last_seen >= ?",
        [liveCutoff]
      );

      const [u7d] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(DISTINCT visitor_id) as count FROM visitors WHERE last_seen >= ?",
        [cutoffs["7D"]]
      );

      const [u30d] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(DISTINCT visitor_id) as count FROM visitors WHERE last_seen >= ?",
        [cutoffs["30D"]]
      );

      const [u6m] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(DISTINCT visitor_id) as count FROM visitors WHERE last_seen >= ?",
        [cutoffs["6M"]]
      );

      const [u1y] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(DISTINCT visitor_id) as count FROM visitors WHERE last_seen >= ?",
        [cutoffs["1Y"]]
      );

      const [pvRow] = await executeD1Query<{ count: number }>(
        db,
        "SELECT COUNT(*) as count FROM page_views"
      );

      const [sessRow] = await executeD1Query<{ count: number; avg_dur: number; bounces: number }>(
        db,
        "SELECT COUNT(*) as count, AVG(duration_sec) as avg_dur, SUM(is_bounce) as bounces FROM sessions"
      );

      const totalPv = pvRow?.count || 0;
      const totalSess = sessRow?.count || 0;
      const avgDur = Math.round(sessRow?.avg_dur || 0);
      const bounces = sessRow?.bounces || 0;
      const bounceRate = totalSess > 0 ? `${((bounces / totalSess) * 100).toFixed(1)}%` : "0.0%";
      const visitors30d = u30d?.count || 0;
      const conversionRate = visitors30d > 0 ? `${((totalLeads / visitors30d) * 100).toFixed(1)}%` : "0.0%";

      return {
        liveVisitorsNow: liveRow?.count || 0,
        liveWindowMinutes: 5,
        uniqueVisitors: {
          "7D": u7d?.count || 0,
          "30D": visitors30d,
          "6M": u6m?.count || 0,
          "1Y": u1y?.count || 0
        },
        totalPageviews: totalPv,
        totalSessions: totalSess,
        totalLeads,
        conversionRate,
        avgDwellSeconds: avgDur,
        bounceRate,
        connectionHealth: health,
        lastRefreshedAt: new Date().toISOString()
      };
    } catch (err) {
      console.error("[getAnalyticsOverview D1 Error]:", err);
    }
  }

  // Memory fallback computation
  const store = getGlobalAnalyticsStore();
  let liveNow = 0;
  for (const v of store.liveVisitors.values()) {
    if (v.lastSeen >= liveCutoff) liveNow++;
  }

  const u7dSet = new Set<string>();
  const u30dSet = new Set<string>();
  const u6mSet = new Set<string>();
  const u1ySet = new Set<string>();
  const allSessions = new Set<string>();
  let totalPv = 0;
  let totalDuration = 0;
  let singlePageSessions = 0;

  const sessionPageCounts = new Map<string, number>();

  for (const ev of store.events) {
    if (ev.ts >= cutoffs["7D"]) u7dSet.add(ev.visitorId);
    if (ev.ts >= cutoffs["30D"]) u30dSet.add(ev.visitorId);
    if (ev.ts >= cutoffs["6M"]) u6mSet.add(ev.visitorId);
    if (ev.ts >= cutoffs["1Y"]) u1ySet.add(ev.visitorId);

    allSessions.add(ev.sessionId);

    if (ev.type === "pageview") {
      totalPv++;
      sessionPageCounts.set(ev.sessionId, (sessionPageCounts.get(ev.sessionId) || 0) + 1);
    } else if (ev.type === "page_duration" && ev.durationSec) {
      totalDuration += ev.durationSec;
    }
  }

  sessionPageCounts.forEach((cnt) => {
    if (cnt <= 1) singlePageSessions++;
  });

  const totalSess = allSessions.size;
  const bounceRate = totalSess > 0 ? `${((singlePageSessions / totalSess) * 100).toFixed(1)}%` : "0.0%";
  const avgDur = totalSess > 0 ? Math.round(totalDuration / totalSess) : 0;
  const v30d = u30dSet.size;
  const conversionRate = v30d > 0 ? `${((totalLeads / v30d) * 100).toFixed(1)}%` : "0.0%";

  return {
    liveVisitorsNow: liveNow,
    liveWindowMinutes: 5,
    uniqueVisitors: {
      "7D": u7dSet.size,
      "30D": v30d,
      "6M": u6mSet.size,
      "1Y": u1ySet.size
    },
    totalPageviews: totalPv,
    totalSessions: totalSess,
    totalLeads,
    conversionRate,
    avgDwellSeconds: avgDur,
    bounceRate,
    connectionHealth: health,
    lastRefreshedAt: new Date().toISOString()
  };
}

/**
 * 2. GET /api/admin/analytics/timeseries
 * Supports range: 7D, 30D, 6M, 1Y
 */
export async function getTimeseriesData(
  db?: D1Database | null,
  range: "7D" | "30D" | "6M" | "1Y" = "7D"
): Promise<TrafficDataPoint[]> {
  const now = Date.now();
  const numDays = range === "7D" ? 7 : range === "30D" ? 30 : range === "6M" ? 180 : 365;
  const cutoff = now - numDays * 86400000;

  if (db) {
    try {
      const rows = await executeD1Query<{
        date_str: string;
        views: number;
        visitors: number;
      }>(
        db,
        `SELECT 
          strftime('%Y-%m-%d', ts / 1000, 'unixepoch') as date_str,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as visitors
        FROM page_views 
        WHERE ts >= ?
        GROUP BY date_str
        ORDER BY date_str ASC`,
        [cutoff]
      );

      if (rows.length > 0) {
        return rows.map((r) => {
          const d = new Date(r.date_str);
          const label =
            range === "7D"
              ? d.toLocaleDateString("en-US", { weekday: "short" })
              : range === "30D"
              ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

          return {
            date: label,
            visitors: r.visitors,
            pageviews: r.views,
            leads: 0
          };
        });
      }
    } catch (err) {
      console.error("[getTimeseriesData D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantPv = store.events.filter((e) => e.type === "pageview" && e.ts >= cutoff);

  if (relevantPv.length === 0) {
    return [];
  }

  // Group by date
  const dayMap = new Map<string, { visitors: Set<string>; views: number }>();
  for (const ev of relevantPv) {
    const d = new Date(ev.ts);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    let item = dayMap.get(dateKey);
    if (!item) {
      item = { visitors: new Set(), views: 0 };
      dayMap.set(dateKey, item);
    }
    item.views++;
    item.visitors.add(ev.visitorId);
  }

  const result: TrafficDataPoint[] = [];
  const sortedKeys = Array.from(dayMap.keys()).sort();
  for (const dateKey of sortedKeys) {
    const item = dayMap.get(dateKey)!;
    const d = new Date(dateKey);
    const label =
      range === "7D"
        ? d.toLocaleDateString("en-US", { weekday: "short" })
        : range === "30D"
        ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    result.push({
      date: label,
      visitors: item.visitors.size,
      pageviews: item.views,
      leads: 0
    });
  }

  return result;
}

/**
 * 3. GET /api/admin/analytics/channels
 * Returns acquisition channels with visitor counts, share %, and leads
 */
export async function getAcquisitionChannels(
  db?: D1Database | null,
  days = 30
): Promise<ChannelMetrics[]> {
  const cutoff = Date.now() - days * 86400000;
  const leads = await getAllLeads(db);

  if (db) {
    try {
      const rows = await executeD1Query<{
        channel_name: string;
        visitors: number;
      }>(
        db,
        `SELECT 
          CASE 
            WHEN utm_campaign != '' THEN 'Paid Campaign'
            WHEN source LIKE '%whatsapp%' THEN 'WhatsApp Direct'
            WHEN source LIKE '%google%' OR referrer LIKE '%google%' THEN 'Organic Search'
            WHEN referrer LIKE '%facebook%' OR referrer LIKE '%instagram%' OR referrer LIKE '%linkedin%' THEN 'Social Media'
            WHEN referrer != '' AND referrer NOT LIKE '%sahyak%' THEN 'Referrals'
            ELSE 'Direct Navigation'
          END as channel_name,
          COUNT(DISTINCT visitor_id) as visitors
        FROM page_views
        WHERE ts >= ?
        GROUP BY channel_name
        ORDER BY visitors DESC`,
        [cutoff]
      );

      if (rows.length > 0) {
        const totalV = rows.reduce((acc, r) => acc + r.visitors, 0);
        return rows.map((r) => {
          const share = totalV > 0 ? `${((r.visitors / totalV) * 100).toFixed(1)}%` : "0.0%";
          const channelLeads = leads.filter((l) => {
            const src = (l.source || "").toLowerCase();
            return src.includes(r.channel_name.toLowerCase());
          }).length;
          const convRate = r.visitors > 0 ? `${((channelLeads / r.visitors) * 100).toFixed(1)}%` : "0.0%";

          return {
            channel: r.channel_name,
            visitors: r.visitors,
            share,
            leads: channelLeads,
            conversionRate: convRate
          };
        });
      }
    } catch (err) {
      console.error("[getAcquisitionChannels D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantPv = store.events.filter((e) => e.type === "pageview" && e.ts >= cutoff);

  if (relevantPv.length === 0) return [];

  const channelMap = new Map<string, Set<string>>();
  for (const ev of relevantPv) {
    let ch = "Direct Navigation";
    const src = (ev.source || "").toLowerCase();
    const ref = (ev.referrer || "").toLowerCase();

    if (ev.campaign) ch = "Paid Campaign";
    else if (src.includes("whatsapp")) ch = "WhatsApp Direct";
    else if (ref.includes("google") || src.includes("google")) ch = "Organic Search";
    else if (ref.includes("facebook") || ref.includes("instagram") || ref.includes("linkedin")) ch = "Social Media";
    else if (ref && !ref.includes("sahyak")) ch = "Referrals";

    let vSet = channelMap.get(ch);
    if (!vSet) {
      vSet = new Set();
      channelMap.set(ch, vSet);
    }
    vSet.add(ev.visitorId);
  }

  const totalVisitors = Array.from(channelMap.values()).reduce((acc, s) => acc + s.size, 0);
  const result: ChannelMetrics[] = [];
  channelMap.forEach((vSet, channel) => {
    const vCount = vSet.size;
    const share = totalVisitors > 0 ? `${((vCount / totalVisitors) * 100).toFixed(1)}%` : "0.0%";
    const channelLeads = leads.filter((l) => (l.source || "").toLowerCase().includes(channel.toLowerCase())).length;
    const convRate = vCount > 0 ? `${((channelLeads / vCount) * 100).toFixed(1)}%` : "0.0%";

    result.push({
      channel,
      visitors: vCount,
      share,
      leads: channelLeads,
      conversionRate: convRate
    });
  });

  return result.sort((a, b) => b.visitors - a.visitors);
}

/**
 * 4. GET /api/admin/analytics/pages
 * Returns top routes excluding admin and API routes
 */
export async function getTopPages(
  db?: D1Database | null,
  days = 30
): Promise<TopPageMetrics[]> {
  const cutoff = Date.now() - days * 86400000;

  if (db) {
    try {
      const rows = await executeD1Query<{
        path: string;
        views: number;
        visitors: number;
      }>(
        db,
        `SELECT 
          path,
          COUNT(*) as views,
          COUNT(DISTINCT visitor_id) as visitors
        FROM page_views
        WHERE ts >= ? AND path NOT LIKE '/admin%' AND path NOT LIKE '/api%'
        GROUP BY path
        ORDER BY views DESC
        LIMIT 20`,
        [cutoff]
      );

      if (rows.length > 0) {
        const totalV = rows.reduce((acc, r) => acc + r.views, 0);
        return rows.map((r) => ({
          path: r.path,
          views: r.views,
          visitors: r.visitors,
          share: totalV > 0 ? `${((r.views / totalV) * 100).toFixed(1)}%` : "0.0%"
        }));
      }
    } catch (err) {
      console.error("[getTopPages D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantPv = store.events.filter(
    (e) => e.type === "pageview" && e.ts >= cutoff && !e.path.startsWith("/admin") && !e.path.startsWith("/api")
  );

  if (relevantPv.length === 0) return [];

  const pageMap = new Map<string, { views: number; visitors: Set<string> }>();
  for (const ev of relevantPv) {
    let p = pageMap.get(ev.path);
    if (!p) {
      p = { views: 0, visitors: new Set() };
      pageMap.set(ev.path, p);
    }
    p.views++;
    p.visitors.add(ev.visitorId);
  }

  const totalViews = relevantPv.length;
  const result: TopPageMetrics[] = [];
  pageMap.forEach((val, path) => {
    result.push({
      path,
      views: val.views,
      visitors: val.visitors.size,
      share: totalViews > 0 ? `${((val.views / totalViews) * 100).toFixed(1)}%` : "0.0%"
    });
  });

  return result.sort((a, b) => b.views - a.views);
}

/**
 * 5. GET /api/admin/analytics/countries
 * Returns top countries with normalized full names via Intl.DisplayNames
 */
export async function getTopCountries(
  db?: D1Database | null,
  days = 30
): Promise<CountryMetrics[]> {
  const cutoff = Date.now() - days * 86400000;

  if (db) {
    try {
      const rows = await executeD1Query<{
        country: string;
        visitors: number;
      }>(
        db,
        `SELECT 
          country,
          COUNT(DISTINCT visitor_id) as visitors
        FROM page_views
        WHERE ts >= ?
        GROUP BY country
        ORDER BY visitors DESC
        LIMIT 20`,
        [cutoff]
      );

      if (rows.length > 0) {
        const totalV = rows.reduce((acc, r) => acc + r.visitors, 0);
        return rows.map((r) => ({
          countryCode: r.country || "IN",
          countryName: normalizeCountryName(r.country || "IN"),
          visitors: r.visitors,
          share: totalV > 0 ? `${((r.visitors / totalV) * 100).toFixed(1)}%` : "0.0%"
        }));
      }
    } catch (err) {
      console.error("[getTopCountries D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantPv = store.events.filter((e) => e.type === "pageview" && e.ts >= cutoff);
  if (relevantPv.length === 0) return [];

  const countryMap = new Map<string, Set<string>>();
  for (const ev of relevantPv) {
    const c = ev.country || "IN";
    let set = countryMap.get(c);
    if (!set) {
      set = new Set();
      countryMap.set(c, set);
    }
    set.add(ev.visitorId);
  }

  const totalVisitors = Array.from(countryMap.values()).reduce((acc, s) => acc + s.size, 0);
  const result: CountryMetrics[] = [];
  countryMap.forEach((vSet, code) => {
    result.push({
      countryCode: code,
      countryName: normalizeCountryName(code),
      visitors: vSet.size,
      share: totalVisitors > 0 ? `${((vSet.size / totalVisitors) * 100).toFixed(1)}%` : "0.0%"
    });
  });

  return result.sort((a, b) => b.visitors - a.visitors);
}

/**
 * 6. GET /api/admin/analytics/devices
 * Returns device and browser breakdowns
 */
export async function getDeviceBreakdown(
  db?: D1Database | null,
  days = 30
): Promise<PlatformMetrics> {
  const cutoff = Date.now() - days * 86400000;

  if (db) {
    try {
      const deviceRows = await executeD1Query<{ device: string; count: number }>(
        db,
        `SELECT device, COUNT(DISTINCT visitor_id) as count FROM page_views WHERE ts >= ? GROUP BY device`,
        [cutoff]
      );
      const browserRows = await executeD1Query<{ browser: string; count: number }>(
        db,
        `SELECT browser, COUNT(DISTINCT visitor_id) as count FROM page_views WHERE ts >= ? GROUP BY browser`,
        [cutoff]
      );

      const totalD = deviceRows.reduce((acc, r) => acc + r.count, 0);
      const totalB = browserRows.reduce((acc, r) => acc + r.count, 0);

      return {
        devices: deviceRows.map((r) => ({
          device: r.device || "Desktop",
          count: r.count,
          share: totalD > 0 ? `${((r.count / totalD) * 100).toFixed(1)}%` : "0.0%"
        })),
        browsers: browserRows.map((r) => ({
          browser: r.browser || "Other",
          count: r.count,
          share: totalB > 0 ? `${((r.count / totalB) * 100).toFixed(1)}%` : "0.0%"
        }))
      };
    } catch (err) {
      console.error("[getDeviceBreakdown D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantPv = store.events.filter((e) => e.type === "pageview" && e.ts >= cutoff);

  const deviceMap = new Map<string, Set<string>>();
  const browserMap = new Map<string, Set<string>>();

  for (const ev of relevantPv) {
    const dev = ev.device || "Desktop";
    const br = ev.browser || "Other";

    let dSet = deviceMap.get(dev);
    if (!dSet) {
      dSet = new Set();
      deviceMap.set(dev, dSet);
    }
    dSet.add(ev.visitorId);

    let bSet = browserMap.get(br);
    if (!bSet) {
      bSet = new Set();
      browserMap.set(br, bSet);
    }
    bSet.add(ev.visitorId);
  }

  const totalD = Array.from(deviceMap.values()).reduce((a, b) => a + b.size, 0);
  const totalB = Array.from(browserMap.values()).reduce((a, b) => a + b.size, 0);

  const devices: { device: string; count: number; share: string }[] = [];
  deviceMap.forEach((vSet, device) => {
    devices.push({
      device,
      count: vSet.size,
      share: totalD > 0 ? `${((vSet.size / totalD) * 100).toFixed(1)}%` : "0.0%"
    });
  });

  const browsers: { browser: string; count: number; share: string }[] = [];
  browserMap.forEach((vSet, browser) => {
    browsers.push({
      browser,
      count: vSet.size,
      share: totalB > 0 ? `${((vSet.size / totalB) * 100).toFixed(1)}%` : "0.0%"
    });
  });

  return {
    devices: devices.sort((a, b) => b.count - a.count),
    browsers: browsers.sort((a, b) => b.count - a.count)
  };
}

/**
 * 7. GET /api/admin/analytics/sections
 * Returns homepage section attention & dwell seconds from IntersectionObserver
 */
export async function getSectionDwellMetrics(
  db?: D1Database | null,
  days = 30
): Promise<SectionDwellMetrics[]> {
  const cutoff = Date.now() - days * 86400000;

  if (db) {
    try {
      const rows = await executeD1Query<{
        section_id: string;
        views: number;
        engaged: number;
        avg_dwell: number;
      }>(
        db,
        `SELECT 
          section_id,
          COUNT(*) as views,
          SUM(CASE WHEN duration_sec >= 5 THEN 1 ELSE 0 END) as engaged,
          AVG(duration_sec) as avg_dwell
        FROM section_engagements
        WHERE ts >= ?
        GROUP BY section_id
        ORDER BY avg_dwell DESC`,
        [cutoff]
      );

      if (rows.length > 0) {
        return rows.map((r) => ({
          sectionId: r.section_id,
          sectionName: formatSectionName(r.section_id),
          views: r.views,
          engagedVisits: r.engaged || 0,
          avgDwellSec: Math.round(r.avg_dwell || 0)
        }));
      }
    } catch (err) {
      console.error("[getSectionDwellMetrics D1 Error]:", err);
    }
  }

  // Memory fallback
  const store = getGlobalAnalyticsStore();
  const relevantSe = store.events.filter((e) => e.type === "section_engagement" && e.ts >= cutoff && e.sectionId);

  if (relevantSe.length === 0) return [];

  const sectionMap = new Map<string, { views: number; engaged: number; totalSec: number }>();
  for (const ev of relevantSe) {
    const sId = ev.sectionId!;
    let s = sectionMap.get(sId);
    if (!s) {
      s = { views: 0, engaged: 0, totalSec: 0 };
      sectionMap.set(sId, s);
    }
    s.views++;
    const dur = ev.durationSec || 0;
    if (dur >= 5) s.engaged++;
    s.totalSec += dur;
  }

  const result: SectionDwellMetrics[] = [];
  sectionMap.forEach((val, sectionId) => {
    result.push({
      sectionId,
      sectionName: formatSectionName(sectionId),
      views: val.views,
      engagedVisits: val.engaged,
      avgDwellSec: val.views > 0 ? Math.round(val.totalSec / val.views) : 0
    });
  });

  return result.sort((a, b) => b.avgDwellSec - a.avgDwellSec);
}

/**
 * Backward-compatible master function for /api/admin/analytics
 */
export async function getAdminAnalytics(
  db?: D1Database | null,
  days = 30
): Promise<AdminAnalyticsData> {
  const overview = await getAnalyticsOverview(db);
  const timeseries = await getTimeseriesData(db, days <= 7 ? "7D" : "30D");
  const topPages = await getTopPages(db, days);
  const sections = await getSectionDwellMetrics(db, days);
  const channels = await getAcquisitionChannels(db, days);
  const geo = await getTopCountries(db, days);
  const platform = await getDeviceBreakdown(db, days);

  // Live visitors list
  const liveCutoff = Date.now() - 5 * 60 * 1000;
  let liveVisitorsList: LiveVisitorRecord[] = [];

  if (db && overview.connectionHealth.connected) {
    try {
      const rows = await executeD1Query<{
        session_id: string;
        visitor_id: string;
        current_path: string;
        last_seen: number;
        country: string;
        city: string;
        device: string;
      }>(
        db,
        "SELECT * FROM live_visitors WHERE last_seen >= ? ORDER BY last_seen DESC LIMIT 50",
        [liveCutoff]
      );
      liveVisitorsList = rows.map((r) => ({
        sessionId: r.session_id,
        visitorId: r.visitor_id,
        currentPath: r.current_path,
        lastSeen: r.last_seen,
        country: normalizeCountryName(r.country),
        city: r.city,
        device: r.device
      }));
    } catch {
      // Ignore
    }
  }

  if (liveVisitorsList.length === 0) {
    const store = getGlobalAnalyticsStore();
    for (const v of store.liveVisitors.values()) {
      if (v.lastSeen >= liveCutoff) {
        liveVisitorsList.push({
          ...v,
          country: normalizeCountryName(v.country)
        });
      }
    }
  }

  return {
    timeWindow: `Past ${days} Days`,
    summary: {
      totalVisitors: overview.uniqueVisitors["30D"],
      totalPageviews: overview.totalPageviews,
      totalSessions: overview.totalSessions,
      bounceRate: overview.bounceRate,
      avgSessionDurationSec: overview.avgDwellSeconds,
      totalLeads: overview.totalLeads,
      conversionRate: overview.conversionRate,
      liveActiveVisitors: overview.liveVisitorsNow
    },
    trafficSeries: timeseries,
    topPages,
    sectionEngagement: sections,
    channels,
    geo,
    devices: platform.devices.map((d) => ({ device: d.device, visitors: d.count, share: d.share })),
    liveVisitorsList,
    connectionHealth: overview.connectionHealth
  };
}

export async function clearAnalyticsStore(db?: D1Database | null): Promise<void> {
  const store = getGlobalAnalyticsStore();
  store.events.length = 0;
  store.liveVisitors.clear();

  if (db) {
    try {
      await executeD1Run(db, "DELETE FROM page_views");
      await executeD1Run(db, "DELETE FROM sessions");
      await executeD1Run(db, "DELETE FROM visitors");
      await executeD1Run(db, "DELETE FROM live_visitors");
      await executeD1Run(db, "DELETE FROM section_engagement");
      await executeD1Run(db, "DELETE FROM daily_analytics_aggregates");
    } catch (err) {
      console.error("[clearAnalyticsStore D1 Error]:", err);
    }
  }
}

