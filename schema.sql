-- ============================================================================
-- SAHYAK PRODUCTION D1 DATABASE SCHEMA
-- ============================================================================

-- 1. LEADS CAPTURE & CONVERSION PIPELINE
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT DEFAULT 'Not specified',
    team_size TEXT DEFAULT '1-5',
    requirement TEXT,
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
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- 2. VISITOR IDENTITY (FIRST-PARTY ANONYMOUS INTELLIGENCE)
CREATE TABLE IF NOT EXISTS visitors (
    visitor_id TEXT PRIMARY KEY,
    first_seen INTEGER NOT NULL,          -- Unix ms timestamp
    last_seen INTEGER NOT NULL,           -- Unix ms timestamp
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
);

CREATE INDEX IF NOT EXISTS idx_visitors_first_seen ON visitors(first_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_source ON visitors(first_source);

-- 3. BROWSING SESSIONS (ENGAGEMENT & ATTRIBUTION SESSIONS)
CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    start_time INTEGER NOT NULL,          -- Unix ms timestamp
    last_active INTEGER NOT NULL,         -- Unix ms timestamp
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
    is_bounce INTEGER DEFAULT 1,          -- 1 if single-page session, 0 if navigated
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_visitor ON sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_sessions_source ON sessions(source);

-- 4. PAGE VIEWS & TIME ON PAGE
CREATE TABLE IF NOT EXISTS page_views (
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
    ts INTEGER NOT NULL,                  -- Unix ms timestamp
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pv_ts ON page_views(ts);
CREATE INDEX IF NOT EXISTS idx_pv_visitor ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_pv_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_pv_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_pv_source ON page_views(source);

-- 5. SECTION ENGAGEMENT (HOMEPAGE DWELL INTELLIGENCE)
CREATE TABLE IF NOT EXISTS section_engagements (
    id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    section_id TEXT NOT NULL,             -- e.g. hero, problem, conduit, mobile_closer, inventory, site_visit, etc.
    duration_sec INTEGER NOT NULL,        -- Dwell time in seconds
    ts INTEGER NOT NULL,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_se_ts ON section_engagements(ts);
CREATE INDEX IF NOT EXISTS idx_se_section ON section_engagements(section_id);

-- 6. LIVE TELEMETRY HEARTBEAT (ACTIVE VISITORS NOW)
CREATE TABLE IF NOT EXISTS live_visitors (
    session_id TEXT PRIMARY KEY,
    visitor_id TEXT NOT NULL,
    current_path TEXT NOT NULL,
    last_seen INTEGER NOT NULL,           -- Unix ms timestamp
    country TEXT DEFAULT '',
    city TEXT DEFAULT '',
    device TEXT DEFAULT 'Desktop',
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_live_last_seen ON live_visitors(last_seen);

-- 7. AUDIT LOGS & SECURITY TELEMETRY
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 8. DAILY ROLLUP AGGREGATES (FAST 6M/1Y RANGE QUERIES)
CREATE TABLE IF NOT EXISTS daily_analytics_aggregates (
    date TEXT PRIMARY KEY,               -- YYYY-MM-DD
    visitors INTEGER DEFAULT 0,
    pageviews INTEGER DEFAULT 0,
    sessions INTEGER DEFAULT 0,
    bounces INTEGER DEFAULT 0,
    leads INTEGER DEFAULT 0,
    avg_dwell_sec INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_daa_date ON daily_analytics_aggregates(date);

-- ============================================================================
-- SAHYAK SEO / GEO / AEO & SEARCH INTELLIGENCE ENGINE TABLES
-- ============================================================================

-- 9. SEO TOPIC CLUSTERS (TAXONOMY & PILLAR TOPICS)
CREATE TABLE IF NOT EXISTS seo_topics (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    parent_topic_id TEXT DEFAULT '',
    pillar_page_id TEXT DEFAULT '',
    cluster_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seo_topics_slug ON seo_topics(slug);
CREATE INDEX IF NOT EXISTS idx_seo_topics_parent ON seo_topics(parent_topic_id);

-- 10. SEO KEYWORDS (REAL TARGETING & PERFORMANCE REPOSITORY)
CREATE TABLE IF NOT EXISTS seo_keywords (
    id TEXT PRIMARY KEY,
    keyword TEXT NOT NULL UNIQUE,
    normalized_keyword TEXT NOT NULL DEFAULT '',
    topic_id TEXT NOT NULL,
    search_intent TEXT NOT NULL,          -- informational, commercial_investigation, transactional, navigational, problem_solution, comparison, tool_calculator, local_regional
    priority TEXT DEFAULT 'core',         -- core, high, medium, low
    country TEXT DEFAULT 'IN',            -- ISO alpha-2 country code
    language TEXT DEFAULT 'en',           -- ISO language code
    locale TEXT DEFAULT 'en-in',          -- combined locale code
    source TEXT DEFAULT '',               -- SERP research, Search Console, Google Trends, etc.
    source_url TEXT DEFAULT '',           -- reference URL
    research_date TEXT DEFAULT '',        -- YYYY-MM-DD
    search_volume INTEGER,               -- NULL unless verified by external authoritative source
    volume_source TEXT DEFAULT '',        -- data source attribution
    difficulty TEXT DEFAULT '',            -- data-backed or empty
    difficulty_source TEXT DEFAULT '',
    commercial_value TEXT DEFAULT 'medium',-- high, medium, low
    mapped_page_id TEXT DEFAULT '',       -- ID of mapped page in seo_pages
    target_url TEXT DEFAULT '',           -- Target destination URL
    status TEXT DEFAULT 'unmapped',       -- unmapped, mapped, candidate, published, deferred, duplicate, cannibalization_risk
    notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seo_keywords_topic ON seo_keywords(topic_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_intent ON seo_keywords(search_intent);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_priority ON seo_keywords(priority);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_status ON seo_keywords(status);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_normalized ON seo_keywords(normalized_keyword);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_mapped_page ON seo_keywords(mapped_page_id);

-- 11. SEO PAGES MODEL (PROGRAMMATIC & STATIC SEARCH METADATA)
CREATE TABLE IF NOT EXISTS seo_pages (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    page_type TEXT NOT NULL,              -- commercial_landing, problem_solution, feature, industry_solution, educational_learning, tool, comparison, country_market
    primary_topic_id TEXT DEFAULT '',
    search_intent TEXT NOT NULL,
    primary_keyword TEXT NOT NULL,
    secondary_keywords TEXT DEFAULT '[]', -- JSON array of strings
    country TEXT DEFAULT 'IN',            -- ISO alpha-2 country code
    language TEXT DEFAULT 'en',           -- ISO language code
    locale TEXT DEFAULT 'en-in',          -- combined locale code
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    h1 TEXT NOT NULL,
    body_content TEXT DEFAULT '',         -- Structured content payload or markdown
    canonical_url TEXT NOT NULL,
    hreflang_references TEXT DEFAULT '[]',-- JSON array of { lang, url }
    schema_type TEXT DEFAULT 'WebSite',   -- Organization, SoftwareApplication, BreadcrumbList, Article, FAQPage
    schema_config TEXT DEFAULT '{}',      -- JSON payload of schema options
    is_indexable INTEGER DEFAULT 1,       -- 1 if indexable, 0 if noindex
    publication_status TEXT DEFAULT 'draft', -- draft, published, archived
    breadcrumb_hierarchy TEXT DEFAULT '[]',-- JSON array of { name, item }
    parent_topic TEXT DEFAULT '',
    related_pages TEXT DEFAULT '[]',      -- JSON array of page IDs or slugs
    quality_score INTEGER DEFAULT 0,      -- 0-100 quality score
    quality_issues TEXT DEFAULT '[]',     -- JSON array of quality audit notes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_type ON seo_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_seo_pages_topic ON seo_pages(primary_topic_id);
CREATE INDEX IF NOT EXISTS idx_seo_pages_status ON seo_pages(publication_status);
CREATE INDEX IF NOT EXISTS idx_seo_pages_indexable ON seo_pages(is_indexable);

-- 12. INTERNAL LINK GRAPH (CRAWLABLE CONTEXTUAL TOPOLOGY)
CREATE TABLE IF NOT EXISTS seo_internal_links (
    id TEXT PRIMARY KEY,
    source_page_id TEXT NOT NULL,
    source_path TEXT NOT NULL,
    target_page_id TEXT NOT NULL,
    target_path TEXT NOT NULL,
    anchor_text TEXT NOT NULL,
    rel TEXT DEFAULT 'follow',
    context TEXT DEFAULT 'body',          -- body, navigation, footer, related_cluster, breadcrumb
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sil_source ON seo_internal_links(source_path);
CREATE INDEX IF NOT EXISTS idx_sil_target ON seo_internal_links(target_path);

-- 13. SEARCH CONSOLE PERFORMANCE INGESTION (REAL DATA REPOSITORY)
CREATE TABLE IF NOT EXISTS search_console_metrics (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    page TEXT NOT NULL,
    country TEXT NOT NULL,
    device TEXT NOT NULL,                 -- DESKTOP, MOBILE, TABLET
    clicks INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    position REAL DEFAULT 0.0,
    date TEXT NOT NULL,                   -- YYYY-MM-DD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_scm_unique ON search_console_metrics(date, query, page, country, device);
CREATE INDEX IF NOT EXISTS idx_scm_date ON search_console_metrics(date);
CREATE INDEX IF NOT EXISTS idx_scm_page ON search_console_metrics(page);
CREATE INDEX IF NOT EXISTS idx_scm_query ON search_console_metrics(query);

-- 14. SEO AUDIT ISSUES LOG
CREATE TABLE IF NOT EXISTS seo_audit_issues (
    id TEXT PRIMARY KEY,
    route_path TEXT NOT NULL,
    severity TEXT NOT NULL,               -- critical, warning, info
    issue_type TEXT NOT NULL,             -- orphan_page, missing_title, duplicate_title, missing_desc, missing_h1, broken_link, broken_canonical, noindex_conflict
    message TEXT NOT NULL,
    suggested_fix TEXT NOT NULL,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sai_severity ON seo_audit_issues(severity);
CREATE INDEX IF NOT EXISTS idx_sai_path ON seo_audit_issues(route_path);

-- 15. SEO CONTENT OPPORTUNITIES ENGINE
CREATE TABLE IF NOT EXISTS seo_content_opportunities (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    normalized_query TEXT NOT NULL,
    current_page TEXT DEFAULT '',
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr REAL DEFAULT 0.0,
    position REAL DEFAULT 0.0,
    intent TEXT DEFAULT 'informational',
    classification TEXT NOT NULL,         -- optimize_existing_page, new_page_candidate, internal_link_opportunity, metadata_opportunity, cannibalization_risk, insufficient_data, ignore
    recommended_action TEXT NOT NULL,
    reason TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',       -- high, medium, low
    confidence REAL DEFAULT 0.8,          -- 0.0 - 1.0 confidence score
    evidence TEXT DEFAULT '{}',           -- JSON payload of supporting metrics
    data_period TEXT DEFAULT '28d',       -- 7d, 28d, 3m
    source TEXT DEFAULT 'google_search_console',
    first_seen TEXT NOT NULL,
    last_seen TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sco_query_page ON seo_content_opportunities(query, current_page);
CREATE INDEX IF NOT EXISTS idx_sco_status ON seo_content_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_sco_classification ON seo_content_opportunities(classification);
CREATE INDEX IF NOT EXISTS idx_sco_priority ON seo_content_opportunities(priority);

-- 16. GOOGLE SEARCH CONSOLE SYNC OPERATIONS & LOCKING
CREATE TABLE IF NOT EXISTS gsc_sync_state (
    id TEXT PRIMARY KEY,                  -- 'singleton'
    status TEXT DEFAULT 'never_synced',   -- never_synced, running, completed, partially_completed, failed, disconnected
    last_successful_sync TEXT,            -- ISO string
    last_attempted_sync TEXT,             -- ISO string
    rows_imported INTEGER DEFAULT 0,
    date_range_start TEXT DEFAULT '',
    date_range_end TEXT DEFAULT '',
    error_message TEXT DEFAULT '',
    is_locked INTEGER DEFAULT 0,
    lock_acquired_at TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. SEO ALERT & MONITORING ENGINE
CREATE TABLE IF NOT EXISTS seo_alerts (
    id TEXT PRIMARY KEY,
    severity TEXT NOT NULL,               -- critical, warning, info
    metric TEXT NOT NULL,                 -- traffic, impressions, ctr, rank, technical, canonical, conversion
    current_value REAL DEFAULT 0.0,
    baseline_value REAL DEFAULT 0.0,
    change_pct REAL DEFAULT 0.0,
    affected_target TEXT DEFAULT '',       -- query, page, or system component
    recommended_action TEXT NOT NULL,
    status TEXT DEFAULT 'open',           -- open, acknowledged, resolved, dismissed
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_seo_alerts_status ON seo_alerts(status);
CREATE INDEX IF NOT EXISTS idx_seo_alerts_severity ON seo_alerts(severity);
