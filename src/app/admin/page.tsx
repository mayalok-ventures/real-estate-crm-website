"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  Download,
  ExternalLink,
  Eye,
  Globe,
  LayoutGrid,
  List,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Monitor,
  Phone,
  PhoneCall,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Users,
  X,
  Zap,
  RotateCcw
} from "lucide-react";
import AdminTelemetryCharts from "@/components/admin/AdminTelemetryCharts";
import AdminSeoWorkspace from "@/components/admin/AdminSeoWorkspace";
import { LeadStatus } from "@/lib/leads-store";

interface LeadRecord {
  id: string;
  requestId?: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  teamSize?: string;
  requirement?: string;
  notes?: string;
  inquiryType?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  status?: LeadStatus;
}

interface AnalyticsOverview {
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
  connectionHealth: {
    connected: boolean;
    statusText: string;
    engine: string;
    latencyMs: number;
  };
  lastRefreshedAt: string;
}

interface TimeseriesPoint {
  date: string;
  visitors: number;
  pageviews: number;
  leads: number;
}

interface ChannelItem {
  channel: string;
  visitors: number;
  share: string;
  leads: number;
  conversionRate: string;
}

interface PageItem {
  path: string;
  views: number;
  visitors: number;
  share: string;
}

interface CountryItem {
  countryCode: string;
  countryName: string;
  visitors: number;
  share: string;
}

interface DevicesPayload {
  devices: { device: string; count: number; share: string }[];
  browsers: { browser: string; count: number; share: string }[];
}

interface SectionItem {
  sectionId: string;
  sectionName: string;
  views: number;
  engagedVisits: number;
  avgDwellSec: number;
}

const STATUS_OPTIONS: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Demo Scheduled",
  "Converted",
  "Closed"
];

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string }> = {
  New: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  Contacted: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Qualified: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Demo Scheduled": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Converted: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Closed: { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }
};

