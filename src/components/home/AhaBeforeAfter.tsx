"use client";

import React from "react";
import Image from "next/image";
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock,
  Database,
  Flame,
  ShieldCheck,
  Smartphone,
  XCircle, 
  Sparkles,
  TrendingUp
} from "lucide-react";

export default function AhaBeforeAfter() {
  return (
    <section 
      id="aha"
      data-analytics-section="aha_before_after"
      className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Minimal Copy */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0077ff] text-[11px] font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Operational Shift
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Nothing between the lead <span className="brand-gradient-text">and the next move.</span>
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-500 font-medium">
            From fragmented friction to connected velocity.
          </p>
        </div>

        {/* High-Contrast Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-10">
          
          {/* 1. Before: The Disconnected Mess */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-50 border border-slate-200 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-rose-600 bg-rose-100/80 px-2.5 py-1 rounded-md">
                  WITHOUT SAHYAK
                </span>
                <span className="text-[11px] font-mono text-slate-400">Disconnected</span>
              </div>

              {/* Real-World Tactile Anchor: Chaotic Paper Slips */}
              <div className="relative rounded-2xl overflow-hidden border border-rose-200/80 aspect-[16/9] shadow-xs group">
                <Image
                  src="/images/before-chaotic-sales-diary.jpg"
                  alt="Scattered handwritten site visit registers, sticky notes, and paper slips"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover brightness-95 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono text-rose-200 font-medium">
                    Unindexed paper registers &middot; Missed callbacks &middot; Inventory leakage
                  </span>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Lead lands in email &middot; sits unassigned for hours</span>
                    <span className="text-[10px] font-mono text-rose-500 block">T+4 hours &middot; Lead goes cold</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Brochures sent from personal phones &middot; untracked</span>
                    <span className="text-[10px] font-mono text-slate-400 block">Zero brokerage ownership &middot; Data leaves with rep</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Site visits written in notebooks &middot; no directions sent</span>
                    <span className="text-[10px] font-mono text-rose-500 block">Buyer lost in traffic &middot; 42% no-show rate</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Manager spends Saturday calling reps for status updates</span>
                    <span className="text-[10px] font-mono text-slate-400 block">Blind operations &middot; Unreliable spreadsheets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-center">
              <span className="text-xs text-rose-700 font-semibold font-mono">
                Deals stall. Leads go cold.
              </span>
            </div>
          </div>

          {/* 2. After: The Sahyak Rhythm */}
          <div className="rounded-3xl p-6 sm:p-8 bg-slate-950 text-white border border-slate-800 space-y-6 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                  WITH SAHYAK
                </span>
                <span className="text-[11px] font-mono text-cyan-400">One System</span>
              </div>

              {/* Product UI Anchor: Automated Pipeline Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 aspect-[16/9] shadow-inner group">
                <Image
                  src="/images/lead-automation-dashboard.png"
                  alt="Sahyak real-time automated lead pipeline and SLA telemetry"
                  fill
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover object-top brightness-95 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono text-emerald-300 font-medium">
                    Sub-15s automated ingress &middot; Active response timers &middot; Zero lead loss
                  </span>
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Lead routed in &lt;15s &middot; Closer notified immediately</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">Sub-15s ingress &middot; T-15m Response Clock</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>1-Tap WhatsApp brochure &middot; zero number saving needed</span>
                    <span className="text-[10px] font-mono text-cyan-400 block">100% Brokerage record &middot; Verified delivery</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Automated show-flat calendar &middot; live Google Maps pin</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">Gate pass generated &middot; Directions delivered</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span>Real-time manager telemetry &middot; zero manual reporting</span>
                    <span className="text-[10px] font-mono text-cyan-400 block">Real-time floor radar &middot; Instant team audit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <span className="text-xs text-emerald-400 font-semibold font-mono">
                One connected flow. Every next move taken.
              </span>
            </div>
          </div>

        </div>

        {/* Coded Operational Shift Workflow Strip */}
        <div className="max-w-5xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Lead Ingress &amp; Routing</span>
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-rose-600 font-semibold">Manual Spreadsheets</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-600 font-bold">Instant Ingress Alert</span>
            </div>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-slate-200 pt-2 sm:pt-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Client Data Ownership</span>
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-rose-600 font-semibold">Personal WhatsApp</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-600 font-bold">Brokerage Ledger</span>
            </div>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Show-Flat Coordination</span>
            <div className="flex items-center justify-center gap-2 text-xs font-mono">
              <span className="text-rose-600 font-semibold">Unassisted Driving</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="text-emerald-600 font-bold">GPS Pin &amp; Gate Pass</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

