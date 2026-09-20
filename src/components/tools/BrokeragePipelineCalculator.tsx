"use client";

import React, { useState, useMemo, useRef } from "react";
import { 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  Layers, 
  Percent, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface PipelineState {
  monthlyInquiries: number;
  inquiryToVisitPct: number;
  visitToNegotiationPct: number;
  negotiationToBookingPct: number;
  averagePropertyValueInr: number;
  brokerageCommissionPct: number;
  salesCycleDays: number;
}

export function BrokeragePipelineCalculator() {
  const hasTrackedUse = useRef(false);
  const trackUse = () => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "brokerage_pipeline_calculator",
      });
    }
  };

  const [state, setState] = useState<PipelineState>({
    monthlyInquiries: 300,
    inquiryToVisitPct: 22,
    visitToNegotiationPct: 28,
    negotiationToBookingPct: 35,
    averagePropertyValueInr: 8500000, // 85 Lakhs
    brokerageCommissionPct: 2.0,
    salesCycleDays: 45,
  });

  const calculations = useMemo(() => {
    // 1. Funnel Stages Count
    const siteVisits = Math.round(state.monthlyInquiries * (state.inquiryToVisitPct / 100));
    const negotiations = Math.round(siteVisits * (state.visitToNegotiationPct / 100));
    const closedDeals = Math.round((negotiations * (state.negotiationToBookingPct / 100)) * 10) / 10;

    // Overall inquiry-to-close win rate
    const overallConversionPct = state.monthlyInquiries > 0
      ? (closedDeals / state.monthlyInquiries) * 100
      : 0;

    // 2. Financials
    const grossCommissionPerDeal = state.averagePropertyValueInr * (state.brokerageCommissionPct / 100);
    const monthlyGrossRevenueInr = closedDeals * grossCommissionPerDeal;
    const annualGrossRevenueInr = monthlyGrossRevenueInr * 12;
    const monthlyInventoryGmvInr = closedDeals * state.averagePropertyValueInr;

    // 3. Pipeline Velocity Formula:
    // Velocity (INR / day) = (Active Opportunities * Win Rate * Deal Value) / Sales Cycle Days
    // In our context: (Site Visits * Negotiation-to-Close Rate * Commission) / Cycle Days
    const activePipelineValue = siteVisits * grossCommissionPerDeal;
    const dailyPipelineVelocityInr = state.salesCycleDays > 0
      ? (siteVisits * (state.negotiationToBookingPct / 100) * grossCommissionPerDeal) / state.salesCycleDays
      : 0;

    // 4. Accelerated Pipeline (Automated Cadence benchmark: -15 days cycle time, +15% visit rate)
    const acceleratedDays = Math.max(15, state.salesCycleDays - 15);
    const acceleratedVisits = Math.round(state.monthlyInquiries * Math.min(0.40, (state.inquiryToVisitPct * 1.15) / 100));
    const acceleratedNegotiations = Math.round(acceleratedVisits * (state.visitToNegotiationPct / 100));
    const acceleratedClosedDeals = Math.round((acceleratedNegotiations * (state.negotiationToBookingPct / 100)) * 10) / 10;
    const acceleratedMonthlyGrossInr = acceleratedClosedDeals * grossCommissionPerDeal;
    const incrementalMonthlyGainInr = Math.max(0, acceleratedMonthlyGrossInr - monthlyGrossRevenueInr);
    const velocityLiftPct = monthlyGrossRevenueInr > 0
      ? ((incrementalMonthlyGainInr / monthlyGrossRevenueInr) * 100).toFixed(1)
      : "0";

    // Format INR helper
    const formatInr = (num: number) => {
      if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
      if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
      return `₹${Math.round(num).toLocaleString("en-IN")}`;
    };

    return {
      siteVisits,
      negotiations,
      closedDeals,
      overallConversionPct: overallConversionPct.toFixed(2),
      grossCommissionPerDeal,
      monthlyGrossRevenueInr,
      annualGrossRevenueInr,
      monthlyInventoryGmvInr,
      activePipelineValue,
      dailyPipelineVelocityInr,
      acceleratedDays,
      acceleratedClosedDeals,
      acceleratedMonthlyGrossInr,
      incrementalMonthlyGainInr,
      velocityLiftPct,
      formatInr,
    };
  }, [state]);

  const handleChange = (field: keyof PipelineState, value: number) => {
    trackUse();
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-10">
      {/* Interactive Inputs & Live Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                Sales Funnel Parameters
              </h2>
              <p className="text-xs text-slate-500">
                Adjust inquiry volume, conversion stages, ticket sizes, and average cycle duration.
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Monthly Inquiries */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Monthly Inquiries (Portals + Campaigns + Walk-ins)
              </label>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {state.monthlyInquiries} leads/mo
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="25"
              value={state.monthlyInquiries}
              onChange={(e) => handleChange("monthlyInquiries", parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>50 leads</span>
              <span>750 leads</span>
              <span>1,500 leads</span>
            </div>
          </div>

          {/* Inquiry to Site Visit Conversion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-indigo-600" />
                Inquiry ➔ Site Visit Rate (%)
              </label>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {state.inquiryToVisitPct}% ({calculations.siteVisits} visits)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={state.inquiryToVisitPct}
              onChange={(e) => handleChange("inquiryToVisitPct", parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>5% (Slow manual outreach)</span>
              <span>22% (Industry Average)</span>
              <span>50% (Instant WhatsApp cadence)</span>
            </div>
          </div>

          {/* Site Visit to Active Negotiation Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-violet-600" />
                Site Visit ➔ Offer / Negotiation Rate (%)
              </label>
              <span className="font-mono font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                {state.visitToNegotiationPct}% ({calculations.negotiations} active offers)
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={state.visitToNegotiationPct}
              onChange={(e) => handleChange("visitToNegotiationPct", parseInt(e.target.value, 10))}
              className="w-full accent-violet-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Weak qualification)</span>
              <span>28% (Typical)</span>
              <span>60% (High-intent inventory matching)</span>
            </div>
          </div>

          {/* Negotiation to Booking Close Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Negotiation ➔ Token / Booking Close Rate (%)
              </label>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {state.negotiationToBookingPct}% ({calculations.closedDeals} deals/mo)
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              step="5"
              value={state.negotiationToBookingPct}
              onChange={(e) => handleChange("negotiationToBookingPct", parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% (Heavy token attrition)</span>
              <span>35% (Standard)</span>
              <span>70% (Locked payment milestones)</span>
            </div>
          </div>

          {/* Property Ticket Size & Commission Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Avg Property Ticket Value
              </label>
              <select
                value={state.averagePropertyValueInr}
                onChange={(e) => handleChange("averagePropertyValueInr", parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={4500000}>₹45 Lakhs (Affordable Housing)</option>
                <option value={6500000}>₹65 Lakhs (Mid-Income 2BHK)</option>
                <option value={8500000}>₹85 Lakhs (Prime Mid-Segment)</option>
                <option value={15000000}>₹1.50 Crore (Premium 3BHK)</option>
                <option value={30000000}>₹3.00 Crore (Luxury Condos)</option>
                <option value={75000000}>₹7.50 Crore (Ultra-Luxury / Villas)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-slate-400" />
                Brokerage Fee Rate (%)
              </label>
              <select
                value={state.brokerageCommissionPct}
                onChange={(e) => handleChange("brokerageCommissionPct", parseFloat(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1.0}>1.0% (Resale Standard)</option>
                <option value={1.5}>1.5% (Secondary Market)</option>
                <option value={2.0}>2.0% (Primary Direct Mandate)</option>
                <option value={2.5}>2.5% (Sole Selling Partner)</option>
                <option value={3.0}>3.0% (Exclusive Launch Mandate)</option>
                <option value={4.0}>4.0% (Luxury Developer Outlier)</option>
              </select>
            </div>
          </div>

          {/* Average Sales Cycle Days */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Average Sales Cycle Duration (Inquiry to Token)
              </label>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                {state.salesCycleDays} days
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="120"
              step="5"
              value={state.salesCycleDays}
              onChange={(e) => handleChange("salesCycleDays", parseInt(e.target.value, 10))}
              className="w-full accent-amber-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>15 days (Fast impulse)</span>
              <span>45 days (Standard residential)</span>
              <span>120 days (High-ticket luxury)</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Primary Revenue Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-heading">
                Pipeline Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Win Rate: {calculations.overallConversionPct}%
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 block font-heading">
                Projected Monthly Brokerage Commission
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400 font-mono">
                {calculations.formatInr(calculations.monthlyGrossRevenueInr)}
                <span className="text-xs text-slate-400 font-normal"> /mo</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Annual Run-Rate: <span className="font-mono text-slate-200 font-semibold">{calculations.formatInr(calculations.annualGrossRevenueInr)}</span> from {calculations.closedDeals} closures/mo.
              </p>
            </div>

            {/* Stage Flow Breakdown */}
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
                Monthly Funnel Stage Flow
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 block">Inquiries</span>
                  <span className="font-mono font-bold text-white text-sm">{state.monthlyInquiries}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 block">Visits</span>
                  <span className="font-mono font-bold text-indigo-400 text-sm">{calculations.siteVisits}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/40">
                  <span className="text-[10px] text-slate-400 block">Offers</span>
                  <span className="font-mono font-bold text-violet-400 text-sm">{calculations.negotiations}</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 block">Deals</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{calculations.closedDeals}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Velocity Metric */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Daily Pipeline Velocity:</span>
                <span className="font-mono font-bold text-amber-400">
                  {calculations.formatInr(calculations.dailyPipelineVelocityInr)} / day
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Monthly Inventory Value Closed:</span>
                <span className="font-mono font-bold text-slate-200">
                  {calculations.formatInr(calculations.monthlyInventoryGmvInr)} GMV
                </span>
              </div>
            </div>
          </div>

          {/* Sahyak Velocity Acceleration Impact */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Sahyak CRM Automation Advantage</span>
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed">
              By shrinking response lag below 15s and orchestrating automated WhatsApp site visit reminders, typical brokerages compress cycle length to <strong>{calculations.acceleratedDays} days</strong> and lift closures to <strong>{calculations.acceleratedClosedDeals} deals/mo</strong>.
            </p>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                <span>Incremental Commission Gain:</span>
                <span className="font-mono text-emerald-700 text-sm font-extrabold">
                  +{calculations.formatInr(calculations.incrementalMonthlyGainInr)}/mo
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Pipeline Velocity Lift:</span>
                <span className="font-mono font-bold text-emerald-600">+{calculations.velocityLiftPct}%</span>
              </div>
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-xs font-extrabold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-md hover:shadow-lg"
            >
              <span>Accelerate Your Sales Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
