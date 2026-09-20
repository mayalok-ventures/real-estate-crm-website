import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Layers, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Workflow,
  Zap,
  ChevronRight
} from "lucide-react";
import { getPageBySlug, getPages } from "@/lib/seo/store";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { 
  buildFAQSchema, 
  buildHowToSchema, 
  buildSoftwareApplicationSchema 
} from "@/lib/seo/structured-data";
import { Breadcrumbs } from "@/lib/seo/breadcrumbs";
import { siteConfig } from "@/lib/config";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages
    .filter((p) => p.slug.startsWith("solutions/"))
    .map((p) => ({
      slug: p.slug.replace("solutions/", ""),
    }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(`solutions/${slug}`);
  if (!page) return {};

  return generateSeoMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/solutions/${slug}`,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    isIndexable: page.isIndexable,
    hreflangReferences: page.hreflangReferences,
    locale: page.locale,
  });
}

export default async function SolutionSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(`solutions/${slug}`);

  if (!page) {
    notFound();
  }

  const config = (page.schemaConfig || {}) as Record<string, any>;
  const aeoSummary = config.aeoSummary as string | undefined;
  const workflowSteps = (config.workflowSteps || []) as Array<{ name: string; text: string }>;
  const faqItems = (config.faqItems || []) as Array<{ question: string; answer: string }>;
  const entities = (config.entities || []) as Array<{ name: string; type: string }>;

  // Build JSON-LD structured data
  const softwareSchema = buildSoftwareApplicationSchema();
  const faqSchema = faqItems.length > 0 ? buildFAQSchema(faqItems) : null;
  const howToSchema = workflowSteps.length > 0
    ? buildHowToSchema(page.h1, page.metaDescription, workflowSteps)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Top Header & Breadcrumbs Strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={page.breadcrumbHierarchy} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200/80 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-heading">
            <Building2 className="w-3.5 h-3.5" />
            <span className="capitalize">{slug.replace(/-/g, " ")} Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight max-w-4xl mx-auto">
            {page.h1}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {page.metaDescription}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Start Free (20 Leads Included)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center gap-2 transition-all border border-slate-200"
            >
              <span>Schedule Architecture Demo</span>
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sub-15s Portal Webhook Ingress</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Official Meta Cloud API</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Forced Credit Card</span>
            </span>
          </div>
        </div>
      </section>

      {/* AEO Concise Answer Summary Block */}
      {aeoSummary && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 font-heading">
                  Direct Operational Summary (AEO Answer Block)
                </span>
                <p className="text-sm sm:text-base text-blue-50 leading-relaxed font-sans">
                  {aeoSummary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Step-by-Step Operational Workflow (HowTo Schema Mapped) */}
      {workflowSteps.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-3 mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-heading">
              Operational Implementation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              How the {slug.replace(/-/g, " ")} System Works
            </h2>
            <p className="text-sm text-slate-600">
              Four sequential execution stages engineered around real-world property brokerage and developer sales floors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {step.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Real Estate Entity Relationships */}
      {entities.length > 0 && (
        <section className="bg-white border-y border-slate-200 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-heading block mb-4">
              Real Estate Knowledge Graph &amp; Technical Standards
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {entities.map((ent, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {ent.type}
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-heading">
                    {ent.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Tool Cross-Link */}
      {slug === "real-estate-lead-management" && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block font-heading">
                Interactive ROI Calculator Available
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Calculate the revenue impact of your current lead response time
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Enter your monthly inquiries and current agent response delays to model potential conversion upside.
              </p>
            </div>
            <Link
              href="/tools/lead-response-time-calculator"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Launch Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* FAQ Section (FAQPage Schema Mapped) */}
      {faqItems.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-3 mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-heading">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Operational Answers for Real Estate Sales Leaders
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-xs"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Real Estate Solutions Cluster */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading mb-4">
            Explore Related Real Estate Pipeline Modules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/solutions/real-estate-lead-follow-up"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all block group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                <span>Lead Follow-Up System</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Structured WhatsApp cadences and automated reminder tasks.</p>
            </Link>

            <Link
              href="/solutions/site-visit-management"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all block group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                <span>Site Visit Coordination</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Automated WhatsApp GPS pins and show-flat check-in logistics.</p>
            </Link>

            <Link
              href="/solutions/property-inventory-management"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all block group"
            >
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center justify-between">
                <span>Unit Inventory &amp; 48h Lock</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Real-time multi-tower unit matrices and double-booking prevention.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Strip */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Ready to upgrade your real estate sales velocity?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Start immediately on our Free Starter Tier: 20 active leads, 1 user seat, 10 WhatsApp actions, and 3 properties included forever with zero credit card required.
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
