import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  CalendarCheck, 
  CheckCircle2, 
  Clock,
  Database, 
  FileBadge, 
  Lock, 
  MapPin, 
  MessageSquare, 
  Mic, 
  Send, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Users, 
  Webhook, 
  Workflow, 
  Zap,
  Check,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { buildBreadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Real Estate CRM Features — Automated Speed-to-Lead & Field Closer OS",
  description:
    "Explore Sahyak's purpose-built real estate CRM features: universal webhook ingestion, 1-tap WhatsApp communication, follow-up queues, site visit logistics, and multi-tower inventory.",
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
  executionLabel: string;
  executionValue: string;
  isolationLabel: string;
  isolationValue: string;
}

const WORKFLOW_MODULES: WorkflowModule[] = [
  {
    id: "capture",
    stageNumber: "01",
    badge: "LEAD CAPTURE",
    title: "Universal Inbound Webhook Ingestion from Ads & Portals",
    purpose: "Stop downloading manual CSV exports at the end of the day while inquiries grow cold.",
    whatItHelpsYouDo: "Connect your lead sources through webhooks and move new inquiries into SAHYAK automatically. Ingests leads from Meta Ads, Google Ads, website inquiry forms, and property portals the moment a buyer submits an inquiry.",
    capabilities: [
      "Standard HTTP/HTTPS inbound webhook ingestion with full UTM and campaign source attribution",
      "Automatic Indian phone number normalization (+91) and instant duplicate detection",
      "Captures buyer budget, preferred configuration (1BHK / 2BHK / 3BHK), and project interest",
      "Automatic lead record creation with instant assignment pipeline initiation"
    ],
    uiBadge: "WEBHOOK INGRESS",
    uiDetail: {
      label: "Webhook Ingress Status",
      value: "Active & De-duplicated",
      subtext: "Inbound payload parsed with UTM source attribution intact"
    },
    executionLabel: "Execution",
    executionValue: "Inbound Webhook API",
    isolationLabel: "Data Isolation",
    isolationValue: "Tenant Isolated"
  },
  {
    id: "assign",
    stageNumber: "02",
    badge: "LEAD DISTRIBUTION",
    title: "Instant Lead Distribution & Intelligent Assignment",
    purpose: "Prevent prime buyer leads from sitting unassigned in a shared inbox.",
    whatItHelpsYouDo: "Fast lead assignment keeps new inquiries moving to the right sales user automatically, avoiding manual bottleneck delays and speeding up first contact.",
    capabilities: [
      "Automated round-robin distribution across active sales executives",
      "Least-loaded assignment balancing active inquiry volumes across the team",
      "Capacity-based distribution rules to prevent sales rep overload",
      "Instant fallback assignment to ensure zero leads are left unattended"
    ],
    uiBadge: "ROUTING ENGINE",
    uiDetail: {
      label: "Assignment Engine",
      value: "Routed Instantly",
      subtext: "Assigned to available closer via dynamic round-robin"
    },
    executionLabel: "Routing Rule",
    executionValue: "Dynamic Round-Robin",
    isolationLabel: "Load Balancing",
    isolationValue: "Least-Loaded Model"
  },
  {
    id: "engage",
    stageNumber: "03",
    badge: "WHATSAPP SALES WORKFLOW",
    title: "1-Tap WhatsApp Communication & Collateral Sharing",
    purpose: "Engage buyers on the channel they actually read without cluttering personal contacts.",
    whatItHelpsYouDo: "Enables 1-to-1 WhatsApp conversations, media sharing, and instant project collateral dispatch directly from the lead docket without saving numbers to personal phonebooks.",
    capabilities: [
      "Direct 1-to-1 WhatsApp messaging without saving unknown contacts to personal devices",
      "Dispatch verified project brochures, floor plans, and audio notes with 1 tap",
      "Pre-configured real estate message templates for first response, price sheets, and highlights",
      "Supports direct device pairing and official Meta WhatsApp Cloud API integration",
      "Chronological logging of WhatsApp outreach timestamps inside the lead activity profile"
    ],
    uiBadge: "WHATSAPP HUB",
    uiDetail: {
      label: "Outreach Packet",
      value: "Brochure & Floor Plans",
      subtext: "1-Tap collateral dispatched and logged to lead profile"
    },
    executionLabel: "Protocol",
    executionValue: "Meta Cloud API / Device Sync",
    isolationLabel: "Contact Hygiene",
    isolationValue: "Zero Phonebook Clutter"
  },
  {
    id: "followup",
    stageNumber: "04",
    badge: "FOLLOW-UP MANAGEMENT",
    title: "Structured Follow-Up Cadences & Leakage Prevention",
    purpose: "Stop qualified buyers from dropping through the cracks between the first call and the site visit.",
    whatItHelpsYouDo: "Organizes scheduled tasks across phone calls, site visits, WhatsApp follow-ups, and in-person meetings with standardized disposition outcomes and browser audio alerts.",
    capabilities: [
      "Structured follow-up task scheduling with specific due dates, times, and channels",
      "Standardized call outcomes (Interested, Callback Requested, Budget Mismatch, Re-visit Planned)",
      "Snooze, delay, and reschedule controls to adapt to buyer availability",
      "Browser audio reminders and notification badges for due tasks",
      "Complete chronological follow-up audit trail preserved across the customer lifecycle"
    ],
    uiBadge: "FOLLOW-UP CADENCE",
    uiDetail: {
      label: "Follow-Up Queue",
      value: "Due Task & Callback Alert",
      subtext: "Browser audio reminder active • Chronological history saved"
    },
    executionLabel: "Alert Trigger",
    executionValue: "In-App Audio Notification",
    isolationLabel: "Outcome Schema",
    isolationValue: "Standardized Dispositions"
  },
  {
    id: "mobile",
    stageNumber: "05",
    badge: "FIELD OPERATIONS",
    title: "Mobile-First PWA for On-Site Field Executives",
    purpose: "Equip sales executives who work in cars, at project sales galleries, and between client walkthroughs.",
    whatItHelpsYouDo: "A lightweight, touch-first Progressive Web App (PWA) that installs on any smartphone for quick updates, lead status adjustments, and voice memo capture on the move.",
    capabilities: [
      "Native installable mobile application experience on Android and iOS (PWA)",
      "In-app voice memo recording for logging verbal updates quickly without typing long notes",
      "Rapid 1-hand interface for updating lead status, marking follow-up outcomes, and checking notes",
      "Instant access to project inventory, buyer preferences, and interaction histories on the go"
    ],
    uiBadge: "MOBILE FIELD PWA",
    uiDetail: {
      label: "Field Mobility",
      value: "Voice Memo Recorded",
      subtext: "Audio note attached to lead docket on mobile PWA"
    },
    executionLabel: "Experience",
    executionValue: "Installable Mobile PWA",
    isolationLabel: "Input Mode",
    isolationValue: "Voice Memo & Touch Chips"
  },
  {
    id: "visit",
    stageNumber: "06",
    badge: "SITE VISIT MANAGEMENT",
    title: "Show-Flat Visit Scheduling & On-Site Feedback",
    purpose: "Turn scheduled site visits into confirmed walk-ins and capture immediate buyer impressions.",
    whatItHelpsYouDo: "Coordinates buyer visits from appointment scheduling through show-flat walkthroughs to immediate post-visit feedback, ratings, and next-day follow-up triggers.",
    capabilities: [
      "Centralized site visit calendar linking buyers, assigned sales closers, and project sales galleries",
      "Share project location details, driving directions, and appointment confirmations with buyers",
      "Visit status tracking: Scheduled, Completed, Rescheduled, Cancelled, and No-Show",
      "Structured post-visit feedback capture including client interest ratings and unit preferences",
      "Automated follow-up task generation immediately upon visit completion"
    ],
    uiBadge: "VISIT COORDINATION",
    uiDetail: {
      label: "Site Visit Docket",
      value: "Show-Flat Walkthrough Done",
      subtext: "Interest rating logged • Immediate follow-up triggered"
    },
    executionLabel: "Tracking",
    executionValue: "Status & Rating Logging",
    isolationLabel: "Post-Visit Trigger",
    isolationValue: "Next-Touch Task Queued"
  },
  {
    id: "inventory",
    stageNumber: "07",
    badge: "PROPERTY & INVENTORY",
    title: "Multi-Tower Inventory Matrix with Time-Bounded Holds",
    purpose: "Eliminate double-selling disputes between in-house teams and channel partners.",
    whatItHelpsYouDo: "Gives sales executives real-time visibility into available, held, blocked, booked, and sold units across all project towers, with time-bounded temporary holds that auto-expire.",
    capabilities: [
      "4-level real estate inventory hierarchy: Project → Tower → Floor → Unit",
      "Real-time unit availability states: AVAILABLE, HOLD, BLOCKED, BOOKED, and SOLD",
      "Unit detail dockets with carpet area, super built-up area, floor, facing, and pricing",
      "Time-bounded inventory holds with automatic expiry to prevent stagnant reservations",
      "Role-based unit blocking permissions to maintain total pricing integrity across broker networks"
    ],
    uiBadge: "INVENTORY MATRIX",
    uiDetail: {
      label: "Unit Inventory Status",
      value: "Unit T2-1402 Temporary Hold",
      subtext: "Time-bounded hold active • Auto-expires on timeout"
    },
    executionLabel: "Hierarchy",
    executionValue: "Project → Tower → Floor → Unit",
    isolationLabel: "Hold Behavior",
    isolationValue: "Time-Bounded Auto-Expiry"
  },
  {
    id: "deals",
    stageNumber: "08",
    badge: "DEALS & MILESTONE PAYMENTS",
    title: "Deal Pipeline & Construction-Linked Milestone Tracking",
    purpose: "Manage multi-month property conversions with milestone payment schedules and GST invoicing.",
    whatItHelpsYouDo: "Track deals from initial qualification through booking token advances, construction-linked payment milestones, and GST tax breakdowns.",
    capabilities: [
      "Multi-stage deal pipeline with win probabilities and weighted revenue forecasting",
      "Booking token advance tracking with payment reference and confirmation",
      "Milestone payment schedules (Booking, Agreement, Foundation, Structure, Possession, or Custom)",
      "GST invoice generation with statutory tax breakdowns for real estate transactions",
      "Clear financial visibility into booked deal value and collection progress"
    ],
    uiBadge: "DEAL PIPELINE",
    uiDetail: {
      label: "Deal Pipeline State",
      value: "Token Advance Confirmed",
      subtext: "Milestone payment schedule attached • GST calculated"
    },
    executionLabel: "Pipeline Model",
    executionValue: "Weighted Revenue Forecast",
    isolationLabel: "Payment Schedule",
    isolationValue: "Construction-Linked (CLP)"
  },
  {
    id: "automation",
    stageNumber: "09",
    badge: "WORKFLOW AUTOMATION",
    title: "Event-Driven Workflow Automation for Real Estate",
    purpose: "Eliminate repetitive administrative tasks so sales executives spend their time closing.",
    whatItHelpsYouDo: "Automatically trigger standard operating procedures the instant an event occurs in the CRM—from inbound lead ingress to site visit completion and deal stage shifts.",
    capabilities: [
      "Lead Created → Automatically assign sales user and generate first-touch follow-up task",
      "Site Visit Completed → Instantly prompt agent for client rating and schedule next-day quote call",
      "Deal Stage Changed → Update pipeline probabilities and notify team administrators",
      "Automated task queues that keep customer communication moving forward without manual oversight"
    ],
    uiBadge: "EVENT AUTOMATION",
    uiDetail: {
      label: "Event Automation Rules",
      value: "Lead Ingress → Auto-Assigned",
      subtext: "First follow-up task created automatically"
    },
    executionLabel: "Event Triggers",
    executionValue: "State Change Listeners",
    isolationLabel: "SOP Execution",
    isolationValue: "Automated Task Queues"
  },
  {
    id: "security",
    stageNumber: "10",
    badge: "SECURITY & ACCESS",
    title: "Multi-Tenant Logical Isolation & Role-Based Access",
    purpose: "Protect confidential client databases, lead ownership, and pricing authority across teams.",
    whatItHelpsYouDo: "Clean multi-tenant architecture with granular role-based access control, secure HTTPS/TLS encryption in transit, and HMAC-verified webhooks.",
    capabilities: [
      "Multi-tenant logical data isolation ensuring complete organizational data partitioning",
      "Granular Role-Based Access Control (RBAC) restricting phone export and unit blocking by user tier",
      "Inbound webhook authentication using cryptographic HMAC SHA-256 signatures",
      "Secure transmission over TLS 1.3 with audited administrator session security",
      "Zero third-party tracker data selling or cross-tenant data visibility"
    ],
    uiBadge: "SECURITY CORE",
    uiDetail: {
      label: "Security & Access Architecture",
      value: "Multi-Tenant Logical Isolation",
      subtext: "Granular RBAC • HMAC SHA-256 Webhook Verification"
    },
    executionLabel: "Webhook Security",
    executionValue: "HMAC SHA-256 Verification",
    isolationLabel: "Architecture",
    isolationValue: "Multi-Tenant Logical Isolation"
  }
];

