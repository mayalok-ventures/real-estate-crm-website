/**
 * SAHYAK CRM — Search Entity Model, SEO, GEO, AEO & International Types
 */

export type SearchIntent =
  | "informational"
  | "commercial_investigation"
  | "transactional"
  | "navigational"
  | "problem_solution"
  | "comparison"
  | "tool_calculator"
  | "local_regional";

export type PageType =
  | "commercial_landing"
  | "problem_solution"
  | "feature"
  | "industry_solution"
  | "educational_learning"
  | "tool"
  | "comparison"
  | "country_market";

export type PublicationStatus = "draft" | "in_review" | "published" | "archived";

export type PriorityLevel = "core" | "high" | "medium" | "low";

export type SchemaType =
  | "Organization"
  | "WebSite"
  | "SoftwareApplication"
  | "BreadcrumbList"
  | "Article"
  | "FAQPage"
  | "Product";

export interface HreflangReference {
  lang: string; // e.g. "en", "en-IN", "en-US", "x-default"
  url: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string; // URL
}

export interface SeoTopic {
  id: string;
  slug: string;
  title: string;
  description: string;
  parentTopicId?: string;
  pillarPageId?: string;
  clusterOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type KeywordStatus =
  | "unmapped"
  | "mapped"
  | "candidate"
  | "published"
  | "deferred"
  | "duplicate"
  | "cannibalization_risk";

export interface SeoKeyword {
  id: string;
  keyword: string;
  normalizedKeyword: string;
  topicId: string;
  searchIntent: SearchIntent;
  priority: PriorityLevel;
  country?: string;
  language?: string;
  locale?: string;
  source?: string;
  sourceUrl?: string;
  researchDate?: string;
  searchVolume?: number | null;
  volumeSource?: string;
  difficulty?: string;
  difficultySource?: string;
  commercialValue?: "high" | "medium" | "low";
  mappedPageId?: string;
  targetPageId?: string;
  targetUrl?: string;
  status: KeywordStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeoPage {
  id: string;
  slug: string;
  pageType: PageType;
  primaryTopicId: string;
  searchIntent: SearchIntent;
  primaryKeyword: string;
  secondaryKeywords: string[];
  country: string; // ISO 3166-1 alpha-2, e.g. "IN", "US", "AE"
  language: string; // ISO 639-1, e.g. "en"
  locale: string; // e.g. "en-in", "en-us"
  title: string;
  metaDescription: string;
  h1: string;
  bodyContent: string;
  canonicalUrl: string;
  hreflangReferences: HreflangReference[];
  schemaType: SchemaType;
  schemaConfig: Record<string, unknown>;
  isIndexable: boolean;
  publicationStatus: PublicationStatus;
  breadcrumbHierarchy: BreadcrumbItem[];
  parentTopic?: string;
  relatedPages: string[];
  qualityScore: number;
  qualityIssues: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InternalLink {
  id: string;
  sourcePageId: string;
  sourcePath: string;
  targetPageId: string;
  targetPath: string;
  anchorText: string;
  rel?: "follow" | "nofollow";
  context?: "body" | "navigation" | "footer" | "related_cluster" | "breadcrumb";
  createdAt: string;
}

export interface SearchConsoleMetric {
  id: string;
  query: string;
  page: string;
  country: string;
  device: "DESKTOP" | "MOBILE" | "TABLET";
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface AuditIssue {
  id: string;
  routePath: string;
  severity: "critical" | "warning" | "info";
  issueType:
    | "orphan_page"
    | "missing_title"
    | "bad_title_length"
    | "duplicate_title"
    | "missing_desc"
    | "weak_desc"
    | "duplicate_desc"
    | "missing_h1"
    | "multiple_h1"
    | "broken_link"
    | "broken_canonical"
    | "missing_canonical"
    | "noindex_conflict"
    | "sitemap_mismatch"
    | "missing_hreflang"
    | "invalid_json_ld"
    | "missing_structured_data"
    | "missing_breadcrumbs"
    | "thin_content"
    | "draft_exposed"
    | "accidental_noindex"
    | "redirect_issue"
    | "route_404"
    | "excessive_crawl_depth"
    | "internal_link_gap"
    | "duplicate_intent"
    | "cannibalization_risk"
    | "excessive_links";
  message: string;
  suggestedFix: string;
  detectedAt: string;
}

export interface QualityGateResult {
  passed: boolean;
  score: number;
  issues: string[];
  warnings: string[];
  checks: {
    slugFormat: boolean;
    titleLength: boolean;
    descriptionLength: boolean;
    h1Presence: boolean;
    wordCount: boolean;
    canonicalValid: boolean;
    localeValid: boolean;
    noDuplicateKeyword: boolean;
    noBrokenLinks: boolean;
    schemaValid: boolean;
    publicAccessible: boolean;
    notNoindexIfPublished: boolean;
  };
}

export interface SeoOverviewStats {
  totalPages: number;
  indexablePages: number;
  noindexPages: number;
  draftPages: number;
  topicsCount: number;
  keywordsCount: number;
  internalLinksCount: number;
  criticalIssuesCount: number;
  warningIssuesCount: number;
  healthScore: number;
  lastAuditDate: string | null;
  gscConnected: boolean;
  totalGscClicks: number;
  totalGscImpressions: number;
  opportunitiesCount?: number;
}

// ============================================================================
// PHASE 3 SEARCH INTELLIGENCE & CONVERSION TYPES
// ============================================================================

export type OpportunityClassification =
  | "optimize_existing_page"
  | "new_page_candidate"
  | "internal_link_opportunity"
  | "metadata_opportunity"
  | "cannibalization_risk"
  | "insufficient_data"
  | "ignore";

export type OpportunityStatus =
  | "opportunity"
  | "review"
  | "approved"
  | "in_progress"
  | "updated"
  | "dismissed";

export interface SeoContentOpportunity {
  id: string;
  query: string;
  normalizedQuery: string;
  currentPage: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  intent: SearchIntent;
  classification: OpportunityClassification;
  recommendedAction: string;
  reason: string;
  priority?: "high" | "medium" | "low";
  confidence?: number;
  evidence?: Record<string, unknown>;
  dataPeriod?: string;
  status: OpportunityStatus;
  source: string;
  firstSeen: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeoConversionMetric {
  landingPage: string;
  pageTitle: string;
  organicVisitors: number;
  ctaClicks: number;
  leads: number;
  qualifiedLeads?: number;
  opportunities?: number;
  deals?: number;
  revenue?: string; // e.g. "Revenue attribution unavailable"
  conversionRate: string; // e.g. "4.2%" or "Insufficient data"
  status: "active" | "insufficient_data";
}

export interface InternalLinkRecommendation {
  id: string;
  sourcePath: string;
  targetPath: string;
  recommendedAnchor: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface TopicGraphCluster {
  topicId: string;
  topicTitle: string;
  slug: string;
  pillarPage: string;
  supportingPages: { path: string; title: string; intent: string }[];
  tools: { path: string; title: string }[];
  comparisons: { path: string; title: string }[];
  entityRelationships: string[];
  inboundInternalLinksCount: number;
  outboundInternalLinksCount: number;
}

export type GscSyncStatus =
  | "never_synced"
  | "running"
  | "completed"
  | "partially_completed"
  | "failed"
  | "disconnected";

export interface GscSyncState {
  id: string;
  status: GscSyncStatus;
  lastSuccessfulSync: string | null;
  lastAttemptedSync: string | null;
  rowsImported: number;
  dateRangeStart: string;
  dateRangeEnd: string;
  errorMessage: string;
  isLocked: boolean;
  lockAcquiredAt: string | null;
  updatedAt: string;
}

export interface GscSyncResult {
  success: boolean;
  connected: boolean;
  ingestedCount: number;
  skippedCount: number;
  dateRange?: { startDate: string; endDate: string };
  message: string;
  timestamp: string;
  state?: GscSyncState;
}

// ============================================================================
// PHASE 4 SEARCH GROWTH, ALERT & MARKET INTELLIGENCE TYPES
// ============================================================================

export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "open" | "acknowledged" | "resolved" | "dismissed";

export interface SeoAlert {
  id: string;
  severity: AlertSeverity;
  metric: string;
  currentValue: number;
  baselineValue: number;
  changePct: number;
  affectedTarget: string;
  recommendedAction: string;
  status: AlertStatus;
  detectedAt: string;
  metadata?: Record<string, unknown>;
}

export interface MarketIntelligenceItem {
  country: string;
  countryName: string;
  organicVisitors: number;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  capturedLeads: number;
  conversionRate: string;
  topQueries: { query: string; clicks: number; impressions: number }[];
  topLandingPages: { page: string; clicks: number; impressions: number }[];
  status: "observed" | "emerging" | "insufficient_data";
}

export type ProductClaimStatus =
  | "implemented"
  | "partial"
  | "planned"
  | "external_dependency"
  | "unsupported";

export interface ProductClaimTruth {
  id: string;
  claim: string;
  category:
    | "lead_ingress"
    | "whatsapp"
    | "inventory"
    | "commission"
    | "security"
    | "compliance"
    | "site_visits"
    | "performance";
  status: ProductClaimStatus;
  evidence: string;
  lastVerified: string;
  constraints?: string;
}

export interface GrowthOverviewStats {
  organicVisitors: number;
  impressions: number;
  clicks: number;
  ctr: number;
  averagePosition: number;
  capturedLeads: number;
  organicConversionRate: string;
  dateRange: string;
  dataStatus: "connected" | "insufficient_data" | "disconnected";
}

