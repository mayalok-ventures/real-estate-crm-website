import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Users,
  ChevronRight,
  PieChart
} from "lucide-react";
import { getPageBySlug, getPages } from "@/lib/seo/store";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { 
  buildFAQSchema, 
  buildHowToSchema, 
  buildSoftwareApplicationSchema 
} from "@/lib/seo/structured-data";
import { Breadcrumbs } from "@/lib/seo/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages
    .filter((p) => p.slug.startsWith("industry/"))
    .map((p) => ({
      slug: p.slug.replace("industry/", ""),
    }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(`industry/${slug}`);
  if (!page) return {};

  return generateSeoMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/industry/${slug}`,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    isIndexable: page.isIndexable,
    hreflangReferences: page.hreflangReferences,
    locale: page.locale,
  });
}

export default async function IndustrySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(`industry/${slug}`);

  if (!page) {
    notFound();
  }

  const config = (page.schemaConfig || {}) as Record<string, any>;
  const aeoSummary = config.aeoSummary as string | undefined;
  const workflowSteps = (config.workflowSteps || []) as Array<{ name: string; text: string }>;
  const faqItems = (config.faqItems || []) as Array<{ question: string; answer: string }>;

  const softwareSchema = buildSoftwareApplicationSchema();
  const faqSchema = faqItems.length > 0 ? buildFAQSchema(faqItems) : null;
  const howToSchema = workflowSteps.length > 0
    ? buildHowToSchema(page.h1, page.metaDescription, workflowSteps)
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-heading">
            <Users className="w-3.5 h-3.5" />
            <span className="capitalize">{slug.replace(/-/g, " ")} Persona OS</span>
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
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Anti-Poaching Phone Masking</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Multi-Project Mandates</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero Forced Credit Card</span>
            </span>
          </div>
        </div>
      </section>

      {/* AEO Summary Box */}
      {aeoSummary && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-900">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-heading">
                  Direct Operational Summary (AEO Answer Block)
                </span>
                <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-sans">
                  {aeoSummary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Workflow Steps */}
      {workflowSteps.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-3 mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-heading">
              Operational Implementation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Built Around Real {slug === "real-estate-brokers" ? "Brokerage" : "Developer"} Operations
            </h2>
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

      {/* Cross-Link to Calculator for Brokers */}
      {slug === "real-estate-brokers" && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block font-heading">
                Interactive Brokerage Tool
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                Calculate Agent Splits &amp; Firm Retained Net
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Model transparent line-by-line disbursements across deal value, gross brokerage, agent split, and supervisor overrides.
              </p>
            </div>
            <Link
              href="/tools/real-estate-commission-calculator"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              <span>Open Commission Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* FAQs */}
      {faqItems.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-3 mb-8">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider font-heading">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Common Questions from {slug === "real-estate-brokers" ? "Brokerage Founders" : "Developers & Builders"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2 shadow-xs"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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

      {/* Bottom Conversion */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
            Scale your property business with real estate first technology
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Start immediately on our Free Starter Tier: 20 active leads, 1 user seat, 10 WhatsApp actions, and 3 properties included with zero credit card required.
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
