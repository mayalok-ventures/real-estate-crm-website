"use client";

import React, { useState, useMemo, useRef } from "react";
import { DollarSign, PieChart, Users, Building2, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { trackGaEvent } from "@/lib/gtag";

interface CommissionState {
  dealValueInr: number;
  grossCommissionPct: number;
  agentSplitPct: number;
  teamLeadOverridePct: number;
  deskFeeInr: number;
  includeGst: boolean;
}

export function CommissionCalculator() {
  const hasTrackedUse = useRef(false);
  const trackUse = () => {
    if (!hasTrackedUse.current) {
      hasTrackedUse.current = true;
      trackGaEvent("tool_use", {
        tool_name: "real_estate_commission_calculator",
      });
    }
  };

  const [state, setState] = useState<CommissionState>({
    dealValueInr: 12000000, // 1.2 Crore
    grossCommissionPct: 2.0,
    agentSplitPct: 60.0,
    teamLeadOverridePct: 5.0,
    deskFeeInr: 0,
    includeGst: true,
  });

  const calculations = useMemo(() => {
    // 1. Gross Commission before GST
    const baseGrossCommission = state.dealValueInr * (state.grossCommissionPct / 100);

    // 2. GST handling (18% under Indian GST for real estate brokerage)
    const gstAmount = state.includeGst ? baseGrossCommission * 0.18 : 0;
    const totalInvoiceToBuilder = baseGrossCommission + gstAmount;

    // 3. Pool for distribution (base gross commission)
    const distributablePool = baseGrossCommission;

    // 4. Agent Gross Payout
    const agentGrossPayout = distributablePool * (state.agentSplitPct / 100);
    const agentNetPayout = Math.max(0, agentGrossPayout - state.deskFeeInr);

    // 5. Team Lead Override Payout
    const teamLeadPayout = distributablePool * (state.teamLeadOverridePct / 100);

    // 6. Firm Retained Net
    const firmRetainedNet = Math.max(
      0,
      distributablePool - agentGrossPayout - teamLeadPayout + state.deskFeeInr
    );

    const firmRetainedPct = distributablePool > 0 ? (firmRetainedNet / distributablePool) * 100 : 0;

    return {
      baseGrossCommission,
      gstAmount,
      totalInvoiceToBuilder,
      agentNetPayout,
      teamLeadPayout,
      firmRetainedNet,
      firmRetainedPct: Math.round(firmRetainedPct * 10) / 10,
    };
  }, [state]);

  const formatInr = (num: number) => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-8">
      <div className="p-6 sm:p-8 bg-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-heading">
              <PieChart className="w-3.5 h-3.5" />
              <span>Transparent Brokerage Ledger</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-2 font-heading">
              Real Estate Commission Split &amp; Firm Payout Calculator
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Model transparent payouts for property deals: compute gross developer billing, sales agent splits, manager overrides, and firm net retention with zero hidden formulas.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Distributable Brokerage</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">
              {formatInr(calculations.baseGrossCommission)}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-6 space-y-6">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>1. Deal &amp; Brokerage Agreement Terms</span>
          </h4>

          {/* Deal Value */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Property Transaction Agreement Value</span>
              <span className="font-bold text-slate-900 font-mono">{formatInr(state.dealValueInr)}</span>
            </div>
            <input
              type="range"
              min="2000000"
              max="50000000"
              step="500000"
              value={state.dealValueInr}
              onChange={(e) => {
                trackUse();
                setState({ ...state, dealValueInr: Number(e.target.value) });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹20 Lakhs</span>
              <span>₹1.5 Crore</span>
              <span>₹5.0 Crore</span>
            </div>
          </div>

          {/* Gross Commission % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Gross Builder / Seller Commission Rate</span>
              <span className="font-bold text-slate-900 font-mono">{state.grossCommissionPct}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.25"
              value={state.grossCommissionPct}
              onChange={(e) => {
                trackUse();
                setState({ ...state, grossCommissionPct: Number(e.target.value) });
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.5% (Secondary)</span>
              <span>2.0% (Standard Primary)</span>
              <span>6.0% (Underwritten / Sole Mandate)</span>
            </div>
          </div>

          {/* Agent Split % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Closing Agent Commission Split Ratio</span>
              <span className="font-bold text-emerald-600 font-mono">{state.agentSplitPct}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={state.agentSplitPct}
              onChange={(e) => {
                trackUse();
                setState({ ...state, agentSplitPct: Number(e.target.value) });
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>20% (Junior Agent)</span>
              <span>60% (Senior Closer)</span>
              <span>90% (Independent Desk)</span>
            </div>
          </div>

          {/* Team Lead Override % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-700">
              <span>Team Leader / Sales Manager Override</span>
              <span className="font-bold text-purple-600 font-mono">{state.teamLeadOverridePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={state.teamLeadOverridePct}
              onChange={(e) => setState({ ...state, teamLeadOverridePct: Number(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0% (Direct)</span>
              <span>5% (Standard Hierarchy)</span>
              <span>20% (Director Level)</span>
            </div>
          </div>

          {/* GST Toggle */}
          <div className="pt-2 flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Include 18% GST on Brokerage Invoice</span>
              <span className="text-[11px] text-slate-500">Standard Indian GST compliance on taxable agency services</span>
            </div>
            <input
              type="checkbox"
              checked={state.includeGst}
              onChange={(e) => setState({ ...state, includeGst: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Line-by-Line Financial Statement */}
        <div className="lg:col-span-6 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>2. Line-by-Line Disbursement Ledger</span>
          </h4>

          {/* Breakdown Cards */}
          <div className="space-y-3">
            {/* Agent Payout */}
            <div className="p-4 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wide block">
                  Closing Agent Net Payout ({state.agentSplitPct}%)
                </span>
                <span className="text-xl font-black text-emerald-700 font-heading">
                  {formatInr(calculations.agentNetPayout)}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                Agent Payout
              </span>
            </div>

            {/* Team Lead Override */}
            <div className="p-4 bg-white rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wide block">
                  Team Leader Override ({state.teamLeadOverridePct}%)
                </span>
                <span className="text-xl font-black text-purple-700 font-heading">
                  {formatInr(calculations.teamLeadPayout)}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                Supervisor Override
              </span>
            </div>

            {/* Firm Retained Net */}
            <div className="p-4 bg-white rounded-xl border border-blue-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wide block">
                  Firm Retained Gross Revenue ({calculations.firmRetainedPct}%)
                </span>
                <span className="text-xl font-black text-blue-700 font-heading">
                  {formatInr(calculations.firmRetainedNet)}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Agency Retained
              </span>
            </div>
          </div>

          {/* Tax Breakdown */}
          {state.includeGst && (
            <div className="p-3 bg-white/70 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600">
              <div className="flex justify-between">
                <span>Base Taxable Brokerage:</span>
                <span className="font-mono font-medium">{formatInr(calculations.baseGrossCommission)}</span>
              </div>
              <div className="flex justify-between">
                <span>18% Output GST (CGST + SGST):</span>
                <span className="font-mono font-medium">{formatInr(calculations.gstAmount)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                <span>Total Developer Invoice:</span>
                <span className="font-mono">{formatInr(calculations.totalInvoiceToBuilder)}</span>
              </div>
            </div>
          )}

          {/* Action Link */}
          <div className="pt-2">
            <Link
              href="/industry/real-estate-brokers"
              onClick={() => {
                trackGaEvent("tool_complete", {
                  tool_name: "real_estate_commission_calculator",
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Explore Brokerage CRM Capabilities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-3 bg-slate-100/80 border-t border-slate-200 text-[11px] text-slate-500">
        <strong>Mathematical Ledger Proof:</strong> Distributable Pool ({formatInr(calculations.baseGrossCommission)}) = Agent Share ({formatInr(calculations.agentNetPayout)}) + Supervisor Override ({formatInr(calculations.teamLeadPayout)}) + Agency Net Retention ({formatInr(calculations.firmRetainedNet)}). All calculations execute client-side.
      </div>
    </div>
  );
}
