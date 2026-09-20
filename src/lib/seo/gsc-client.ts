/**
 * SAHYAK CRM — Google Search Console API Ingestion Service
 *
 * Implements direct Google OAuth2 Service Account authentication using RS256 JWT
 * and native WebCrypto/Node crypto APIs.
 *
 * COMPLIANCE & ZERO FAKE DATA MANDATE:
 * - Environment variables only (GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL, GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY)
 * - Zero credentials in source code.
 * - Truthful unconfigured state: Returns "Search Console not connected" when credentials are absent.
 * - Zero simulated metrics, impressions, or clicks.
 * - Idempotent daily incremental ingestion into search_console_metrics.
 */

import { siteConfig } from "@/lib/config";
import { SearchConsoleMetric, GscSyncResult } from "./types";
import { getD1Database, executeD1Run, ensureD1Schema } from "@/lib/d1-database";

export interface GscCredentials {
  clientEmail: string;
  privateKey: string;
  siteUrl: string;
}

export function getGscCredentials(): GscCredentials | null {
  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL?.trim();
  const rawKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY?.trim();
  const siteUrl =
    process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() ||
    `sc-domain:${new URL(siteConfig.url).hostname}`;

  if (!clientEmail || !rawKey) {
    return null;
  }

  // Normalize private key formatting (handles escaped \n from .env files)
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return { clientEmail, privateKey, siteUrl };
}

export function isGscConfigured(): boolean {
  return getGscCredentials() !== null;
}

/**
 * Creates an RS256 JWT Assertion and exchanges it for a Google OAuth2 access token.
 */
