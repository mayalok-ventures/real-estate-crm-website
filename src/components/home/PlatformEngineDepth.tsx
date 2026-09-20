"use client";

import React from "react";
import { 
  Cpu, 
  Database, 
  Layers, 
  Lock, 
  Server, 
  ShieldCheck, 
  Workflow, 
  Zap 
} from "lucide-react";

export default function PlatformEngineDepth() {
  return (
    <section 
      id="architecture" 
      data-analytics-section="platform_engine_depth"
      className="py-24 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Under the Hood
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            An Enterprise Multi-Tenant Platform Engine, Dedicated to Real Estate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Sahyak isn&apos;t a makeshift spreadsheet wrapper. It is engineered on a decoupled, modular CRM engine designed to handle millions of transactions with strict tenant isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dynamic Entity Schema</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Add RERA registration IDs, Khata certificates, Super Built-Up area ratios, or custom payment milestones without schema migrations or engineering downtime.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Tenant Data Isolation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict cryptographic tenant partitions and Row-Level Security guarantee that no agency lead or developer unit data ever intersects across customer boundaries.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Edge-Native Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Executed across distributed Cloudflare Edge nodes. Global latency averages &lt; 50ms, ensuring instantaneous mobile lookups on weak 4G site connections.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Webhook Ingress Core</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized JSON webhook endpoints ready to accept lead payloads from any portal, custom landing page, or Meta Ads webhook in real-time.
            </p>
          </div>
        </div>

        {/* Blueprint Callout Strip */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              Long-Term Platform Blueprint
            </span>
            <h4 className="text-lg font-bold text-white">
              Grounded in Real Estate Today. Engineered for High-Ticket Pipelines Tomorrow.
            </h4>
            <p className="text-xs text-slate-400 max-w-2xl">
              By mastering the hardest high-ticket sales cycle in India — real estate — our underlying architecture is natively built to handle complex multi-stakeholder pipelines anywhere.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC2 &amp; DPDP Compliant Architecture
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
