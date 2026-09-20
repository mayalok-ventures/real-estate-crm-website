/**
 * Cloudflare D1 Database Prepared Statement Enforcement & Self-Healing Migration Layer
 */

export { getD1Database } from "./cloudflare-context";

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  run(): Promise<{ success: boolean; meta?: unknown }>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>;
  exec(query: string): Promise<unknown>;
}

let schemaInitialized = false;

const INIT_SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT DEFAULT 'Not specified',
    team_size TEXT DEFAULT '1-5',
    requirement TEXT,
    notes TEXT DEFAULT '',
    inquiry_type TEXT DEFAULT 'Book a Demo',
    source TEXT DEFAULT 'Direct',
    utm_source TEXT DEFAULT '',
    utm_medium TEXT DEFAULT '',
    utm_campaign TEXT DEFAULT '',
    utm_term TEXT DEFAULT '',
    utm_content TEXT DEFAULT '',
    landing_page TEXT DEFAULT '/',
    referrer TEXT DEFAULT '',
    visitor_id TEXT DEFAULT '',
    session_id TEXT DEFAULT '',
    status TEXT DEFAULT 'New',
    ip_address TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)`,
  `CREATE TABLE IF NOT EXISTS visitors (
    visitor_id TEXT PRIMARY KEY,
    first_seen INTEGER NOT NULL,
    last_seen INTEGER NOT NULL,
    total_sessions INTEGER DEFAULT 1,
    total_pageviews INTEGER DEFAULT 1,
    first_source TEXT DEFAULT 'Direct',
    first_referrer TEXT DEFAULT '',
    first_landing_page TEXT DEFAULT '/',
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    device TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Other',
    os TEXT DEFAULT 'Other',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_visitors_first_seen ON visitors(first_seen)`,
  `CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen)`,
  `CREATE INDEX IF NOT EXISTS idx_visitors_source ON visitors(first_source)`,
  `CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    start_time INTEGER NOT NULL,
    last_active INTEGER NOT NULL,
    page_count INTEGER DEFAULT 1,
    duration_sec INTEGER DEFAULT 0,
    entry_page TEXT DEFAULT '/',
    exit_page TEXT DEFAULT '/',
    referrer TEXT DEFAULT '',
    source TEXT DEFAULT 'Direct',
    medium TEXT DEFAULT '',
    campaign TEXT DEFAULT '',
    term TEXT DEFAULT '',
    content TEXT DEFAULT '',
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    device TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Other',
    os TEXT DEFAULT 'Other',
    is_bounce INTEGER DEFAULT 1,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_source ON sessions(source)`,
  `CREATE TABLE IF NOT EXISTS page_views (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT DEFAULT '',
    referrer TEXT DEFAULT '',
    source TEXT DEFAULT 'Direct',
    utm_campaign TEXT DEFAULT '',
    duration_sec INTEGER DEFAULT 0,
    entry_page TEXT DEFAULT '/',
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    device TEXT DEFAULT 'Desktop',
    browser TEXT DEFAULT 'Other',
    os TEXT DEFAULT 'Other',
    is_entry INTEGER DEFAULT 0,
    is_exit INTEGER DEFAULT 0,
    ts INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_pv_ts ON page_views(ts)`,
  `CREATE INDEX IF NOT EXISTS idx_pv_visitor ON page_views(visitor_id)`,
  `CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id)`,
  `CREATE INDEX IF NOT EXISTS idx_pv_path ON page_views(path)`,
  `CREATE INDEX IF NOT EXISTS idx_pv_source ON page_views(source)`,
  `CREATE TABLE IF NOT EXISTS section_engagements (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    section_id TEXT NOT NULL,
    duration_sec INTEGER NOT NULL,
    ts INTEGER NOT NULL,
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_se_ts ON section_engagements(ts)`,
  `CREATE INDEX IF NOT EXISTS idx_se_section ON section_engagements(section_id)`,
  `CREATE TABLE IF NOT EXISTS live_visitors (
    session_id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    current_path TEXT NOT NULL,
    last_seen INTEGER NOT NULL,
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    device TEXT DEFAULT 'Desktop',
    created_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_live_last_seen ON live_visitors(last_seen)`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_type)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`,
  `CREATE TABLE IF NOT EXISTS daily_analytics_aggregates (
    date TEXT PRIMARY KEY,
    visitors INTEGER DEFAULT 0,
    pageviews INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    bounces INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    avg_dwell_sec INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_daa_date ON daily_analytics_aggregates(date)`,
  `CREATE TABLE IF NOT EXISTS seo_topics (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    parent_topic_id TEXT DEFAULT '',
    pillar_page_id TEXT DEFAULT '',
    cluster_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_seo_topics_slug ON seo_topics(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_topics_parent ON seo_topics(parent_topic_id)`,
  `CREATE TABLE IF NOT EXISTS seo_keywords (
    id TEXT PRIMARY KEY,
    keyword TEXT NOT NULL UNIQUE,
    normalized_keyword TEXT NOT NULL DEFAULT '',
    topic_id TEXT NOT NULL,
    search_intent TEXT NOT NULL,
    priority TEXT DEFAULT 'core',
    country TEXT DEFAULT 'IN',
    language TEXT DEFAULT 'en',
    locale TEXT DEFAULT 'en-in',
    source TEXT DEFAULT '',
    source_url TEXT DEFAULT '',
    research_date TEXT DEFAULT '',
    search_volume INTEGER,
    volume_source TEXT DEFAULT '',
    difficulty TEXT DEFAULT '',
    difficulty_source TEXT DEFAULT '',
    commercial_value TEXT DEFAULT 'medium',
    mapped_page_id TEXT DEFAULT '',
    target_url TEXT DEFAULT '',
    status TEXT DEFAULT 'unmapped',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_topic ON seo_keywords(topic_id)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_intent ON seo_keywords(search_intent)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_priority ON seo_keywords(priority)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_status ON seo_keywords(status)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_normalized ON seo_keywords(normalized_keyword)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_keywords_mapped_page ON seo_keywords(mapped_page_id)`,
  `CREATE TABLE IF NOT EXISTS seo_pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    page_type TEXT NOT NULL,
    primary_topic_id TEXT DEFAULT '',
    search_intent TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    secondary_keywords TEXT DEFAULT '[]',
    country TEXT DEFAULT 'IN',
    language TEXT DEFAULT 'en',
    locale TEXT DEFAULT 'en-in',
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    h1 TEXT NOT NULL,
    body_content TEXT DEFAULT '',
    canonical_url TEXT NOT NULL,
    hreflang_references TEXT DEFAULT '[]',
    schema_type TEXT DEFAULT 'WebSite',
    schema_config TEXT DEFAULT '{}',
    is_indexable INTEGER DEFAULT 1,
    publication_status TEXT DEFAULT 'draft',
    breadcrumb_hierarchy TEXT DEFAULT '[]',
    parent_topic TEXT DEFAULT '',
    related_pages TEXT DEFAULT '[]',
    quality_score INTEGER DEFAULT 0,
    quality_issues TEXT DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_type ON seo_pages(page_type)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_topic ON seo_pages(primary_topic_id)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_status ON seo_pages(publication_status)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_pages_indexable ON seo_pages(is_indexable)`,
  `CREATE TABLE IF NOT EXISTS seo_internal_links (
    id TEXT PRIMARY KEY,
    source_page_id TEXT NOT NULL,
    source_path TEXT NOT NULL,
    target_page_id TEXT NOT NULL,
    target_path TEXT NOT NULL,
    anchor_text TEXT NOT NULL,
    rel TEXT DEFAULT 'follow',
    context TEXT DEFAULT 'body',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sil_source ON seo_internal_links(source_path)`,
  `CREATE INDEX IF NOT EXISTS idx_sil_target ON seo_internal_links(target_path)`,
  `CREATE TABLE IF NOT EXISTS search_console_metrics (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    page TEXT NOT NULL,
    country TEXT NOT NULL,
    device TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    position REAL DEFAULT 0.0,
    date TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_scm_unique ON search_console_metrics(date, query, page, country, device)`,
  `CREATE INDEX IF NOT EXISTS idx_scm_date ON search_console_metrics(date)`,
  `CREATE INDEX IF NOT EXISTS idx_scm_page ON search_console_metrics(page)`,
  `CREATE INDEX IF NOT EXISTS idx_scm_query ON search_console_metrics(query)`,
  `CREATE TABLE IF NOT EXISTS seo_audit_issues (
    id TEXT PRIMARY KEY,
    route_path TEXT NOT NULL,
    severity TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    message TEXT NOT NULL,
    suggested_fix TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_sai_severity ON seo_audit_issues(severity)`,
  `CREATE INDEX IF NOT EXISTS idx_sai_path ON seo_audit_issues(route_path)`,
  `CREATE TABLE IF NOT EXISTS seo_content_opportunities (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    normalized_query TEXT NOT NULL,
    current_page TEXT DEFAULT '',
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    position REAL DEFAULT 0.0,
    intent TEXT DEFAULT 'informational',
    classification TEXT NOT NULL,
    recommended_action TEXT NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'opportunity',
    priority TEXT DEFAULT 'medium',
    confidence REAL DEFAULT 0.8,
    evidence TEXT DEFAULT '{}',
    data_period TEXT DEFAULT '28d',
    source TEXT DEFAULT 'google_search_console',
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_sco_query_page ON seo_content_opportunities(query, current_page)`,
  `CREATE INDEX IF NOT EXISTS idx_sco_status ON seo_content_opportunities(status)`,
  `CREATE INDEX IF NOT EXISTS idx_sco_classification ON seo_content_opportunities(classification)`,
  `CREATE INDEX IF NOT EXISTS idx_sco_priority ON seo_content_opportunities(priority)`,
  `CREATE TABLE IF NOT EXISTS gsc_sync_state (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'never_synced',
    last_successful_sync TEXT,
    last_attempted_sync TEXT,
    rows_imported INTEGER DEFAULT 0,
    date_range_start TEXT DEFAULT '',
    date_range_end TEXT DEFAULT '',
    error_message TEXT DEFAULT '',
    is_locked INTEGER DEFAULT 0,
    lock_acquired_at TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS seo_alerts (
    id TEXT PRIMARY KEY,
    severity TEXT NOT NULL,
    metric TEXT NOT NULL,
    current_value REAL DEFAULT 0.0,
    baseline_value REAL DEFAULT 0.0,
    change_pct REAL DEFAULT 0.0,
    affected_target TEXT DEFAULT '',
    recommended_action TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT DEFAULT '{}'
  )`,
  `CREATE INDEX IF NOT EXISTS idx_seo_alerts_status ON seo_alerts(status)`,
  `CREATE INDEX IF NOT EXISTS idx_seo_alerts_severity ON seo_alerts(severity)`
];

export async function ensureD1Schema(db: D1Database): Promise<void> {
  if (schemaInitialized) return;

  try {
    const test = await db.prepare("SELECT 1 FROM leads LIMIT 1").first();
    if (test !== undefined) {
      try {
        await db.prepare("ALTER TABLE leads ADD COLUMN notes TEXT DEFAULT ''").run();
      } catch {
        // notes column already exists
      }
      try {
        await db.prepare(`CREATE TABLE IF NOT EXISTS daily_analytics_aggregates (
          date TEXT PRIMARY KEY,
          visitors INTEGER DEFAULT 0,
          pageviews INTEGER DEFAULT 0,
          sessions INTEGER DEFAULT 0,
          bounces INTEGER DEFAULT 0,
          leads INTEGER DEFAULT 0,
          avg_dwell_sec INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )`).run();
      } catch {
        // already exists
      }
      // Ensure SEO tables exist
      try {
        await db.prepare(`CREATE TABLE IF NOT EXISTS seo_topics (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          parent_topic_id TEXT DEFAULT '',
          pillar_page_id TEXT DEFAULT '',
          cluster_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        await db.prepare(`CREATE TABLE IF NOT EXISTS seo_keywords (
          id TEXT PRIMARY KEY,
          keyword TEXT NOT NULL UNIQUE,
          normalized_keyword TEXT NOT NULL DEFAULT '',
          topic_id TEXT NOT NULL,
          search_intent TEXT NOT NULL,
          priority TEXT DEFAULT 'core',
          country TEXT DEFAULT 'IN',
          language TEXT DEFAULT 'en',
          locale TEXT DEFAULT 'en-in',
          source TEXT DEFAULT '',
          source_url TEXT DEFAULT '',
          research_date TEXT DEFAULT '',
          search_volume INTEGER,
          volume_source TEXT DEFAULT '',
          difficulty TEXT DEFAULT '',
          difficulty_source TEXT DEFAULT '',
          commercial_value TEXT DEFAULT 'medium',
          mapped_page_id TEXT DEFAULT '',
          target_url TEXT DEFAULT '',
          status TEXT DEFAULT 'unmapped',
          notes TEXT DEFAULT '',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN normalized_keyword TEXT NOT NULL DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN country TEXT DEFAULT 'IN'").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN language TEXT DEFAULT 'en'").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN locale TEXT DEFAULT 'en-in'").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN source TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN source_url TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN research_date TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN search_volume INTEGER").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN volume_source TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN difficulty_source TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN commercial_value TEXT DEFAULT 'medium'").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN mapped_page_id TEXT DEFAULT ''").run();
        } catch {}
        try {
          await db.prepare("ALTER TABLE seo_keywords ADD COLUMN status TEXT DEFAULT 'unmapped'").run();
        } catch {}
        await db.prepare(`CREATE TABLE IF NOT EXISTS seo_pages (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          page_type TEXT NOT NULL,
          primary_topic_id TEXT DEFAULT '',
          search_intent TEXT NOT NULL,
          primary_keyword TEXT NOT NULL,
          secondary_keywords TEXT DEFAULT '[]',
          country TEXT DEFAULT 'IN',
          language TEXT DEFAULT 'en',
          locale TEXT DEFAULT 'en-in',
          title TEXT NOT NULL,
          meta_description TEXT NOT NULL,
          h1 TEXT NOT NULL,
          body_content TEXT DEFAULT '',
          canonical_url TEXT NOT NULL,
          hreflang_references TEXT DEFAULT '[]',
          schema_type TEXT DEFAULT 'WebSite',
          schema_config TEXT DEFAULT '{}',
          is_indexable INTEGER DEFAULT 1,
          publication_status TEXT DEFAULT 'draft',
          breadcrumb_hierarchy TEXT DEFAULT '[]',
          parent_topic TEXT DEFAULT '',
          related_pages TEXT DEFAULT '[]',
          quality_score INTEGER DEFAULT 0,
          quality_issues TEXT DEFAULT '[]',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        await db.prepare(`CREATE TABLE IF NOT EXISTS seo_internal_links (
          id TEXT PRIMARY KEY,
          source_page_id TEXT NOT NULL,
          source_path TEXT NOT NULL,
          target_page_id TEXT NOT NULL,
          target_path TEXT NOT NULL,
          anchor_text TEXT NOT NULL,
          rel TEXT DEFAULT 'follow',
          context TEXT DEFAULT 'body',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        await db.prepare(`CREATE TABLE IF NOT EXISTS search_console_metrics (
          id TEXT PRIMARY KEY,
          query TEXT NOT NULL,
          page TEXT NOT NULL,
          country TEXT NOT NULL,
          device TEXT NOT NULL,
          clicks INTEGER DEFAULT 0,
          impressions INTEGER DEFAULT 0,
          ctr REAL DEFAULT 0.0,
          position REAL DEFAULT 0.0,
          date TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        await db.prepare(`CREATE TABLE IF NOT EXISTS seo_audit_issues (
          id TEXT PRIMARY KEY,
          route_path TEXT NOT NULL,
          severity TEXT NOT NULL,
          issue_type TEXT NOT NULL,
          message TEXT NOT NULL,
          suggested_fix TEXT NOT NULL,
          detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`).run();
        try {
          await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_scm_unique ON search_console_metrics(date, query, page, country, device)").run();
        } catch {}
        try {
          await db.prepare(`CREATE TABLE IF NOT EXISTS seo_content_opportunities (
            id TEXT PRIMARY KEY,
            query TEXT NOT NULL,
            normalized_query TEXT NOT NULL,
            current_page TEXT DEFAULT '',
            impressions INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            ctr REAL DEFAULT 0.0,
            position REAL DEFAULT 0.0,
            intent TEXT DEFAULT 'informational',
            classification TEXT NOT NULL,
            recommended_action TEXT NOT NULL,
            reason TEXT NOT NULL,
            status TEXT DEFAULT 'opportunity',
            source TEXT DEFAULT 'google_search_console',
            first_seen TEXT NOT NULL,
            last_seen TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`).run();
          await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_sco_query_page ON seo_content_opportunities(query, current_page)").run();
          await db.prepare("CREATE INDEX IF NOT EXISTS idx_sco_status ON seo_content_opportunities(status)").run();
          await db.prepare("CREATE INDEX IF NOT EXISTS idx_sco_classification ON seo_content_opportunities(classification)").run();
          try {
            await db.prepare("ALTER TABLE seo_content_opportunities ADD COLUMN priority TEXT DEFAULT 'medium'").run();
          } catch {}
          try {
            await db.prepare("ALTER TABLE seo_content_opportunities ADD COLUMN confidence REAL DEFAULT 0.8").run();
          } catch {}
          try {
            await db.prepare("ALTER TABLE seo_content_opportunities ADD COLUMN evidence TEXT DEFAULT '{}'").run();
          } catch {}
          try {
            await db.prepare("ALTER TABLE seo_content_opportunities ADD COLUMN data_period TEXT DEFAULT '28d'").run();
          } catch {}
          try {
            await db.prepare("CREATE INDEX IF NOT EXISTS idx_sco_priority ON seo_content_opportunities(priority)").run();
          } catch {}
        } catch {}

        try {
          await db.prepare(`CREATE TABLE IF NOT EXISTS gsc_sync_state (
            id TEXT PRIMARY KEY,
            status TEXT DEFAULT 'never_synced',
            last_successful_sync TEXT,
            last_attempted_sync TEXT,
            rows_imported INTEGER DEFAULT 0,
            date_range_start TEXT DEFAULT '',
            date_range_end TEXT DEFAULT '',
            error_message TEXT DEFAULT '',
            is_locked INTEGER DEFAULT 0,
            lock_acquired_at TEXT DEFAULT '',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`).run();
        } catch {}

        try {
          await db.prepare(`CREATE TABLE IF NOT EXISTS seo_alerts (
            id TEXT PRIMARY KEY,
            severity TEXT NOT NULL,
            metric TEXT NOT NULL,
            current_value REAL DEFAULT 0.0,
            baseline_value REAL DEFAULT 0.0,
            change_pct REAL DEFAULT 0.0,
            affected_target TEXT DEFAULT '',
            recommended_action TEXT NOT NULL,
            status TEXT DEFAULT 'open',
            detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT DEFAULT '{}'
          )`).run();
          await db.prepare("CREATE INDEX IF NOT EXISTS idx_seo_alerts_status ON seo_alerts(status)").run();
          await db.prepare("CREATE INDEX IF NOT EXISTS idx_seo_alerts_severity ON seo_alerts(severity)").run();
        } catch {}
      } catch (seoErr) {
        console.warn("[D1 SEO Schema ensure notice]:", seoErr);
      }
      schemaInitialized = true;
      return;
    }
  } catch {
    // Table missing, initialize
  }

  try {
    const stmts = INIT_SCHEMA_STATEMENTS.map((sql) => db.prepare(sql));
    await db.batch(stmts);
    schemaInitialized = true;
  } catch (err) {
    console.error("[D1 Auto-Schema Init Failed]:", err);
  }
}

export interface D1ConnectionHealth {
  connected: boolean;
  statusText: string;
  engine: "Cloudflare D1 (SQLite)" | "In-Memory Dual Runtime";
  latencyMs: number;
}

export async function verifyD1Connection(db?: D1Database | null): Promise<D1ConnectionHealth> {
  if (!db) {
    return {
      connected: false,
      statusText: "LOCAL DUAL-RUNTIME ENGINE ACTIVE (D1 UNBOUND)",
      engine: "In-Memory Dual Runtime",
      latencyMs: 0
    };
  }

  const start = Date.now();
  try {
    await ensureD1Schema(db);
    const ping = await db.prepare("SELECT 1 as ping").first<{ ping: number }>();
    const latency = Date.now() - start;
    if (ping && ping.ping === 1) {
      return {
        connected: true,
        statusText: "D1 DATABASE CONNECTED",
        engine: "Cloudflare D1 (SQLite)",
        latencyMs: latency
      };
    }
    return {
      connected: false,
      statusText: "D1 QUERY FAILED",
      engine: "Cloudflare D1 (SQLite)",
      latencyMs: latency
    };
  } catch (err: any) {
    return {
      connected: false,
      statusText: `D1 CONNECTION ERROR: ${err?.message || "Unknown"}`,
      engine: "Cloudflare D1 (SQLite)",
      latencyMs: Date.now() - start
    };
  }
}

export async function executeD1Query<T = unknown>(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureD1Schema(db);
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  const res = await bound.all<T>();
  return res.results || [];
}

export async function executeD1Run(
  db: D1Database,
  sql: string,
  params: unknown[] = []
): Promise<{ success: boolean; meta?: unknown }> {
  await ensureD1Schema(db);
  const stmt = db.prepare(sql);
  const bound = params.length > 0 ? stmt.bind(...params) : stmt;
  return await bound.run();
}
