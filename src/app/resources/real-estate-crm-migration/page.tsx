import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Clock,
  CheckSquare,
  Scale
} from "lucide-react";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/lib/seo/breadcrumbs";
import { buildBreadcrumbSchema, buildArticleSchema } from "@/lib/seo/structured-data";
import { MigrationChecklistTool } from "@/components/tools/MigrationChecklistTool";

export const metadata: Metadata = generateSeoMetadata({
  title: "Real Estate CRM Migration Playbook: Excel to CRM Transition | Sahyak",
  description: "Step-by-step operational guide for migrating property agency leads, WhatsApp conversations, and broker inventories from spreadsheets into Sahyak CRM.",
  path: "/resources/real-estate-crm-migration",
  keywords: [
    "real estate CRM migration",
    "excel to real estate CRM",
    "property lead migration playbook",
    "broker spreadsheet transition",
    "real estate WhatsApp CRM cutover"
  ],
  isIndexable: true,
  hreflangReferences: [
    { lang: "en", url: "https://sahyak.com/resources/real-estate-crm-migration" },
    { lang: "x-default", url: "https://sahyak.com/resources/real-estate-crm-migration" }
  ],
  locale: "en-in",
});

export default function RealEstateCrmMigrationPage() {
  const canonicalUrl = "https://sahyak.com/resources/real-estate-crm-migration";
  const breadcrumbItems = [
    { name: "Home", item: "https://sahyak.com" },
    { name: "Resources", item: "https://sahyak.com/resources" },
    { name: "CRM Migration Playbook", item: canonicalUrl }
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const articleSchema = buildArticleSchema({
    headline: "Real Estate CRM Migration Playbook: Excel to CRM Transition",
    description: "Step-by-step operational guide for migrating property agency leads, WhatsApp conversations, and broker inventories from spreadsheets into Sahyak CRM.",
    url: canonicalUrl,
    datePublished: "2026-09-20T00:00:00Z",
    dateModified: "2026-09-20T00:00:00Z",
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Header */}
      <header className="bg-white border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-heading">
            <Database className="w-3.5 h-3.5" />
            <span>Master Engineering Playbook</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            Real Estate CRM Migration: The Definitive Excel to CRM Transition Guide
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, battle-tested cutover roadmap for real estate brokerages, channel partners, and builders moving from scattered spreadsheets and WhatsApp chats to unified sales automation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              12 min read
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              RERA &amp; DPDP Operational Alignment
            </span>
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-blue-600" />
              Includes Interactive Diagnostic Tool
            </span>
          </div>
        </div>
      </header>

      {/* AEO Direct Answer Box */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-heading">
                Direct Operational Summary (AEO)
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                A real estate CRM migration is the systematic transfer of property leads, customer interaction histories, inventory unit locks, and broker commission splits from disconnected spreadsheets or legacy systems into a unified sales operating system. A successful cutover requires pre-cleaning E.164 phone numbers, configuring tower-level unit matrices, setting up Meta Cloud API WhatsApp webhooks, and conducting a 72-hour parallel pilot before archiving legacy sheets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Section 1: The Spreadsheets Breaking Point */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            1. Why Real Estate Brokerages Outgrow Spreadsheets
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Spreadsheets function adequately when a property agency operates with 1 or 2 brokers managing under 50 leads per month. However, once marketing spend scales across property portals (99acres, MagicBricks, Housing.com) and Meta Ads, spreadsheets introduce critical operational bottlenecks:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
              <span className="text-xs font-bold text-rose-600 font-heading block">2–4 Hour Delay</span>
              <strong className="text-xs text-slate-900 font-heading block">Manual CSV Copy-Pasting</strong>
              <p className="text-[11px] text-slate-500">
                Portal leads sit dormant in email inboxes until a manager manually downloads and re-uploads them.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
              <span className="text-xs font-bold text-amber-600 font-heading block">Zero Concurrency</span>
              <strong className="text-xs text-slate-900 font-heading block">Double-Booking Units</strong>
              <p className="text-[11px] text-slate-500">
                Two sales agents take tokens on the same 3BHK unit simultaneously because sheet cells lack temporary locking timers.
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-1.5 shadow-xs">
              <span className="text-xs font-bold text-blue-600 font-heading block">Data Exfiltration</span>
              <strong className="text-xs text-slate-900 font-heading block">Phone Number Poaching</strong>
              <p className="text-[11px] text-slate-500">
                Unrestricted spreadsheet exports allow departing agents to download your high-net-worth client database.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Step-by-Step Migration Roadmap */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            2. The 5-Phase Real Estate Cutover Roadmap
          </h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Phase 1: Pre-Migration Data Hygiene &amp; Phone Normalization
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Extract your historical lead database into CSV. Crucially, run a regex cleanup to format all phone numbers to standard 10-digit or E.164 (+91) format. WhatsApp Cloud API dispatch fails if numbers contain country code typos or leading zeros. De-duplicate shared broker records and standardize property requirements into structured ranges (e.g., 2BHK, 3BHK, Commercial).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Phase 2: Property Inventory Matrix &amp; Temporary Unit Locks
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Configure your project architecture: Project Name $\to$ Tower/Phase $\to$ Wing $\to$ Unit Number $\to$ Carpet Area. In Sahyak CRM, assign 48-hour temporary locking rules so that when an agent collects an expression of interest (EOI), the unit is locked system-wide across all agent mobile screens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Phase 3: Official Meta Cloud API WhatsApp &amp; Ingress Webhooks
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Verify your Meta Business Manager account with your GST certificate. Connect your dedicated WhatsApp Business phone number. Submit pre-approved brochure dispatch message templates. Update webhook endpoints in 99acres, MagicBricks, and Meta Ads so fresh leads land in your sales pipeline in sub-15 seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">4</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Phase 4: Agent Roles (RBAC) &amp; Client Number Masking
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Create user seats with strict role boundaries. Field agents should receive push notifications for assigned site visits but have export permissions disabled and client phone numbers obscured to safeguard your agency intellectual property.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">5</span>
                <h3 className="text-sm font-bold text-slate-900 font-heading">
                  Phase 5: The 72-Hour Parallel Run &amp; Spreadsheet Retirement
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-8">
                Do not delete spreadsheets immediately. Run a 3-day parallel pilot over a weekend site visit cycle. Verify that all automated Sunday site visit pins dispatches correctly via WhatsApp. On Monday morning, set the Google Sheets file to read-only mode and mandate all follow-up logging inside Sahyak CRM.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Interactive Diagnostic Assessment Tool */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-heading">
              Interactive Diagnostic Utility
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
              Evaluate Your Agency Migration Readiness
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Check off your current data hygiene and technical milestones below to calculate your real-time go-live readiness score:
            </p>
          </div>

          <MigrationChecklistTool />
        </section>

        {/* Section 4: Related Playbooks & Calculators */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Related Operational Playbooks &amp; Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Link
              href="/compare/real-estate-crm-vs-excel"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-3 group"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 group-hover:text-blue-600 font-heading block">
                  CRM vs Excel Detailed Comparison &rarr;
                </strong>
                <span className="text-slate-500">Audit the operational differences and financial costs between spreadsheets and dedicated real estate CRM.</span>
              </div>
            </Link>

            <Link
              href="/tools/lead-leakage-calculator"
              className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-start gap-3 group"
            >
              <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 group-hover:text-blue-600 font-heading block">
                  Lead Leakage Calculator &rarr;
                </strong>
                <span className="text-slate-500">Calculate how many portal inquiries your team is losing to response delays and follow-up attrition.</span>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom CTA Strip */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h2 className="text-2xl font-extrabold font-heading">
            Ready to Retire Spreadsheets in Your Property Firm?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Begin on Sahyak CRM with our free Starter tier. Includes 20 free leads, 1 user seat, official WhatsApp brochure delivery, and inventory locking.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-heading transition-all shadow-md"
            >
              <span>Schedule Guided Migration Assistance</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
