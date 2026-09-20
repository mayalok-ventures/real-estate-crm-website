"use client";

import React, { useState, useMemo, useRef } from "react";
import { DollarSign, TrendingUp, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, BarChart3, Scale } from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface RoiCalculatorState {
  teamSize: number;
  monthlyLeads: number;
  currentMonthlyDeals: number;
  averagePropertyValueInr: number;
  brokerageRatePct: number;
  expectedConversionImprovementPct: number;
}

export function CrmRoiCalculator() {
  const hasTrackedUse = useRef(false);
  const trackUse = () => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "real_estate_crm_roi_calculator",
      });
    }
  };

  const [state, setState] = useState<RoiCalculatorState>({
    teamSize: 5,
    monthlyLeads: 200,
    currentMonthlyDeals: 3,
    averagePropertyValueInr: 8500000, // 85 Lakhs
    brokerageRatePct: 2.0,
    expectedConversionImprovementPct: 25, // 25% lift in closed deals
  });

  const calculations = useMemo(() => {
    const grossCommissionPerDeal = state.averagePropertyValueInr * (state.brokerageRatePct / 100);

    // Baseline Metrics
    const baselineMonthlyBrokerage = state.currentMonthlyDeals * grossCommissionPerDeal;
    const baselineAnnualBrokerage = baselineMonthlyBrokerage * 12;

    // Projected Improvement
    const additionalMonthlyDeals = Math.round((state.currentMonthlyDeals * (state.expectedConversionImprovementPct / 100)) * 10) / 10;
    const projectedMonthlyDeals = state.currentMonthlyDeals + additionalMonthlyDeals;
    const projectedMonthlyBrokerage = projectedMonthlyDeals * grossCommissionPerDeal;
    const projectedAnnualBrokerage = projectedMonthlyBrokerage * 12;

    const netAnnualGrossGain = projectedAnnualBrokerage - baselineAnnualBrokerage;

    // SAHYAK Software Cost Modeling
    // 1 user = ₹0 (Starter Free); 2-5 users = ₹1,999/mo (Growth); 6-15 users = ₹4,999/mo (Pro); 16+ = ₹9,999/mo (Enterprise)
    let monthlySoftwareCostInr = 0;
    let tierName = "Starter (Free)";
    if (state.teamSize === 1) {
      monthlySoftwareCostInr = 0;
      tierName = "Starter (Free Tier)";
    } else if (state.teamSize <= 5) {
      monthlySoftwareCostInr = 1999;
      tierName = "Growth Tier (₹1,999/mo)";
    } else if (state.teamSize <= 15) {
      monthlySoftwareCostInr = 4999;
      tierName = "Pro Tier (₹4,999/mo)";
    } else {
      monthlySoftwareCostInr = 9999;
      tierName = "Enterprise Tier (₹9,999/mo)";
    }

    const annualSoftwareCostInr = monthlySoftwareCostInr * 12;
    const netAnnualRoiInr = Math.max(0, netAnnualGrossGain - annualSoftwareCostInr);
    const roiMultiple = annualSoftwareCostInr > 0 ? (netAnnualGrossGain / annualSoftwareCostInr).toFixed(1) : "Infinite";

    return {
      grossCommissionPerDeal,
      baselineMonthlyBrokerage,
      baselineAnnualBrokerage,
      additionalMonthlyDeals,
      projectedMonthlyDeals,
      projectedAnnualBrokerage,
      netAnnualGrossGain,
      tierName,
      monthlySoftwareCostInr,
      annualSoftwareCostInr,
      netAnnualRoiInr,
      roiMultiple,
    };
  }, [state]);

  const formatInr = (num: number) => {
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Team & Pipeline Inputs */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              1. Agency Scale &amp; Deal Parameters
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Provide your current agency headcount, typical closure run-rate, and property values.
            </p>
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="team-size-slider" className="text-slate-700">Active Sales Agents / Users</label>
              <span className="text-blue-600 font-bold">{state.teamSize} users</span>
            </div>
            <input
              id="team-size-slider"
              aria-label="Active Sales Agents or Users"
              type="range"
              min="1"
              max="30"
              step="1"
              value={state.teamSize}
              onChange={(e) => {
                trackUse();
                setState({ ...state, teamSize: parseInt(e.target.value) || 1 });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Solo (1)</span>
              <span>Boutique (5)</span>
              <span>Large Firm (30)</span>
            </div>
          </div>

          {/* Current Monthly Deals */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="deals-slider" className="text-slate-700">Current Closures per Month</label>
              <span className="text-blue-600 font-bold">{state.currentMonthlyDeals} deals/mo</span>
            </div>
            <input
              id="deals-slider"
              aria-label="Current Closures per Month"
              type="range"
              min="1"
              max="25"
              step="1"
              value={state.currentMonthlyDeals}
              onChange={(e) => {
                trackUse();
                setState({ ...state, currentMonthlyDeals: parseInt(e.target.value) || 1 });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 deal</span>
              <span>10 deals</span>
              <span>25 deals</span>
            </div>
          </div>

          {/* Property Value & Brokerage Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="property-val-input" className="text-xs font-semibold text-slate-700">Average Property Price (₹)</label>
              <input
                id="property-val-input"
                aria-label="Average Property Price in Rupees"
                type="number"
                step="500000"
                min="1000000"
                value={state.averagePropertyValueInr}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, averagePropertyValueInr: parseInt(e.target.value) || 1000000 });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="brokerage-rate-input" className="text-xs font-semibold text-slate-700">Brokerage Rate (%)</label>
              <input
                id="brokerage-rate-input"
                aria-label="Brokerage Rate Percentage"
                type="number"
                step="0.25"
                min="0.5"
                max="6"
                value={state.brokerageRatePct}
                onChange={(e) => {
                  trackUse();
                  setState({ ...state, brokerageRatePct: parseFloat(e.target.value) || 1.0 });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Expected Efficiency Improvement */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-semibold">
              <label htmlFor="efficiency-gain-slider" className="text-slate-700">Modeled Pipeline Efficiency Gain</label>
              <span className="text-emerald-600 font-bold">+{state.expectedConversionImprovementPct}% lift</span>
            </div>
            <input
              id="efficiency-gain-slider"
              aria-label="Modeled Pipeline Efficiency Gain Percentage"
              type="range"
              min="5"
              max="50"
              step="5"
              value={state.expectedConversionImprovementPct}
              onChange={(e) => {
                trackUse();
                setState({ ...state, expectedConversionImprovementPct: parseInt(e.target.value) || 5 });
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Conservative (+5%)</span>
              <span>Standard (+25%)</span>
              <span>Aggressive (+50%)</span>
            </div>
          </div>
        </div>

        {/* Right Column: ROI Model Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-semibold uppercase text-emerald-400">
                  Annual Return Projections
                </span>
                <h3 className="text-xl font-extrabold font-heading text-white mt-0.5">
                  Investment vs. Upside
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            {/* High-Level ROI Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Net Commission Gain</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
                  {formatInr(calculations.netAnnualGrossGain)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  +{calculations.additionalMonthlyDeals} extra deals/mo
                </span>
              </div>
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <span className="text-xs text-slate-400 block">Annual Software Cost</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-heading">
                  {formatInr(calculations.annualSoftwareCostInr)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  for {state.teamSize} active seats
                </span>
              </div>
            </div>

            {/* Software Cost & Payback Ratio */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block">Required Sahyak CRM Plan:</span>
                <strong className="text-white font-heading">{calculations.tierName}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block">Estimated ROI Multiple:</span>
                <strong className="text-emerald-400 font-heading text-sm">{calculations.roiMultiple}x</strong>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/pricing"
                onClick={() => {
                  trackGaEvent("tool_complete", {
                    tool_name: "real_estate_crm_roi_calculator",
                  });
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-heading flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>View Transparent Tier Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Model Transparency */}
          <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-700 space-y-1.5 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 font-heading">
              <Scale className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Model Assumptions &amp; Scope</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Calculations assume additional deal flow is generated via automated sub-15s webhook response, structured unit inventory locking, and unified multi-touch follow-ups. Results reflect mathematical estimates and do not guarantee deal closures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
