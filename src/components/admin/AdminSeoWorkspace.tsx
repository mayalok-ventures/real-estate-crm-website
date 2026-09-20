"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  RefreshCw,
  FileText,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Link2,
  Activity,
  Check,
  Clock,
  Eye,
  Plus,
  Compass,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  X,
  Database,
  Target,
  Users,
  Network,
  ArrowUpRight,
  BarChart2,
  Calendar,
  Filter,
  Bell,
  Wrench,
  Calculator,
  Shield,
  BookOpen,
  AlertOctagon
} from "lucide-react";
import {
  SeoTopic,
  SeoKeyword,
  SeoPage,
  InternalLink,
  AuditIssue,
  SeoOverviewStats,
  QualityGateResult,
  SearchConsoleMetric,
  SeoContentOpportunity,
  SeoConversionMetric,
  TopicGraphCluster,
  InternalLinkRecommendation,
  OpportunityClassification,
  OpportunityStatus,
  SeoAlert,
  MarketIntelligenceItem,
  GscSyncState,
  ProductClaimTruth,
} from "@/lib/seo/types";
import { PRODUCT_CLAIMS_REGISTRY } from "@/lib/seo/product-truth";

type SeoSubTab =
  | "overview"
  | "performance"
  | "opportunities"
  | "alerts"
  | "market"
  | "tools"
  | "conversion"
  | "truth"
  | "graph"
  | "topics"
  | "keywords"
  | "pages"
  | "audit"
  | "sitemaps";

interface SitemapSegment {
  name: string;
  url: string;
  pageCount: number;
  status: string;
  changeFrequency: string;
}

