import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  Scale, 
  Sparkles, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { getPageBySlug, getPages } from "@/lib/seo/store";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { 
  buildArticleSchema, 
  buildFAQSchema 
} from "@/lib/seo/structured-data";
import { Breadcrumbs } from "@/lib/seo/breadcrumbs";
import { ComparisonView } from "@/components/compare/ComparisonView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages
    .filter((p) => p.slug.startsWith("compare/"))
    .map((p) => ({
      slug: p.slug.replace("compare/", ""),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(`compare/${slug}`);
  if (!page) return {};

  return generateSeoMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/compare/${slug}`,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    isIndexable: page.isIndexable,
    hreflangReferences: page.hreflangReferences,
    locale: page.locale,
    ogType: "article",
  });
}

export default async function CompareSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(`compare/${slug}`);

  if (!page) {
    notFound();
  }

  const config = (page.schemaConfig || {}) as Record<string, any>;
  const aeoSummary = config.aeoSummary as string | undefined;
  const faqItems = (config.faqItems || []) as Array<{ question: string; answer: string }>;

  const articleSchema = buildArticleSchema({
    headline: page.h1,
    description: page.metaDescription,
    url: page.canonicalUrl,
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
  });
  const faqSchema = faqItems.length > 0 ? buildFAQSchema(faqItems) : null;

  // Matrix rows for Excel vs CRM
  const excelComparisonRows = [
    {
      dimension: "1. Lead Ingress & Speed-to-Lead",
      traditionalOption: "Manual copy-paste / CSV downloads",
      traditionalDetail: "Portal leads sit in portal inboxes or email notifications for 1-4 hours before an agent manually types them into a spreadsheet row.",
      traditionalFit: "no" as const,
      crmOption: "Sub-15s Direct Webhook Ingress",
      crmDetail: "Standardized HTTPS webhooks ingest incoming inquiries from 99acres, MagicBricks, and Meta Ads in under 15 seconds, alerting available agents instantly.",
      crmFit: "yes" as const,
    },
    {
      dimension: "2. Client Data Security & Poaching",
      traditionalOption: "Zero row-level access control",
      traditionalDetail: "Any sales rep with spreadsheet view access can download or copy the entire firm database of high-net-worth property investors in 1 click.",
      traditionalFit: "no" as const,
      crmOption: "Role-Based Phone Number Masking",
      crmDetail: "Junior agents place calls through the CRM dialer without seeing raw phone numbers. Bulk CSV export is strictly locked to firm founders.",
      crmFit: "yes" as const,
    },
    {
      dimension: "3. WhatsApp Proposal Dispatch",
      traditionalOption: "Manual copy-paste to phonebook",
      traditionalDetail: "Agent must save the buyer's number to their personal contacts, open WhatsApp, and manually attach brochures and floor plans.",
      traditionalFit: "no" as const,
      crmOption: "1-Tap Verified WhatsApp Dispatch",
      crmDetail: "Agents send pre-approved project brochures, pricing cards, and floor plans directly from the CRM client card without saving numbers.",
      crmFit: "yes" as const,
    },
    {
      dimension: "4. Unit Inventory & 48h Locks",
      traditionalOption: "Static text columns",
      traditionalDetail: "Managing availability across multiple towers and phases in cells frequently results in two agents taking booking tokens for the same apartment.",
      traditionalFit: "partial" as const,
      crmOption: "Real-Time Visual Matrix Grid",
      crmDetail: "Live visual unit grid with automated 48-hour temporary countdown locks prevents double-selling and syncs across all agent devices in real time.",
      crmFit: "yes" as const,
    },
    {
      dimension: "5. Sunday Site Visit Logistics",
      traditionalOption: "Informal notes in remarks column",
      traditionalDetail: "No automatic location sharing or calendar invites. High show-flat no-show rates because buyers get lost or forget the appointment.",
      traditionalFit: "partial" as const,
      crmOption: "Automated WhatsApp GPS Pins",
      crmDetail: "Automated Saturday confirmation messages with 1-tap Google Maps directions, host reception check-in, and mobile audio voice note logs.",
      crmFit: "yes" as const,
    },
    {
      dimension: "6. Agent Follow-Up Reminders",
      traditionalOption: "Manual calendar alerts",
      traditionalDetail: "Agents frequently forget to follow up with leads after the 2nd call, leading to forgotten prospects and wasted advertising spend.",
      traditionalFit: "partial" as const,
      crmOption: "Automated Daily Follow-Up Queue",
      crmDetail: "Dynamic daily task list prioritized by deal temperature, scheduled callbacks, and automatic manager escalation for untouched leads.",
      crmFit: "yes" as const,
    },
    {
      dimension: "7. Ease of Setup & Flexibility",
      traditionalOption: "Instant setup & zero learning curve",
      traditionalDetail: "Every agent already understands how to type into Excel or Google Sheets. No software training or account provisioning required.",
      traditionalFit: "yes" as const,
      crmOption: "Structured Real Estate Interface",
      crmDetail: "Pre-configured specifically for property sales (BHK filters, site visit statuses, developer fields) requiring ~15 minutes of onboarding.",
      crmFit: "partial" as const,
    },
    {
      dimension: "8. Cost & License Fees",
      traditionalOption: "Free / Included in Office Suite",
      traditionalDetail: "Zero dedicated software cost, making spreadsheets the ideal choice for solo brokers operating with zero marketing budget.",
      traditionalFit: "yes" as const,
      crmOption: "Free Starter Tier (₹0) / ₹499 Base",
      crmDetail: "Free Starter tier includes 20 active leads and 1 user seat forever. Transparent Base plan at ₹499/mo for growing brokerages.",
      crmFit: "yes" as const,
    },
  ];

  // Matrix rows for Personal WhatsApp vs CRM
  const whatsappComparisonRows = [
    {
      dimension: "1. Data Ownership on Agent Departure",
      traditionalOption: "Agent owns all client chats",
      traditionalDetail: "When an agent resigns or moves to a competing brokerage, all buyer chat histories, negotiation notes, and phone numbers leave with their phone.",
      traditionalFit: "no" as const,
      crmOption: "Central Firm Database Ownership",
      crmDetail: "All buyer communications route through the company's verified WhatsApp business number. Customer history stays permanently in the CRM.",
      crmFit: "yes" as const,
    },
    {
      dimension: "2. Official Meta API Compliance",
      traditionalOption: "Personal / Unofficial Web Tools",
      traditionalDetail: "Using unofficial browser scrapers or bulk extension senders causes instant, permanent WhatsApp telephone number bans with zero appeal recourse.",
      traditionalFit: "no" as const,
      crmOption: "Official Meta Cloud API",
      crmDetail: "100% compliant with Meta Terms of Service. Operates with verified business profile badges and protected transport encryption.",
      crmFit: "yes" as const,
    },
    {
      dimension: "3. Manager Visibility & Coaching",
      traditionalOption: "Zero visibility into ongoing chats",
      traditionalDetail: "Sales managers have no way of knowing how an agent pitched a project, quoted prices, or handled objections without looking over their shoulder.",
      traditionalFit: "no" as const,
      crmOption: "Shared Multi-Agent Team Inbox",
      crmDetail: "Managers monitor real-time conversation flows, review agent response quality, and can intervene directly on stalled high-ticket negotiations.",
      crmFit: "yes" as const,
    },
    {
      dimension: "4. Floor Plan & Brochure Dispatch",
      traditionalOption: "Manual attachment from phone gallery",
      traditionalDetail: "Agent must save phone number to device contacts, search gallery for PDFs, and send manually—cluttering personal phone storage.",
      traditionalFit: "partial" as const,
      crmOption: "1-Tap Verified Media Delivery",
      crmDetail: "Pre-approved, compressed architectural PDFs and unit price sheets are delivered in 1 click from the CRM without saving buyer contacts.",
      crmFit: "yes" as const,
    },
    {
      dimension: "5. Lead Pipeline Stage Synchronization",
      traditionalOption: "Completely disconnected from CRM",
      traditionalDetail: "Chats occur on personal phone while CRM pipeline statuses remain stale unless the agent remembers to manually update both systems.",
      traditionalFit: "no" as const,
      crmOption: "Automatic Stage & Activity Logging",
      crmDetail: "WhatsApp message dispatches, brochure sends, and incoming buyer replies automatically log to the lead's activity timeline.",
      crmFit: "yes" as const,
    },
    {
      dimension: "6. Informal Casual Interactions",
      traditionalOption: "Natural 1-on-1 personal messaging",
      traditionalDetail: "Ideal for informal check-ins, personal greetings, and casual relationship-building with close personal friends.",
      traditionalFit: "yes" as const,
      crmOption: "Formalized Professional Communication",
      crmDetail: "Branded, verified corporate sender profile. Better for formal commercial proposals, site visit confirmations, and official payment notices.",
      crmFit: "partial" as const,
    },
    {
      dimension: "7. Software Cost",
      traditionalOption: "100% Free App",
      traditionalDetail: "WhatsApp and WhatsApp Business apps are free to download and use on mobile devices.",
      traditionalFit: "yes" as const,
      crmOption: "Includes 10 Free Actions / Meta Billing",
      crmDetail: "Free Starter includes 10 WhatsApp actions; paid plans include capacity add-ons and standard Meta conversational utility pricing.",
      crmFit: "partial" as const,
    },
  ];

  const rows = slug === "real-estate-crm-vs-excel" ? excelComparisonRows : whatsappComparisonRows;
  const traditionalLabel = slug === "real-estate-crm-vs-excel" ? "Spreadsheets (Excel / Google Sheets)" : "Personal WhatsApp / Business App";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Top Header & Breadcrumbs Strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={page.breadcrumbHierarchy} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 font-heading">
            <Scale className="w-3.5 h-3.5 text-blue-600" />
            <span>Objective Architectural Comparison</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight max-w-4xl mx-auto">
            {page.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {page.metaDescription}
          </p>
        </div>
      </section>

      {/* AEO Summary Box */}
      {aeoSummary && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-heading">
                  Architectural Synthesis (AEO Direct Summary)
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {aeoSummary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Side-by-Side Comparison Matrix */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ComparisonView
          title={page.h1}
          subtitle="Objective operational comparison across data protection, speed-to-lead, WhatsApp delivery, unit locking, and costs."
          comparisonType={slug === "real-estate-crm-vs-excel" ? "excel" : "whatsapp"}
          traditionalLabel={traditionalLabel}
          crmLabel="Sahyak Real Estate CRM"
          rows={rows}
        />
      </main>

      {/* FAQs */}
      {faqItems.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-heading">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
              Decision &amp; Migration Guidance
            </h2>
          </div>

          <div className="space-y-3">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 shadow-xs"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-heading flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom Conversion */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Try the real estate first workflow risk-free
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Start on our Free Starter Tier: 20 active leads, 1 user seat, 10 WhatsApp actions, and 3 properties included forever with zero credit card required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm transition-all shadow-sm"
            >
              Start Free (No Card Needed)
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all"
            >
              Schedule Sales Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
