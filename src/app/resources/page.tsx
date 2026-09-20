"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Check, 
  Code2, 
  Copy, 
  FileText, 
  MessageSquare, 
  CalendarCheck, 
  Clock, 
  Download, 
  MapPin, 
  CheckCheck,
  Calculator,
  ArrowRight,
  GitBranch,
  Layers,
  Building2,
  Workflow,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowUpRight
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const SAMPLE_WHATSAPP_SCRIPT = `Hi {{buyer_name}}, thank you for inquiring about {{project_name}} ({{unit_config}}).

I have attached the approved architectural floor plans and brochure PDF below:
📄 {{brochure_pdf_link}}

Key Highlights:
• Location: {{location}}
• Possession: {{possession_date}}
• Price: {{all_inclusive_price}}

Would you like to walk through the sample suite this Saturday at 11:30 AM or 3:00 PM?
I can dispatch a direct Google Maps location pin and gate visitor pass QR directly on WhatsApp.`;

const SAMPLE_SITE_VISIT_CHECKLIST = `[ ] 1. T-24h: WhatsApp confirmation sent with Google Maps pin & visitor gate pass QR.
[ ] 2. T-2h: Automated WhatsApp reminder sent to buyer with location & parking instructions.
[ ] 3. T-30m: Show flat inspected (climate control active, lighting on, collateral ready).
[ ] 4. T-15m: Sales closer present at reception with printed cost sheets & unit availability matrix.
[ ] 5. During Visit: Property walkthrough completed; floor plan, carpet area & amenities reviewed.
[ ] 6. Post Visit (Immediate): Agent notes & client feedback logged directly in CRM.
[ ] 7. T+2h: Follow-up pricing sheet dispatched via WhatsApp with temporary unit block details.`;

const SAMPLE_FOLLOWUP_CADENCE = `TOUCH 1 (0 to 15 mins): 1-Tap WhatsApp brochure delivery + introductory qualifying call.
TOUCH 2 (Day 1 · Midday): Configuration comparison & construction-linked payment (CLP) breakdown.
TOUCH 3 (Day 3 · Evening): Weekend show-flat visit invitation with Google Maps location pin.
TOUCH 4 (Day 7): Project update (e.g., fresh tower release or unit allotment alert).
TOUCH 5 (Day 14): Follow-up qualification check: Active inquiry or archive to long-term nurture pool.`;

const SAMPLE_WEBHOOK_PAYLOAD = `{
  "event": "lead.inbound",
  "timestamp": "2026-09-20T10:45:00Z",
  "endpoint": "https://example.com/webhook",
  "tenant_id": "{{your_org_id}}",
  "lead": {
    "name": "{{buyer_name}}",
    "phone": "{{buyer_phone}}",
    "email": "{{buyer_email}}",
    "city": "{{buyer_city}}",
    "project_id": "{{project_id}}",
    "unit_config": "2BHK / 3BHK",
    "budget_inr": 15000000,
    "source": "portal_webhook",
    "utm_campaign": "{{campaign_name}}"
  }
}`;

const CALCULATOR_RESOURCES = [
  {
    title: "Lead Response Time Calculator",
    slug: "/tools/lead-response-time-calculator",
    badge: "SPEED-TO-LEAD",
    description: "Calculate how response latency affects property inquiry conversion and quantify pipeline revenue lost to response delays.",
    metric: "Models 15s to 24h impact"
  },
  {
    title: "Real Estate Lead Leakage Calculator",
    slug: "/tools/real-estate-lead-leakage-calculator",
    badge: "PIPELINE ATTRITION",
    description: "Quantify how many portal inquiries drop out across response delays and incomplete follow-up cadences.",
    metric: "Quantifies recoverable commission"
  },
  {
    title: "Real Estate CRM ROI Calculator",
    slug: "/tools/real-estate-crm-roi-calculator",
    badge: "INVESTMENT PAYBACK",
    description: "Model the financial return on investment of deploying a real estate CRM across deal lift, commission gains, and payback multiples.",
    metric: "Shows net ROI & payback months"
  },
  {
    title: "Real Estate Commission Calculator",
    slug: "/tools/real-estate-commission-calculator",
    badge: "COMMISSION SPLITS",
    description: "Compute gross property commissions, broker-agent splits, TDS Section 194H (2% / 5%), and 18% GST deductions.",
    metric: "Includes statutory Indian tax math"
  },
  {
    title: "Brokerage Pipeline Velocity Calculator",
    slug: "/tools/brokerage-pipeline-calculator",
    badge: "SALES VELOCITY",
    description: "Measure throughput across inquiries, site visits, active negotiations, and token closures based on sales cycle length.",
    metric: "Calculates daily pipeline velocity"
  },
  {
    title: "CRM Migration Readiness Checklist",
    slug: "/tools/real-estate-crm-migration-checklist",
    badge: "READINESS AUDIT",
    description: "Evaluate your brokerage or sales team's data hygiene, webhook access, and team readiness to transition from spreadsheets.",
    metric: "Interactive 7-dimension scoring"
  },
];

