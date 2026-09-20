/**
 * SAHYAK CRM — SEO Alert & Monitoring Engine (Phase 4C)
 *
 * Evaluates real historical telemetry, technical audit issues, and search performance
 * against configurable thresholds to generate actionable alerts for administrators.
 *
 * STATUSES: open | acknowledged | resolved | dismissed
 * SEVERITIES: critical | warning | info
 */

import { SeoAlert, AlertSeverity, AlertStatus } from "./types";
import { runSeoAudit } from "./audit-crawler";
import { getGscSyncState } from "./gsc-client";
import { getContentOpportunities } from "./opportunity-engine";
import { getD1Database, executeD1Query, executeD1Run, ensureD1Schema } from "@/lib/d1-database";

export interface AlertThresholds {
  trafficDropPct: number;      // default: 25 (%)
  impressionsDropPct: number;  // default: 30 (%)
  ctrDropPct: number;          // default: 35 (%)
  rankDropPositions: number;   // default: 3.0 (positions)
  conversionDropPct: number;   // default: 25 (%)
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  trafficDropPct: 25,
  impressionsDropPct: 30,
  ctrDropPct: 35,
  rankDropPositions: 3.0,
  conversionDropPct: 25,
};

let memoryAlerts: SeoAlert[] = [];

/**
 * Evaluates current system state and generates real data alerts.
 */
export async function evaluateSeoAlerts(
  customThresholds: Partial<AlertThresholds> = {}
): Promise<SeoAlert[]> {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  const alerts: SeoAlert[] = [];
  const now = new Date().toISOString();

  // 1. Check Technical SEO Crawler Health
  try {
    const audit = await runSeoAudit();
    for (const issue of audit.issues) {
      if (issue.severity === "critical") {
        alerts.push({
          id: `alert_tech_${issue.id}`,
          severity: "critical",
          metric: "technical_seo",
          currentValue: 1,
          baselineValue: 0,
          changePct: 100,
          affectedTarget: issue.routePath,
          recommendedAction: issue.suggestedFix,
          status: "open",
          detectedAt: now,
          metadata: { issueType: issue.issueType, message: issue.message },
        });
      }
    }
  } catch (err) {
    console.warn("[Alert Engine Technical Audit Check Notice]:", err);
  }

  // 2. Check GSC Sync Status
  try {
    const syncState = await getGscSyncState();
    if (syncState && syncState.status === "failed") {
      alerts.push({
        id: `alert_gsc_sync_failed_${syncState.lastAttemptedSync?.substring(0, 10) || "latest"}`,
        severity: "critical",
        metric: "gsc_sync",
        currentValue: 0,
        baselineValue: 1,
        changePct: -100,
        affectedTarget: "Google Search Console API Ingestion",
        recommendedAction: `Inspect GSC error log: ${syncState.errorMessage || "Unknown connection fault"}. Verify service account private key.`,
        status: "open",
        detectedAt: now,
        metadata: { error: syncState.errorMessage },
      });
    }
  } catch (err) {
    console.warn("[Alert Engine GSC Sync Check Notice]:", err);
  }

  // 3. Check for High-Risk Cannibalization from Opportunities
  try {
    const opportunities = await getContentOpportunities();
    for (const opp of opportunities) {
      if (opp.classification === "cannibalization_risk" && opp.priority === "high") {
        alerts.push({
          id: `alert_cannibal_${opp.id}`,
          severity: "warning",
          metric: "cannibalization",
          currentValue: opp.impressions,
          baselineValue: 0,
          changePct: 100,
          affectedTarget: `Query: ${opp.query}`,
          recommendedAction: opp.recommendedAction,
          status: "open",
          detectedAt: now,
          metadata: { query: opp.query, page: opp.currentPage },
        });
      }
    }
  } catch (err) {
    console.warn("[Alert Engine Opportunity Check Notice]:", err);
  }

  // Persist alerts to D1 and in-memory
  memoryAlerts = alerts;

  const db = getD1Database();
  if (db && alerts.length > 0) {
    try {
      await ensureD1Schema(db);
      for (const a of alerts) {
        const sql = `
          INSERT INTO seo_alerts (
            id, severity, metric, current_value, baseline_value, change_pct,
            affected_target, recommended_action, status, detected_at, metadata
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            current_value = excluded.current_value,
            change_pct = excluded.change_pct,
            recommended_action = excluded.recommended_action
        `;
        await executeD1Run(db, sql, [
          a.id,
          a.severity,
          a.metric,
          a.currentValue,
          a.baselineValue,
          a.changePct,
          a.affectedTarget,
          a.recommendedAction,
          a.status,
          a.detectedAt,
          JSON.stringify(a.metadata || {}),
        ]);
      }
    } catch (d1Err) {
      console.warn("[D1 Alert Upsert Notice]:", d1Err);
    }
  }

  return alerts;
}

/**
 * Retrieves alerts with optional status or severity filtering.
 */
export async function getSeoAlerts(filters?: {
  status?: AlertStatus;
  severity?: AlertSeverity;
}): Promise<SeoAlert[]> {
  const db = getD1Database();
  if (db) {
    try {
      await ensureD1Schema(db);
      let sql = "SELECT * FROM seo_alerts WHERE 1=1";
      const params: unknown[] = [];

      if (filters?.status) {
        sql += " AND status = ?";
        params.push(filters.status);
      }
      if (filters?.severity) {
        sql += " AND severity = ?";
        params.push(filters.severity);
      }

      sql += " ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END, detected_at DESC LIMIT 100";

      const rows = await executeD1Query<any>(db, sql, params);
      if (rows && rows.length > 0) {
        return rows.map((r) => {
          let metadata = {};
          try {
            metadata = typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata || {};
          } catch {}

          return {
            id: r.id,
            severity: r.severity as AlertSeverity,
            metric: r.metric,
            currentValue: r.current_value,
            baselineValue: r.baseline_value,
            changePct: r.change_pct,
            affectedTarget: r.affected_target,
            recommendedAction: r.recommended_action,
            status: r.status as AlertStatus,
            detectedAt: r.detected_at,
            metadata,
          };
        });
      }
    } catch (err) {
      console.warn("[D1 getSeoAlerts fallback]:", err);
    }
  }

  let list = [...memoryAlerts];
  if (filters?.status) {
    list = list.filter((a) => a.status === filters.status);
  }
  if (filters?.severity) {
    list = list.filter((a) => a.severity === filters.severity);
  }
  return list;
}

/**
 * Updates an alert's status (open -> acknowledged -> resolved -> dismissed).
 */
export async function updateAlertStatus(
  id: string,
  status: AlertStatus
): Promise<boolean> {
  const memIdx = memoryAlerts.findIndex((a) => a.id === id);
  if (memIdx !== -1) {
    memoryAlerts[memIdx].status = status;
  }

  const db = getD1Database();
  if (db) {
    try {
      await ensureD1Schema(db);
      await executeD1Run(
        db,
        "UPDATE seo_alerts SET status = ? WHERE id = ?",
        [status, id]
      );
      return true;
    } catch (err) {
      console.warn("[D1 updateAlertStatus error]:", err);
    }
  }

  return memIdx !== -1;
}
