import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { siteConfig } from "@/lib/config";

export function GlobalFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 text-slate-600 font-sans text-xs">
      {/* Live Operational Telemetry Strip */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Platform Status: Operational
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">WhatsApp Cloud API Ready</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline">Cloudflare Edge Security Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
            <span>Free Tier: 20 Leads Included</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Real Estate Narrative */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm border border-slate-200/80 bg-white flex items-center justify-center">
                <Image
                  src="/android-chrome-192x192.png"
                  alt="Sahyak CRM Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight font-heading">
                Sahyak<span className="text-slate-400 font-normal text-xs ml-0.5">crm</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
              The serious CRM engineered around how real estate sales actually work. Stop lead leakage from property inquiries to WhatsApp follow-ups, site visits, and booked units.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                <Building2 className="w-3 h-3 text-[#0077ff]" />
                <span>Real Estate First GTM</span>
              </span>
            </div>
          </div>

          {/* Real Estate Sales Engine */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Real Estate Sales Engine
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/features" className="text-slate-500 hover:text-slate-900 transition-colors">
                  All Real Estate Features
                </Link>
              </li>
              <li>
                <Link href="/features#whatsapp" className="text-slate-500 hover:text-slate-900 transition-colors">
                  1-Tap WhatsApp Proposals
                </Link>
              </li>
              <li>
                <Link href="/features#site-visits" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Site Visit Coordination
                </Link>
              </li>
              <li>
                <Link href="/features#inventory" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Unit Inventory & BHK Matching
                </Link>
              </li>
              <li>
                <Link href="/features#platform" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Modular Platform Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Plans & Pricing */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Plans & Pricing
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/pricing" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Free Starter (20 Leads)
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Base Plan (₹499/mo)
                </Link>
              </li>
              <li>
                <Link href="/pricing#calculator" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Capacity Add-on Calculator
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Sales Blueprints &amp; Playbooks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Schedule Real Estate Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-heading">
              Trust & Company
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/security" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Data Security & RBAC Isolation
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-500 hover:text-slate-900 transition-colors">
                  About Sahyak & Mission
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Privacy Policy (DPDP Aligned)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.whatsappSalesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Sales on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Legal Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {siteConfig.legal.companyName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-700 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-700 transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-slate-700 transition-colors">
              Security
            </Link>
            <Link href="/contact" className="hover:text-slate-700 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