const SOLUTION_RESOURCES = [
  {
    title: "Real Estate Lead Management",
    slug: "/solutions/real-estate-lead-management",
    badge: "INGRESS & ROUTING",
    description: "Sub-15s webhook ingestion from property portals and Meta campaigns with automated deduplication and round-robin agent routing."
  },
  {
    title: "Speed-to-Lead Follow-up Automation",
    slug: "/solutions/real-estate-lead-follow-up",
    badge: "CADENCE & REMINDERS",
    description: "Structured multi-touch follow-up sequences that prevent leads from dropping through the cracks between inquiry and site visit."
  },
  {
    title: "Real Estate Sales Pipeline",
    slug: "/solutions/real-estate-sales-pipeline",
    badge: "DEAL PROGRESSION",
    description: "Track property deals from initial qualification through site visits, price negotiations, token advances, and booking stages."
  },
  {
    title: "Show-Flat & Site Visit Logistics",
    slug: "/solutions/real-estate-site-visits",
    badge: "FIELD OPERATIONS",
    description: "Coordinate Sunday site visits with WhatsApp location pins, gate passes, arrival confirmations, and post-visit agent voice logs."
  },
  {
    title: "Multi-Tower Property Inventory",
    slug: "/solutions/property-inventory-management",
    badge: "INVENTORY MATRIX",
    description: "Live tower-by-tower unit availability matrices with 48-hour temporary locks to eliminate double-booking across broker networks."
  },
  {
    title: "Real Estate WhatsApp CRM",
    slug: "/solutions/real-estate-whatsapp-crm",
    badge: "WHATSAPP WORKFLOWS",
    description: "1-Tap WhatsApp brochure and cost sheet delivery directly from the lead docket without saving numbers to device address books."
  },
];

const COMPARISON_RESOURCES = [
  {
    title: "Real Estate CRM vs. Excel & Spreadsheets",
    slug: "/compare/real-estate-crm-vs-excel",
    badge: "EVALUATION GUIDE",
    description: "A comprehensive breakdown of why spreadsheet tracking causes lead leakage, inventory conflicts, and field sales communication breakdowns."
  },
  {
    title: "Real Estate CRM vs. Personal WhatsApp",
    slug: "/compare/real-estate-crm-vs-whatsapp",
    badge: "EVALUATION GUIDE",
    description: "Why managing property buyers across personal WhatsApp chats results in unrecorded communications, lost client histories, and pipeline blindness."
  },
];

