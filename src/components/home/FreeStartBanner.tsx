"use client";

import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function FreeStartBanner() {
  return (
    <section 
      id="free-starter" 
      data-analytics-section="free_start_banner"
      className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Zero Risk • Immediate Activation
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Close Your Next Property Deal on the Free Starter Plan
        </h2>

        <p className="mt-4 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Test Sahyak with your live ad leads or weekend walk-ins. 
          No credit card required, no artificial trial expiration.
        </p>

        {/* Free Offer Details Grid */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-2xl backdrop-blur-md max-w-3xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-4">
            Included in the Free Starter Plan:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">20</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Free Leads</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">1</div>
              <div className="text-xs text-slate-300 font-medium mt-1">User Seat</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">10</div>
              <div className="text-xs text-slate-300 font-medium mt-1">WhatsApp Msgs</div>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">3</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Properties</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Live in &lt; 5 Minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Upgrade Only When You Scale
            </span>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={siteConfig.appSignupUrl}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all text-center"
          >
            Schedule 20-Min Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
