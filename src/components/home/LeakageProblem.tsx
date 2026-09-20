"use client";

import React, { useState } from "react";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  MessageSquare, 
  ShieldAlert, 
  Zap,
  ArrowRight,
  UserX,
  CalendarX,
  Compass
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export default function LeakageProblem() {
  return (
    <section 
      id="problem" 
      data-analytics-section="leakage_problem"
      className="py-20 sm:py-24 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>The Reality of Property Sales</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            When Leads Fall Through the Cracks, Deals Disappear.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A buyer inquires on an ad or property portal. If they don&apos;t receive a floor plan while their interest is hot, they move on to the next project. Spreadsheets, memory, and buried personal chats cannot keep pace.
          </p>
        </div>

        {/* 4 Real World Bottlenecks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Delayed Ingestion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Portal inquiries sit in email inboxes or CSV exports until someone downloads and manually distributes them hours later.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Buried WhatsApp Chats</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Brochures and floor plans get sent from personal phone numbers. When an agent is busy on site, buyer inquiries go cold.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <CalendarX className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Show-Flat No-Shows</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Site visits are scheduled verbally without calendar invites, driving directions, or automated morning-of reminders.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <UserX className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Blind Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sales heads have no clear way to verify which leads were contacted, who attended site visits, or why a high-value buyer stalled.
            </p>
          </div>
        </div>

        {/* Side-by-Side Reality Check */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Chaos */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">The Spreadsheet &amp; Chat Scramble</h3>
                  <p className="text-xs text-slate-500">Portal CSVs + Personal Phone Numbers + Memory</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-slate-900 block">Delayed Manual Assignment:</strong>
                    Leads wait hours before an agent calls. By then, the buyer is already speaking with a competing broker.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-slate-900 block">Personal Contacts Clutter:</strong>
                    Agents save hundreds of buyer numbers to personal phones, mixing personal life with client conversations.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-slate-900 block">Uncoordinated Site Visits:</strong>
                    Buyers get lost navigating to the show flat or forget the scheduled Saturday meeting time.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    <strong className="text-slate-900 block">Double-Booking Unit Inquiries:</strong>
                    Two agents pitch the same available unit without knowing if another buyer has already placed a token.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-rose-200/60 text-xs text-rose-800 font-medium">
              Result: Wasted ad spend, frustrated buyers, and lost commissions.
            </div>
          </div>

          {/* The Sahyak Real Estate Conduit */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap className="w-36 h-36 text-blue-400" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#0077ff] flex items-center justify-center text-white font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">The Sahyak Real Estate Pipeline</h3>
                  <p className="text-xs text-slate-400">Direct Ingress &rarr; Instant WhatsApp &rarr; Booked Deal</p>
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Immediate Ingress &amp; Routing:</strong>
                    Leads flow through webhooks directly into the CRM, instantly assigned to the right territory closer.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">1-Tap WhatsApp Proposals:</strong>
                    Send watermarked brochures and high-res floor plans instantly without saving numbers to personal contact books.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Show-Flat Location Coordination:</strong>
                    Automated WhatsApp Google Maps location pin and reminder alerts keep site visits on track.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-white block">Live Multi-Tower Unit Matrix:</strong>
                    Instant visibility into available, 48-hour locked, and booked units across all towers.
                  </div>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between relative z-10">
              <span className="text-emerald-400 font-semibold">Every lead tracked from first inquiry to closed booking.</span>
              <a href="#conduit" className="text-white hover:text-cyan-300 font-bold flex items-center gap-1">
                <span>See the journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