export default function ResourcesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const schemaJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteConfig.url}/resources/#collection`,
        "url": `${siteConfig.url}/resources`,
        "name": "Real Estate Sales Resources & Operating Hub",
        "description": "Practical resources, interactive calculators, field checklists, and operating guides for real estate sales teams, brokers, and developers.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${siteConfig.url}/#website`,
          "url": siteConfig.url,
          "name": siteConfig.name
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/resources/#breadcrumbs`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteConfig.url
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Resources",
            "item": `${siteConfig.url}/resources`
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* 1. Hero Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0077ff] text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>REAL ESTATE SALES RESOURCES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight">
            Practical Resources for Running Real Estate Sales Operations
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Guides, calculators, checklists and sales operating resources built around lead management, follow-up, WhatsApp, site visits, property inventory and CRM operations.
          </p>
        </div>
      </section>

      {/* 2. Interactive Calculators & Operating Tools Hub */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] tracking-wider block mb-1">
                CATEGORY 01 &middot; OPERATIONAL UTILITIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Calculators &amp; Operating Tools
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Interactive mathematical tools designed to model response velocity, commission splits, lead attrition, and software payback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CALCULATOR_RESOURCES.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.slug}
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0077ff]/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-[#0077ff] border border-blue-100">
                      {tool.badge}
                    </span>
                    <Calculator className="w-4 h-4 text-slate-400 group-hover:text-[#0077ff] transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0077ff] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="font-mono text-[11px] text-slate-400">{tool.metric}</span>
                  <span className="inline-flex items-center gap-1 text-[#0077ff] font-semibold group-hover:translate-x-0.5 transition-transform">
                    Use Tool <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CRM Migration & Operating Playbooks Hub */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider block mb-1">
                CATEGORY 02 &middot; TRANSITION GUIDES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                CRM Migration &amp; Operating Playbooks
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              In-depth operational playbooks for transitioning sales teams from chaotic spreadsheets and legacy software without losing lead momentum.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-semibold border border-emerald-200">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ZERO-DOWNTIME MIGRATION PLAYBOOK</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-heading">
                  Real Estate CRM Migration: The 72-Hour Spreadsheet Transition Guide
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A structured field playbook detailing how real estate brokerages, developer sales offices, and channel partner teams can migrate active pipeline data from spreadsheets into a dedicated real estate CRM over a single weekend without missing site visits or lead calls.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-slate-600">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <strong className="block text-slate-900 mb-1">Phase 1: Audit</strong>
                    Field schema mapping, deduplication &amp; pipeline hygiene.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <strong className="block text-slate-900 mb-1">Phase 2: Weekend Pilot</strong>
                    72-hour parallel run during live site visit cycles.
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <strong className="block text-slate-900 mb-1">Phase 3: Cutover</strong>
                    Spreadsheet freeze, live webhook routing &amp; team adoption.
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">Published Resource &middot; Complete Guide</span>
                <Link
                  href="/resources/real-estate-crm-migration"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                >
                  Read Migration Playbook <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-100">
                  INTERACTIVE READINESS TOOL
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Evaluate Your Team&apos;s Migration Readiness
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Before initiating a cutover, use our interactive 7-point readiness checklist to identify portal credential access, data hygiene gaps, and agent training requirements.
                </p>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Portal webhook credential validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phone number normalization &amp; deduplication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active inventory matrix verification</span>
                  </div>
                </div>
              </div>
              <Link
                href="/tools/real-estate-crm-migration-checklist"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <span>Open Readiness Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sales Solutions & Operating Architecture */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-indigo-700 tracking-wider block mb-1">
                CATEGORY 03 &middot; SALES SOLUTIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Operational Solution Architecture
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Deep architectural explanations of how each core stage of the real estate sales process is solved in software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOLUTION_RESOURCES.map((sol) => (
              <Link
                key={sol.slug}
                href={sol.slug}
                className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {sol.badge}
                    </span>
                    <Workflow className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sol.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-indigo-600">
                  <span>Explore Solution</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Decision Guides & Comparisons */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-amber-700 tracking-wider block mb-1">
                CATEGORY 04 &middot; EVALUATION GUIDES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                Software Evaluation &amp; Comparisons
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Objective comparisons for sales leaders deciding between spreadsheet workflows, unorganized WhatsApp chats, and dedicated real estate CRM software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMPARISON_RESOURCES.map((comp) => (
              <Link
                key={comp.slug}
                href={comp.slug}
                className="group p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-500/60 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                      {comp.badge}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {comp.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
                  <span>Read Full Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Operational Templates & Field Tools (Sanitized Demo Cards) */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              OPERATIONAL FIELD TEMPLATES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              Ready-to-Use Operational Templates
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standardized message templates, field checklist protocols, and integration schemas. Copy and adapt directly into your day-to-day sales operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card 1: WhatsApp First-Response Template */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    EXAMPLE WHATSAPP FIRST-RESPONSE TEMPLATE
                  </span>
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    1-Tap First-Response Brochure Drop
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
                    <div><strong>FOR:</strong> Sales Reps &amp; Closers</div>
                    <div><strong>TYPE:</strong> Message Template</div>
                    <div><strong>FORMAT:</strong> Copy-Paste</div>
                  </div>
                </div>

                {/* WhatsApp Chat Frame Mockup */}
                <div className="rounded-2xl border border-slate-200 bg-[#efeae2] overflow-hidden shadow-inner">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                        CL
                      </div>
                      <div>
                        <div className="font-semibold leading-tight">&#123;&#123;buyer_name&#125;&#125;</div>
                        <div className="text-[10px] text-emerald-100">Prospective Buyer &middot; Inquiry Lead</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200 font-mono">
                      Template Format
                    </span>
                  </div>

                  {/* Chat Area */}
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="max-w-[92%] bg-[#d9fdd3] text-slate-800 rounded-2xl rounded-tr-xs p-3 shadow-xs space-y-2 border border-emerald-200/60">
                        {/* PDF Attachment Chip */}
                        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-emerald-300/60">
                          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="font-bold text-[11px] text-slate-900 truncate">&#123;&#123;project_name&#125;&#125;_Brochure_FloorPlans.pdf</div>
                            <div className="text-[9px] text-slate-500">Project collateral &middot; Approved floor plans</div>
                          </div>
                          <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>

                        {/* Text Content */}
                        <p className="text-[11px] leading-relaxed whitespace-pre-line text-slate-700">
                          Hi <strong className="text-slate-900">&#123;&#123;buyer_name&#125;&#125;</strong>, thank you for inquiring about <strong className="text-slate-900">&#123;&#123;project_name&#125;&#125; (&#123;&#123;unit_config&#125;&#125;)</strong>.
                          {"\n\n"}
                          • <span className="font-semibold text-slate-900">Location:</span> &#123;&#123;location&#125;&#125;{"\n"}
                          • <span className="font-semibold text-slate-900">Possession:</span> &#123;&#123;possession_date&#125;&#125;{"\n"}
                          • <span className="font-semibold text-slate-900">Price:</span> &#123;&#123;all_inclusive_price&#125;&#125;
                          {"\n\n"}
                          Would you like to walk through the sample suite this Saturday at 11:30 AM or 3:00 PM? I can dispatch an automated Google Maps pin &amp; visitor gate pass QR.
                        </p>

                        <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                          <span>Dispatch Time</span>
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("wa-script", SAMPLE_WHATSAPP_SCRIPT)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "wa-script" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "wa-script" ? "Copied to Clipboard!" : "Copy Template"}</span>
              </button>
            </div>

            {/* Card 2: Site Visit Follow-up Checklist */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-800 bg-cyan-100 px-2.5 py-0.5 rounded">
                    FIELD CHECKLIST TEMPLATE
                  </span>
                  <CalendarCheck className="w-4 h-4 text-cyan-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Site Visit Follow-up Checklist
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
                    <div><strong>FOR:</strong> Site Sales &amp; Closers</div>
                    <div><strong>TYPE:</strong> Field Checklist</div>
                    <div><strong>FORMAT:</strong> Operational Guide</div>
                  </div>
                </div>

                {/* Field Checklist Document Mockup */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-900 tracking-wider">
                        ON-SITE OPERATIONAL CHECKPOINTS
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded font-semibold">
                      OPERATING TEMPLATE
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700 font-mono">
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-24h:</strong> Send WhatsApp appointment confirmation with Google Maps location pin &amp; gate pass details.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-2h:</strong> Send morning reminder to client with driving directions &amp; parking instructions.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-30m:</strong> Verify show-flat preparedness (lighting active, presentation collaterals organized).
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">During Visit:</strong> Walk unit layout, review carpet area dimensions, and present payment milestones.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">Post Visit (T+2h):</strong> Dispatch customized quote via WhatsApp with temporary unit block option.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("visit-sop", SAMPLE_SITE_VISIT_CHECKLIST)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "visit-sop" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "visit-sop" ? "Copied to Clipboard!" : "Copy Field Checklist"}</span>
              </button>
            </div>

            {/* Card 3: Real Estate Lead Follow-up Cadence */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded">
                    SUGGESTED OPERATING TEMPLATE
                  </span>
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Real Estate Lead Follow-up Cadence
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
                    <div><strong>FOR:</strong> Inside Sales &amp; Telecallers</div>
                    <div><strong>TYPE:</strong> Cadence Template</div>
                    <div><strong>FORMAT:</strong> Timing Sequence</div>
                  </div>
                </div>

                {/* Cadence Timeline Sequence */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono text-cyan-400">
                    <span>SUGGESTED 5-TOUCH WORKFLOW</span>
                    <span>MULTI-TOUCH CADENCE</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-emerald-500/30">
                        1
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-emerald-400 font-bold">TOUCH 1 &middot; 0-15m</span>
                          <span>WhatsApp + Call</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Immediate brochure delivery &amp; introductory qualifying call</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-cyan-500/30">
                        2
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-cyan-400 font-bold">TOUCH 2 &middot; Day 1 (Midday)</span>
                          <span>Cost Analysis</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Tower &amp; configuration comparison with payment schedule</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-indigo-500/30">
                        3
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-indigo-400 font-bold">TOUCH 3 &middot; Day 3 (Evening)</span>
                          <span>Site Visit Invite</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Weekend show-flat calendar invite + driving directions pin</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-amber-500/30">
                        4
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-amber-400 font-bold">TOUCH 4 &middot; Day 7</span>
                          <span>Inventory Update</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Project update or fresh unit allotment release alert</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-rose-950 text-rose-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-rose-500/30">
                        5
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-rose-400 font-bold">TOUCH 5 &middot; Day 14</span>
                          <span>Status Check</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Active qualification check &middot; Move to long-term nurture pool</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("followup-playbook", SAMPLE_FOLLOWUP_CADENCE)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "followup-playbook" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "followup-playbook" ? "Copied to Clipboard!" : "Copy Cadence Template"}</span>
              </button>
            </div>

            {/* Card 4: Inbound Lead Webhook Payload */}
            <div className="bg-slate-50/60 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded">
                    EXAMPLE INBOUND LEAD PAYLOAD
                  </span>
                  <Code2 className="w-4 h-4 text-purple-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Example Inbound Lead Webhook Payload
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200/60">
                    <div><strong>FOR:</strong> Integration Specialists</div>
                    <div><strong>FORMAT:</strong> JSON Schema</div>
                    <div><strong>ENDPOINT:</strong> Example URL</div>
                  </div>
                </div>

                {/* Code Window Mockup */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
                  {/* Window Top Bar */}
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-slate-400 ml-2 text-[11px]">inbound_lead_payload.json</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      https://example.com/webhook
                    </span>
                  </div>

                  {/* Code Body */}
                  <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
                    <pre className="text-cyan-300">
                      <code>{SAMPLE_WEBHOOK_PAYLOAD}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("webhook-json", SAMPLE_WEBHOOK_PAYLOAD)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "webhook-json" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "webhook-json" ? "Copied to Clipboard!" : "Copy Payload Schema"}</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Next Actions & Navigation CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Next Steps</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading max-w-3xl mx-auto">
            Ready to Streamline Your Real Estate Sales Operations?
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect incoming portal leads, equip field agents with 1-tap WhatsApp workflows, and track every unit deal from inquiry to booking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/features"
              className="px-6 py-3.5 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
              Explore CRM Features
            </Link>
            <Link
              href="/solutions/real-estate-lead-management"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
            >
              See Real Estate Solutions
            </Link>
            <Link
              href="/tools/lead-response-time-calculator"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
            >
              Try a Calculator
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
