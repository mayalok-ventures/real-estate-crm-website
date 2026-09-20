"use client";

import React from "react";
import { 
  Activity, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Radio, 
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react";

const LIVE_TEAM_EVENTS = [
  {
    id: "1",
    tag: "WHATSAPP",
    color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
    text: "Rahul S. dispatched Tower B floor plan to Vikram M.",
    time: "32s ago"
  },
  {
    id: "2",
    tag: "SITE VISIT",
    color: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
    text: "Priya V. concluded 3BHK show-flat inspection at Palm Retreat",
    time: "4m ago"
  },
  {
    id: "3",
    tag: "SLA ALERT",
    color: "text-amber-400 bg-amber-500/20 border-amber-500/30",
    text: "Inbound Meta lead uncontacted for 12 mins · Escalation T-3m",
    time: "12m ago"
  },
  {
    id: "4",
    tag: "TOKEN ADVANCE",
    color: "text-indigo-400 bg-indigo-500/20 border-indigo-500/30",
    text: "Rajesh S. logged ₹5,00,000 NEFT token for Unit A-1402",
    time: "18m ago"
  }
];

export default function ManagerCockpit() {
  return (
    <section 
      id="manager-radar"
      data-analytics-section="manager_cockpit"
      className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cinematic Zoom-Out Breadcrumb */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
            <span>ONE LEAD</span>
            <span className="text-slate-600">&rarr;</span>
            <span>ONE AGENT</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="text-white font-bold">TEAM PIPELINE</span>
          </div>
        </div>

        {/* Section Header: Minimal Copy */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-slate-100">
            Complete visibility across the floor.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-400 font-medium">
            Every lead, every call, every visit — in real time.
          </p>
        </div>

        {/* Manager Telemetry Console */}
        <div className="max-w-5xl mx-auto bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 backdrop-blur-xs">
          
          {/* 4 Live Vital Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Active Leads Today</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">18</span>
              <span className="text-[11px] text-emerald-400 font-mono block">All routed &lt;2s</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Follow-ups Due</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">3</span>
              <span className="text-[11px] text-slate-400 font-mono block">Next: in 25 mins</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Site Visits Scheduled</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">5</span>
              <span className="text-[11px] text-slate-400 font-mono block">Saturday Show Flats</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Units Under Token</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">2</span>
              <span className="text-[11px] text-slate-400 font-mono block">₹4.97 Cr Pipeline</span>
            </div>
          </div>

          {/* Live Activity Telemetry Feed */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Operations Stream &middot; Demo Radar
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Simulated Floor View</span>
            </div>

            <div className="space-y-2">
              {LIVE_TEAM_EVENTS.map((evt) => (
                <div 
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border shrink-0 ${evt.color}`}>
                      {evt.tag}
                    </span>
                    <span className="text-slate-300 font-medium truncate">
                      {evt.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {evt.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Console Note */}
          <div className="text-center pt-1">
            <span className="text-xs font-mono text-slate-400">
              Zero manual spreadsheet updates required from sales executives.
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
