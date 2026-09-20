import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Layers, 
  MessageSquare, 
  Sparkles, 
  Target, 
  Zap,
  Users,
  ShieldCheck,
  Check,
  Workflow,
  MapPin,
  CalendarCheck,
  Smartphone,
  Database,
  ArrowUpRight
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { buildOrganizationSchema, buildBreadcrumbSchema } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "About Sahyak CRM — Real Estate First Platform & Company Thesis",
  description:
    "Learn about Sahyak CRM: purpose-built sales operations software for real estate developers, brokers, and channel partners. Our story, thesis, and product capabilities.",
  alternates: {
    canonical: "https://sahyak.com/about"
  }
};

const THESIS_STAGES = [
  { 
    step: "01", 
    label: "LEAD", 
    title: "Webhook Ingress",
    desc: "Sub-15s lead ingestion from portals (MagicBricks, 99acres) & Meta campaigns with automated deduplication." 
  },
  { 
    step: "02", 
    label: "CONVERSATION", 
    title: "1-Tap WhatsApp",
    desc: "Dispatch approved brochures and floor plans instantly via Meta Cloud API without saving contacts." 
  },
  { 
    step: "03", 
    label: "VISIT", 
    title: "Site Visit Logistics",
    desc: "Coordinate show-flat visits, dispatch Google Maps pins, gate passes, and record post-visit closer notes." 
  },
  { 
    step: "04", 
    label: "PROPERTY", 
    title: "Tower & Unit Matrix",
    desc: "Live multi-tower unit availability with configurable 48-hour temporary locks to eliminate double-selling." 
  },
  { 
    step: "05", 
    label: "DEAL", 
    title: "Pipeline & Booking",
    desc: "Track token advance receipts, payment milestones, and booking stages directly in the deal pipeline." 
  },
];

const TARGET_PERSONAS = [
  {
    title: "Real Estate Brokers & Channel Partners",
    badge: "BROKERAGES & CPs",
    description: "Independent agencies and channel partner networks managing fast-paced buyer inquiries across multiple developer projects.",
    needs: [
      "Sub-15s lead capture from digital ad campaigns and portals",
      "1-Tap WhatsApp brochure delivery without contact saves",
      "Multi-tier agent commission splits with TDS & GST calculation",
      "Lead ownership protection to prevent internal conflict"
    ]
  },
  {
    title: "Property Developers & Builder Sales Offices",
    badge: "DEVELOPERS & BUILDERS",
    description: "In-house builder sales teams managing project launches, channel partner registrations, and high-volume site galleries.",
    needs: [
      "Live multi-tower unit inventory matrices with temporary locks",
      "Round-robin lead assignment across project sales executives",
      "Sunday show-flat logistics with visitor gate pass coordination",
      "Role-based access control protecting client phone exports"
    ]
  },
  {
    title: "Field Sales Closers & Site Executives",
    badge: "ON-SITE CLOSERS",
    description: "Frontline sales reps conducting property walkthroughs, presenting sample suites, and negotiating payment schedules.",
    needs: [
      "Mobile-first workflow designed for quick one-handed operation",
      "Instant access to verified floor plans, carpet areas & cost sheets",
      "Quick Google Maps location pin dispatch to prospective buyers",
      "Immediate visit feedback and voice note logging in the docket"
    ]
  },
  {
    title: "In-House Telecalling & Pre-Sales Teams",
    badge: "TELECALLING & QUALIFICATION",
    description: "Inside sales representatives screening incoming inquiries, qualifying budgets, and scheduling weekend appointments.",
    needs: [
      "Speed-to-lead follow-up queues prioritizing fresh inquiries",
      "Pre-configured 5-touch follow-up cadences across call & WhatsApp",
      "Fast inquiry qualification fields (budget, configuration, timeframe)",
      "Automated lead re-routing when response SLAs expire"
    ]
  }
];

