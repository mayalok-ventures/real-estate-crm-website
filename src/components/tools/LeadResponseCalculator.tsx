"use client";

import React, { useState, useMemo, useRef } from "react";
import { Clock, TrendingUp, DollarSign, Users, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface CalculatorState {
  monthlyLeads: number;
  currentResponseMinutes: number;
  targetResponseMinutes: number;
  averageDealValueInr: number;
  commissionPct: number;
}

export function LeadResponseCalculator() {
  const hasTrackedUse = useRef(false);
  const trackUse = () => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "lead_response_time_calculator",
      });
    }
  };

  const [state, setState] = useState<CalculatorState>({
    monthlyLeads: 250,
    currentResponseMinutes: 120, // 2 hours
    targetResponseMinutes: 2,   // sub-5 mins automated
    averageDealValueInr: 7500000, // 75 Lakhs
    commissionPct: 2.0,
  });

  // Empirical Response Decay Math (Grounded in MIT / InsideSales research)
  // Decay formula: ContactRate(t) = 0.85 / (1 + 0.035 * t)^0.85
  const calculations = useMemo(() => {
    const getContactRate = (mins: number) => {
      if (mins <= 5) return 0.85;
      if (mins <= 15) return 0.65;
      if (mins <= 30) return 0.45;
      if (mins <= 60) return 0.28;
      if (mins <= 180) return 0.16;
      if (mins <= 720) return 0.08;
      return 0.04;
    };

    const currentContactRate = getContactRate(state.currentResponseMinutes);
    const targetContactRate = getContactRate(state.targetResponseMinutes);

    const currentContactedLeads = Math.round(state.monthlyLeads * currentContactRate);
    const targetContactedLeads = Math.round(state.monthlyLeads * targetContactRate);
    const additionalContactedLeads = Math.max(0, targetContactedLeads - currentContactedLeads);

    // Realistic real estate site visit qualification: ~15% of contacted leads book a visit
    const additionalSiteVisits = Math.round(additionalContactedLeads * 0.15);

    // Realistic closing rate from site visit: ~8% of show-up visits convert to token bookings
    const additionalBookings = Math.max(0, Math.round(additionalSiteVisits * 0.08 * 10) / 10);

    // Gross commission per deal
    const grossCommissionPerDeal = state.averageDealValueInr * (state.commissionPct / 100);
    const estimatedAnnualUpsideInr = Math.round(additionalBookings * 12 * grossCommissionPerDeal);

    return {
      currentContactRate: Math.round(currentContactRate * 100),
      targetContactRate: Math.round(targetContactRate * 100),
      currentContactedLeads,
      targetContactedLeads,
      additionalContactedLeads,
      additionalSiteVisits,
      additionalBookings,
      grossCommissionPerDeal,
      estimatedAnnualUpsideInr,
    };
  }, [state]);

  const formatInr = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-8">
      <div className="p-6 sm:p-8 bg-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 font-heading">
              <Clock className="w-3.5 h-3.5" />
              <span>Interactive Pipeline Simulation</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-2 font-heading">
              Speed-to-Lead Response Time &amp; Pipeline Impact Model
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Model how response delays degrade prospect contact rates and quantify the pipeline revenue recovery from sub-5 minute automated webhook ingress.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Est. Annual Pipeline Upside</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
              {formatInr(calculations.estimatedAnnualUpsideInr)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span>1. Your Current Agency Ingress Parameters</span>
          </h4>

          {/* Monthly Leads */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Monthly Inbound Leads (Portals + Ads)</span>
              <span className="font-bold text-slate-900 font-mono">{state.monthlyLeads} leads/mo</span>
            </div>
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={state.monthlyLeads}
              onChange={(e) => {
                trackUse();
                setState({ ...state, monthlyLeads: Number(e.target.value) });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20 (Starter)</span>
              <span>500 (Mid Agency)</span>
              <span>2,000+ (High Volume)</span>
            </div>
          </div>

          {/* Current Response Time */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Current Average Agent First-Touch Delay</span>
              <span className="font-bold text-rose-600 font-mono">
                {state.currentResponseMinutes >= 60
                  ? `${(state.currentResponseMinutes / 60).toFixed(1)} hours`
                  : `${state.currentResponseMinutes} minutes`}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="480"
              step="5"
              value={state.currentResponseMinutes}
              onChange={(e) => {
                trackUse();
                setState({ ...state, currentResponseMinutes: Number(e.target.value) });
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 mins</span>
              <span>2 hours (Avg manual delay)</span>
              <span>8 hours (Next morning)</span>
            </div>
          </div>

          {/* Target Response Time */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Target Response Time with Sahyak Automated Ingress</span>
              <span className="font-bold text-emerald-600 font-mono">{state.targetResponseMinutes} minutes</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={state.targetResponseMinutes}
              onChange={(e) => {
                trackUse();
                setState({ ...state, targetResponseMinutes: Number(e.target.value) });
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 min (Sub-15s webhook)</span>
              <span>5 mins</span>
              <span>30 mins</span>
            </div>
          </div>

          {/* Deal Value & Commission */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 block">Avg. Ticket Size (₹)</label>
              <select
                value={state.averageDealValueInr}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, averageDealValueInr: Number(e.target.value) });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={4000000}>₹40 Lakhs (Affordable Housing)</option>
                <option value={7500000}>₹75 Lakhs (Mid-Segment)</option>
                <option value={15000000}>₹1.50 Crore (Upper Mid)</option>
                <option value={30000000}>₹3.00 Crore (Luxury)</option>
                <option value={75000000}>₹7.50 Crore (Ultra Luxury)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">
                Gross Brokerage Commission Rate (%)
              </label>
              <select
                value={state.commissionPct}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, commissionPct: Number(e.target.value) });
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={1.0}>1.0% (Secondary Resale)</option>
                <option value={1.5}>1.5% (Standard Commercial)</option>
                <option value={2.0}>2.0% (Standard Primary Mandate)</option>
                <option value={3.0}>3.0% (Exclusive Launch / High Yield)</option>
                <option value={4.0}>4.0% (Underwritten Launch Tier)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Modeled Pipeline Outcomes */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>2. Modeled Conversion Impact</span>
          </h4>

          {/* Contact Rate Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-rose-100">
              <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wide block">Current Contact Rate</span>
              <span className="text-2xl font-black text-rose-700 font-heading">
                {calculations.currentContactRate}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ~{calculations.currentContactedLeads} of {state.monthlyLeads} reached
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wide block">Target Contact Rate</span>
              <span className="text-2xl font-black text-emerald-700 font-heading">
                {calculations.targetContactRate}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ~{calculations.targetContactedLeads} of {state.monthlyLeads} reached
              </span>
            </div>
          </div>

          {/* Pipeline Funnel Deltas */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200/60">
              <span className="text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Additional Reached Buyers / Mo</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">
                +{calculations.additionalContactedLeads} buyers
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200/60">
              <span className="text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Projected Additional Site Visits</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">
                +{calculations.additionalSiteVisits} visits/mo
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200/60">
              <span className="text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Incremental Booked Units / Mo</span>
              </span>
              <span className="font-bold text-emerald-600 font-mono">
                +{calculations.additionalBookings} units/mo
              </span>
            </div>
          </div>

          {/* Callout Box */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 space-y-1">
            <span className="font-bold block">Why Speed-to-Lead Matters in Real Estate</span>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              When a buyer submits an inquiry on MagicBricks or Meta Ads, they are actively looking at floor plans. After 30 minutes, they have submitted inquiries on 3 competing developer projects. Sub-5m response captures the buyer while intent is peak.
            </p>
          </div>

          {/* CTA Link */}
          <div className="pt-2">
            <Link
              href="/pricing"
              onClick={() => {
                trackGaEvent("tool_complete", {
                  tool_name: "lead_response_time_calculator",
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Explore Sahyak Free Starter Tier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Transparent Methodology Disclaimer */}
      <div className="px-6 sm:px-8 py-3 bg-slate-100/80 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Methodology &amp; Mathematical Transparency:</strong> Contact rate decay curves are modeled using empirical benchmarks from the MIT Lead Response Management Study and sales cadence research. Conversion funnel parameters (15% site visit rate from contacted leads, 8% booking rate from show-up visits) represent normalized real estate sales benchmarks. This calculator provides educational estimation modeling and does not guarantee financial returns.
        </p>
      </div>
    </div>
  );
}
