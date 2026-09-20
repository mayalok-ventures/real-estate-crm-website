import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  CalendarCheck, 
  CheckCircle2, 
  Cpu, 
  Database, 
  FileBadge, 
  HardDrive, 
  Lock, 
  MapPin, 
  MessageSquare, 
  Mic, 
  Navigation, 
  PhoneCall, 
  Send, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Users, 
  Webhook, 
  Workflow, 
  Zap 
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Real Estate CRM Features — Automated Speed-to-Lead & Field Closer OS",
  description:
    "Explore Sahyak's purpose-built real estate CRM features: standardized webhook ingestion, 1-tap WhatsApp floor plan delivery, mobile voice note call logs, site visit logistics, and multi-tower inventory management.",
  alternates: {
    canonical: "https://sahyak.com/features"
  }
};

interface WorkflowModule {
  id: string;
  stageNumber: string;
  badge: string;
  title: string;
  purpose: string;
  whatItHelpsYouDo: string;
  capabilities: string[];
  uiBadge: string;
  uiDetail: {
    label: string;
    value: string;
    subtext: string;
  };
}

const WORKFLOW_MODULES: WorkflowModule[] = [
  {
    id: "capture",
    stageNumber: "01",
    badge: "Lead Capture",
    title: "Instant Inbound Ingress from Ads & Portals",
    purpose: "Stop downloading CSV exports at end-of-day while leads go cold.",
    whatItHelpsYouDo: "Connects Meta Ads, Google Ads, and property portals directly to your CRM via standard webhooks so every lead is captured the moment a buyer hits submit.",
    capabilities: [
      "Standard HTTP webhook ingestion with full UTM campaign tracking",
      "Automatic phone number normalization (+91) and instant de-duplication",
      "Immediate capture of buyer budget, preferred configuration, and micro-market",
      "Zero reliance on manual CSV downloads or email alerts"
    ],
    uiBadge: "INGRESS CORE",
    uiDetail: {
      label: "Webhook Ingress Status",
      value: "Active & De-duplicated",
      subtext: "Payload parsed with UTM attribution intact"
    }
  },
  {
    id: "assign",
    stageNumber: "02",
    badge: "Lead Distribution",
    title: "Automated Round-Robin Routing & SLA Guard",
    purpose: "Prevent prime buyer leads from sitting unassigned in an inbox.",
    whatItHelpsYouDo: "Routes high-intent property inquiries instantly to the right sales executive based on project assignment, budget tier, and agent availability.",
    capabilities: [
      "Micro-market territory and project-based round-robin distribution",
      "High-ticket routing rule (e.g. leads >₹2 Cr assigned to senior luxury closers)",
      "Configurable 15-minute first-call attempt SLA timer",
      "Automated manager escalation if an inbound lead remains untouched"
    ],
    uiBadge: "ROUTING ENGINE",
    uiDetail: {
      label: "Assignment Status",
      value: "Routed in Seconds",
      subtext: "Assigned to territory luxury closer with 15m SLA"
    }
  },
  {
    id: "engage",
    stageNumber: "03",
    badge: "WhatsApp Engagement",
    title: "1-Tap WhatsApp Floor Plans & Brochures",
    purpose: "Engage buyers on the channel they actually read without cluttering personal contacts.",
    whatItHelpsYouDo: "Allows agents to dispatch branded project brochures, high-res floor plans, and RERA approval certificates directly over WhatsApp with 1 tap.",
    capabilities: [
      "Direct chat initiation without saving 2,000 unverified numbers to personal phones",
      "Pre-loaded, verified project message templates and greeting scripts",
      "1-Click sharing of custom watermarked PDF brochures with broker contact details",
      "Automatic logging of WhatsApp outreach timestamps inside the lead profile"
    ],
    uiBadge: "WHATSAPP HUB",
    uiDetail: {
      label: "Outreach Packet",
      value: "Floor Plan & RERA Docs",
      subtext: "Branded PDF dispatched with custom broker watermark"
    }
  },
  {
    id: "followup",
    stageNumber: "04",
    badge: "Field Operations",
    title: "Mobile Field Closer & Voice Note Logging",
    purpose: "Equip sales executives who work in cars, at project sites, and between client meetings.",
    whatItHelpsYouDo: "Provides a fast, thumb-friendly mobile interface for field brokers to log call outcomes, record Hinglish voice notes, and access records offline in basement parking.",
    capabilities: [
      "Voice note field recording with automatic transcription into structured CRM notes",
      "1-Tap call disposition chips (Interested, Token Expected, Re-visit Requested)",
      "Low-signal and basement offline caching with automatic sync upon reconnecting",
      "Instant calendar task creation for scheduled callbacks"
    ],
    uiBadge: "MOBILE FIELD OS",
    uiDetail: {
      label: "Audio Intelligence",
      value: "Hinglish Voice Note Parsed",
      subtext: "Budget, preferred tower, and re-visit date logged"
    }
  },
  {
    id: "visit",
    stageNumber: "05",
    badge: "Show Flat Logistics",
    title: "Site Visit Coordination & GPS Directions",
    purpose: "Turn scheduled site visits into confirmed walk-ins without navigation confusion.",
    whatItHelpsYouDo: "Automates show-flat appointments with calendar invites, driving directions, live Google Maps pins, and morning-of reminders to keep buyers on track.",
    capabilities: [
      "Show-flat appointment calendar shared between client and site sales manager",
      "Automated dispatch of Google Maps location pin and experience centre directions",
      "Scheduled T-2h WhatsApp reminder alerts before the visit begins",
      "Post-visit feedback form prompt to log client reactions immediately"
    ],
    uiBadge: "VISIT COMMAND",
    uiDetail: {
      label: "Site Visit Logistics",
      value: "Confirmed with Location Pin",
      subtext: "Driving directions and automated reminder scheduled"
    }
  },
  {
    id: "close",
    stageNumber: "06",
    badge: "Inventory & Deals",
    title: "Multi-Tower Property & Unit Lock Matrix",
    purpose: "Eliminate double-selling disputes between in-house teams and channel partners.",
    whatItHelpsYouDo: "Gives sales executives real-time visibility into available, 48-hour locked, and booked units across all towers, with instant payment schedule generation.",
    capabilities: [
      "Live unit grid with carpet area, super built-up, floor, facing, and RERA specs",
      "48-hour temporary inventory lock upon receipt of booking token advance",
      "Instant 1-click generation of Construction-Linked Payment (CLP) quotation sheets",
      "Role-based unit blocking permissions to maintain total pricing integrity"
    ],
    uiBadge: "INVENTORY MATRIX",
    uiDetail: {
      label: "Unit Inventory Status",
      value: "Unit A-1402 Blocked (48h)",
      subtext: "Advance token logged • CLP payment schedule generated"
    }
  }
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#0077ff] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Estate Sales Workflows</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-heading max-w-4xl mx-auto leading-tight">
            Built for How Real Estate Deals Actually Move
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Generic SaaS CRMs were designed for email-based desk software. Sahyak is engineered around WhatsApp floor plans, on-site mobile execution, and high-ticket property inventory.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-brand text-white text-xs py-3.5 px-7 font-bold shadow-md"
            >
              <span>Start Free — 20 Leads</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              href="/pricing"
              className="btn-pill-secondary text-xs py-3.5 px-6 font-bold"
            >
              <span>View Pricing at ₹499</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Video Ecosystem Showcase */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <div className="p-4 sm:p-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-700 inline-block" />
                <span className="text-xs font-mono text-slate-400 ml-2">features-integration-ecosystem.mp4</span>
              </div>
              <span className="text-xs font-mono text-[#0077ff] font-semibold">Workflow Ingress Demonstration</span>
            </div>
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover select-none"
              >
                <source src="/videos/features-integration-ecosystem.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Workflow Modules (Organized by Sales Stage) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {WORKFLOW_MODULES.map((module, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={module.id}
                id={module.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                  isEven ? "" : "lg:flex-row-reverse"
                }`}
              >
                {/* Left/Right Text Content */}
                <div className={`lg:col-span-6 ${isEven ? "" : "lg:order-2"} space-y-5`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black font-mono text-[#0077ff] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60">
                      STAGE {module.stageNumber}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {module.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                    {module.title}
                  </h2>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      The Operational Challenge:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      {module.purpose}
                    </p>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {module.whatItHelpsYouDo}
                  </p>

                  <div className="space-y-3 pt-2">
                    {module.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left/Right Simulated Visual Card */}
                <div className={`lg:col-span-6 ${isEven ? "" : "lg:order-1"}`}>
                  <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
                      <span>MODULE: {module.uiBadge}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        OPERATIONAL
                      </span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {module.uiDetail.label}
                        </span>
                        <Zap className="w-4 h-4 text-[#0077ff]" />
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {module.uiDetail.value}
                      </div>
                      <p className="text-xs text-slate-600">
                        {module.uiDetail.subtext}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Execution</span>
                        <span className="font-semibold text-slate-900">Standard CRM Flow</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Data Isolation</span>
                        <span className="font-semibold text-slate-900">Tenant Encrypted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Bottom Call to Action */}
      <section className="py-20 bg-slate-50 border-t border-slate-200 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
            Test These Workflows on Active Property Inquiries
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Get started with 20 free leads and 10 WhatsApp actions today. No credit card required.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-brand text-white text-xs py-3.5 px-8 font-bold shadow-md"
            >
              <span>Start Free — 20 Leads</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
            <Link
              href="/pricing"
              className="btn-pill-secondary text-xs py-3.5 px-7 font-bold"
            >
              <span>View Pricing at ₹499</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
