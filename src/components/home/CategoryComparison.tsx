"use client";

import React from "react";
import { Check, X, Sparkles } from "lucide-react";

interface ComparisonRow {
  feature: string;
  sahyak: string | boolean;
  spreadsheets: string | boolean;
  legacyCrm: string | boolean;
  highlight?: boolean;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Setup & Go-Live Time",
    sahyak: "5 Minutes",
    spreadsheets: "Immediate",
    legacyCrm: "3 - 6 Months",
    highlight: true
  },
  {
    feature: "Native Indian WhatsApp Floor Plan Delivery",
    sahyak: true,
    spreadsheets: false,
    legacyCrm: "Requires costly 3rd-party plugins"
  },
  {
    feature: "Speed-to-Lead Automation (<15s)",
    sahyak: true,
    spreadsheets: false,
    legacyCrm: "Complex workflow config"
  },
  {
    feature: "Site Visit Logistics & GPS Pins",
    sahyak: true,
    spreadsheets: false,
    legacyCrm: false
  },
  {
    feature: "Voice Note Field Logging (Hinglish/Hindi)",
    sahyak: true,
    spreadsheets: false,
    legacyCrm: false,
    highlight: true
  },
  {
    feature: "Multi-Tower Inventory & Unit Lock Matrix",
    sahyak: true,
    spreadsheets: "Prone to duplicate sales",
    legacyCrm: "Requires custom database dev"
  },
  {
    feature: "Client Phone Number Masking (Anti-Poaching)",
    sahyak: true,
    spreadsheets: false,
    legacyCrm: "Expensive add-on"
  },
  {
    feature: "Cost Structure",
    sahyak: "Free Starter (20 Leads), then ₹1,499/mo",
    spreadsheets: "Free (but loses ₹Lakhs in leads)",
    legacyCrm: "₹8,000 - ₹25,000 / seat / mo"
  }
];

export default function CategoryComparison() {
  return (
    <section 
      id="comparison" 
      data-analytics-section="category_comparison"
      className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Clear Architectural Advantage
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Generic Tools Fail in Real Estate
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Spreadsheets can&apos;t send WhatsApp floor plans at 10 PM. 
            Legacy enterprise CRMs take 6 months of consulting to configure. Sahyak is live in 5 minutes.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-5 sm:p-6 text-sm font-extrabold text-slate-900 w-2/5">
                    Operational Capability
                  </th>
                  <th className="p-5 sm:p-6 text-sm font-extrabold text-cyan-700 bg-cyan-50/50 w-1/5 border-x border-cyan-100 text-center">
                    <span className="block text-base text-slate-900">Sahyak CRM</span>
                    <span className="text-[11px] font-normal text-cyan-600">Real Estate First</span>
                  </th>
                  <th className="p-5 sm:p-6 text-sm font-semibold text-slate-600 w-1/5 text-center">
                    <span className="block text-slate-800">Excel / Google Sheets</span>
                    <span className="text-[11px] font-normal text-slate-400">Manual Spreadsheets</span>
                  </th>
                  <th className="p-5 sm:p-6 text-sm font-semibold text-slate-600 w-1/5 text-center">
                    <span className="block text-slate-800">Legacy Enterprise CRM</span>
                    <span className="text-[11px] font-normal text-slate-400">Salesforce / HubSpot</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {COMPARISON_DATA.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      row.highlight ? "bg-cyan-50/20" : ""
                    }`}
                  >
                    <td className="p-5 sm:p-6 font-semibold text-slate-800">
                      {row.feature}
                    </td>

                    {/* Sahyak Column */}
                    <td className="p-5 sm:p-6 bg-cyan-50/30 border-x border-cyan-100/60 font-bold text-slate-900 text-center">
                      {typeof row.sahyak === "boolean" ? (
                        row.sahyak ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 mx-auto">
                            <X className="w-4 h-4" />
                          </div>
                        )
                      ) : (
                        <span className="text-cyan-800 font-bold">{row.sahyak}</span>
                      )}
                    </td>

                    {/* Spreadsheets Column */}
                    <td className="p-5 sm:p-6 text-slate-500 text-center">
                      {typeof row.spreadsheets === "boolean" ? (
                        row.spreadsheets ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 mx-auto">
                            <X className="w-4 h-4" />
                          </div>
                        )
                      ) : (
                        <span>{row.spreadsheets}</span>
                      )}
                    </td>

                    {/* Legacy CRM Column */}
                    <td className="p-5 sm:p-6 text-slate-500 text-center">
                      {typeof row.legacyCrm === "boolean" ? (
                        row.legacyCrm ? (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 mx-auto">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400 mx-auto">
                            <X className="w-4 h-4" />
                          </div>
                        )
                      ) : (
                        <span>{row.legacyCrm}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