interface FutureFeature {
  title: string;
  badge: string;
  badgeType: "coming_soon" | "in_development" | "roadmap";
  concept: string;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const FUTURE_FEATURES: FutureFeature[] = [
  {
    title: "AI Voice Transcription",
    badge: "COMING SOON",
    badgeType: "coming_soon",
    concept: "Voice recording → Speech-to-Text (Whisper AI) → Structured CRM activity note",
    benefits: [
      "Less typing for busy agents driving between project sites",
      "Faster field updates logged immediately after client walkthroughs",
      "Searchable conversation transcripts inside the lead timeline",
      "Seamless context handover between junior reps and senior closers"
    ],
    icon: Mic
  },
  {
    title: "AI Conversation Summary",
    badge: "IN DEVELOPMENT",
    badgeType: "in_development",
    concept: "Lead record + WhatsApp chat history → AI analysis → Concise buyer profile summary",
    benefits: [
      "Instant understanding of buyer preferences, budget, and objections",
      "Eliminates reading through weeks of unstructured chat transcripts",
      "Equips sales managers with rapid context before joining high-stakes calls"
    ],
    icon: Sparkles
  },
  {
    title: "AI Follow-up Suggestions",
    badge: "IN DEVELOPMENT",
    badgeType: "in_development",
    concept: "Lead stage + activity timeline + conversation context → AI recommended next action",
    benefits: [
      "Recommends high-converting next steps (Call, Brochure, Site Visit, Follow-up)",
      "Maintains rigorous sales discipline across large inside sales teams",
      "Reduces guesswork on when and how to re-engage stalled inquiries"
    ],
    icon: Workflow
  },
  {
    title: "AI Message Generation",
    badge: "IN DEVELOPMENT",
    badgeType: "in_development",
    concept: "Lead context + property unit + chat history → AI drafts custom WhatsApp message → Agent reviews & approves → Dispatched",
    benefits: [
      "Drafts highly personalized WhatsApp responses tailored to buyer questions",
      "Strict human-in-the-loop: message is never sent without agent review",
      "Accelerates response speed while preserving professional sales tone"
    ],
    icon: MessageSquare
  },
  {
    title: "CLP Quotation Builder",
    badge: "COMING SOON",
    badgeType: "coming_soon",
    concept: "Unit & property data + pricing + payment milestones → Reusable pre-booking quotation → Shareable PDF via WhatsApp",
    benefits: [
      "Rapid quotation generation without manual spreadsheet calculations",
      "Establishes transparent construction-linked payment expectations for buyers",
      "Professional branded cost sheets sent instantly during negotiations"
    ],
    icon: FileBadge
  },
  {
    title: "Direct Meta Ads Lead Sync",
    badge: "IN DEVELOPMENT",
    badgeType: "in_development",
    concept: "Meta OAuth → Meta Lead Forms API → SAHYAK ingestion pipeline → Deduplication → Assignment",
    benefits: [
      "Direct API integration with Meta Ads alongside existing webhook ingestion",
      "Pulls instant lead form submissions without third-party connector tools",
      "Full ad set and campaign attribution captured automatically"
    ],
    icon: Webhook
  },
  {
    title: "Native Web Push Notifications",
    badge: "COMING SOON",
    badgeType: "coming_soon",
    concept: "CRM event → Backend notification trigger → Browser & device push alert",
    benefits: [
      "Instant push alerts for newly assigned inquiries and due follow-ups",
      "Show-flat site visit reminders delivered directly to mobile lock screens",
      "Keeps field agents connected even when the browser tab is in background"
    ],
    icon: Send
  },
  {
    title: "15-Minute Response SLA & Escalation Engine",
    badge: "IN DEVELOPMENT",
    badgeType: "in_development",
    concept: "Lead assigned → SLA countdown timer starts → First response detected stops timer; unhandled leads trigger reminder & manager escalation",
    benefits: [
      "Enforces speed-to-lead response discipline across the sales floor",
      "Automated escalation alert to sales manager if inquiry remains untouched",
      "Provides measurable SLA compliance metrics across individual reps"
    ],
    icon: Clock
  },
  {
    title: "Offline CRM Data Synchronization",
    badge: "ON THE ROADMAP",
    badgeType: "roadmap",
    concept: "CRM data cache → IndexedDB storage → Offline actions → Mutation queue → Auto-sync upon reconnection",
    benefits: [
      "View unit availability and customer notes in basement parking and low-signal areas",
      "Queue follow-up updates and visit notes while offline",
      "Automatic background synchronization with conflict handling upon reconnecting"
    ],
    icon: Database
  },
  {
    title: "Dynamic PDF Watermarking",
    badge: "COMING SOON",
    badgeType: "coming_soon",
    concept: "Brochure PDF generated → Dynamic broker / agency watermark stamped → Branded document dispatched via WhatsApp",
    benefits: [
      "Protects proprietary project collateral and pricing sheets from unaccredited sharing",
      "Ensures broker branding and contact info are permanently attached",
      "Professional presentation that reinforces agency credibility"
    ],
    icon: Lock
  }
];

export default function FeaturesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: siteConfig.url },
    { name: "Features", item: `${siteConfig.url}/features` }
  ]);
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/features/#webpage`,
    "url": `${siteConfig.url}/features`,
    "name": "Real Estate CRM Features — Automated Speed-to-Lead & Field Closer OS",
    "description": "Explore Sahyak's purpose-built real estate CRM features: universal webhook ingestion, 1-tap WhatsApp communication, follow-up queues, site visit logistics, and multi-tower inventory.",
    "publisher": {
      "@id": `${siteConfig.url}/#organization`
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* 1. Hero Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-blue-50/40 via-white to-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#0077ff] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>REAL ESTATE SALES WORKFLOWS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-heading max-w-4xl mx-auto leading-tight">
            Built for How Real Estate Deals Actually Move
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            SAHYAK is a real-estate-first CRM built around the actual sales workflow of Indian real-estate teams. From universal webhook lead capture to instant distribution, 1-tap WhatsApp communication, follow-up queues, show-flat visits, multi-tower inventory matrices, and deal milestones.
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
                aria-label="Sahyak workflow integration and lead ingress demonstration video"
              >
                <source src="/videos/features-integration-ecosystem.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Workflow Modules (Organized by Sales Lifecycle Stage) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          <div className="text-center max-w-3xl mx-auto space-y-3 pb-4">
            <span className="text-xs font-mono font-bold uppercase text-[#0077ff] tracking-wider">
              OPERATIONAL SALES LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              How Deals Move Through SAHYAK
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every feature corresponds to an active operational step in property sales: from initial inquiry capture to agent distribution, WhatsApp engagement, field follow-up, show-flat walkthroughs, and inventory locks.
            </p>
          </div>

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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {module.badge}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                    {module.title}
                  </h2>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 font-mono">
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
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
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
                        <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">{module.executionLabel}</span>
                        <span className="font-semibold text-slate-900">{module.executionValue}</span>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-slate-700">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold font-mono">{module.isolationLabel}</span>
                        <span className="font-semibold text-slate-900">{module.isolationValue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Future Features: What's Coming Next (Transparent Product Roadmap) */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BUILT FOR WHAT&apos;S NEXT &middot; PRODUCT ROADMAP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading">
              Upcoming Capabilities in Development
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              A transparent look at the AI workflows, direct integrations, and automated engines currently in active engineering for future SAHYAK releases. Every capability below is clearly labeled as Coming Soon or In Development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FUTURE_FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${
                        feat.badgeType === "coming_soon"
                          ? "bg-cyan-950/80 text-cyan-300 border-cyan-500/40"
                          : feat.badgeType === "in_development"
                          ? "bg-amber-950/80 text-amber-300 border-amber-500/40"
                          : "bg-purple-950/80 text-purple-300 border-purple-500/40"
                      }`}>
                        {feat.badge}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400">
                        <IconComp className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        {feat.title}
                      </h3>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] font-mono text-cyan-300/90 leading-relaxed">
                        {feat.concept}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                        Planned Operational Value:
                      </span>
                      {feat.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                    <span>Engineering Roadmap</span>
                    <span className="text-slate-400 font-semibold">Future Release</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
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