const PRODUCT_CAPABILITIES = [
  {
    icon: Zap,
    title: "Sub-15s Webhook Ingestion",
    description: "Standardized webhook receivers capture incoming inquiries from MagicBricks, 99acres, Housing.com, and Meta Ads in under 15 seconds."
  },
  {
    icon: Users,
    title: "Automated Round-Robin Routing",
    description: "Intelligent lead assignment rules distribute inquiries dynamically across available sales reps based on project specialization and capacity."
  },
  {
    icon: MessageSquare,
    title: "1-Tap WhatsApp Collateral Dispatch",
    description: "Official Meta Cloud API integration allows agents to dispatch approved brochure PDFs and cost sheets without saving numbers to device address books."
  },
  {
    icon: CalendarCheck,
    title: "Structured Follow-up Cadences",
    description: "Configurable multi-touch follow-up task queues ensure leads receive timely touches between initial inquiry and booked site visits."
  },
  {
    icon: Building2,
    title: "Multi-Tower Inventory & Unit Locks",
    description: "Live unit status matrices (Available, Blocked, Sold) with 48-hour temporary inventory locks prevent double-booking across broker teams."
  },
  {
    icon: MapPin,
    title: "Site Visit Logistics & Check-In",
    description: "Dispatch Google Maps location pins, gate passes, and track visitor arrivals with mobile post-visit notes logged immediately."
  },
  {
    icon: Workflow,
    title: "Deal Pipeline & Payment Milestones",
    description: "Track property deals from qualification through site visits, active price negotiations, token advances, and construction-linked booking stages."
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Data Isolation (RBAC)",
    description: "Strict permission controls obscure raw customer phone numbers from junior reps while allowing full operational follow-up."
  }
];

