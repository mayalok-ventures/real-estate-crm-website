"use client";

import React, { useState, useMemo, useRef } from "react";
import { CheckSquare, Square, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Download, RefreshCw, Layers } from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface ChecklistItem {
  id: string;
  category: "data_hygiene" | "inventory" | "whatsapp" | "team_rbac" | "portal_webhooks" | "cutover";
  title: string;
  description: string;
  critical: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 1. Data Hygiene & Cleaning
  {
    id: "data_export",
    category: "data_hygiene",
    title: "Export Clean CSV from Spreadsheets / Legacy CRM",
    description: "Export all active leads with created_date, stage, last_contact_date, assigned_agent, and budget.",
    critical: true,
  },
  {
    id: "phone_normalization",
    category: "data_hygiene",
    title: "Normalize Phone Numbers to E.164 (+91)",
    description: "Strip spaces, hyphens, and leading zeros so WhatsApp API routing functions without transmission failure.",
    critical: true,
  },
  {
    id: "deduplication",
    category: "data_hygiene",
    title: "De-duplicate Secondary and Shared Inquiries",
    description: "Flag duplicate phone numbers and resolve whether duplicate entries belong to same buyer or multiple inquiries.",
    critical: false,
  },

  // 2. Property Inventory & Unit Locking
  {
    id: "project_structure",
    category: "inventory",
    title: "Define Project, Tower & Unit Hierarchy",
    description: "Organize towers, floors, unit numbers, unit types (2BHK/3BHK), and carpet areas according to RERA layout.",
    critical: true,
  },
  {
    id: "unit_status_mapping",
    category: "inventory",
    title: "Map Unit Availability States (Available, Locked, Sold)",
    description: "Audit current physical site locks and set initial temporary lock durations (24h to 72h).",
    critical: false,
  },

  // 3. WhatsApp Business Cloud API
  {
    id: "meta_bm_verification",
    category: "whatsapp",
    title: "Verify Meta Business Manager Account",
    description: "Ensure legal company documents (GST / Certificate of Incorporation) are verified in Meta Business Suite.",
    critical: true,
  },
  {
    id: "template_approval",
    category: "whatsapp",
    title: "Submit Instant Brochure Dispatch Templates for Pre-Approval",
    description: "Pre-approve transactional greeting and PDF brochure download templates with Meta.",
    critical: true,
  },

  // 4. Team & Role-Based Permissions
  {
    id: "role_assignment",
    category: "team_rbac",
    title: "Configure Agent, Team Leader & Director Access Tiers",
    description: "Establish which agents can export data, view unassigned pools, and issue temporary unit locks.",
    critical: false,
  },
  {
    id: "phone_masking_policy",
    category: "team_rbac",
    title: "Activate Client Phone Number Masking Policy",
    description: "Prevent unauthorized customer record downloads by junior field agents.",
    critical: false,
  },

  // 5. Portal Webhook Ingress
  {
    id: "webhook_keys",
    category: "portal_webhooks",
    title: "Obtain Portal Webhook Endpoints & Secrets",
    description: "Retrieve developer webhook routing credentials for MagicBricks, 99acres, and Meta Lead Ads.",
    critical: true,
  },
  {
    id: "ingress_dry_run",
    category: "portal_webhooks",
    title: "Simulate Sub-15s Test Lead Dispatch",
    description: "Send a mock lead through portal staging endpoint to verify instant agent assignment.",
    critical: true,
  },

  // 6. Cutover & Validation
  {
    id: "parallel_run",
    category: "cutover",
    title: "Run 3-Day Parallel Pilot for Sunday Site Visits",
    description: "Maintain spreadsheet as passive backup for 72 hours while all active follow-ups occur in CRM.",
    critical: true,
  },
  {
    id: "spreadsheet_retirement",
    category: "cutover",
    title: "Archive and Lock Shared Spreadsheets",
    description: "Set Google Sheets to view-only mode to prevent shadow data entry after cutover.",
    critical: false,
  },
];

export function MigrationChecklistTool() {
  const hasTrackedUse = useRef(false);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(["data_export", "project_structure", "meta_bm_verification"])
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const toggleItem = (id: string) => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "real_estate_crm_migration_checklist",
      });
    }
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const stats = useMemo(() => {
    const total = CHECKLIST_ITEMS.length;
    const completed = completedIds.size;
    const scorePct = Math.round((completed / total) * 100);

    const criticalItems = CHECKLIST_ITEMS.filter((i) => i.critical);
    const completedCritical = criticalItems.filter((i) => completedIds.has(i.id)).length;
    const criticalScorePct = Math.round((completedCritical / criticalItems.length) * 100);

    let readinessStatus = "Preparation Stage";
    let statusColor = "text-amber-600 bg-amber-50 border-amber-200";

    if (scorePct >= 85 && criticalScorePct === 100) {
      readinessStatus = "Ready for Production Cutover";
      statusColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    } else if (scorePct >= 50) {
      readinessStatus = "In Progress — Critical Prerequisites Pending";
      statusColor = "text-blue-700 bg-blue-50 border-blue-200";
    }

    return {
      total,
      completed,
      scorePct,
      criticalTotal: criticalItems.length,
      completedCritical,
      criticalScorePct,
      readinessStatus,
      statusColor,
    };
  }, [completedIds]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return CHECKLIST_ITEMS;
    return CHECKLIST_ITEMS.filter((i) => i.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Top Readiness Score Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-heading">
              Migration Readiness Diagnostic
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading mt-1">
              Overall Go-Live Score: {stats.scorePct}%
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {stats.completed} of {stats.total} operational milestones completed ({stats.completedCritical}/{stats.criticalTotal} critical requirements satisfied).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl text-xs font-bold font-heading border ${stats.statusColor}`}>
              {stats.readinessStatus}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${stats.scorePct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0% (Data Prep)</span>
            <span>50% (Webhook Staging)</span>
            <span>100% (Full Production Cutover)</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "all", label: "All Items (12)" },
          { id: "data_hygiene", label: "1. Data Prep & Cleaning" },
          { id: "inventory", label: "2. Unit Inventory" },
          { id: "whatsapp", label: "3. WhatsApp Cloud API" },
          { id: "team_rbac", label: "4. Roles & Phone Masking" },
          { id: "portal_webhooks", label: "5. Portal Webhooks" },
          { id: "cutover", label: "6. Cutover & Validation" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-heading transition-all ${
              selectedCategory === cat.id
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Checklist Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDone = completedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? "bg-blue-50/40 border-blue-200 text-slate-900"
                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : (
                  <div className="w-5 h-5 rounded-md border-2 border-slate-300" />
                )}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`text-xs sm:text-sm font-bold font-heading ${isDone ? "text-blue-900 line-through decoration-blue-400" : "text-slate-900"}`}>
                    {item.title}
                  </h3>
                  {item.critical && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                      Critical
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cross-Link Bar to Migration Pillar Guide */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-xs">
          <strong className="text-slate-900 font-heading block">Need the complete migration playbook?</strong>
          <span className="text-slate-600">Read the step-by-step Real Estate CRM Migration Playbook with field mapping specifications.</span>
        </div>
        <Link
          href="/resources/real-estate-crm-migration"
          onClick={() => {
            trackGaEvent("tool_complete", {
              tool_name: "real_estate_crm_migration_checklist",
            });
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shrink-0"
        >
          <span>Read Migration Playbook</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
