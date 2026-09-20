"use client";

import React, { useState, useMemo, useRef } from "react";
import { AlertCircle, ArrowRight, ShieldAlert, TrendingDown, RefreshCw, CheckCircle2, DollarSign } from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface LeakageState {
  monthlyLeads: number;
  initialResponseMinutes: number;
  followUpCompletionPct: number;
  currentConversionPct: number;
  averageDealValueInr: number;
  brokeragePct: number;
}

export function LeadLeakageCalculator() {
  const hasTrackedUse = useRef(false);
  const trackUse = () => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "real_estate_lead_leakage_calculator",
      });
    }
  };

  const [state, setState] = useState<LeakageState>({
    monthlyLeads: 250,
    initialResponseMinutes: 120, // 2 hours
    followUpCompletionPct: 40,   // only 40% receive 3+ follow-ups
    currentConversionPct: 1.2,
    averageDealValueInr: 8000000, // 80 Lakhs
    brokeragePct: 2.0,
  });

  const calculations = useMemo(() => {
    // 1. Initial Response Decay: Contact drop-off curve
    // Fast response (<= 5 min) retains ~85% reachability; >= 120 min retains ~18%
    const getReachabilityRate = (mins: number) => {
      if (mins <= 5) return 0.85;
      if (mins <= 15) return 0.65;
      if (mins <= 30) return 0.48;
      if (mins <= 60) return 0.32;
      if (mins <= 120) return 0.18;
      if (mins <= 360) return 0.10;
      return 0.05;
    };

    const currentReachability = getReachabilityRate(state.initialResponseMinutes);
    const benchmarkReachability = getReachabilityRate(5); // automated <5 min target

    // Leads lost to delayed first response
    const unreachableLeads = Math.round(state.monthlyLeads * (1 - currentReachability));
    const reachableLeads = Math.max(0, state.monthlyLeads - unreachableLeads);

    // 2. Follow-Up Drop-Off Leakage
    // Leads who are reached but don't get consistent multi-touch follow-up drop off
    const leadsWithoutCadence = Math.round(reachableLeads * (1 - state.followUpCompletionPct / 100));
    // Industry benchmark: ~50% of un-followed reached leads go cold or buy from competitor
    const coldCadenceLeads = Math.round(leadsWithoutCadence * 0.5);

    // Total monthly leaked leads
    const totalLeakedLeads = Math.min(state.monthlyLeads, unreachableLeads + coldCadenceLeads);
    const leakagePct = Math.round((totalLeakedLeads / Math.max(1, state.monthlyLeads)) * 100);

    // 3. Potential Recoverable Pipeline
    // If response drops to <15 min and follow-up completion reaches 85%:
    const targetContacted = Math.round(state.monthlyLeads * benchmarkReachability);
    const targetFollowed = Math.round(targetContacted * 0.85);
    const potentialAdditionalDeals = Math.max(
      0,
      Math.round(((targetFollowed - (reachableLeads - coldCadenceLeads)) * (state.currentConversionPct / 100)) * 10) / 10
    );

    const brokeragePerDeal = state.averageDealValueInr * (state.brokeragePct / 100);
    const estimatedAnnualLeakageValue = Math.round(potentialAdditionalDeals * 12 * brokeragePerDeal);

    return {
      currentReachabilityPct: Math.round(currentReachability * 100),
      unreachableLeads,
      coldCadenceLeads,
      totalLeakedLeads,
      leakagePct,
      potentialAdditionalDeals,
      brokeragePerDeal,
      estimatedAnnualLeakageValue,
    };
  }, [state]);

  const formatInr = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8">
      {/* Interactive Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Form Controls */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              1. Agency Operational Inputs
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust sliders to match your current portal ingress, team response times, and pipeline metrics.
            </p>
          </div>

          {/* Monthly Inbound Leads */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="monthly-leads-slider" className="text-slate-700">Monthly Inbound Leads (Portals + Ads)</label>
              <span className="text-blue-600 font-bold">{state.monthlyLeads} leads/mo</span>
            </div>
            <input
              id="monthly-leads-slider"
              aria-label="Monthly Inbound Leads"
              type="range"
              min="20"
              max="2000"
              step="10"
              value={state.monthlyLeads}
              onChange={(e) => {
                trackUse();
                setState({ ...state, monthlyLeads: parseInt(e.target.value) || 20 });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>20</span>
              <span>1,000</span>
              <span>2,000</span>
            </div>
          </div>

          {/* Average First Response Time */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="response-time-slider" className="text-slate-700">Current First Response Time</label>
              <span className="text-amber-600 font-bold">
                {state.initialResponseMinutes >= 60
                  ? `${(state.initialResponseMinutes / 60).toFixed(1)} hrs`
                  : `${state.initialResponseMinutes} mins`}
              </span>
            </div>
            <input
              id="response-time-slider"
              aria-label="Current First Response Time"
              type="range"
              min="2"
              max="480"
              step="5"
              value={state.initialResponseMinutes}
              onChange={(e) => {
                trackUse();
                setState({ ...state, initialResponseMinutes: parseInt(e.target.value) || 2 });
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Instant (2m)</span>
              <span>2 Hours</span>
              <span>8 Hours</span>
            </div>
          </div>

          {/* Multi-Touch Follow-Up Completion */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="followup-slider" className="text-slate-700">Leads Receiving 3+ Follow-ups</label>
              <span className="text-blue-600 font-bold">{state.followUpCompletionPct}%</span>
            </div>
            <input
              id="followup-slider"
              aria-label="Leads Receiving 3+ Follow-ups"
              type="range"
              min="10"
              max="100"
              step="5"
              value={state.followUpCompletionPct}
              onChange={(e) => {
                trackUse();
                setState({ ...state, followUpCompletionPct: parseInt(e.target.value) || 10 });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>10% (Drop-off)</span>
              <span>50%</span>
              <span>100% (Disciplined)</span>
            </div>
          </div>

          {/* Current Conversion Rate & Average Property Price */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="conversion-rate-input" className="text-xs font-semibold text-slate-700">Current Conversion (%)</label>
              <input
                id="conversion-rate-input"
                aria-label="Current Conversion Rate"
                type="number"
                step="0.1"
                min="0.1"
                max="15"
                value={state.currentConversionPct}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, currentConversionPct: parseFloat(e.target.value) || 0.5 });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="avg-property-value-input" className="text-xs font-semibold text-slate-700">Avg Property Value (₹)</label>
              <input
                id="avg-property-value-input"
                aria-label="Average Property Value in Rupees"
                type="number"
                step="500000"
                min="1000000"
                max="100000000"
                value={state.averageDealValueInr}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, averageDealValueInr: parseInt(e.target.value) || 1000000 });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Average Brokerage % */}
          <div className="space-y-1.5 pt-1">
            <label htmlFor="brokerage-pct-input" className="text-xs font-semibold text-slate-700">Average Brokerage Commission (%)</label>
            <input
              id="brokerage-pct-input"
              aria-label="Average Brokerage Commission Percentage"
              type="number"
              step="0.1"
              min="0.5"
              max="10"
              value={state.brokeragePct}
              onChange={(e) => {
                trackUse();
                setState({ ...state, brokeragePct: parseFloat(e.target.value) || 1.0 });
              }}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Right Column: Visualized Leakage Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-rose-400">
                  Calculated Monthly Drain
                </span>
                <h3 className="text-xl font-extrabold font-heading text-white mt-0.5">
                  Pipeline Leakage Summary
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>

            {/* High-Level Leakage Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Total Leaked Inquiries</span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 font-heading">
                  {calculations.totalLeakedLeads} <span className="text-xs font-normal text-slate-400">leads/mo</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  ~{calculations.leakagePct}% of total inbound volume
                </span>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Effective Reachability</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading">
                  {calculations.currentReachabilityPct}%
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  at {state.initialResponseMinutes}m first response
                </span>
              </div>
            </div>

            {/* Detailed Drop-off attribution */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 block">Unreached due to response lag</span>
                <span className="text-lg font-bold text-white font-heading">
                  {calculations.unreachableLeads} <span className="text-xs font-normal text-slate-400">leads/mo</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Buyers contacted competitor</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex justify-between items-center">
                <span className="text-[11px] text-slate-400 block">Lost to Incomplete Cadence</span>
                <span className="text-lg font-bold text-white font-heading">
                  {calculations.coldCadenceLeads} <span className="text-xs font-normal text-slate-400">leads/mo</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">&lt;3 touchpoints before drop</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/solutions/real-estate-lead-follow-up"
                onClick={() => {
                  trackGaEvent("tool_complete", {
                    tool_name: "real_estate_lead_leakage_calculator",
                  });
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-heading flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Explore Automated Follow-Up Workflows</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Model Transparency Box */}
          <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950 font-heading">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Model Methodology &amp; Assumptions</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Calculations apply standard real estate lead decay distributions where contact rate diminishes non-linearly with elapsed response time. All projections represent analytical operational benchmarks, not contractually guaranteed income.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
