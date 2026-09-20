import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { getPageBySlug, getPages } from "@/lib/seo/store";
import { generateSeoMetadata } from "@/lib/seo/metadata";
import { 
  buildFAQSchema, 
  buildWebApplicationSchema 
} from "@/lib/seo/structured-data";
import { Breadcrumbs } from "@/lib/seo/breadcrumbs";
import { LeadResponseCalculator } from "@/components/tools/LeadResponseCalculator";
import { CommissionCalculator } from "@/components/tools/CommissionCalculator";
import { LeadLeakageCalculator } from "@/components/tools/LeadLeakageCalculator";
import { CrmRoiCalculator } from "@/components/tools/CrmRoiCalculator";
import { MigrationChecklistTool } from "@/components/tools/MigrationChecklistTool";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getPages();
  return pages
    .filter((p) => p.slug.startsWith("tools/"))
    .map((p) => ({
      slug: p.slug.replace("tools/", ""),
    }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(`tools/${slug}`);
  if (!page) return {};

  return generateSeoMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/tools/${slug}`,
    keywords: [page.primaryKeyword, ...page.secondaryKeywords],
    isIndexable: page.isIndexable,
    hreflangReferences: page.hreflangReferences,
    locale: page.locale,
  });
}

export default async function ToolSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(`tools/${slug}`);

  if (!page) {
    notFound();
  }

  const config = (page.schemaConfig || {}) as Record<string, any>;
  const aeoSummary = config.aeoSummary as string | undefined;
  const faqItems = (config.faqItems || []) as Array<{ question: string; answer: string }>;

  const webAppSchema = buildWebApplicationSchema(page.h1, page.metaDescription, page.canonicalUrl);
  const faqSchema = faqItems.length > 0 ? buildFAQSchema(faqItems) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 font-heading">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Operational Utility</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight max-w-3xl mx-auto">
            {page.h1}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
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
                  Operational Reference &amp; Tool Methodology (AEO)
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {aeoSummary}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Tool Implementation */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {slug === "lead-response-time-calculator" && <LeadResponseCalculator />}
        {slug === "real-estate-commission-calculator" && <CommissionCalculator />}
        {slug === "lead-leakage-calculator" && <LeadLeakageCalculator />}
        {slug === "crm-roi-calculator" && <CrmRoiCalculator />}
        {slug === "real-estate-crm-migration-checklist" && <MigrationChecklistTool />}
      </main>

      {/* Tool FAQs */}
      {faqItems.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-heading">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
              Methodology &amp; Formula Explanation
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

      {/* Cross-Link Bar */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <strong className="text-slate-900 font-heading block">Automate these calculations inside your agency:</strong>
            <span>Start on Sahyak CRM with 20 free leads and 1 user seat included.</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>View Free Starter Tier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
