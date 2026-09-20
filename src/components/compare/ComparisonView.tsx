"use client";

import React, { useState } from "react";
import { Check, X, Minus, ShieldCheck, AlertCircle, ArrowRight, Table, Layers } from "lucide-react";
import Link from "next/link";

interface ComparisonRow {
  dimension: string;
  traditionalOption: string;
  traditionalDetail: string;
  traditionalFit: "yes" | "partial" | "no";
  crmOption: string;
  crmDetail: string;
  crmFit: "yes" | "partial" | "no";
}

interface ComparisonViewProps {
  title: string;
  subtitle: string;
  comparisonType: "excel" | "whatsapp";
  traditionalLabel: string;
  crmLabel: string;
  rows: ComparisonRow[];
}

export function ComparisonView({
  title,
  subtitle,
  comparisonType,
  traditionalLabel,
  crmLabel,
  rows,
}: ComparisonViewProps) {
  const [filter, setFilter] = useState<"all" | "advantages" | "drawbacks">("all");

  const getStatusBadge = (fit: "yes" | "partial" | "no") => {
    switch (fit) {
      case "yes":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>Supported</span>
          </span>
        );
      case "partial":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <Minus className="w-3 h-3 text-amber-600" />
            <span>Partial / Manual</span>
          </span>
        );
      case "no":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            <span>Not Supported</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden my-8">
      {/* Header */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 font-heading">
          <Table className="w-3.5 h-3.5" />
          <span>Factual Software Architecture Matrix</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-2 font-heading">
          {title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="py-4 px-6 font-bold text-slate-900 uppercase tracking-wider font-heading w-1/4">
                Operational Dimension
              </th>
              <th className="py-4 px-6 font-bold text-slate-700 uppercase tracking-wider font-heading w-3/8 bg-slate-100/50">
                {traditionalLabel}
              </th>
              <th className="py-4 px-6 font-bold text-blue-900 uppercase tracking-wider font-heading w-3/8 bg-blue-50/50">
                {crmLabel} (Sahyak CRM)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900 align-top">
                  <span>{row.dimension}</span>
                </td>
                <td className="py-4 px-6 align-top bg-slate-50/20">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(row.traditionalFit)}
                    <span className="font-semibold text-slate-800">{row.traditionalOption}</span>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px] mt-1">
                    {row.traditionalDetail}
                  </p>
                </td>
                <td className="py-4 px-6 align-top bg-blue-50/10">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusBadge(row.crmFit)}
                    <span className="font-semibold text-blue-950">{row.crmOption}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px] mt-1">
                    {row.crmDetail}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Balanced Summary Banner */}
      <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-600 max-w-xl">
          <strong className="text-slate-900 block font-heading">
            {comparisonType === "excel"
              ? "When to stick with Spreadsheets:"
              : "When to use Personal WhatsApp:"}
          </strong>
          <span>
            {comparisonType === "excel"
              ? "If you are a solo agent working fewer than 20 deals a year with no sales reps, spreadsheets remain the most flexible, zero-cost tool. Move to CRM when managing portal ad spend, junior agents, or multi-tower unit inventory."
              : "Personal WhatsApp is unmatched for informal 1-on-1 friend conversations. For commercial brokerage operations with multiple agents, official Meta Cloud API CRM protects business continuity when staff leave."}
          </span>
        </div>
        <Link
          href="/pricing"
          className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
        >
          <span>Explore Free Starter Tier</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
