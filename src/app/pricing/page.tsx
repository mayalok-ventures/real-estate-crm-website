"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal,
  Building2,
  Zap,
  Users,
  Database,
  HardDrive,
  Layers,
  MessageSquare,
  FileSpreadsheet
} from "lucide-react";
import { trackGaEvent } from "@/lib/gtag";
import { 
  siteConfig, 
  pricingConfig, 
  USER_TIERS, 
  LEAD_TIERS, 
  STORAGE_TIERS, 
  INTEGRATION_TIERS 
} from "@/lib/config";
import { formatINR } from "@/lib/utils";
import {
  SupportedCurrency,
  SUPPORTED_CURRENCIES,
  FALLBACK_INR_RATES,
  convertInrToTarget,
  formatDisplayCurrency,
  detectCurrency
} from "@/lib/currency";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  const [currency, setCurrency] = useState<SupportedCurrency>("INR");
  const [rates, setRates] = useState<Record<SupportedCurrency, number>>(FALLBACK_INR_RATES);

  // Auto-detect currency on mount or load persisted preference
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sahyak_currency") as SupportedCurrency | null;
      if (saved && SUPPORTED_CURRENCIES[saved]) {
        setCurrency(saved);
      } else if (typeof navigator !== "undefined") {
        const detected = detectCurrency(navigator.language);
        setCurrency(detected);
      }
    } catch {}

    // Fetch live cached exchange rates
    fetch("/api/currency")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates) {
          setRates(data.rates);
        }
      })
      .catch(() => {});
  }, []);

  // Track pricing_view interaction
  useEffect(() => {
    trackGaEvent("pricing_view", {
      billing_cycle: isAnnual ? "annual" : "monthly",
      currency: currency,
      page_location: typeof window !== "undefined" ? window.location.href : "",
    });
  }, [isAnnual, currency]);

  const handleCurrencyChange = (cur: SupportedCurrency) => {
    setCurrency(cur);
    try {
      window.localStorage.setItem("sahyak_currency", cur);
    } catch {}
  };

  // Tier Index States
  const [userTierIndex, setUserTierIndex] = useState<number>(0);
  const [leadTierIndex, setLeadTierIndex] = useState<number>(0);
  const [storageTierIndex, setStorageTierIndex] = useState<number>(0);
  const [integrationTierIndex, setIntegrationTierIndex] = useState<number>(0);

  // Calculate pricing using canonical tiered logic
  const calcResult = useMemo(() => {
    return pricingConfig.calculatePlanPrice({
      userTierIndex,
      leadTierIndex,
      storageTierIndex,
      integrationTierIndex,
      isAnnual,
    });
  }, [userTierIndex, leadTierIndex, storageTierIndex, integrationTierIndex, isAnnual]);

  const { freeStarter, basePlan } = pricingConfig;

  // Formatted price strings
  const formattedEffectivePrice = useMemo(() => {
    if (calcResult.isCustomPlan) return "Custom";
    if (currency === "INR") return formatINR(calcResult.effectiveMonthly);
    const converted = convertInrToTarget(calcResult.effectiveMonthly, currency, rates);
    return formatDisplayCurrency(converted, currency);
  }, [calcResult, currency, rates]);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO: The Interactive Capacity Configurator */}
      <section className="pt-16 pb-20 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Copy */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-[#0077ff] text-xs font-semibold mb-4">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Pay for Capacity, Not Locked Features</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight font-heading leading-tight break-words">
              Base Access at {currency === "INR" ? "₹499" : `${formatDisplayCurrency(convertInrToTarget(499, currency, rates), currency)} (~₹499)`}. <span className="brand-gradient-text">Configure your scale.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
              Every feature, pipeline tool, and WhatsApp hub is included from Day 1. Select the exact user and data capacity your sales floor needs.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 max-w-full">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    !isAnnual
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                    isAnnual
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span>Annual Commitment</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/30">
                    10% Discount
                  </span>
                </button>
              </div>

              {/* Display Currency Switcher */}
              <div className="inline-flex flex-wrap justify-center items-center gap-1 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-mono max-w-full">
                {(["INR", "USD", "GBP", "EUR", "AED"] as SupportedCurrency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => handleCurrencyChange(cur)}
                    className={`px-2 sm:px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      currency === cur
                        ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/80"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={`Display in ${SUPPORTED_CURRENCIES[cur].name}`}
                  >
                    <span className="mr-1">{SUPPORTED_CURRENCIES[cur].flag}</span>
                    <span>{cur}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* THE CONFIGURATOR HERO BOX */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: 4 Tier Selectors */}
              <div className="lg:col-span-7 p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 bg-slate-50/40 border-b lg:border-b-0 lg:border-r border-slate-200">
                
                {/* 1. User Capacity Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Users className="w-4 h-4 text-[#0077ff]" />
                      <span>Sales Team Users</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0077ff]">
                      {calcResult.selectedUserTier.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {USER_TIERS.slice(0, 6).map((tier, idx) => (
                      <button
                        key={tier.label}
                        onClick={() => setUserTierIndex(idx)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                          userTierIndex === idx
                            ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="truncate">{tier.value} {tier.value === 1 ? "User" : "Users"}</div>
                        <div className={`text-[10px] ${userTierIndex === idx ? "text-cyan-400" : "text-slate-400"}`}>
                          {tier.priceMonthly === 0 ? "Included" : `+₹${tier.priceMonthly.toLocaleString("en-IN")}`}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setUserTierIndex(6)}
                      className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                        userTierIndex === 6
                          ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div>100+</div>
                      <div className={`text-[10px] ${userTierIndex === 6 ? "text-cyan-400" : "text-slate-400"}`}>
                        Custom
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Lead Capacity Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Stored Active Leads</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {calcResult.selectedLeadTier.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {LEAD_TIERS.slice(0, 7).map((tier, idx) => (
                      <button
                        key={tier.label}
                        onClick={() => setLeadTierIndex(idx)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                          leadTierIndex === idx
                            ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="truncate">{tier.value >= 1000 ? `${tier.value / 1000}K` : tier.value} Leads</div>
                        <div className={`text-[10px] ${leadTierIndex === idx ? "text-cyan-400" : "text-slate-400"}`}>
                          {tier.priceMonthly === 0 ? "Included" : `+₹${tier.priceMonthly.toLocaleString("en-IN")}`}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setLeadTierIndex(7)}
                      className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                        leadTierIndex === 7
                          ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div>500K+</div>
                      <div className={`text-[10px] ${leadTierIndex === 7 ? "text-cyan-400" : "text-slate-400"}`}>
                        Custom
                      </div>
                    </button>
                  </div>
                </div>

                {/* 3. Document Storage Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <HardDrive className="w-4 h-4 text-purple-600" />
                      <span>Document &amp; Media Storage</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-600">
                      {calcResult.selectedStorageTier.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STORAGE_TIERS.slice(0, 6).map((tier, idx) => (
                      <button
                        key={tier.label}
                        onClick={() => setStorageTierIndex(idx)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                          storageTierIndex === idx
                            ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="truncate">{tier.value} GB</div>
                        <div className={`text-[10px] ${storageTierIndex === idx ? "text-cyan-400" : "text-slate-400"}`}>
                          {tier.priceMonthly === 0 ? "Included" : `+₹${tier.priceMonthly.toLocaleString("en-IN")}`}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => setStorageTierIndex(6)}
                      className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                        storageTierIndex === 6
                          ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                          : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                      }`}
                    >
                      <div>500GB+</div>
                      <div className={`text-[10px] ${storageTierIndex === 6 ? "text-cyan-400" : "text-slate-400"}`}>
                        Custom
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Connected Platforms Tier */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                      <Layers className="w-4 h-4 text-amber-600" />
                      <span>Connected Platforms &amp; Integrations</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-600">
                      {calcResult.selectedIntegrationTier.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pay according to the number of external platforms/services you connect.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {INTEGRATION_TIERS.map((tier, idx) => (
                      <button
                        key={tier.label}
                        onClick={() => setIntegrationTierIndex(idx)}
                        className={`p-2.5 rounded-xl text-xs font-mono transition-all text-center cursor-pointer border ${
                          integrationTierIndex === idx
                            ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 border-slate-200"
                        }`}
                      >
                        <div className="truncate">{tier.label.split(" (")[0]}</div>
                        <div className={`text-[10px] ${integrationTierIndex === idx ? "text-cyan-400" : "text-slate-400"}`}>
                          {tier.isCustom ? "Custom" : tier.priceMonthly === 0 ? "CSV Included" : `+₹${tier.priceMonthly.toLocaleString("en-IN")}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Live Itemized Cost Breakdown */}
              <div className="lg:col-span-5 p-4 sm:p-6 lg:p-10 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-6">
                  {/* Real Estate Scale Context Visual */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] sm:aspect-[21/9] shadow-inner">
                    <Image
                      src="/images/skyline-residences-luxury-tower.jpg"
                      alt="High-rise real estate development portfolio capacity"
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover object-center brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex items-end p-3">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                          Portfolio Capacity
                        </span>
                        <span className="text-[10px] font-mono text-slate-300">
                          Scales with your inventory
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Live Subscription Breakdown
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Sahyak Commercials
                    </h3>
                  </div>

                  {/* Itemized Line Items */}
                  <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-100 py-4">
                    <div className="flex justify-between items-start gap-2">
                      <span>Base Plan Access (1 User, 2k Leads, 5GB):</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {currency === "INR" ? "₹499 / mo" : `${formatDisplayCurrency(convertInrToTarget(499, currency, rates), currency)} / mo (~₹499)`}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span>User Capacity ({calcResult.selectedUserTier.label}):</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {calcResult.selectedUserTier.priceMonthly === 0
                          ? "Included"
                          : currency === "INR"
                          ? `+₹${calcResult.selectedUserTier.priceMonthly.toLocaleString("en-IN")}`
                          : `+${formatDisplayCurrency(convertInrToTarget(calcResult.selectedUserTier.priceMonthly, currency, rates), currency)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span>Lead Storage ({calcResult.selectedLeadTier.label}):</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {calcResult.selectedLeadTier.priceMonthly === 0
                          ? "Included"
                          : currency === "INR"
                          ? `+₹${calcResult.selectedLeadTier.priceMonthly.toLocaleString("en-IN")}`
                          : `+${formatDisplayCurrency(convertInrToTarget(calcResult.selectedLeadTier.priceMonthly, currency, rates), currency)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span>Document Storage ({calcResult.selectedStorageTier.label}):</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {calcResult.selectedStorageTier.priceMonthly === 0
                          ? "Included"
                          : currency === "INR"
                          ? `+₹${calcResult.selectedStorageTier.priceMonthly.toLocaleString("en-IN")}`
                          : `+${formatDisplayCurrency(convertInrToTarget(calcResult.selectedStorageTier.priceMonthly, currency, rates), currency)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span>Platform Integrations ({calcResult.selectedIntegrationTier.label}):</span>
                      <span className="font-mono font-bold text-slate-900 shrink-0">
                        {calcResult.selectedIntegrationTier.priceMonthly === 0
                          ? "Included"
                          : currency === "INR"
                          ? `+₹${calcResult.selectedIntegrationTier.priceMonthly.toLocaleString("en-IN")}`
                          : `+${formatDisplayCurrency(convertInrToTarget(calcResult.selectedIntegrationTier.priceMonthly, currency, rates), currency)}`}
                      </span>
                    </div>
                  </div>

                  {/* Effective Rate Display */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-slate-500 font-medium block">
                      {isAnnual ? "Effective Monthly (Billed Annually at 10% Off):" : "Monthly Billing:"}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight font-heading">
                        {formattedEffectivePrice}
                      </span>
                      {!calcResult.isCustomPlan && (
                        <span className="text-slate-500 text-sm font-medium">/ month</span>
                      )}
                    </div>
                    {currency !== "INR" && !calcResult.isCustomPlan && (
                      <div className="text-xs text-slate-500 font-mono">
                        Authoritative billing: {formatINR(calcResult.effectiveMonthly)} / month
                      </div>
                    )}
                    {isAnnual && !calcResult.isCustomPlan && (
                      <div className="text-xs text-emerald-700 font-semibold pt-1">
                        Saves {currency === "INR" ? formatINR(calcResult.annualSavings) : `${formatDisplayCurrency(convertInrToTarget(calcResult.annualSavings, currency, rates), currency)} (~${formatINR(calcResult.annualSavings)})`} per year with annual commitment
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="space-y-3 pt-2">
                  <Link
                    href={siteConfig.appSignupUrl}
                    className="btn-pill-brand text-white text-sm py-4 px-8 font-bold flex items-center justify-center gap-2 w-full shadow-lg shadow-blue-500/20"
                  >
                    <span>{calcResult.isCustomPlan ? "Contact Enterprise Sales" : "Start Base Plan"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] text-slate-400 text-center font-mono">
                    No setup fees &middot; Transparent billing &middot; GST invoice available
                  </p>
                  {currency !== "INR" && (
                    <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
                      <span className="font-bold">Transparent Billing Notice:</span> Displayed prices are converted for reference. Subscription billing and invoices are processed in INR.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. Free Starter Tier & Base Inclusions Grid */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Free Starter Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                EVALUATION TIER
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Free Starter &middot; ₹0
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Test Sahyak with 20 active leads, 1 user seat, 10 WhatsApp actions, and 3 properties. No credit card required.
              </p>
            </div>
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-secondary text-xs sm:text-sm py-3 px-6 font-bold shrink-0 w-full md:w-auto text-center"
            >
              Start Free
            </Link>
          </div>

          {/* Full List of Base Access Inclusions */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
                Everything Included in Base Access (₹499)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We do not lock core CRM features behind high enterprise paywalls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {basePlan.inclusions.map((feature) => (
                <div 
                  key={feature}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-2.5"
                >
                  <Check className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Commercial FAQ Callout */}
          <div className="p-6 rounded-3xl bg-blue-50/60 border border-blue-100 text-xs text-slate-700 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0077ff]" />
              Transparent Commercial Policy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] leading-relaxed">
              <p>
                <strong>WhatsApp Hub:</strong> WhatsApp integration is included without a separate SAHYAK per-message charge. External Meta/WhatsApp Business API or provider charges, where applicable, remain separate.
              </p>
              <p>
                <strong>GST &amp; Invoicing:</strong> GST invoices are issued for eligible transactions. Input tax credit, where applicable, depends on the customer&apos;s tax eligibility.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
