"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Database,
  FileSpreadsheet, 
  Layers, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Zap,
  PhoneMissed,
  Activity,
  Play
} from "lucide-react";

export default function ChaosToConduit() {
  const [simulating, setSimulating] = useState(false);
  const [lastSource, setLastSource] = useState<string>("Meta Ads");

  const runSimulation = (source: string) => {
    setLastSource(source);
    setSimulating(true);
    setTimeout(() => setSimulating(false), 2200);
  };

  return (
    <section 
      id="chaos-to-conduit"
      data-analytics-section="chaos_to_conduit"
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Minimal Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Scattered &rarr; Connected
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            5 sources. 3 spreadsheets. 2 agents.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-rose-600 font-semibold">
            Somewhere here, a buyer gets lost.
          </p>
        </div>

        {/* CUSTOM VECTOR COLLAPSE CANVAS */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl overflow-hidden space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* 1. Inbound Scattered Fragments (4 Cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Inbound Channels Fragment
                </span>
                <span className="text-[10px] font-mono text-slate-400">Click to simulate flow</span>
              </div>

              <button
                onClick={() => runSimulation("Meta Ads")}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    Instagram &amp; Meta Ads
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block pl-4">
                    meta_lead #9841 &middot; 12s ago
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  CSV Export
                </span>
              </button>

              <button
                onClick={() => runSimulation("WhatsApp Inbound")}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Personal WhatsApp Chats
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block pl-4">
                    Inbound Chat &middot; +91 98112 ••••• &middot; 2s ago
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Unread
                </span>
              </button>

              <button
                onClick={() => runSimulation("99acres / Housing")}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Housing &amp; 99acres Portals
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block pl-4">
                    Portal Webhook &middot; Tower B 3BHK &middot; 45s ago
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Email Alerts
                </span>
              </button>

              <button
                onClick={() => runSimulation("Website Forms")}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Website Landing Pages
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block pl-4">
                    UTM: /godrej-palm-retreat &middot; 1m ago
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Form Fills
                </span>
              </button>

              <button
                onClick={() => runSimulation("Partner Referral")}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer shadow-xs"
              >
                <div className="space-y-0.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Channel Partner Referrals
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block pl-4">
                    Broker: Rajesh Apex &middot; Sector 150 &middot; 3m ago
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Phone Notes
                </span>
              </button>
            </div>

            {/* 2. Middle: Vector Conduit Funnel (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-rose-50/60 to-blue-50/60 border border-slate-200/80 space-y-4 text-center relative overflow-hidden">
              {/* Subtle animated background stream */}
              {simulating && (
                <div className="absolute inset-0 bg-[#0077ff]/5 animate-pulse pointer-events-none" />
              )}

              <span className="text-[11px] font-mono uppercase text-slate-600 font-bold">
                The Operational Bottleneck
              </span>

              {/* The Breakdown Visual */}
              <div className="w-full space-y-2 text-left z-10">
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 text-xs">
                  <FileSpreadsheet className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-slate-700">3 Unsynced Spreadsheets</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 text-xs">
                  <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-slate-700">Buried WhatsApp Personal Chats</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-xs flex items-center gap-2.5 text-xs">
                  <PhoneMissed className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="text-slate-700">Unmonitored Follow-up Misses</span>
                </div>
              </div>

              {/* Animated Vector Conduit Pipe */}
              <div className="w-full py-2 z-10">
                <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-cyan-400 font-bold">INGRESS BUS ARCHITECTURE</span>
                    <span className="text-slate-400">DEMO FLOW</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full bg-gradient-to-r from-[#0077ff] via-cyan-400 to-emerald-400 transition-all duration-700 ${
                        simulating ? "w-full animate-pulse" : "w-2/3"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>SHA-256 De-dupe Node</span>
                    <span>SLA Target: &lt;2s</span>
                  </div>
                </div>
              </div>

              {/* Animated Collapse Arrow */}
              <div className="pt-1 flex items-center gap-2 text-xs font-mono font-bold text-[#0077ff] z-10">
                <span>Collapsing into Sahyak</span>
                <ArrowRight className={`w-4 h-4 ${simulating ? "translate-x-1 transition-transform" : ""}`} />
              </div>
            </div>

            {/* 3. Right: Sahyak Single Pipeline Output (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-mono uppercase text-emerald-600 font-bold block mb-2">
                Sahyak &middot; One Lead Conduit
              </span>

              <div className={`bg-slate-950 text-white rounded-2xl p-5 border transition-all duration-300 space-y-3 shadow-lg ${
                simulating ? "border-emerald-400 ring-2 ring-emerald-500/20" : "border-emerald-500/30"
              }`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      EXAMPLE PIPELINE INGRESS
                    </span>
                    {simulating && (
                      <span className="text-[10px] font-mono text-cyan-300 animate-pulse">
                        &larr; {lastSource}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono">Workflow Demo</span>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-100 flex items-center justify-between">
                    <span>Vikram Malhotra &middot; Sector 150</span>
                    <span className="text-[10px] font-mono text-cyan-400">Sample Lead</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Godrej Palm Retreat &middot; 3 BHK &middot; ₹1.85 Cr
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>De-duplicated &middot; Phone Masked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Assigned to Senior Closer Rahul</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Routing Rule: Luxury / Sector 150</span>
                  <span className="text-emerald-400">T-15m SLA Active</span>
                </div>
              </div>

              <div className="p-2 text-center text-xs text-slate-500 font-medium">
                All sources. One pipeline. Nothing slips through.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

