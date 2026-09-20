"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Mic, 
  Radio, 
  Smartphone, 
  TrendingUp, 
  Zap 
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface TelemetryEvent {
  id: string;
  type: "lead" | "sla_warning" | "voice_note" | "booking";
  badge: string;
  badgeClass: string;
  title: string;
  detail: string;
  timeAgo: string;
  metric: string;
}

const INITIAL_EVENTS: TelemetryEvent[] = [
  {
    id: "evt-1",
    type: "lead",
    badge: "Inbound Capture",
    badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    title: "High-Intent 4BHK Lead Inbound",
    detail: "Source: Meta Luxury Ads (Golf Course Extn) • Phone: +91 98112••••• • Budget: ₹3.85 Cr",
    timeAgo: "12s ago",
    metric: "Routed in 0.8s"
  },
  {
    id: "evt-2",
    type: "sla_warning",
    badge: "SLA Guard",
    badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    title: "Site Visit Follow-Up Warning",
    detail: "Lead: Dr. Ananya Iyer • Visit concluded 45 mins ago • Follow-up call pending by Agent Priya",
    timeAgo: "2m ago",
    metric: "Escalation T-15m"
  },
  {
    id: "evt-3",
    type: "voice_note",
    badge: "Audio Intelligence",
    badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    title: "Field Voice Note Transcribed",
    detail: "Agent Rajesh: 'Buyer ready for Unit A-1201 at ₹2.40 Cr, needs CLP schedule before token.'",
    timeAgo: "6m ago",
    metric: "Sentiment: 94% Warm"
  },
  {
    id: "evt-4",
    type: "booking",
    badge: "Unit Reserved",
    badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    title: "Booking Token Advance Logged",
    detail: "Unit A-1402 (3BHK) • Advance: ₹5,00,000 via NEFT • Inventory locked for 48 hours",
    timeAgo: "14m ago",
    metric: "Deal Value: ₹2.52 Cr"
  }
];

export default function ManagerTelemetryRadar() {
  const [events, setEvents] = useState<TelemetryEvent[]>(INITIAL_EVENTS);
  const [pulseCount, setPulseCount] = useState<number>(4);

  return (
    <section 
      id="radar" 
      data-analytics-section="manager_telemetry_radar"
      className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950 border border-cyan-800/80 text-cyan-400 text-xs font-semibold mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            Live Operations Stream
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Sales Manager&apos;s Command Radar
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Real-time pipeline visibility across site executives, field brokers, and ad campaigns. 
            Catch SLA breaches and hot buyers before revenue slips away.
          </p>
        </div>

        {/* Live Metrics Header Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Active Inbound Streams</span>
            <div className="text-2xl font-black text-cyan-400 mt-1 flex items-center gap-2">
              <Activity className="w-5 h-5" /> 8 Portals
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">99acres, MagicBricks, Meta, Web</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Avg Speed to First Call</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 flex items-center gap-2">
              <Zap className="w-5 h-5" /> 14.2s
            </div>
            <span className="text-[10px] text-emerald-500/80 mt-1 block">SLA Target &lt; 15 mins (99.1% pass)</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Weekend Site Visits</span>
            <div className="text-2xl font-black text-indigo-400 mt-1 flex items-center gap-2">
              <Clock className="w-5 h-5" /> 24 Confirmed
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">WhatsApp GPS Pins Dispatched</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">Blocked Units (48h)</span>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> ₹7.25 Cr
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">3 Active Token Advances</span>
          </div>
        </div>

        {/* Live Simulation Stream */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-semibold uppercase tracking-wider">
                Telemetry Ingress Feed
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">System Status: All Nodes Nominal</span>
          </div>

          <div className="space-y-4">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {evt.type === "lead" && <Zap className="w-5 h-5 text-cyan-400" />}
                    {evt.type === "sla_warning" && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    {evt.type === "voice_note" && <Mic className="w-5 h-5 text-indigo-400" />}
                    {evt.type === "booking" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${evt.badgeClass}`}>
                        {evt.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">({evt.timeAgo})</span>
                    </div>
                    <p className="text-xs text-slate-300 font-medium">{evt.detail}</p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                    {evt.metric}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>Encrypted Edge Relay • D1 Multi-region Sync • Sub-second Latency</span>
            <span className="text-cyan-400 font-mono font-medium">Real-time audit log verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