export default function AboutPage() {
  const organizationSchema = buildOrganizationSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: siteConfig.url },
    { name: "About", item: `${siteConfig.url}/about` }
  ]);
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/about/#webpage`,
    "url": `${siteConfig.url}/about`,
    "name": "About Sahyak CRM — Real Estate First Platform & Company Thesis",
    "description": "Learn about Sahyak CRM: purpose-built sales operations software for real estate developers, brokers, and channel partners. Our story, thesis, and product capabilities.",
    "publisher": {
      "@id": `${siteConfig.url}/#organization`
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      {/* 1. Hero Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0077ff] text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>THE REAL ESTATE FIRST THESIS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight">
            CRM Built Around How High-Ticket <span className="brand-gradient-text">Real Estate Deals Actually Move.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Real estate sales depend on immediate lead response, WhatsApp conversations, structured follow-up cadences, physical site visits, unit-level inventory availability, and cross-team coordination. Sahyak is engineered directly around these operational requirements.
          </p>
        </div>
      </section>

      {/* 2. Visual Core Thesis Progression */}
      <section className="py-14 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
              THE REAL ESTATE SALES MOTION
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Five Operational Stages of a Property Transaction
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
            {THESIS_STAGES.map((stg) => (
              <div key={stg.step} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-xs text-cyan-400 font-bold block">{stg.step} &middot; {stg.label}</span>
                  <span className="text-sm font-extrabold text-white block">{stg.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {stg.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-[11px] text-slate-400 font-mono">
              Note: Stage 05 tracks booking stages and token advance status; external banking transactions and legal registrations are completed through statutory channels.
            </span>
          </div>
        </div>
      </section>

      {/* 3. Operational Narrative: Why Sahyak & Why Real Estate */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section 1: WHY SAHYAK EXISTS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-100 pb-16">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block mb-1">
                PROBLEM STATEMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Why Sahyak Exists
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-base">
                When property inquiries sit in disconnected spreadsheets or personal chat inboxes, buyer momentum disappears.
              </p>
              <p>
                Imagine a buyer enquires about a high-value property on a Sunday afternoon. If the sales team cannot quickly identify the lead, respond, share the right property information, and coordinate the next step, the opportunity loses momentum.
              </p>
              <p>
                Traditional general-purpose software was built around cold email outbound campaigns and lengthy desktop deal reviews. Real estate moves in real time: on smartphones, via WhatsApp messages, through highway traffic, and across physical show flats.
              </p>
              <p>
                Sahyak exists to eliminate operational gaps across the complete sales loop: <strong>incoming lead capture → round-robin assignment → fast WhatsApp engagement → structured follow-up → site visit coordination → live inventory verification → deal progression.</strong>
              </p>
            </div>
          </div>

          {/* Section 2: WHY REAL ESTATE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block mb-1">
                DOMAIN FOCUS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Why Real Estate
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-base">
                Real estate combines several operational challenges that make sales coordination unusually demanding.
              </p>

              {/* Real Estate Sales Gallery Experience Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] shadow-sm my-4 group">
                <Image
                  src="/images/about-sales-gallery-consultation.jpg"
                  alt="High-end real estate developer sales gallery with architectural scale model"
                  fill
                  sizes="(max-width: 768px) 100vw, 650px"
                  className="object-cover object-center brightness-95 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4">
                  <span className="text-xs font-mono text-cyan-300 font-medium">
                    Where high-ticket transactions happen: Developer sales galleries, architectural scale models &amp; in-person consultations
                  </span>
                </div>
              </div>

              <p>
                Property transactions are rarely completed behind a desktop computer. Sales closers navigate traffic, accompany buyers on construction walkthroughs, coordinate visitor gate passes, and check real-time unit availability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-sans text-slate-700">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <strong className="block text-slate-900 mb-1">High Transaction Values</strong>
                  Consultative multi-month sales cycles with multiple family and financial decision-makers.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <strong className="block text-slate-900 mb-1">Physical Site Visits</strong>
                  Show-flat walkthroughs remain the single most critical milestone in converting interest into bookings.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <strong className="block text-slate-900 mb-1">Inventory Dependencies</strong>
                  Every deal attaches to a physical unit; double-booking or outdated availability creates immediate friction.
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <strong className="block text-slate-900 mb-1">WhatsApp Centrality</strong>
                  Buyers expect immediate floor plan PDFs and cost sheets directly on WhatsApp rather than email attachments.
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Who Sahyak Is Built For */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-[#0077ff] tracking-wider">
              TARGET OPERATIONAL PERSONAS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              Who Sahyak Is Built For
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tailored workflows for each distinct participant in the real estate sales ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TARGET_PERSONAS.map((persona) => (
              <div
                key={persona.title}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-[#0077ff] border border-blue-100">
                    {persona.badge}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {persona.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {persona.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block mb-2">
                    Key Operational Requirements:
                  </span>
                  {persona.needs.map((need) => (
                    <div key={need} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{need}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. What Sahyak Actually Does Today */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase text-emerald-700 tracking-wider">
              VERIFIED PRODUCT CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
              What Sahyak Does Today
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              A focused, production-verified feature set built to solve real estate sales friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCT_CAPABILITIES.map((cap) => {
              const IconComp = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <IconComp className="w-4 h-4 text-[#0077ff]" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0077ff] hover:underline"
            >
              <span>Explore Detailed CRM Feature Specifications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CoreSetu Foundation & Technical Architecture */}
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 block mb-1">
                PLATFORM FOUNDATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                The CoreSetu Foundation
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-sm text-slate-300 leading-relaxed">
              <p className="font-semibold text-white text-base">
                Architectural stability for mission-critical real estate sales data.
              </p>
              <p>
                Underneath Sahyak CRM lies CoreSetu, the modular multi-tenant application foundation developed by Mayalok Ventures. CoreSetu provides tenant data isolation, secure authentication, role-based access control, and resilient webhook ingress event queues.
              </p>
              <p>
                This architectural separation ensures that client records, lead pipelines, and broker interactions remain strictly isolated per organization, while enabling rapid deployment of specialized real estate workflows.
              </p>
            </div>
          </div>

          {/* Architecture Video Container */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 text-white shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">Platform Foundation Bridge</span>
              <span>about-coresetu-bridge.mp4</span>
            </div>
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label="Sahyak and CoreSetu architectural foundation bridge video"
              >
                <source src="/videos/about-coresetu-bridge.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Product Vision & Direction */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
            PRODUCT DIRECTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
            Real Estate First. Built to Scale Further.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Sahyak is 100% focused on real estate sales operations today. Every data field, notification workflow, and mobile interface is optimized for property transactions.
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto">
            The underlying architectural foundation is designed to support broader high-ticket consultative sales operations over time, but we intentionally prioritize depth in Indian real estate over generic horizontal expansion.
          </p>
        </div>
      </section>

      {/* 8. Trust, Security & Compliance Signals */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">
              OPERATIONAL INTEGRITY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Security &amp; Trust Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#0077ff]" />
                <span>Multi-Tenant Data Isolation</span>
              </div>
              <p>Every organization operates within an isolated tenant environment with role-based access control and strict boundary separation.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#0077ff]" />
                <span>Client Data Protection</span>
              </div>
              <p>Customer data is strictly owned by the subscribing organization. Zero 3rd-party data sharing, reselling, or cross-tenant visibility.</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-[#0077ff]" />
                <span>Transparent Operations</span>
              </div>
              <p>Published pricing, a Free Starter tier (20 leads included), and direct support channels without artificial feature gating.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Next Steps CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-cyan-400 text-xs font-semibold border border-slate-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experience Sahyak CRM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-heading">
            See How Sahyak Accelerates Your Property Sales Pipeline
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Explore our purpose-built features, review transparent pricing, or book a live architectural walkthrough with our product specialists.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/features"
              className="px-6 py-3.5 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            >
              Explore CRM Features
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors border border-slate-700"
            >
              View Transparent Pricing
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-colors"
            >
              Book an Architecture Demo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
