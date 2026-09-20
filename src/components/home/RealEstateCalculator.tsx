"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  IndianRupee, 
  Sparkles, 
  TrendingUp 
} from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/utils";

export default function RealEstateCalculator() {
  const [leadsPerMonth, setLeadsPerMonth] = useState<number>(150);
  const [avgTicketPriceLakhs, setAvgTicketPriceLakhs] = useState<number>(180); // ₹1.8 Cr
  const [commissionPct, setCommissionPct] = useState<number>(2.0); // 2%
  const [leakagePct, setLeakagePct] = useState<number>(35); // 35% leaked leads

  // Computations
  const avgTicketRupees = avgTicketPriceLakhs * 100000;
  const grossCommissionPerUnit = avgTicketRupees * (commissionPct / 100);
  
  // Leaked leads per month
  const leakedLeads = Math.round(leadsPerMonth * (leakagePct / 100));
  
  // Conservative recovery with Sahyak speed-to-lead & automated WhatsApp:
  // Recovering just 5% of previously leaked leads into completed bookings over a year
  const recoveredUnitsPerYear = Math.max(1, Math.round(leakedLeads * 12 * 0.04));
  const recoveredRevenueYearly = recoveredUnitsPerYear * grossCommissionPerUnit;
  const extraSiteVisitsMonthly = Math.round(leakedLeads * 0.22);

  return (
    <section 
      id="calculator" 
      data-analytics-section="roi_calculator"
      className="py-24 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
            <Calculator className="w-3.5 h-3.5" />
            Revenue Recovery Simulator
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calculate How Much Revenue You Leak Every Quarter
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            In high-ticket real estate, saving even one lead from dying in an unread spreadsheet pays for your entire technology stack for the next 5 years.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Monthly Leads */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Monthly Inbound Leads (Portals + Ads + Walk-ins)
                </label>
                <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-lg text-sm">
                  {leadsPerMonth} leads/mo
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="10"
                value={leadsPerMonth}
                onChange={(e) => setLeadsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>20 leads (Boutique Broker)</span>
                <span>1,000 leads (Large Builder)</span>
              </div>
            </div>

            {/* Slider 2: Average Property Ticket Size */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Average Property Ticket Size
                </label>
                <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm">
                  {formatINR(avgTicketRupees)}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="1000"
                step="10"
                value={avgTicketPriceLakhs}
                onChange={(e) => setAvgTicketPriceLakhs(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹40 Lakhs (Affordable)</span>
                <span>₹10 Crores (Ultra Luxury)</span>
              </div>
            </div>

            {/* Slider 3: Commission or Margin Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Broker Commission or Builder Net Margin
                </label>
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-sm">
                  {commissionPct.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.5"
                value={commissionPct}
                onChange={(e) => setCommissionPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1.0% (Base CP Share)</span>
                <span>5.0% (Sole Selling / Direct Margin)</span>
              </div>
            </div>

            {/* Slider 4: Current Leakage Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-slate-900">
                  Estimated Current Lead Leakage (Slow / Uncontacted)
                </label>
                <span className="font-mono font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-lg text-sm">
                  {leakagePct}% of leads lost
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={leakagePct}
                onChange={(e) => setLeakagePct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>10% (Disciplined Team)</span>
                <span>60% (Manual Spreadsheets)</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-2 font-bold">
                Projected Annual Recovery
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {formatINR(recoveredRevenueYearly)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Estimated extra revenue recovered by preventing lead death in the first 15 minutes.
              </p>

              <div className="mt-6 space-y-3 pt-6 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Additional Site Visits / mo:</span>
                  <span className="font-bold text-cyan-300 font-mono">+{extraSiteVisitsMonthly} visits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Extra Bookings Converted / yr:</span>
                  <span className="font-bold text-emerald-300 font-mono">+{recoveredUnitsPerYear} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payback Period:</span>
                  <span className="font-bold text-amber-300 font-mono">&lt; 3 Days (1st Deal)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 relative z-10">
              <Link
                href="https://crm.sahyak.com/register"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Recover Your First Booking with Free Tier
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                20 Leads • 1 User • 10 WhatsApp Messages • 3 Properties Included Free
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