async function getGoogleAccessToken(creds: GscCredentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: creds.clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const base64UrlEncode = (obj: Record<string, unknown>): string => {
    const json = JSON.stringify(obj);
    return Buffer.from(json)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedClaims = base64UrlEncode(claimSet);
  const unsignedToken = `${encodedHeader}.${encodedClaims}`;

  // Sign using WebCrypto RS256 with Node.js crypto fallback
  let signature = "";
  if (typeof crypto !== "undefined" && crypto.subtle) {
    try {
      const b64 = creds.privateKey
        .replace(/-----BEGIN [A-Z ]+-----/g, "")
        .replace(/-----END [A-Z ]+-----/g, "")
        .replace(/\s+/g, "");
      const binary = Buffer.from(b64, "base64");
      const cryptoKey = await crypto.subtle.importKey(
        "pkcs8",
        binary,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBuffer = await crypto.subtle.sign(
        "RSASSA-PKCS1-v1_5",
        cryptoKey,
        new TextEncoder().encode(unsignedToken)
      );
      signature = Buffer.from(signatureBuffer)
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    } catch {
      // Fallback
    }
  }

  if (!signature && typeof globalThis !== "undefined" && "process" in globalThis) {
    try {
      const gProcess = (globalThis as any).process;
      if (gProcess?.versions?.node) {
        const nodeCrypto = await (Function('return import("node:crypto")')() as Promise<any>);
        const signer = nodeCrypto.createSign("RSA-SHA256");
        signer.update(unsignedToken);
        signer.end();
        signature = signer
          .sign(creds.privateKey)
          .toString("base64")
          .replace(/=/g, "")
          .replace(/\+/g, "-")
          .replace(/\//g, "_");
      }
    } catch {
      // Fallback unavailable
    }
  }

  const assertion = `${unsignedToken}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    const errorText = await tokenRes.text();
    throw new Error(`Google OAuth token exchange failed (${tokenRes.status}): ${errorText}`);
  }

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error("No access_token returned by Google OAuth endpoint");
  }

  return tokenData.access_token;
}

export interface GscQueryOptions {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  rowLimit?: number;
  backfillDays?: number;
}

/**
 * Fetch helper with exponential backoff for transient 429/5xx errors.
 */
async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = 3,
  delayMs = 800
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
        if (i === retries - 1) return res;
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
    }
  }
  return fetch(url, init);
}

/**
 * Fetches real query and page performance metrics from Google Search Console API.
 */
export async function fetchGscSearchAnalytics(
  options: GscQueryOptions = {}
): Promise<{ metrics: Omit<SearchConsoleMetric, "id" | "createdAt">[]; siteUrl: string; startDate: string; endDate: string }> {
  const creds = getGscCredentials();
  if (!creds) {
    throw new Error("Search Console not connected. Missing GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL or GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY.");
  }

  const accessToken = await getGoogleAccessToken(creds);

  // Default to the last 28 days (or backfillDays)
  const now = new Date();
  const defaultEnd = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const daysSpan = options.backfillDays && options.backfillDays > 0 ? options.backfillDays : 28;
  const defaultStart = new Date(defaultEnd.getTime() - daysSpan * 24 * 60 * 60 * 1000);

  const startDate = options.startDate || defaultStart.toISOString().split("T")[0];
  const endDate = options.endDate || defaultEnd.toISOString().split("T")[0];
  const rowLimit = options.rowLimit || 5000;

  let currentSiteUrl = creds.siteUrl;
  let endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    currentSiteUrl
  )}/searchAnalytics/query`;

  let response = await fetchWithRetry(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["date", "query", "page", "country", "device"],
      rowLimit,
    }),
  });

  // Auto-recovery: if 403, try the alternate property format (sc-domain vs URL-prefix)
  if (response.status === 403) {
    const hostname = new URL(siteConfig.url).hostname;
    const alternateUrl = currentSiteUrl.startsWith("sc-domain:")
      ? `https://${hostname}/`
      : `sc-domain:${hostname}`;

    const altEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      alternateUrl
    )}/searchAnalytics/query`;

    const altResponse = await fetchWithRetry(altEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["date", "query", "page", "country", "device"],
        rowLimit,
      }),
    });

    if (altResponse.ok) {
      response = altResponse;
      currentSiteUrl = alternateUrl;
    }
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Search Console API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rows = data.rows || [];

  const metrics: Omit<SearchConsoleMetric, "id" | "createdAt">[] = rows.map((row: any) => {
    const [date, query, page, country, device] = row.keys || [];
    return {
      date: date || startDate,
      query: (query || "").trim(),
      page: (page || "").trim(),
      country: (country || "IND").toUpperCase(),
      device: ((device || "DESKTOP").toUpperCase() as "DESKTOP" | "MOBILE" | "TABLET"),
      clicks: Math.round(row.clicks || 0),
      impressions: Math.round(row.impressions || 0),
      ctr: parseFloat((row.ctr ? row.ctr * 100 : 0).toFixed(2)),
      position: parseFloat((row.position || 0).toFixed(1)),
    };
  });

  return { metrics, siteUrl: creds.siteUrl, startDate, endDate };
}

/**
 * Retrieves the current GSC sync operational state from the database.
 */
export async function getGscSyncState(): Promise<GscSyncResult["state"]> {
  const configured = isGscConfigured();
  if (!configured) {
    return {
      id: "singleton",
      status: "disconnected",
      lastSuccessfulSync: null,
      lastAttemptedSync: null,
      rowsImported: 0,
      dateRangeStart: "",
      dateRangeEnd: "",
      errorMessage: "Google Search Console credentials not configured in environment variables",
      isLocked: false,
      lockAcquiredAt: null,
      updatedAt: new Date().toISOString(),
    };
  }

  const db = getD1Database();
  if (!db) {
    return {
      id: "singleton",
      status: "never_synced",
      lastSuccessfulSync: null,
      lastAttemptedSync: null,
      rowsImported: 0,
      dateRangeStart: "",
      dateRangeEnd: "",
      errorMessage: "",
      isLocked: false,
      lockAcquiredAt: null,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    await ensureD1Schema(db);
    const row = await db.prepare("SELECT * FROM gsc_sync_state WHERE id = 'singleton'").first<any>();
    if (!row) {
      return {
        id: "singleton",
        status: "never_synced",
        lastSuccessfulSync: null,
        lastAttemptedSync: null,
        rowsImported: 0,
        dateRangeStart: "",
        dateRangeEnd: "",
        errorMessage: "",
        isLocked: false,
        lockAcquiredAt: null,
        updatedAt: new Date().toISOString(),
      };
    }
    return {
      id: row.id,
      status: row.status,
      lastSuccessfulSync: row.last_successful_sync,
      lastAttemptedSync: row.last_attempted_sync,
      rowsImported: row.rows_imported || 0,
      dateRangeStart: row.date_range_start || "",
      dateRangeEnd: row.date_range_end || "",
      errorMessage: row.error_message || "",
      isLocked: Boolean(row.is_locked),
      lockAcquiredAt: row.lock_acquired_at,
      updatedAt: row.updated_at || new Date().toISOString(),
    };
  } catch {
    return {
      id: "singleton",
      status: "never_synced",
      lastSuccessfulSync: null,
      lastAttemptedSync: null,
      rowsImported: 0,
      dateRangeStart: "",
      dateRangeEnd: "",
      errorMessage: "",
      isLocked: false,
      lockAcquiredAt: null,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Ingests real Search Console metrics into D1 / SQLite with idempotency, sync locking,
 * retry handling, and partial failure recovery.
 */
export async function syncSearchConsoleData(options: GscQueryOptions = {}): Promise<GscSyncResult> {
  const timestamp = new Date().toISOString();

  if (!isGscConfigured()) {
    return {
      success: false,
      connected: false,
      ingestedCount: 0,
      skippedCount: 0,
      message: "Search Console not connected. Configure GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL and GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY in environment variables to enable real data ingestion.",
      timestamp,
      state: await getGscSyncState(),
    };
  }

  const db = getD1Database();
  const lockTimeoutMs = 5 * 60 * 1000; // 5 minutes lock timeout

  if (db) {
    try {
      await ensureD1Schema(db);
      const existing = await db.prepare("SELECT * FROM gsc_sync_state WHERE id = 'singleton'").first<any>();
      if (existing && existing.is_locked === 1) {
        const lockAge = existing.lock_acquired_at ? Date.now() - new Date(existing.lock_acquired_at).getTime() : 0;
        if (lockAge < lockTimeoutMs) {
          return {
            success: false,
            connected: true,
            ingestedCount: 0,
            skippedCount: 0,
            message: "Sync job is currently running in another process. Lock held.",
            timestamp,
            state: await getGscSyncState(),
          };
        }
      }

      // Acquire lock
      const sqlLock = `
        INSERT OR REPLACE INTO gsc_sync_state (
          id, status, last_attempted_sync, is_locked, lock_acquired_at, updated_at
        ) VALUES ('singleton', 'running', ?, 1, ?, ?)
      `;
      await executeD1Run(db, sqlLock, [timestamp, timestamp, timestamp]);
    } catch (lockErr) {
      console.warn("[GSC Lock Acquire Warning]:", lockErr);
    }
  }

  let ingestedCount = 0;
  let skippedCount = 0;
  let errorEncountered = false;
  let errorMessage = "";

  try {
    const { metrics, siteUrl, startDate, endDate } = await fetchGscSearchAnalytics(options);

    if (db) {
      await ensureD1Schema(db);

      for (const m of metrics) {
        if (!m.query || !m.page) {
          skippedCount++;
          continue;
        }

        try {
          const id = `gsc_${m.date}_${Buffer.from(`${m.query}_${m.page}_${m.country}_${m.device}`).toString("base64url").substring(0, 32)}`;

          // Idempotent write using composite unique key idx_scm_unique
          const sql = `
            INSERT OR REPLACE INTO search_console_metrics (
              id, query, page, country, device, clicks, impressions, ctr, position, date, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          await executeD1Run(db, sql, [
            id,
            m.query,
            m.page,
            m.country,
            m.device,
            m.clicks,
            m.impressions,
            m.ctr,
            m.position,
            m.date,
            timestamp,
          ]);
          ingestedCount++;
        } catch (itemErr: any) {
          errorEncountered = true;
          skippedCount++;
          errorMessage = itemErr?.message || "Error ingesting item";
        }
      }

      // Release lock and record state
      const finalStatus = errorEncountered && ingestedCount > 0 ? "partially_completed" : "completed";
      const sqlRelease = `
        UPDATE gsc_sync_state SET
          status = ?,
          is_locked = 0,
          lock_acquired_at = NULL,
          last_successful_sync = ?,
          rows_imported = ?,
          date_range_start = ?,
          date_range_end = ?,
          error_message = ?,
          updated_at = ?
        WHERE id = 'singleton'
      `;
      await executeD1Run(db, sqlRelease, [
        finalStatus,
        timestamp,
        ingestedCount,
        startDate,
        endDate,
        errorEncountered ? errorMessage : "",
        timestamp,
      ]);
    }

    return {
      success: true,
      connected: true,
      ingestedCount,
      skippedCount,
      dateRange: {
        startDate: options.startDate || "last_28_days",
        endDate: options.endDate || "latest",
      },
      message: `Successfully ingested ${ingestedCount} real search metrics from Google Search Console property (${siteUrl}).`,
      timestamp,
      state: await getGscSyncState(),
    };
  } catch (error: any) {
    console.error("[GSC Sync Error]:", error);
    if (db) {
      try {
        const sqlFail = `
          UPDATE gsc_sync_state SET
            status = 'failed',
            is_locked = 0,
            lock_acquired_at = NULL,
            error_message = ?,
            updated_at = ?
          WHERE id = 'singleton'
        `;
        await executeD1Run(db, sqlFail, [error?.message || "Unknown error", timestamp]);
      } catch {}
    }

    return {
      success: false,
      connected: true,
      ingestedCount: 0,
      skippedCount: 0,
      message: `GSC Ingestion Error: ${error?.message || "Unknown error during sync"}`,
      timestamp,
      state: await getGscSyncState(),
    };
  }
}
