"use client";

import React from "react";
import { 
  AlertTriangle, 
  FileSpreadsheet, 
  MessageSquare, 
  UserX, 
  Clock, 
  ArrowDown, 
  AlertCircle,
  Share2,
  PhoneMissed
} from "lucide-react";

export default function BottleneckChaos() {
  return (
    <section 
      id="problem"
      data-analytics-section="bottleneck_chaos"
      className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Minimal Copy */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-mono uppercase tracking-wider mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Scattered Reality
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            5 sources. 3 spreadsheets. 2 agents.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-rose-600 font-semibold">
            Somewhere here, a buyer gets lost.
          </p>
        </div>

        {/* Visual Fragmentation Flow */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 1. Left: Inbound Chaos Sources */}
            <div className="lg:col-span-4 space-y-2.5">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-3">
                Inbound Inquiries Arrive
              </span>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Meta Ads Inquiries
                </span>
                <span className="text-[10px] font-mono text-slate-400">CSV Export</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Personal WhatsApp Chats
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Unread</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  99acres &amp; MagicBricks
                </span>
                <span className="text-[10px] font-mono text-slate-400">Email Alerts</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Channel Partner Referrals
                </span>
                <span className="text-[10px] font-mono text-slate-400">Phone Notes</span>
              </div>
            </div>

            {/* 2. Middle: The Breakdown / Disconnect */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
              <span className="text-[11px] font-mono uppercase text-rose-700 font-bold">
                Where the Friction Happens
              </span>

              <div className="w-full space-y-2.5">
                <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-rose-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">3 Untracked Spreadsheets</span>
                    <span className="text-slate-500 text-[11px]">Manual copying creates delays</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Buried Personal Chats</span>
                    <span className="text-slate-500 text-[11px]">Brochures sent with no log</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-rose-200 shadow-xs flex items-center gap-3">
                  <PhoneMissed className="w-5 h-5 text-rose-600 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Unmonitored Follow-ups</span>
                    <span className="text-slate-500 text-[11px]">No manager oversight</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Right: The Cost of Chaos */}
            <div className="lg:col-span-4 space-y-3 text-center lg:text-left">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-3">
                The Outcome
              </span>

              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>DEAL DROPPED</span>
                </div>

                <div className="text-sm font-bold text-slate-200">
                  Lead &ldquo;Dr. Iyer &middot; 4 BHK &middot; ₹3.2 Cr&rdquo; went cold after no response for 18 hours.
                </div>

                <div className="text-xs text-slate-400 border-t border-slate-800 pt-3">
                  The buyer visited another project and booked with a competing builder.
                </div>
              </div>

              <div className="p-3 text-center">
                <span className="text-xs text-slate-500 font-medium">
                  Not a lead volume problem. An execution gap.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
