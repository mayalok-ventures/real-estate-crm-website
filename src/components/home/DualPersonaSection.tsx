"use client";

import React, { useState } from "react";
import { 
  Building, 
  CheckCircle2, 
  FileBadge, 
  Lock, 
  PieChart, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Users, 
  Wallet 
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function DualPersonaSection() {
  const [activePersona, setActivePersona] = useState<"brokers" | "developers">("brokers");

  return (
    <section 
      id="personas" 
      data-analytics-section="dual_persona"
      className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5 text-cyan-600" />
            Purpose-Built for Indian Real Estate
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored for How Deals Actually Close in India
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Whether you are an independent channel partner brokerage or an enterprise property developer, 
            Sahyak solves your exact operational bottleneck.
          </p>

          {/* Persona Switcher Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm mt-8">
            <button
              onClick={() => setActivePersona("brokers")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activePersona === "brokers"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              For Brokers &amp; Channel Partners
            </button>
            <button
              onClick={() => setActivePersona("developers")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activePersona === "developers"
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building className="w-4 h-4" />
              For Property Developers &amp; Builders
            </button>
          </div>
        </div>

        {/* Persona Content Display */}
        {activePersona === "brokers" ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 lg:p-12 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Agency &amp; Broker OS</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Protect Your HNW Client Book &amp; Double Brokerage Speed
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                  Built to prevent employee client poaching, deliver instantly co-branded brochures, and track commissions across multiple developers.
                </p>
              </div>
              <Link
                href={siteConfig.appSignupUrl}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0077ff] hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0"
              >
                Start Free
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Client Phone Masking</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Junior agents make calls and send WhatsApp messages directly through Sahyak, but buyer phone numbers remain masked to prevent client poaching.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileBadge className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Watermarked PDF Brochures</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1-Click stamp your agency logo, RERA license, and contact details onto builder brochures before sending to buyers via WhatsApp.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Commission Milestone Ledger</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track payout schedules from token advance to agreement signing and registry disbursement across 10+ developer accounts.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Multi-Project Inventory</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search live availability across Godrej, DLF, M3M, and Sobha simultaneously to instantly answer buyer queries on call.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 lg:p-12 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Enterprise Builder Command</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Centralized Multi-Tower Sales &amp; Channel Partner Attribution
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                  Eliminate double bookings, enforce strict 15-minute sales team response SLAs, and automate construction-linked milestone demands.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition-all shrink-0"
              >
                Schedule Real Estate Demo
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Multi-Tower Inventory Lock</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time inventory grid locks units instantly upon token payment. Zero chance of two site managers selling the same corner 3BHK.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">CP Partner Attribution</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Track 200+ channel partners. Automatic first-touch lead registration protects broker attribution and prevents commission disputes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Sales Team SLA Enforcer</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automated re-assignment triggers if a sales executive doesn&apos;t attempt an inbound digital ad lead within 15 minutes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FileBadge className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">CLP Milestone Dispatch</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When Tower B reaches the 14th slab, trigger batch demand letters and WhatsApp payment links to all buyers in 1-click.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
