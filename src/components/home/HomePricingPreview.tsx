"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react";
import { siteConfig, pricingConfig } from "@/lib/config";

export default function HomePricingPreview() {
  const { freeStarter, basePlan } = pricingConfig;

  return (
    <section 
      id="pricing-preview" 
      data-analytics-section="home_pricing_preview"
      className="py-24 bg-white relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Simple, Transparent Commercials
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Start Small. Add Capacity as Your Deals Scale.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            No mandatory consultant retainers, no complex enterprise lock-ins. Test with your active property leads or launch your team on the ₹499 Base Plan.
          </p>
        </div>

        {/* Dual Card Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch mb-12">
          {/* Free Starter Card */}
          <div className="rounded-3xl border border-slate-200 p-8 flex flex-col justify-between bg-slate-50/60 hover:border-slate-300 transition-all shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-slate-900">{freeStarter.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                  {freeStarter.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {freeStarter.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500">/ test plan</span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-1">No credit card required</span>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-200 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>20 Active Leads Capacity</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1 User Seat</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>10 WhatsApp Proposal Actions</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3 Active Property / Unit Listings</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mobile Field Closer Access</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link
                href={siteConfig.appSignupUrl}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2 transition-all text-center"
              >
                <span>Start Free — 20 Leads</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Base Plan Card */}
          <div className="rounded-3xl border-2 border-[#0077ff] p-8 flex flex-col justify-between bg-white shadow-xl relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#0077ff] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
              Complete Sales Engine
            </div>

            <div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <h3 className="text-xl font-bold text-slate-900">{basePlan.name}</h3>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#0077ff]">
                  Foundation
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {basePlan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">₹{basePlan.monthlyPrice}</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-medium block mt-1">
                  ₹{basePlan.annualPricePerMonth}/mo billed annually (Save 10%)
                </span>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>1 Organization &amp; 1 User Included</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>2,000 Stored Leads Included</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>5 GB Media &amp; Brochure Storage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>Unlimited Projects &amp; Unit Inventory</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>WhatsApp Hub &amp; Verified Templates</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>1 Inbound Website Webhook Endpoint</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                href="/pricing"
                className="btn-pill-brand text-white text-xs py-3.5 px-4 font-bold flex items-center justify-center gap-2 shadow-md w-full text-center"
              >
                <span>Calculate Your Custom Capacity</span>
                <SlidersHorizontal className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Capacity Scaling Callout */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Transparent Incremental Capacity</span>
            </div>
            <p className="text-xs text-slate-600">
              Add user seats (+₹349/mo), stored leads (+₹199/1k), storage (+₹99/5GB), or webhooks (+₹199/mo) whenever needed.
            </p>
          </div>
          <Link
            href="/pricing#calculator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077ff] hover:text-blue-700 shrink-0"
          >
            <span>Open Interactive Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