type AdminTab = "overview" | "leads" | "audience" | "sections" | "seo" | "system";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [resetMessage, setResetMessage] = useState<string>("");

  // Core Data States
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [uniqueWindow, setUniqueWindow] = useState<"7D" | "30D" | "6M" | "1Y">("7D");
  const [timeSeriesRange, setTimeSeriesRange] = useState<"7D" | "30D" | "6M" | "1Y">("7D");
  const [timeseriesData, setTimeseriesData] = useState<TimeseriesPoint[]>([]);
  const [channelsData, setChannelsData] = useState<ChannelItem[]>([]);
  const [pagesData, setPagesData] = useState<PageItem[]>([]);
  const [countriesData, setCountriesData] = useState<CountryItem[]>([]);
  const [devicesData, setDevicesData] = useState<DevicesPayload>({ devices: [], browsers: [] });
  const [sectionsData, setSectionsData] = useState<SectionItem[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);

  // Lead management UI state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  // Note saving state
  const [editNotes, setEditNotes] = useState<string>("");
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSaveSuccess, setNotesSaveSuccess] = useState<boolean>(false);

  // Unified data fetcher across all modular endpoints
  const fetchAllAdminData = useCallback(async (currentRange = timeSeriesRange) => {
    setIsRefreshing(true);
    try {
      const [
        overviewRes,
        timeseriesRes,
        channelsRes,
        pagesRes,
        countriesRes,
        devicesRes,
        sectionsRes,
        leadsRes
      ] = await Promise.all([
        fetch("/api/admin/analytics/overview"),
        fetch(`/api/admin/analytics/timeseries?range=${currentRange}`),
        fetch("/api/admin/analytics/channels"),
        fetch("/api/admin/analytics/pages"),
        fetch("/api/admin/analytics/countries"),
        fetch("/api/admin/analytics/devices"),
        fetch("/api/admin/analytics/sections"),
        fetch("/api/admin/leads")
      ]);

      if (overviewRes.ok) {
        const d = await overviewRes.json();
        if (d.success) setOverview(d.data);
      }
      if (timeseriesRes.ok) {
        const d = await timeseriesRes.json();
        if (d.success) setTimeseriesData(d.data);
      }
      if (channelsRes.ok) {
        const d = await channelsRes.json();
        if (d.success) setChannelsData(d.data);
      }
      if (pagesRes.ok) {
        const d = await pagesRes.json();
        if (d.success) setPagesData(d.data);
      }
      if (countriesRes.ok) {
        const d = await countriesRes.json();
        if (d.success) setCountriesData(d.data);
      }
      if (devicesRes.ok) {
        const d = await devicesRes.json();
        if (d.success) setDevicesData(d.data);
      }
      if (sectionsRes.ok) {
        const d = await sectionsRes.json();
        if (d.success) setSectionsData(d.data);
      }
      if (leadsRes.ok) {
        const d = await leadsRes.json();
        if (d.success) setLeads(d.data);
      }
      setSecondsAgo(0);
    } catch (e) {
      console.error("Admin data refresh error:", e);
    } finally {
      setIsRefreshing(false);
    }
  }, [timeSeriesRange]);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          await fetchAllAdminData();
        }
      }
    } catch {
      // Session inactive
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllAdminData]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Live timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Background auto-refresh every 20 seconds for real live telemetry
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchAllAdminData();
    }, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchAllAdminData]);

  // Sync editNotes when a lead is opened
  useEffect(() => {
    if (selectedLead) {
      setEditNotes(selectedLead.notes || "");
      setNotesSaveSuccess(false);
    }
  }, [selectedLead]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchAllAdminData();
      } else {
        setAuthError(data.error || "Invalid administrator credentials.");
      }
    } catch {
      setAuthError("Failed to connect to authentication gateway.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setPassword("");
    setSelectedLead(null);
  };

  const handlePurgeData = async () => {
    if (!window.confirm("Are you sure you want to clear all test leads and telemetry records? This will give you a clean slate.")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      const d = await res.json();
      if (res.ok && d.success) {
        setResetMessage("All data cleared successfully. Clean slate active.");
        setTimeout(() => setResetMessage(""), 4000);
        fetchAllAdminData();
      }
    } catch (e) {
      console.error("Failed to reset:", e);
    }
  };

  const handleTimeRangeChange = async (range: "7D" | "30D" | "6M" | "1Y") => {
    setTimeSeriesRange(range);
    try {
      const res = await fetch(`/api/admin/analytics/timeseries?range=${range}`);
      if (res.ok) {
        const d = await res.json();
        if (d.success) setTimeseriesData(d.data);
      }
    } catch (e) {
      console.error("Failed to load timeseries range:", e);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    setNotesSaveSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLead.id, notes: editNotes })
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === selectedLead.id ? { ...l, notes: editNotes } : l))
        );
        setSelectedLead((prev) => (prev ? { ...prev, notes: editNotes } : null));
        setNotesSaveSuccess(true);
        setTimeout(() => setNotesSaveSuccess(false), 2500);
      }
    } catch (e) {
      console.error("Notes save error:", e);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this lead record?")) {
      return;
    }
    try {
      const res = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
        if (overview) {
          setOverview((prev) =>
            prev ? { ...prev, totalLeads: Math.max(0, prev.totalLeads - 1) } : null
          );
        }
      }
    } catch (e) {
      console.error("Delete lead error:", e);
    }
  };

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "All" || (lead.status || "New") === statusFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q)) ||
        (lead.notes && lead.notes.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, searchQuery]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: leads.length };
    STATUS_OPTIONS.forEach((s) => {
      counts[s] = leads.filter((l) => (l.status || "New") === s).length;
    });
    return counts;
  }, [leads]);

  // Chart data transforms
  const chartTrafficData = useMemo(() => {
    return timeseriesData.map((d) => ({
      date: d.date,
      views: d.pageviews,
      visitors: d.visitors
    }));
  }, [timeseriesData]);

  const chartSectionData = useMemo(() => {
    return sectionsData.map((s) => ({
      section: s.sectionName,
      seconds: s.avgDwellSec
    }));
  }, [sectionsData]);

  const chartSourceData = useMemo(() => {
    const colors = ["#0077ff", "#00a3ff", "#10b981", "#6366f1", "#f59e0b", "#ec4899"];
    return channelsData.map((c, idx) => ({
      name: c.channel,
      value: Math.round(parseFloat(c.share) || 0),
      color: colors[idx % colors.length]
    }));
  }, [channelsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-600 text-xs font-mono space-y-3">
        <RefreshCw className="w-6 h-6 animate-spin text-[#0077ff]" />
        <span className="text-slate-500">Connecting to Administrative Telemetry Gateway...</span>
      </div>
    );
  }

  // 1. Unauthenticated Login Gate (Clean, Light, Branded)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Image
                src="/android-chrome-192x192.png"
                alt="Sahyak CRM Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
              Sahyak <span className="brand-gradient-text">Admin</span>
            </h1>
            <p className="text-xs text-slate-500">
              Enter the master administrator key to manage inbound leads and telemetry operations.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5" htmlFor="admin-pass">
                Master Admin Key
              </label>
              <input
                type="password"
                id="admin-pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter ADMIN_PASSWORD"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077ff]/30 focus:border-[#0077ff] text-slate-900 font-mono text-xs transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Authenticate &amp; Open Control Center
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 transition-colors">
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard (Light & Clean, Brand Matched)
  const isD1Connected = overview?.connectionHealth.connected ?? false;
  const connectionText = overview?.connectionHealth.statusText ?? "INITIALIZING PERSISTENCE...";

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans selection:bg-blue-100">
      
      {/* Top Header Bar */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-white flex items-center justify-center p-1">
              <Image
                src="/android-chrome-192x192.png"
                alt="Sahyak CRM Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base tracking-tight text-slate-900 leading-none">
                  Sahyak<span className="text-[#0077ff]">crm</span>
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-0.5">Telemetry &amp; Operations</span>
            </div>
          </Link>

          {/* Database Health Badge */}
          <span
            className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border hidden md:inline-flex items-center gap-1.5 ${
              isD1Connected
                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                : "text-blue-700 bg-blue-50 border-blue-200"
            }`}
            title={overview?.connectionHealth.engine}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isD1Connected ? "bg-emerald-500 animate-pulse" : "bg-[#0077ff]"
              }`}
            />
            <span>{connectionText}</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live updated ticker */}
          <span className="text-[11px] font-mono text-slate-400 hidden lg:inline-block">
            Updated {secondsAgo === 0 ? "just now" : `${secondsAgo}s ago`}
          </span>

          <Link
            href="/"
            target="_blank"
            className="p-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs hidden sm:inline-flex items-center gap-1.5 transition-all border border-slate-200 font-medium"
          >
            <Globe className="w-3.5 h-3.5 text-[#0077ff]" />
            <span>View Website</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={() => fetchAllAdminData()}
            disabled={isRefreshing}
            className="p-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs flex items-center gap-1.5 transition-all border border-slate-200 font-semibold shadow-xs cursor-pointer"
            title="Refresh All Modular Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#0077ff] ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs flex items-center gap-1.5 transition-all border border-slate-200 font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Global Reset Notice */}
        {resetMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{resetMessage}</span>
            </div>
          </div>
        )}
        
        {/* Top Real-Time KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Live Visitors Now */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Live Visitors Now
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <div className="text-3xl font-black text-slate-900 font-heading">
                {overview?.liveVisitorsNow ?? 0}
              </div>
              <span className="text-xs text-emerald-700 font-semibold font-mono">active</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-2 font-mono">
              Strict 5-min window (last_seen &ge; -300s)
            </div>
          </div>

          {/* 2. Unique Visitors with Window Switcher */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                  Unique Visitors
                </span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-[#0077ff] border border-blue-100">
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 font-heading">
                {overview?.uniqueVisitors?.[uniqueWindow] ?? 0}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Window:</span>
              <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
                {(["7D", "30D", "6M", "1Y"] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => setUniqueWindow(w)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                      uniqueWindow === w
                        ? "bg-[#0077ff] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Total Pageviews */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Total Page Views
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-heading">
              {overview?.totalPageviews ?? 0}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 font-mono">
              <span>Avg Dwell: {overview?.avgDwellSeconds ?? 0}s</span>
              <span>Bounce: {overview?.bounceRate ?? "0.0%"}</span>
            </div>
          </div>

          {/* 4. Captured Inbound Leads */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                Captured Leads
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 font-heading">
              {overview?.totalLeads ?? leads.length}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
              <span className="text-amber-700 font-bold">Conv: {overview?.conversionRate ?? "0.0%"}</span>
              <span className="text-slate-300">&bull;</span>
              <span>{statusCounts.New || 0} New</span>
              <span className="text-slate-300">&bull;</span>
              <span>{statusCounts.Converted || 0} Won</span>
            </div>
          </div>

        </div>

        {/* Intuitive Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "overview"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview &amp; Velocity</span>
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "leads"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Inbound Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("audience")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "audience"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Audience &amp; Traffic</span>
          </button>

          <button
            onClick={() => setActiveTab("sections")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "sections"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Section Attention</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "seo"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Search Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "system"
                ? "bg-[#0077ff] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>System &amp; Clean Slate</span>
          </button>
        </div>

        {/* TAB 1: PULSE & VELOCITY OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <AdminTelemetryCharts
              trafficData={chartTrafficData}
              sectionData={chartSectionData}
              sourceData={chartSourceData}
              timeRange={timeSeriesRange}
              onTimeRangeChange={handleTimeRangeChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Pages Preview Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0077ff]" />
                    <h3 className="text-sm font-bold text-slate-900">Top Visited Pages</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Excludes /admin &amp; /api</span>
                </div>

                {pagesData.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    No visitor pageviews recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="pb-2">Path</th>
                          <th className="pb-2 text-right">Views</th>
                          <th className="pb-2 text-right">Visitors</th>
                          <th className="pb-2 text-right">Share</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {pagesData.map((p) => (
                          <tr key={p.path} className="hover:bg-slate-50/80">
                            <td className="py-2.5 font-sans font-semibold text-blue-600">{p.path}</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">{p.views}</td>
                            <td className="py-2.5 text-right text-slate-500">{p.visitors}</td>
                            <td className="py-2.5 text-right text-slate-400">{p.share}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Acquisition Channels Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900">Attribution Channels</h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Inbound Traffic</span>
                </div>

                {channelsData.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    No acquisition channels recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                        <tr>
                          <th className="pb-2">Channel</th>
                          <th className="pb-2 text-right">Visitors</th>
                          <th className="pb-2 text-right">Share</th>
                          <th className="pb-2 text-right">Leads</th>
                          <th className="pb-2 text-right">Conv.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {channelsData.map((ch) => (
                          <tr key={ch.channel} className="hover:bg-slate-50/80">
                            <td className="py-2.5 font-sans font-medium text-slate-800">{ch.channel}</td>
                            <td className="py-2.5 text-right font-bold text-slate-900">{ch.visitors}</td>
                            <td className="py-2.5 text-right text-slate-500">{ch.share}</td>
                            <td className="py-2.5 text-right text-emerald-600 font-bold">{ch.leads}</td>
                            <td className="py-2.5 text-right text-slate-600">{ch.conversionRate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INBOUND LEADS PIPELINE */}
        {activeTab === "leads" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Header & Export Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900 font-heading">
                    Inbound Lead Pipeline
                  </h2>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                    {filteredLeads.length} of {leads.length} Records
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real captured inquiries from /contact with status lifecycle tracking and sales notes.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center bg-slate-100/80 rounded-xl p-1 border border-slate-200/60">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setViewMode("kanban")}
                    className={`p-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "kanban"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Kanban</span>
                  </button>
                </div>

                <a
                  href="/api/admin/analytics/export?type=leads&format=csv"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-[#0077ff]" />
                  <span>Leads (CSV)</span>
                </a>

                <a
                  href="/api/admin/analytics/export?type=leads&format=json"
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Leads (JSON)</span>
                </a>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, email, company, notes..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0077ff]/30 focus:border-[#0077ff] text-xs text-slate-900 placeholder-slate-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                <button
                  onClick={() => setStatusFilter("All")}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                    statusFilter === "All"
                      ? "bg-[#0077ff] text-white shadow-xs"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  All ({statusCounts.All || 0})
                </button>
                {STATUS_OPTIONS.map((status) => {
                  const count = statusCounts[status] || 0;
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {status} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div>
                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    {leads.length === 0
                      ? "No inbound leads captured yet. Any contact form submission from /contact will appear here in real time."
                      : "No leads matched your search or status filter."}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase text-[10px]">
                        <tr>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Prospect &amp; Company</th>
                          <th className="p-3.5">Direct Contact</th>
                          <th className="p-3.5">Inquiry Details</th>
                          <th className="p-3.5">Closer Notes</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {filteredLeads.map((lead) => {
                          const status = lead.status || "New";
                          const colors = STATUS_COLORS[status];
                          const cleanPhone = lead.phone.replace(/[^0-9]/g, "");

                          return (
                            <tr
                              key={lead.id}
                              className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                              onClick={() => setSelectedLead(lead)}
                            >
                              <td className="p-3.5">
                                <span
                                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${colors.bg} ${colors.text} ${colors.border}`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-slate-900 group-hover:text-[#0077ff] transition-colors">
                                  {lead.name}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <Building className="w-3 h-3 text-slate-400" />
                                  <span>{lead.company || "Brokerage / Agency"}</span>
                                  {lead.teamSize && (
                                    <span className="text-slate-400 font-mono text-[10px]">({lead.teamSize})</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                                <div className="font-mono text-slate-900 font-bold text-[11px]">{lead.phone}</div>
                                <div className="text-slate-500 text-[11px] truncate max-w-[150px]">{lead.email}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <a
                                    href={`https://wa.me/${cleanPhone}?text=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20reaching%20out%20to%20Sahyak%20CRM.`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold"
                                    title="WhatsApp Chat"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" />
                                    WA
                                  </a>
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="text-[10px] text-blue-700 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-semibold"
                                    title="Call Prospect"
                                  >
                                    <PhoneCall className="w-2.5 h-2.5" />
                                    Call
                                  </a>
                                </div>
                              </td>
                              <td className="p-3.5 max-w-xs">
                                <div className="text-slate-700 text-xs line-clamp-2">
                                  {lead.requirement || "General Sahyak CRM Demo & Deployment"}
                                </div>
                              </td>
                              <td className="p-3.5 max-w-xs">
                                {lead.notes ? (
                                  <div className="text-[11px] text-amber-900 line-clamp-2 italic bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                    &ldquo;{lead.notes}&rdquo;
                                  </div>
                                ) : (
                                  <span className="text-[11px] text-slate-400">No notes yet</span>
                                )}
                              </td>
                              <td className="p-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {new Date(lead.submittedAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </td>
                              <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0077ff] text-xs font-bold transition-all mr-1.5 cursor-pointer"
                                >
                                  Manage
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Kanban Board View */}
            {viewMode === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
                {STATUS_OPTIONS.map((status) => {
                  const columnLeads = filteredLeads.filter((l) => (l.status || "New") === status);
                  const colors = STATUS_COLORS[status];

                  return (
                    <div
                      key={status}
                      className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3 space-y-3 flex flex-col min-w-[200px]"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className={`text-xs font-bold ${colors.text}`}>{status}</span>
                        <span className="text-[10px] font-mono bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-full font-bold">
                          {columnLeads.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[600px] pr-1">
                        {columnLeads.length === 0 ? (
                          <div className="text-[11px] text-slate-400 text-center py-6">Empty stage</div>
                        ) : (
                          columnLeads.map((lead) => (
                            <div
                              key={lead.id}
                              onClick={() => setSelectedLead(lead)}
                              className="p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xs cursor-pointer transition-all space-y-2 group"
                            >
                              <div className="font-bold text-xs text-slate-900 group-hover:text-[#0077ff] transition-colors">
                                {lead.name}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {lead.company || "Agency"}
                              </div>
                              <div className="text-[10px] font-mono text-slate-600">{lead.phone}</div>

                              {lead.notes && (
                                <div className="text-[10px] text-amber-800 line-clamp-1 italic bg-amber-50 p-1 rounded">
                                  &ldquo;{lead.notes}&rdquo;
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUDIENCE & GEOGRAPHY */}
        {activeTab === "audience" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geographic Distribution Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0077ff]" />
                  <h3 className="text-sm font-bold text-slate-900">Geographic Footprint</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Cloudflare cf-ipcountry</span>
              </div>

              {countriesData.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No geographic telemetry recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="pb-2">Country</th>
                        <th className="pb-2 text-right">ISO Code</th>
                        <th className="pb-2 text-right">Visitors</th>
                        <th className="pb-2 text-right">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {countriesData.map((c) => (
                        <tr key={c.countryCode} className="hover:bg-slate-50/80">
                          <td className="py-2.5 font-sans font-medium text-slate-800">{c.countryName}</td>
                          <td className="py-2.5 text-right text-slate-500">{c.countryCode}</td>
                          <td className="py-2.5 text-right font-bold text-slate-900">{c.visitors}</td>
                          <td className="py-2.5 text-right text-slate-400">{c.share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Devices & Browsers Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Device &amp; Platform Breakdown</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">User-Agent Telemetry</span>
              </div>

              {devicesData.devices.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  No device telemetry recorded yet.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {devicesData.devices.map((d) => (
                      <div key={d.device} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                        <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-center gap-1.5 mb-1">
                          {d.device === "Mobile" ? (
                            <Smartphone className="w-3.5 h-3.5 text-[#0077ff]" />
                          ) : d.device === "Tablet" ? (
                            <Tablet className="w-3.5 h-3.5 text-purple-600" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span>{d.device}</span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-heading">{d.count}</div>
                        <div className="text-[10px] font-mono text-slate-400">{d.share}</div>
                      </div>
                    ))}
                  </div>

                  {devicesData.browsers.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                        Browsers
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {devicesData.browsers.map((b) => (
                          <span
                            key={b.browser}
                            className="text-xs font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700"
                          >
                            {b.browser}: <span className="font-bold text-slate-900">{b.count}</span> ({b.share})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: SECTION DWELL ATTENTION */}
        {activeTab === "sections" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0077ff]" />
                <h3 className="text-sm font-bold text-slate-900">Homepage Component Attention &amp; Dwell Seconds</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                IntersectionObserver Telemetry (&ge; 2s threshold)
              </span>
            </div>

            {sectionsData.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                No section dwell times recorded yet. Sections are logged when in viewport for 2 seconds or longer.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="pb-2">Section Identifier</th>
                      <th className="pb-2">Display Name</th>
                      <th className="pb-2 text-right">Views</th>
                      <th className="pb-2 text-right">Engaged Visits</th>
                      <th className="pb-2 text-right">Avg Dwell (Seconds)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {sectionsData.map((s) => (
                      <tr key={s.sectionId} className="hover:bg-slate-50/80">
                        <td className="py-2.5 text-slate-400">{s.sectionId}</td>
                        <td className="py-2.5 text-slate-900 font-sans font-bold">{s.sectionName}</td>
                        <td className="py-2.5 text-right text-slate-600">{s.views}</td>
                        <td className="py-2.5 text-right text-[#0077ff] font-semibold">{s.engagedVisits}</td>
                        <td className="py-2.5 text-right text-emerald-700 font-black">{s.avgDwellSec}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SYSTEM & HEALTH & RESET */}
        {activeTab === "system" && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                System Infrastructure &amp; Data Hygiene
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify Cloudflare D1 persistence state and manage telemetry data hygiene.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">
                  Database Engine
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {overview?.connectionHealth.engine || "Dual-Runtime Storage"}
                </div>
                <div className="text-xs text-slate-600">
                  Status: <span className="font-mono font-bold text-blue-700">{overview?.connectionHealth.statusText}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-mono text-slate-500 font-semibold uppercase tracking-wider block">
                  Bot &amp; Scraper Filtering
                </span>
                <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Active Protection
                </div>
                <div className="text-xs text-slate-500">
                  Automated web scrapers, curl commands, and search bots are discarded before ingestion.
                </div>
              </div>
            </div>

            {/* Clean Slate Action */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                  Clean Slate: Purge Test Data
                </h4>
                <p className="text-[11px] text-amber-800 max-w-lg">
                  Removes all previous test inquiries and pageview events so the dashboard reflects only real prospective buyers moving forward.
                </p>
              </div>

              <button
                onClick={handlePurgeData}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge Test Records</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: SEO & SEARCH INTELLIGENCE */}
        {activeTab === "seo" && (
          <AdminSeoWorkspace />
        )}

      </div>

      {/* Lead Detail Slide-Over Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 font-heading">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    ID: {selectedLead.id} &bull; Received:{" "}
                    {new Date(selectedLead.submittedAt).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update Dropdown */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Sales Pipeline Stage
                </label>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedLead.status || "New"}
                    onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0077ff]/30 cursor-pointer shadow-xs"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold border shrink-0 ${
                      STATUS_COLORS[selectedLead.status || "New"].bg
                    } ${STATUS_COLORS[selectedLead.status || "New"].text} ${
                      STATUS_COLORS[selectedLead.status || "New"].border
                    }`}
                  >
                    {selectedLead.status || "New"}
                  </span>
                </div>
              </div>

              {/* Instant Contact Actions */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                    selectedLead.name
                  )},%20thank%20you%20for%20your%20inquiry%20regarding%20Sahyak%20CRM.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="p-2.5 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Direct Call</span>
                </a>
                <a
                  href={`mailto:${selectedLead.email}?subject=Sahyak%20CRM%20Consultation`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-1.5 transition-all border border-slate-200"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              </div>

              {/* Buyer Profile Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Buyer Profile
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Phone:</span>
                    <span className="font-mono text-slate-900 font-bold">{selectedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email:</span>
                    <span className="text-slate-800">{selectedLead.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Company / Brokerage:</span>
                    <span className="text-slate-800">{selectedLead.company || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Team Size:</span>
                    <span className="text-slate-800">{selectedLead.teamSize || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Requirement Text */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Submitted Requirement
                </h4>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed shadow-xs">
                  {selectedLead.requirement || "General Sahyak CRM Consultation"}
                </div>
              </div>

              {/* Closer Notes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-amber-600" />
                    Internal Closer Notes
                  </h4>
                  {notesSaveSuccess && (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Saved!
                    </span>
                  )}
                </div>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record call logs, agreed demo date, pricing tier proposed..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077ff]/30 text-xs font-sans leading-relaxed shadow-xs"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingNotes ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Closer Notes
                </button>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleDeleteLead(selectedLead.id)}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
