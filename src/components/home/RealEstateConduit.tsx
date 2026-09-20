"use client";

import React, { useState } from "react";
import { 
  ArrowRight, 
  Building, 
  CalendarCheck, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  MapPin, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  Users 
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  cardTitle: string;
  data: {
    buyer: string;
    phone: string;
    project: string;
    unit: string;
    budget: number;
    channel: string;
    status: string;
    timestamp: string;
    actionDetail: string;
  };
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: "1. Ingestion",
    subtitle: "Direct Webhook Ingress",
    badge: "Sub-Second Delivery",
    description: "Inbound leads from 99acres, MagicBricks, Meta Ads, or website capture land in the CRM via standardized webhooks with UTM attribution intact.",
    cardTitle: "Raw Inbound Packet Captured",
    data: {
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK + Servant (2,150 sq.ft)",
      budget: 24500000,
      channel: "Meta Ads • Campaign: Luxury-NCR-Q3",
      status: "Ingested & Sanitized",
      timestamp: "09:42:11 AM",
      actionDetail: "Duplicate check passed • Phone verified • High ticket flag (₹2.45 Cr)"
    }
  },
  {
    id: 2,
    title: "2. Assignment",
    subtitle: "Round-Robin & SLA Rules",
    badge: "15s SLA Timer",
    description: "Lead routed instantly to the right closer based on micro-market territory (Gurgaon Sec 150), ticket size (>₹2 Cr), and current agent response bandwidth.",
    cardTitle: "Lead Assigned to Senior Closer",
    data: {
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK + Servant (2,150 sq.ft)",
      budget: 24500000,
      channel: "Assigned: Rajesh Sharma (Luxury Specialist)",
      status: "Assignment Lock",
      timestamp: "09:42:14 AM (+3s)",
      actionDetail: "SLA Countdown Started: 15 mins to first call attempt • Push notification delivered"
    }
  },
  {
    id: 3,
    title: "3. WhatsApp Drop",
    subtitle: "Automated Floor Plan & Brochure",
    badge: "Instant Engagement",
    description: "While the buyer is still reviewing properties, Sahyak triggers a branded WhatsApp packet with high-res floor plans, brochure PDF, and RERA approval.",
    cardTitle: "WhatsApp Media Delivered",
    data: {
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK Tower B - Floor 14 Plan",
      budget: 24500000,
      channel: "WhatsApp Business API",
      status: "Delivered & Read",
      timestamp: "09:42:22 AM (+11s)",
      actionDetail: "Sent: 1x Brochure PDF (4.2MB), 2x Floor Plan PNGs, 1x RERA Registration Doc"
    }
  },
  {
    id: 4,
    title: "4. Site Visit",
    subtitle: "Calendar & Show Flat Logistics",
    badge: "Location Pin Sent",
    description: "Lock in the crucial milestone: Show flat visit scheduled for Saturday with calendar invite, site directions, and automatic T-2hr driver / reminder alerts.",
    cardTitle: "Site Visit Confirmed",
    data: {
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat • Experience Centre",
      unit: "Meeting with: Rajesh S. & Site Architect",
      budget: 24500000,
      channel: "Site Visit Scheduled",
      status: "Saturday 11:30 AM",
      timestamp: "Confirmed via 1-Tap Link",
      actionDetail: "Google Maps show-flat pin sent • SMS reminder set for Saturday 09:30 AM"
    }
  },
  {
    id: 5,
    title: "5. Booking Token",
    subtitle: "Unit Lock & Payment Logging",
    badge: "Unit A-1402 Reserved",
    description: "Record the token advance, block inventory unit for 48 hours, and instantly generate the booking summary letter with construction-linked payment schedule.",
    cardTitle: "Booking Advance Paid",
    data: {
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat • Unit A-1402",
      unit: "3BHK + Servant • North-East Facing",
      budget: 24500000,
      channel: "Advance Token: ₹5,00,000 (NEFT)",
      status: "Inventory Blocked (48h)",
      timestamp: "Saturday 01:45 PM",
      actionDetail: "Payment receipt #SHK-8921 logged • Deal moved to Won • Commission tracked"
    }
  }
];

export default function RealEstateConduit() {
  const [activeStageId, setActiveStageId] = useState<number>(3);
  const activeStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section 
      id="conduit" 
      data-analytics-section="real_estate_conduit"
      className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            End-to-End Real Estate Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The 5-Stage Real Estate Conduit
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From raw portal inquiry to unit token advance in one continuous, automated pipeline.
          </p>
        </div>

        {/* Stage Navigation Buttons */}
        <div className="flex items-center justify-start lg:justify-center overflow-x-auto gap-2 pb-4 mb-10 scrollbar-none">
          {STAGES.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all shrink-0 border ${
                  isActive
                    ? "bg-white border-cyan-500 shadow-md shadow-cyan-500/10 text-slate-900 ring-2 ring-cyan-500/20"
                    : "bg-white/60 border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isActive ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  0{stage.id}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{stage.title}</div>
                  <div className="text-[11px] text-slate-500">{stage.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Stage Simulation Display */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Explainer */}
          <div className="lg:col-span-5 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-semibold mb-4">
                {activeStage.badge}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{activeStage.title}: {activeStage.subtitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {activeStage.description}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Eliminates manual lead copy-pasting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Leaves complete timestamped audit trail</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Built for Indian brokerages &amp; developers</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Stage {activeStage.id} of 5
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveStageId((prev) => Math.max(1, prev - 1))}
                  disabled={activeStageId === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 disabled:opacity-30 hover:bg-slate-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setActiveStageId((prev) => Math.min(5, prev + 1))}
                  disabled={activeStageId === 5}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold disabled:opacity-30 hover:bg-cyan-700"
                >
                  Next Stage
                </button>
              </div>
            </div>
          </div>

          {/* Right Simulated Card */}
          <div className="lg:col-span-7 bg-slate-950 p-6 sm:p-10 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono text-cyan-400 font-semibold">{activeStage.cardTitle}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{activeStage.data.timestamp}</span>
              </div>

              {/* Lead Data Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      {activeStage.data.buyer}
                      <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">Verified Lead</span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{activeStage.data.phone}</p>
                  </div>
                  <div className="sm:text-right">
                    <div className="text-xs text-slate-400">Budget Range</div>
                    <div className="text-base font-bold text-emerald-400">{formatINR(activeStage.data.budget)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Target Project</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-cyan-400" />
                      {activeStage.data.project}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Unit Configuration</span>
                    <span className="font-semibold text-slate-200">{activeStage.data.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Channel / Flow</span>
                    <span className="font-semibold text-slate-200">{activeStage.data.channel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Current State</span>
                    <span className="font-semibold text-cyan-300">{activeStage.data.status}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-slate-300">
                  <span className="text-cyan-400 font-semibold block mb-0.5">Automated System Action:</span>
                  {activeStage.data.actionDetail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
