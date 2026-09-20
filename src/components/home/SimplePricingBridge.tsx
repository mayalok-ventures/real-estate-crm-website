"use client";

import React from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Check, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from "lucide-react";
import { siteConfig, pricingConfig } from "@/lib/config";
import { formatINR } from "@/lib/utils";

export default function SimplePricingBridge() {
  return (
    <section 
      id="pricing-bridge"
      data-analytics-section="simple_pricing_bridge"
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* 1. Honest Pricing Bridge */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#0077ff] uppercase tracking-wider">
              Transparent Access
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
              Start small. <span className="brand-gradient-text">Scale as you close.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-md mx-auto">
              No locked contracts. Upgrade seats and capacity whenever your pipeline expands.
            </p>
          </div>

          {/* Clean Base Plan & Capacity Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Base Plan Core */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0077ff] text-xs font-bold font-mono">
                BASE SUBSCRIPTION
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900">
                    {formatINR(pricingConfig.basePlan.monthlyPrice)}
                  </span>
                  <span className="text-slate-500 text-sm font-medium">/ month</span>
                </div>
                <p className="text-xs text-slate-500">
                  Or {formatINR(pricingConfig.basePlan.annualPricePerMonth)}/mo billed annually (10% savings)
                </p>
              </div>

              {/* Inclusions */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>1 User Seat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>2,000 Stored Leads</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>5 GB Cloud Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>1 Webhook Endpoint</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>Full Pipeline, WhatsApp Hub, Inventory &amp; Mobile PWA</span>
                </div>
              </div>
            </div>

            {/* Right: Add-ons & Full Calculator Link */}
            <div className="md:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4 text-center md:text-left">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                Grow As Needed
              </span>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>User Capacity (up to 5):</span>
                  <span className="font-bold text-slate-900">+₹899 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>10,000 Stored Leads:</span>
                  <span className="font-bold text-slate-900">+₹199 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>20 GB Media Storage:</span>
                  <span className="font-bold text-slate-900">+₹199 / mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Integrations:</span>
                  <span className="font-bold text-slate-900">from +₹399 / mo</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/pricing#calculator"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Interactive Pricing Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Quiet Closing Product Moment */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          {/* Micro Product Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ready for your first 20 leads</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Start with 20 leads. Free.
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              20 active leads &middot; 1 user seat &middot; 10 WhatsApp actions &middot; 3 properties &middot; No credit card.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-brand text-white text-sm py-3.5 px-8 font-semibold group w-full sm:w-auto shadow-md"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={siteConfig.whatsappSalesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-secondary text-sm py-3.5 px-6 font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Talk on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
