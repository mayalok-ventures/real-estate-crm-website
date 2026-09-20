"use client";

import React from "react";
import { 
  ArrowRight, 
  CheckCircle2, 
  Filter, 
  Layers, 
  ShieldCheck, 
  Sparkles, 
  Zap 
} from "lucide-react";

const INBOUND_CHANNELS = [
  { name: "Meta & Google Ads", type: "API Webhook", delay: "Instant", color: "border-blue-200 bg-blue-50/60 text-blue-800" },
  { name: "99acres & MagicBricks", type: "Portal Ingress", delay: "Sub-15s", color: "border-indigo-200 bg-indigo-50/60 text-indigo-800" },
  { name: "WhatsApp Business", type: "Official Cloud API", delay: "Instant", color: "border-emerald-200 bg-emerald-50/60 text-emerald-800" },
  { name: "Website Landing Pages", type: "Native Forms", delay: "Real-time", color: "border-cyan-200 bg-cyan-50/60 text-cyan-800" },
  { name: "Broker & CP Referrals", type: "Mobile Ingress", delay: "1-Tap", color: "border-amber-200 bg-amber-50/60 text-amber-800" },
];

export default function IngressCollapse() {
  return (
    <section 
      id="ingress"
      data-analytics-section="ingress_collapse"
      className="py-16 sm:py-20 bg-white relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0077ff] text-[11px] font-mono uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            The Unified Ingress
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            All sources. One pipeline.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-600 font-medium">
            Nothing slips through.
          </p>
        </div>

        {/* Visual Convergence Funnel */}
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: 5 Ingress Feeds */}
            <div className="lg:col-span-5 space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-3">
                Scattered Inbound Feeds
              </span>

              {INBOUND_CHANNELS.map((ch, idx) => (
                <div 
                  key={ch.name}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#0077ff] animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200">{ch.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{ch.delay}</span>
                </div>
              ))}
            </div>

            {/* Middle: Funnel / Convergence Conduit */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
              <div className="hidden lg:flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0077ff] to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  Auto-Ingest
                </span>
              </div>
              <div className="lg:hidden flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <span>Convergences into Sahyak ↓</span>
              </div>
            </div>

            {/* Right: Unified Sahyak Real Estate Lead State */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block mb-3">
                Single Structured CRM Packet
              </span>

              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    VERIFIED &amp; DEDUPLICATED
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono">09:42:11 AM</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-300 font-bold">
                    Vikram Malhotra · +91 98112•••••
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Godrej Palm Retreat · 3BHK · ₹1.85 Cr
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>De-duped in 0.2s</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Phone Masked</span>
                  </div>
                </div>
              </div>

              <div className="p-2 text-center text-xs text-slate-400 font-medium">
                One clean stream. Assigned to closer in 3 seconds.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