export default function AdminSeoWorkspace() {
  const [subTab, setSubTab] = useState<SeoSubTab>("overview");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Core Data states
  const [stats, setStats] = useState<SeoOverviewStats | null>(null);
  const [topics, setTopics] = useState<(SeoTopic & { keywordsCount: number; pagesCount: number; keywords: any[] })[]>([]);
  const [keywords, setKeywords] = useState<SeoKeyword[]>([]);
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [links, setLinks] = useState<InternalLink[]>([]);
  const [auditIssues, setAuditIssues] = useState<AuditIssue[]>([]);
  const [lastAuditDate, setLastAuditDate] = useState<string | null>(null);
  const [sitemapSegments, setSitemapSegments] = useState<SitemapSegment[]>([]);

  // Phase 3 Data states
  const [performance, setPerformance] = useState<{
    connected: boolean;
    configurationStatus: string;
    timeRange: string;
    summary: {
      totalClicks: number;
      totalImpressions: number;
      avgCtr: string;
      avgPosition: string;
      totalRecords: number;
    };
    topQueries: { query: string; clicks: number; impressions: number; ctr: string; position: string }[];
    topPages: { page: string; clicks: number; impressions: number; ctr: string; position: string }[];
    topCountries: { country: string; clicks: number; impressions: number; ctr: string }[];
    deviceBreakdown: { device: string; clicks: number; impressions: number; ctr: string }[];
    dailyTrend: { date: string; clicks: number; impressions: number }[];
    rawMetrics: SearchConsoleMetric[];
  } | null>(null);

  const [opportunities, setOpportunities] = useState<SeoContentOpportunity[]>([]);
  const [conversionData, setConversionData] = useState<{
    metrics: SeoConversionMetric[];
    totalOrganicVisitors: number;
    totalCtaClicks: number;
    totalOrganicLeads: number;
    overallConversionRate: string;
  } | null>(null);

  const [topicGraph, setTopicGraph] = useState<{
    clusters: TopicGraphCluster[];
    linkRecommendations: InternalLinkRecommendation[];
    stats: any;
  } | null>(null);

  // Performance Filters
  const [perfTimeRange, setPerfTimeRange] = useState<string>("28d");
  const [perfDimension, setPerfDimension] = useState<"queries" | "pages" | "countries" | "devices">("queries");
  const [isSyncingGsc, setIsSyncingGsc] = useState<boolean>(false);
  const [syncNotification, setSyncNotification] = useState<string>("");
  const [backfillDays, setBackfillDays] = useState<number>(28);

  // Phase 4 Growth & Alert States
  const [alerts, setAlerts] = useState<SeoAlert[]>([]);
  const [marketData, setMarketData] = useState<MarketIntelligenceItem[]>([]);
  const [gscSyncState, setGscSyncState] = useState<GscSyncState | null>(null);
  const [alertStatusFilter, setAlertStatusFilter] = useState<string>("all");
  const [oppPriorityFilter, setOppPriorityFilter] = useState<string>("all");
  const [updatingAlertId, setUpdatingAlertId] = useState<string | null>(null);
  const [isEvaluatingAlerts, setIsEvaluatingAlerts] = useState<boolean>(false);

  // Opportunities Filters & Actions
  const [oppClassFilter, setOppClassFilter] = useState<string>("all");
  const [oppStatusFilter, setOppStatusFilter] = useState<string>("all");
  const [updatingOppId, setUpdatingOppId] = useState<string | null>(null);

  // Page Filters
  const [pageSearch, setPageSearch] = useState<string>("");
  const [pageTypeFilter, setPageTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Keyword Filters
  const [kwSearch, setKwSearch] = useState<string>("");
  const [kwIntentFilter, setKwIntentFilter] = useState<string>("all");
  const [kwStatusFilter, setKwStatusFilter] = useState<string>("all");

  // Validation modal state
  const [validatingPage, setValidatingPage] = useState<SeoPage | null>(null);
  const [validationResult, setValidationResult] = useState<QualityGateResult | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Live Audit running state
  const [isRunningAudit, setIsRunningAudit] = useState<boolean>(false);
  const [auditNotification, setAuditNotification] = useState<string>("");

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const [
        statsRes,
        topicsRes,
        pagesRes,
        auditRes,
        sitemapsRes,
        perfRes,
        kwRes,
        oppRes,
        convRes,
        graphRes,
        alertsRes,
        marketRes,
        syncRes,
      ] = await Promise.all([
        fetch("/api/admin/seo/overview"),
        fetch("/api/admin/seo/topics"),
        fetch("/api/admin/seo/pages"),
        fetch("/api/admin/seo/audit"),
        fetch("/api/admin/seo/sitemaps"),
        fetch(`/api/admin/seo/performance?timeRange=${perfTimeRange}`),
        fetch("/api/admin/seo/keywords"),
        fetch("/api/admin/seo/opportunities"),
        fetch("/api/admin/seo/conversion"),
        fetch("/api/admin/seo/topic-graph"),
        fetch("/api/admin/seo/alerts"),
        fetch("/api/admin/seo/market"),
        fetch("/api/admin/seo/performance/sync"),
      ]);

      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.success) setStats(d.data);
      }
      if (topicsRes.ok) {
        const d = await topicsRes.json();
        if (d.success) setTopics(d.data);
      }
      if (pagesRes.ok) {
        const d = await pagesRes.json();
        if (d.success) setPages(d.data);
      }
      if (kwRes.ok) {
        const d = await kwRes.json();
        if (d.success) setKeywords(d.data);
      }
      if (auditRes.ok) {
        const d = await auditRes.json();
        if (d.success) {
          setAuditIssues(d.data.issues || []);
          setLastAuditDate(d.data.lastAuditDate);
        }
      }
      if (sitemapsRes.ok) {
        const d = await sitemapsRes.json();
        if (d.success && d.data?.segments) {
          setSitemapSegments(d.data.segments);
        }
      }
      if (perfRes.ok) {
        const d = await perfRes.json();
        if (d.success) setPerformance(d.data);
      }
      if (oppRes.ok) {
        const d = await oppRes.json();
        if (d.success) setOpportunities(d.data.opportunities || []);
      }
      if (alertsRes.ok) {
        const d = await alertsRes.json();
        if (d.success) setAlerts(d.data || []);
      }
      if (marketRes.ok) {
        const d = await marketRes.json();
        if (d.success) setMarketData(d.data || []);
      }
      if (syncRes.ok) {
        const d = await syncRes.json();
        if (d.success && d.data) setGscSyncState(d.data);
      }
      if (convRes.ok) {
        const d = await convRes.json();
        if (d.success) setConversionData(d.data);
      }
      if (graphRes.ok) {
        const d = await graphRes.json();
        if (d.success) setTopicGraph(d.data);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load SEO intelligence data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [perfTimeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle live audit run
  const handleRunAudit = async () => {
    setIsRunningAudit(true);
    setAuditNotification("");
    try {
      const res = await fetch("/api/admin/seo/audit", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setAuditIssues(data.data.issues);
        setLastAuditDate(data.data.completedAt);
        setAuditNotification(
          `Live crawl complete: ${data.data.scannedPages} pages scanned across 22 checks, ${data.data.criticalCount} critical issues detected.`
        );
        const statsRes = await fetch("/api/admin/seo/overview");
        if (statsRes.ok) {
          const s = await statsRes.json();
          if (s.success) setStats(s.data);
        }
      } else {
        setAuditNotification("Audit crawl encountered an issue.");
      }
    } catch (err: any) {
      setAuditNotification(`Error: ${err?.message || "Audit failed"}`);
    } finally {
      setIsRunningAudit(false);
    }
  };

  // Handle manual GSC sync with backfill support
  const handleSyncGsc = async (days = backfillDays) => {
    setIsSyncingGsc(true);
    setSyncNotification("");
    try {
      const res = await fetch("/api/admin/seo/performance/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backfillDays: days }),
      });
      const d = await res.json();
      if (d.success) {
        setSyncNotification(d.data?.message || `GSC ${days}d data ingested successfully.`);
        fetchData();
      } else {
        setSyncNotification(d.data?.message || d.error || "GSC sync failed.");
      }
    } catch (err: any) {
      setSyncNotification(`Sync Error: ${err?.message || "Network error"}`);
    } finally {
      setIsSyncingGsc(false);
    }
  };

  // Handle opportunity status transition
  const handleUpdateOpportunityStatus = async (id: string, newStatus: OpportunityStatus) => {
    setUpdatingOppId(id);
    try {
      const res = await fetch("/api/admin/seo/opportunities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const d = await res.json();
      if (d.success) {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingOppId(null);
    }
  };

  // Handle alert status transition
  const handleUpdateAlertStatus = async (id: string, newStatus: "open" | "acknowledged" | "resolved" | "dismissed") => {
    setUpdatingAlertId(id);
    try {
      const res = await fetch(`/api/admin/seo/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const d = await res.json();
      if (d.success) {
        setAlerts((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error("Failed to update alert status:", err);
    } finally {
      setUpdatingAlertId(null);
    }
  };

  // Handle running alert engine evaluation
  const handleEvaluateAlerts = async () => {
    setIsEvaluatingAlerts(true);
    try {
      const res = await fetch("/api/admin/seo/alerts", { method: "POST" });
      const d = await res.json();
      if (d.success) {
        fetchData();
      }
    } catch (err) {
      console.error("Failed to evaluate alerts:", err);
    } finally {
      setIsEvaluatingAlerts(false);
    }
  };

  // Run validation on specific page
  const handleValidatePage = async (page: SeoPage) => {
    setValidatingPage(page);
    setIsValidating(true);
    setValidationResult(null);
    try {
      const res = await fetch(`/api/admin/seo/pages/${page.id}/validate`, { method: "POST" });
      const d = await res.json();
      if (d.success) {
        setValidationResult(d.data);
      }
    } catch {
      // Ignored
    } finally {
      setIsValidating(false);
    }
  };

  // Filtered lists
  const filteredPages = pages.filter((p) => {
    if (pageSearch && !p.title.toLowerCase().includes(pageSearch.toLowerCase()) && !p.slug.toLowerCase().includes(pageSearch.toLowerCase())) {
      return false;
    }
    if (pageTypeFilter !== "all" && p.pageType !== pageTypeFilter) return false;
    if (statusFilter !== "all" && p.publicationStatus !== statusFilter) return false;
    if (selectedTopicId && p.primaryTopicId !== selectedTopicId) return false;
    return true;
  });

  const filteredKeywords = keywords.filter((k) => {
    if (kwSearch && !k.keyword.toLowerCase().includes(kwSearch.toLowerCase()) && !k.normalizedKeyword.toLowerCase().includes(kwSearch.toLowerCase())) {
      return false;
    }
    if (kwIntentFilter !== "all" && k.searchIntent !== kwIntentFilter) return false;
    if (kwStatusFilter !== "all" && k.status !== kwStatusFilter) return false;
    return true;
  });

  const filteredOpportunities = opportunities.filter((o) => {
    if (oppClassFilter !== "all" && o.classification !== oppClassFilter) return false;
    if (oppStatusFilter !== "all" && o.status !== oppStatusFilter) return false;
    if (oppPriorityFilter !== "all" && (o.priority || "medium") !== oppPriorityFilter) return false;
    return true;
  });

  const filteredAlerts = alerts.filter((a) => {
    if (alertStatusFilter !== "all" && a.status !== alertStatusFilter) return false;
    return true;
  });

  if (loading && !stats) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-sm font-semibold text-slate-600">Loading Search Intelligence Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200">
              Phase 4 Growth Engine
            </span>
            <span className="text-xs text-slate-400">Search Growth &amp; Market Expansion Control Center</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Search Intelligence &amp; Growth Control Center
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated Search Console operations, 18-point growth heuristics, real-time alerts, market intelligence, and verified product truth.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleRunAudit}
            disabled={isRunningAudit}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isRunningAudit ? "animate-spin" : "text-emerald-400"}`} />
            <span>{isRunningAudit ? "Running 22 Checks..." : "Run SEO Crawler"}</span>
          </button>
        </div>
      </div>

      {auditNotification && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-medium text-blue-900 flex items-center justify-between">
          <span>{auditNotification}</span>
          <button onClick={() => setAuditNotification("")} className="text-blue-500 hover:text-blue-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {syncNotification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-900 flex items-center justify-between">
          <span>{syncNotification}</span>
          <button onClick={() => setSyncNotification("")} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar">
        {[
          { id: "overview", label: "Overview & Health", icon: Activity },
          { id: "performance", label: "Search Performance", icon: TrendingUp },
          { id: "opportunities", label: `Opportunities (${opportunities.length})`, icon: Target },
          { id: "alerts", label: `Alerts (${alerts.length})`, icon: Bell },
          { id: "market", label: "Market Intelligence", icon: Globe },
          { id: "tools", label: "Interactive Tools (5)", icon: Calculator },
          { id: "conversion", label: "SEO Conversion", icon: BarChart2 },
          { id: "graph", label: "Topic Authority Graph", icon: Network },
          { id: "truth", label: "Product Truth", icon: Shield },
          { id: "topics", label: `Clusters (${topics.length})`, icon: Layers },
          { id: "keywords", label: `Keywords (${keywords.length})`, icon: Search },
          { id: "pages", label: `Pages (${pages.length})`, icon: FileText },
          { id: "audit", label: `Audit Issues (${auditIssues.length})`, icon: AlertTriangle },
          { id: "sitemaps", label: `Sitemaps (${sitemapSegments.length})`, icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as SeoSubTab)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: OVERVIEW & HEALTH */}
      {subTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">SEO Health</span>
                <ShieldCheck className={`w-4 h-4 ${(stats?.healthScore || 0) >= 90 ? "text-emerald-500" : "text-amber-500"}`} />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats ? `${stats.healthScore}/100` : "—"}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                {stats?.criticalIssuesCount === 0 ? "Zero critical errors" : `${stats?.criticalIssuesCount} critical errors`}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Indexable Pages</span>
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.indexablePages ?? pages.filter((p) => p.isIndexable).length}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                of {pages.length} registered pages
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Topic Clusters</span>
                <Layers className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.topicsCount ?? topics.length}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Real Estate CRM taxonomy
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Content Ops</span>
                <Target className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {opportunities.length}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Active search opportunities
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Active Sitemaps</span>
                <Compass className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {sitemapSegments.length || 6}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Dynamic segmented XML
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">GSC Ingestion</span>
                <Globe className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-base font-bold text-slate-700 flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${performance?.connected ? "bg-emerald-500" : "bg-amber-400"}`} />
                <span>{performance?.connected ? "Connected" : "Unlinked"}</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Real Search Console credentials
              </p>
            </div>
          </div>

          {/* Phase 4 GSC Automation & Sync State */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Search Console Automation</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    gscSyncState?.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : gscSyncState?.status === "running"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : gscSyncState?.status === "failed"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {gscSyncState?.status ? gscSyncState.status.replace(/_/g, " ") : "Not Connected"}
                </span>
                {gscSyncState?.isLocked ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Sync Locked (Running)
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-slate-600">
                Last successful sync: <span className="font-mono font-semibold">{gscSyncState?.lastSuccessfulSync ? new Date(gscSyncState.lastSuccessfulSync).toLocaleString() : "Never"}</span>
                {gscSyncState?.rowsImported ? ` • ${gscSyncState.rowsImported} rows ingested` : ""}
                {gscSyncState?.dateRangeStart && gscSyncState?.dateRangeEnd ? ` • Range: ${gscSyncState.dateRangeStart} to ${gscSyncState.dateRangeEnd}` : ""}
              </p>
              {gscSyncState?.errorMessage && (
                <p className="text-xs text-rose-600 font-semibold">{gscSyncState.errorMessage}</p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {[
                  { days: 28, label: "28d" },
                  { days: 90, label: "90d Backfill" },
                  { days: 180, label: "180d Backfill" },
                ].map((b) => (
                  <button
                    key={b.days}
                    onClick={() => setBackfillDays(b.days)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      backfillDays === b.days
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleSyncGsc(backfillDays)}
                disabled={isSyncingGsc || !!gscSyncState?.isLocked}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGsc ? "animate-spin" : ""}`} />
                <span>{isSyncingGsc ? "Syncing..." : `Trigger Sync (${backfillDays}d)`}</span>
              </button>
            </div>
          </div>

          {/* Operational Loop Diagram */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Phase 4 Search Growth &amp; Closed-Loop Optimization Engine</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
              {[
                { title: "1. Real GSC Data", desc: "Automated incremental sync" },
                { title: "2. Search Intel", desc: "Position, CTR & intent baseline" },
                { title: "3. 18-Point Heuristics", desc: "Striking distance & decay" },
                { title: "4. Explainable Score", desc: "High/Med/Low priority queue" },
                { title: "5. Content Action", desc: "Controlled review & updates" },
                { title: "6. Technical Crawl", desc: "22-check 100/100 validation" },
                { title: "7. Segmented XML", desc: "Dynamic sitemap discovery" },
                { title: "8. Real Attribution", desc: "Organic lead conversion" },
              ].map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <span className="font-extrabold text-slate-900">{step.title}</span>
                  <span className="text-[10px] text-slate-500 mt-1">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SEARCH PERFORMANCE */}
      {subTab === "performance" && (
        <div className="space-y-5">
          {/* Header & Controls */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    performance?.connected
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {performance?.connected ? "Search Console Connected" : "Search Console not connected"}
                </span>
                <span className="text-xs text-slate-400">Google Search Analytics API</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">Search Performance Analytics</h3>
              <p className="text-xs text-slate-500">
                100% real impressions, clicks, CTR, and average position from Google Search Console.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Date Range Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {[
                  { id: "7d", label: "7 Days" },
                  { id: "28d", label: "28 Days" },
                  { id: "3m", label: "3 Months" },
                  { id: "6m", label: "6 Months" },
                  { id: "12m", label: "12 Months" },
                ].map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setPerfTimeRange(range.id)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      perfTimeRange === range.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              {/* Sync Button */}
              <button
                onClick={() => handleSyncGsc(backfillDays)}
                disabled={isSyncingGsc}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGsc ? "animate-spin" : ""}`} />
                <span>{isSyncingGsc ? "Ingesting GSC..." : "Sync Search Console"}</span>
              </button>
            </div>
          </div>

          {/* Unconnected Truthful Notice */}
          {!performance?.connected && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 text-xs text-amber-950 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Google Search Console API Unlinked</span>
              </div>
              <p>
                In strict compliance with the <strong>Zero Fake Data</strong> mandate, search volumes, impressions, clicks, CTR, and average positions remain completely empty until actual Google Search Console credentials are configured.
              </p>
              <div className="p-4 bg-white/70 rounded-2xl border border-amber-200 space-y-1.5">
                <p className="font-bold text-slate-900">To link your verified domain property:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                  <li>Create a Google Cloud Service Account with Search Console read permissions.</li>
                  <li>Delegate access to your domain property in Google Search Console Settings.</li>
                  <li>Add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY</code> to your environment variables.</li>
                </ol>
              </div>
            </div>
          )}

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Clicks</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {performance?.summary?.totalClicks ?? 0}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Real search referral visitors</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Impressions</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {performance?.summary?.totalImpressions ?? 0}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Times shown in Google SERP</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average CTR</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {performance?.summary?.avgCtr ?? "0.00%"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Click-through rate</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average Position</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {performance?.summary?.avgPosition ?? "0.0"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Mean ranking on Google</p>
            </div>
          </div>

          {/* Dimension Selector & Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[
                  { id: "queries", label: "Top Queries" },
                  { id: "pages", label: "Top Pages" },
                  { id: "countries", label: "Countries" },
                  { id: "devices", label: "Devices" },
                ].map((dim) => (
                  <button
                    key={dim.id}
                    onClick={() => setPerfDimension(dim.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      perfDimension === dim.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {dim.label}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {perfDimension === "queries"
                  ? `${performance?.topQueries?.length || 0} unique queries`
                  : perfDimension === "pages"
                  ? `${performance?.topPages?.length || 0} unique landing pages`
                  : ""}
              </span>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {perfDimension === "queries" && (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Search Query</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Impressions</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {performance?.topQueries && performance.topQueries.length > 0 ? (
                      performance.topQueries.map((q, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{q.query}</td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">{q.clicks}</td>
                          <td className="py-3 px-4 text-right">{q.impressions}</td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{q.ctr}%</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">{q.position}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No query performance data available yet. Ingest Search Console data to populate.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {perfDimension === "pages" && (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Landing Page URL</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Impressions</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                      <th className="py-3 px-4 text-right">Avg Position</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {performance?.topPages && performance.topPages.length > 0 ? (
                      performance.topPages.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-blue-600 truncate max-w-md">{p.page}</td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">{p.clicks}</td>
                          <td className="py-3 px-4 text-right">{p.impressions}</td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{p.ctr}%</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">{p.position}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No page performance data available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {perfDimension === "countries" && (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Country Code</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Impressions</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {performance?.topCountries && performance.topCountries.length > 0 ? (
                      performance.topCountries.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{c.country}</td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">{c.clicks}</td>
                          <td className="py-3 px-4 text-right">{c.impressions}</td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{c.ctr}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No country distribution data available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {perfDimension === "devices" && (
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Device Category</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Impressions</th>
                      <th className="py-3 px-4 text-right">CTR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {performance?.deviceBreakdown && performance.deviceBreakdown.length > 0 ? (
                      performance.deviceBreakdown.map((d, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">{d.device}</td>
                          <td className="py-3 px-4 text-right font-black text-slate-900">{d.clicks}</td>
                          <td className="py-3 px-4 text-right">{d.impressions}</td>
                          <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{d.ctr}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          No device distribution data available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONTENT OPPORTUNITIES */}
      {subTab === "opportunities" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Search Opportunity Engine &amp; Content Refresh
              </h3>
              <p className="text-xs text-slate-500">
                Actionable opportunities identified from real GSC queries, striking distance rankings, and intent gaps.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={oppPriorityFilter}
                onChange={(e) => setOppPriorityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <select
                value={oppClassFilter}
                onChange={(e) => setOppClassFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Classifications</option>
                <option value="optimize_existing_page">Optimize Existing Page</option>
                <option value="new_page_candidate">New Page Candidate</option>
                <option value="metadata_opportunity">Metadata Hook Opportunity</option>
                <option value="internal_link_opportunity">Internal Link Opportunity</option>
                <option value="cannibalization_risk">Cannibalization Risk</option>
              </select>

              <select
                value={oppStatusFilter}
                onChange={(e) => setOppStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="opportunity">Opportunity</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="in_progress">In Progress</option>
                <option value="updated">Updated</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Query &amp; Current Page</th>
                    <th className="py-3 px-4">Classification</th>
                    <th className="py-3 px-4 text-right">Impressions</th>
                    <th className="py-3 px-4 text-right">Avg Pos</th>
                    <th className="py-3 px-4">Action, Reason &amp; Evidence</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opp) => (
                      <tr key={opp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              opp.priority === "high"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : opp.priority === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {opp.priority ? opp.priority.toUpperCase() : "MED"}
                          </span>
                          {opp.confidence ? (
                            <span className="block text-[9px] text-slate-400 mt-0.5 font-mono">
                              {opp.confidence}% conf
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{opp.query}</p>
                          <p className="text-[11px] text-blue-600 font-medium truncate max-w-xs">{opp.currentPage}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              opp.classification === "cannibalization_risk"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : opp.classification === "metadata_opportunity"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : opp.classification === "new_page_candidate"
                                ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {opp.classification.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{opp.impressions}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">{opp.position}</td>
                        <td className="py-3 px-4 max-w-sm">
                          <p className="font-semibold text-slate-800">{opp.recommendedAction}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{opp.reason}</p>
                          {opp.evidence && (
                            <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-mono">
                              {opp.evidence.ctr !== undefined && <span>CTR: {String(opp.evidence.ctr)}%</span>}
                              {opp.evidence.clicks !== undefined && <span>• Clicks: {String(opp.evidence.clicks)}</span>}
                              {opp.evidence.trend !== undefined && <span>• Trend: {String(opp.evidence.trend)}</span>}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              opp.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : opp.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : opp.status === "updated"
                                ? "bg-slate-900 text-white"
                                : opp.status === "dismissed"
                                ? "bg-slate-100 text-slate-400 line-through"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {opp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {opp.status !== "approved" && (
                              <button
                                onClick={() => handleUpdateOpportunityStatus(opp.id, "approved")}
                                disabled={updatingOppId === opp.id}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {opp.status !== "dismissed" && (
                              <button
                                onClick={() => handleUpdateOpportunityStatus(opp.id, "dismissed")}
                                disabled={updatingOppId === opp.id}
                                className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        {opportunities.length === 0
                          ? "No opportunities detected yet. Sync Google Search Console to run automated detection heuristics."
                          : "No opportunities match the selected filters."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: SEO CONVERSION INTELLIGENCE */}
      {subTab === "conversion" && (
        <div className="space-y-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                SEO to Conversion Attribution Intelligence
              </h3>
              <p className="text-xs text-slate-500">
                Deterministic attribution linking organic search visitors directly to landing page CTA clicks and captured leads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                Overall Conv Rate: <strong>{conversionData?.overallConversionRate || "Insufficient data"}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Organic Visitors</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {conversionData?.totalOrganicVisitors ?? 0}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">First-touch search engine referrers</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">CTA Clicks</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {conversionData?.totalCtaClicks ?? 0}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Micro-conversions (Demo/Start Free)</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Captured Leads</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {conversionData?.totalOrganicLeads ?? 0}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Inbound inquiries from organic visits</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Lead Conversion Rate</span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {conversionData?.overallConversionRate || "Insufficient data"}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Real conversion percentage</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Landing Page Conversion Performance
              </span>
              <span className="text-[11px] text-slate-400 italic">
                *Displays &ldquo;Insufficient data&rdquo; when visitor volume is 0 in accordance with Zero Fake Data directive.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">SEO Landing Page</th>
                    <th className="py-3 px-4 text-right">Organic Visitors</th>
                    <th className="py-3 px-4 text-right">CTA Clicks</th>
                    <th className="py-3 px-4 text-right">Captured Leads</th>
                    <th className="py-3 px-4 text-right">Conversion Rate</th>
                    <th className="py-3 px-4 text-center">Attribution State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {conversionData?.metrics && conversionData.metrics.length > 0 ? (
                    conversionData.metrics.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-bold text-blue-600">{m.landingPage}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-sm">{m.pageTitle}</p>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{m.organicVisitors}</td>
                        <td className="py-3 px-4 text-right">{m.ctaClicks}</td>
                        <td className="py-3 px-4 text-right font-black text-emerald-600">{m.leads}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">
                          {m.conversionRate === "Insufficient data" ? (
                            <span className="text-slate-400 font-normal italic">Insufficient data</span>
                          ) : (
                            <span className="text-emerald-600">{m.conversionRate}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {m.status === "active" ? "Active Traffic" : "Insufficient Data"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No landing page conversion data available yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: TOPIC AUTHORITY GRAPH & INTERNAL LINKING */}
      {subTab === "graph" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">
              Content Authority Engine &amp; Cluster Graph
            </h3>
            <p className="text-xs text-slate-500">
              Formal hierarchy linking pillar pages, supporting solutions, calculators, comparisons, and semantic entity relationships.
            </p>
          </div>

          {/* Clusters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topicGraph?.clusters?.map((c) => (
              <div key={c.topicId} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                    Cluster
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {c.inboundInternalLinksCount} in / {c.outboundInternalLinksCount} out
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.topicTitle}</h4>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Pillar:</span>
                    <span>{c.pillarPage}</span>
                  </div>
                </div>

                {/* Supporting Pages */}
                {c.supportingPages.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Supporting Solution Pages:
                    </span>
                    <ul className="space-y-1 text-xs">
                      {c.supportingPages.map((sp, idx) => (
                        <li key={idx} className="text-slate-600 flex items-center justify-between">
                          <span className="truncate max-w-[180px]">{sp.title}</span>
                          <span className="text-[10px] text-slate-400">{sp.path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interactive Tools & Comparisons */}
                {(c.tools.length > 0 || c.comparisons.length > 0) && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                    {c.tools.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Tool: {t.title}
                      </span>
                    ))}
                    {c.comparisons.map((cmp, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-bold">
                        Compare: {cmp.title}
                      </span>
                    ))}
                  </div>
                )}

                {/* Semantic Entities */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Semantic Entities:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.entityRelationships.map((ent, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-600">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Internal Link Recommendations */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Contextual Internal Link Recommendations
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Natural anchor text &amp; contextual information architecture
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Source Page</th>
                    <th className="py-3 px-4">Target Page</th>
                    <th className="py-3 px-4">Recommended Anchor Text</th>
                    <th className="py-3 px-4">Strategic Reason</th>
                    <th className="py-3 px-4 text-center">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topicGraph?.linkRecommendations?.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">{rec.sourcePath}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600">{rec.targetPath}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">&ldquo;{rec.recommendedAnchor}&rdquo;</td>
                      <td className="py-3 px-4 text-slate-500 max-w-sm">{rec.reason}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            rec.priority === "high"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: TOPIC CLUSTERS */}
      {subTab === "topics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">
                    Order #{t.clusterOrder}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {t.keywordsCount || 0} keywords
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{t.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">slug: {t.slug}</span>
                  <span className="text-blue-600 font-bold cursor-pointer" onClick={() => { setSelectedTopicId(t.id); setSubTab("pages"); }}>
                    View Pages &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 7: KEYWORD INTELLIGENCE */}
      {subTab === "keywords" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search keywords or normalized form..."
                value={kwSearch}
                onChange={(e) => setKwSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={kwIntentFilter}
                onChange={(e) => setKwIntentFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Intents</option>
                <option value="commercial_investigation">Commercial Investigation</option>
                <option value="problem_solution">Problem Solution</option>
                <option value="tool_calculator">Tool / Calculator</option>
                <option value="comparison">Comparison</option>
                <option value="informational">Informational</option>
                <option value="local_regional">Local / Regional</option>
              </select>
              <select
                value={kwStatusFilter}
                onChange={(e) => setKwStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="mapped">Mapped</option>
                <option value="candidate">Candidate</option>
                <option value="unmapped">Unmapped</option>
                <option value="cannibalization_risk">Cannibalization Risk</option>
                <option value="deferred">Deferred</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Target Keyword</th>
                    <th className="py-3 px-4">Search Intent</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Mapped Destination</th>
                    <th className="py-3 px-4">Research Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredKeywords.map((k) => (
                    <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{k.keyword}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{k.normalizedKeyword}</p>
                      </td>
                      <td className="py-3 px-4 font-medium">{k.searchIntent}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          k.priority === "core" ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {k.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          k.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : k.status === "cannibalization_risk"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-blue-50 text-blue-700"
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-blue-600 truncate max-w-xs">{k.targetUrl || "—"}</td>
                      <td className="py-3 px-4 text-slate-400 text-[10px]">{k.source || "SERP Analysis"} ({k.researchDate || "2026-09-20"})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: PAGES & QUALITY */}
      {subTab === "pages" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search page title or slug..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageTypeFilter}
                onChange={(e) => setPageTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Page Types</option>
                <option value="commercial_landing">Commercial Landing</option>
                <option value="problem_solution">Problem Solution</option>
                <option value="feature">Feature</option>
                <option value="industry_solution">Industry Solution</option>
                <option value="tool">Interactive Tool</option>
                <option value="comparison">Comparison Matrix</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Page Title &amp; Slug</th>
                    <th className="py-3 px-4">Page Type</th>
                    <th className="py-3 px-4">Target Keyword</th>
                    <th className="py-3 px-4 text-center">Quality Score</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{p.title}</p>
                        <p className="text-[10px] text-blue-600 font-mono">/{p.slug}</p>
                      </td>
                      <td className="py-3 px-4 font-medium">{p.pageType}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{p.primaryKeyword}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          p.qualityScore >= 90 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}>
                          {p.qualityScore}/100
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {p.publicationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleValidatePage(p)}
                          className="px-2.5 py-1 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Audit Quality
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 9: AUDIT ISSUES */}
      {subTab === "audit" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Automated Technical SEO Crawler (22 Health Checks)
              </h3>
              <p className="text-xs text-slate-500">
                Audits broken links, duplicate tags, canonical mismatches, schema syntax, thin content, and cannibalization risks.
              </p>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isRunningAudit}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? "animate-spin" : ""}`} />
              <span>{isRunningAudit ? "Crawling Site..." : "Re-crawl Entire Site"}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Issue Type</th>
                    <th className="py-3 px-4">Route Path</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Suggested Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditIssues.length > 0 ? (
                    auditIssues.map((iss) => (
                      <tr key={iss.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              iss.severity === "critical"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : iss.severity === "warning"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {iss.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">{iss.issueType}</td>
                        <td className="py-3 px-4 font-mono text-blue-600">{iss.routePath}</td>
                        <td className="py-3 px-4 text-slate-700">{iss.message}</td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">{iss.suggestedFix}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold">
                        Zero SEO audit issues detected! All 22 technical checks passed cleanly with 100/100 score.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 10: SITEMAPS */}
      {subTab === "sitemaps" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900">
              Segmented Dynamic XML Sitemaps
            </h3>
            <p className="text-xs text-slate-500">
              Segmented sitemaps for clean search engine discovery and crawl budget optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sitemapSegments.map((seg, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{seg.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {seg.status}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900">{seg.pageCount} pages</div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <a
                    href={seg.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <span>Inspect XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 11: ALERTS & MONITORING */}
      {subTab === "alerts" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  Anomaly Detection
                </span>
                <span className="text-xs text-slate-400">Deviation vs Historical Baselines</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                SEO Monitoring &amp; Real-Time Alert Engine
              </h3>
              <p className="text-xs text-slate-500">
                Detects search traffic decline, cannibalization surges, crawler regressions, and GSC sync interruptions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={alertStatusFilter}
                onChange={(e) => setAlertStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="all">All Alert Statuses</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>

              <button
                onClick={handleEvaluateAlerts}
                disabled={isEvaluatingAlerts}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isEvaluatingAlerts ? "animate-spin" : ""}`} />
                <span>{isEvaluatingAlerts ? "Evaluating..." : "Run Alert Evaluation"}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Metric &amp; Target</th>
                    <th className="py-3 px-4 text-right">Current</th>
                    <th className="py-3 px-4 text-right">Baseline</th>
                    <th className="py-3 px-4 text-right">Change</th>
                    <th className="py-3 px-4">Recommended Action</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAlerts.length > 0 ? (
                    filteredAlerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              alert.severity === "critical"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : alert.severity === "warning"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{alert.metric.replace(/_/g, " ")}</p>
                          <p className="text-[11px] text-blue-600 font-mono truncate max-w-xs">{alert.affectedTarget}</p>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{alert.currentValue}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{alert.baselineValue}</td>
                        <td className={`py-3 px-4 text-right font-bold font-mono ${alert.changePct < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                          {alert.changePct > 0 ? "+" : ""}{alert.changePct}%
                        </td>
                        <td className="py-3 px-4 max-w-sm font-medium text-slate-700">
                          {alert.recommendedAction}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              alert.status === "open"
                                ? "bg-rose-100 text-rose-800"
                                : alert.status === "acknowledged"
                                ? "bg-amber-100 text-amber-800"
                                : alert.status === "resolved"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-400 line-through"
                            }`}
                          >
                            {alert.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {alert.status === "open" && (
                              <button
                                onClick={() => handleUpdateAlertStatus(alert.id, "acknowledged")}
                                disabled={updatingAlertId === alert.id}
                                className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Ack
                              </button>
                            )}
                            {alert.status !== "resolved" && (
                              <button
                                onClick={() => handleUpdateAlertStatus(alert.id, "resolved")}
                                disabled={updatingAlertId === alert.id}
                                className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Resolve
                              </button>
                            )}
                            {alert.status !== "dismissed" && (
                              <button
                                onClick={() => handleUpdateAlertStatus(alert.id, "dismissed")}
                                disabled={updatingAlertId === alert.id}
                                className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        {alerts.length === 0
                          ? "Zero active SEO alerts. Technical crawl health and GSC performance are within expected baselines."
                          : "No alerts match the selected filter."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 12: INTERNATIONAL MARKET INTELLIGENCE */}
      {subTab === "market" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Real Search Telemetry
              </span>
              <span className="text-xs text-slate-400">GSC Country Breakdown</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              International Market Intelligence
            </h3>
            <p className="text-xs text-slate-500">
              Country-level organic search demand and lead conversions. Zero fabricated international demand or synthetic projections.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4 text-right">Visitors</th>
                    <th className="py-3 px-4 text-right">Impressions</th>
                    <th className="py-3 px-4 text-right">Clicks</th>
                    <th className="py-3 px-4 text-right">CTR</th>
                    <th className="py-3 px-4 text-right">Avg Position</th>
                    <th className="py-3 px-4 text-right">Captured Leads</th>
                    <th className="py-3 px-4 text-right">Conv Rate</th>
                    <th className="py-3 px-4 text-center">Market Signal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marketData.length > 0 ? (
                    marketData.map((item) => (
                      <tr key={item.country} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">{item.countryName}</span>
                          <span className="text-slate-400 ml-1 font-mono text-[10px]">({item.country})</span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{item.organicVisitors}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-700">{item.impressions}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{item.clicks}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-semibold">{item.ctr}%</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">{item.averagePosition}</td>
                        <td className="py-3 px-4 text-right font-black text-slate-900">{item.capturedLeads}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-700">{item.conversionRate}%</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              item.status === "observed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : item.status === "emerging"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}
                          >
                            {item.status.replace(/_/g, " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Insufficient country-level search data. Real GSC sync will populate observed international visitors.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-700">Localization &amp; Currency Policy:</span> SAHYAK CRM strictly bills in Indian Rupees (INR ₹). Multi-currency views are indicative conversions based on cached reference rates. No doorway country directories (/ae/, /us/, /sg/) are mass-published without genuine localized value.
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 13: INTERACTIVE TOOLS INVENTORY */}
      {subTab === "tools" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Authority Engine
              </span>
              <span className="text-xs text-slate-400">High-Intent Real Estate Tools</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Interactive Search &amp; Business Tools Engine
            </h3>
            <p className="text-xs text-slate-500">
              Each public tool satisfies a distinct search intent, direct AEO answer section, transparent math model, and direct conversion CTA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Lead Leakage Calculator",
                path: "/tools/real-estate-lead-leakage-calculator",
                keyword: "real estate lead leakage calculator",
                intent: "investigative",
                desc: "Transparent lead decay model calculating lost revenue from slow follow-ups.",
                icon: Calculator,
              },
              {
                title: "CRM ROI Calculator",
                path: "/tools/real-estate-crm-roi-calculator",
                keyword: "real estate crm roi calculator",
                intent: "commercial",
                desc: "Projects net incremental revenue and subscription ROI from CRM automation.",
                icon: TrendingUp,
              },
              {
                title: "CRM Migration Readiness Checklist",
                path: "/tools/real-estate-crm-migration-checklist",
                keyword: "crm migration readiness checklist",
                intent: "commercial",
                desc: "Interactive 12-point readiness diagnostic covering data prep, mapping & go-live.",
                icon: CheckCircle2,
              },
              {
                title: "Real Estate Commission Calculator",
                path: "/tools/real-estate-commission-calculator",
                keyword: "real estate commission calculator india",
                intent: "investigative",
                desc: "Calculates broker splits, slab incentives, and gross deal payouts.",
                icon: Wrench,
              },
              {
                title: "Brokerage Pipeline Calculator",
                path: "/tools/brokerage-pipeline-calculator",
                keyword: "brokerage sales pipeline velocity calculator",
                intent: "investigative",
                desc: "Models sales cycle stages, velocity attrition, and projected bookings.",
                icon: Activity,
              },
              {
                title: "CRM Migration Authority Hub",
                path: "/resources/real-estate-crm-migration",
                keyword: "real estate crm migration guide",
                intent: "informational",
                desc: "Comprehensive cutover blueprint from Excel, WhatsApp, and legacy CRMs.",
                icon: BookOpen,
              },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Indexable
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">{tool.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Query: <span className="text-slate-600 font-semibold">{tool.keyword}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-blue-600 font-mono">
                      {tool.intent}
                    </span>
                    <a
                      href={tool.path}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <span>Open Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 14: PRODUCT TRUTH REGISTRY */}
      {subTab === "truth" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Internal Single Source of Truth
              </span>
              <span className="text-xs text-slate-400">Anti-Hallucination Guardrail</span>
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Product Truth &amp; Claim Verification Registry
            </h3>
            <p className="text-xs text-slate-500">
              Central internal registry of implemented vs unsupported features. All SEO copy, meta descriptions, and AEO summaries must strictly adhere to these truth states.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Claim ID</th>
                    <th className="py-3 px-4">Feature Claim Description</th>
                    <th className="py-3 px-4 text-center">Truth Status</th>
                    <th className="py-3 px-4">Code / Architecture Evidence</th>
                    <th className="py-3 px-4 text-right">Last Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCT_CLAIMS_REGISTRY.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{claim.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800 max-w-sm">{claim.claim}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            claim.status === "implemented"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : claim.status === "partial"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : claim.status === "planned"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : claim.status === "external_dependency"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {claim.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 max-w-xs">{claim.evidence}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-400">{claim.lastVerified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* QUALITY GATE MODAL */}
      {validatingPage && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  SEO Quality Gate Audit
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{validatingPage.title}</h3>
              </div>
              <button onClick={() => setValidatingPage(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isValidating ? (
              <div className="py-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Running Quality Gate Verification...</span>
              </div>
            ) : validationResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-xs font-bold text-slate-700">Quality Score</span>
                  <span className={`text-sm font-black ${validationResult.score >= 90 ? "text-emerald-600" : "text-rose-600"}`}>
                    {validationResult.score} / 100
                  </span>
                </div>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {Object.entries(validationResult.checks || {}).map(([key, passed]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs border border-slate-100">
                      <span className="text-slate-600 font-medium">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                      {passed ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]"><Check className="w-3.5 h-3.5" /> Passed</span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 font-bold text-[11px]"><AlertCircle className="w-3.5 h-3.5" /> Issue</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setValidatingPage(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
