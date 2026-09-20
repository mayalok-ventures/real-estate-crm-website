"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Building, 
  CalendarCheck, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  MapPin, 
  MessageCircle, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  UserCheck, 
  Zap,
  Lock,
  CreditCard
} from "lucide-react";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

interface JourneyStage {
  id: number;
  number: string;
  name: string;
  tagline: string;
  uiHeader: string;
  leadState: {
    stageBadge: string;
    stageColor: string;
    buyer: string;
    phone: string;
    project: string;
    unit: string;
    budget: number;
    timeline: string;
    keyMetric: string;
    liveAction: {
      type: string;
      label: string;
      detail: string;
    };
    visualAnchor?: {
      src: string;
      caption: string;
      tag: string;
    };
    uiDetails: { label: string; value: string }[];
  };
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    number: "01",
    name: "NEW",
    tagline: "Inbound Capture",
    uiHeader: "Raw Inquiry Ingested via Webhook",
    leadState: {
      stageBadge: "INGESTED",
      stageColor: "bg-blue-100 text-blue-700 border-blue-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK Luxury Penthouse",
      budget: 18500000,
      timeline: "09:42:11 AM",
      keyMetric: "Delivered in 0.8s",
      liveAction: {
        type: "ingress",
        label: "Direct Webhook Verification",
        detail: "UTM: Meta Luxury Campaign · Phone Verified · Duplicate Check Passed"
      },
      uiDetails: [
        { label: "Channel", value: "Meta Ads" },
        { label: "Territory", value: "Sector 150" },
        { label: "Possession", value: "Q4 2026" },
        { label: "Intent", value: "High (High-Ticket Flag)" }
      ]
    }
  },
  {
    id: 2,
    number: "02",
    name: "ASSIGNED",
    tagline: "Closer Lock",
    uiHeader: "Territory Match & SLA Clock",
    leadState: {
      stageBadge: "ASSIGNED",
      stageColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK Luxury Penthouse",
      budget: 18500000,
      timeline: "09:42:14 AM (+3s)",
      keyMetric: "15-Min SLA Active",
      liveAction: {
        type: "routing",
        label: "Assigned to Rahul Sharma",
        detail: "Sector 150 Luxury Specialist · Push notification dispatched to closer phone"
      },
      uiDetails: [
        { label: "Assigned Closer", value: "Rahul Sharma" },
        { label: "Routing Rule", value: "Territory + Ticket Size" },
        { label: "SLA Warning", value: "T-15 mins" },
        { label: "Mobile Sync", value: "PWA Delivered" }
      ]
    }
  },
  {
    id: 3,
    number: "03",
    name: "CONTACTED",
    tagline: "1-Tap WhatsApp",
    uiHeader: "Branded Brochure & Floor Plan Drop",
    leadState: {
      stageBadge: "ENGAGED",
      stageColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "Tower B · Unit 1402 Plan",
      budget: 18500000,
      timeline: "09:42:25 AM (+14s)",
      keyMetric: "Read in 45s",
      liveAction: {
        type: "whatsapp",
        label: "Official WhatsApp Sent",
        detail: "Delivered 1x Brochure PDF (3.2 MB) + 2x Floor Plan Renderings"
      },
      uiDetails: [
        { label: "Template", value: "Luxury Project Intro" },
        { label: "Status", value: "Read & Replied" },
        { label: "Contact Saved?", value: "No (Direct 1-Tap)" },
        { label: "Attachment", value: "TowerB_Unit1402.pdf" }
      ]
    }
  },
  {
    id: 4,
    number: "04",
    name: "FOLLOW-UP",
    tagline: "Next Move",
    uiHeader: "Structured Task & Audio Log",
    leadState: {
      stageBadge: "FOLLOW-UP SET",
      stageColor: "bg-amber-100 text-amber-700 border-amber-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "3BHK Luxury Penthouse",
      budget: 18500000,
      timeline: "11:15:00 AM",
      keyMetric: "Voice Note Logged",
      liveAction: {
        type: "task",
        label: "Call Scheduled: Tomorrow 11:30 AM",
        detail: "Closer Voice Note: 'Buyer interested in 14th floor club-facing; needs CLP sheet.'"
      },
      uiDetails: [
        { label: "Reminder", value: "Tomorrow · 11:30 AM" },
        { label: "Audio Note", value: "38s Transcribed" },
        { label: "Priority", value: "High Hot" },
        { label: "Calendar Sync", value: "Google & Apple" }
      ]
    }
  },
  {
    id: 5,
    number: "05",
    name: "SITE VISIT",
    tagline: "Show Flat",
    uiHeader: "Visit Scheduled & Directions Pin",
    leadState: {
      stageBadge: "VISIT BOOKED",
      stageColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat · Show Flat #302",
      unit: "Sample Suite Inspection",
      budget: 18500000,
      timeline: "Saturday · 11:30 AM",
      keyMetric: "Maps Pin Dispatched",
      liveAction: {
        type: "visit",
        label: "Live Location & Gate Pass Dispatched",
        detail: "WhatsApp automated reminder queued for Saturday 09:30 AM (T-2h)"
      },
      visualAnchor: {
        src: "/images/journey-showflat-experience.jpg",
        caption: "Verified Show Flat #302 · Luxury 3BHK Living Lounge & Balcony Inspection",
        tag: "PHYSICAL SHOW FLAT EXPERIENCE"
      },
      uiDetails: [
        { label: "Visit Date", value: "Saturday, 11:30 AM" },
        { label: "Host Rep", value: "Rahul Sharma" },
        { label: "Directions", value: "Google Maps Pin Sent" },
        { label: "Gate Pass", value: "QR Code Generated" }
      ]
    }
  },
  {
    id: 6,
    number: "06",
    name: "NEGOTIATION",
    tagline: "Unit Block",
    uiHeader: "Construction-Linked Plan Locked",
    leadState: {
      stageBadge: "UNIT BLOCKED (48H)",
      stageColor: "bg-purple-100 text-purple-700 border-purple-200",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "Unit B-1402 (14th Floor)",
      budget: 24500000,
      timeline: "Post-Visit Debrief",
      keyMetric: "Locked for 48 Hours",
      liveAction: {
        type: "inventory",
        label: "CLP Quotation Generated & Unit Locked",
        detail: "Agreement cost ₹2.45 Cr · Payment milestones mapped to construction stages"
      },
      uiDetails: [
        { label: "Unit", value: "B-1402 (3BHK + S)" },
        { label: "Carpet Area", value: "1,720 sq.ft" },
        { label: "Plan", value: "CLP (10:80:10)" },
        { label: "Lock Expiry", value: "Sunday 06:00 PM" }
      ]
    }
  },
  {
    id: 7,
    number: "07",
    name: "BOOKED",
    tagline: "Token Advance",
    uiHeader: "Deal Closed & Inventory Marked Sold",
    leadState: {
      stageBadge: "BOOKED & WON",
      stageColor: "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold",
      buyer: "Vikram Malhotra",
      phone: "+91 98112 •••••",
      project: "Godrej Palm Retreat",
      unit: "Unit B-1402 · SOLD",
      budget: 24500000,
      timeline: "Deal Closed",
      keyMetric: "₹5,00,000 Token NEFT",
      liveAction: {
        type: "booking",
        label: "Booking Token Advance Logged",
        detail: "Inventory status updated to SOLD across entire brokerage · Commission tracked"
      },
      visualAnchor: {
        src: "/images/journey-unit-allotment.jpg",
        caption: "Official Allotment Docket, Token Receipt & Verified Floor Plan",
        tag: "CLOSURE TRANSACTION EVIDENCE"
      },
      uiDetails: [
        { label: "Token Paid", value: "₹5,00,000 via NEFT" },
        { label: "Agreement Value", value: "₹2.45 Cr" },
        { label: "Status", value: "SOLD (Closed Won)" },
        { label: "Closer Credit", value: "Rahul Sharma" }
      ]
    }
  }
];

export default function InteractiveLeadJourney() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const currentStage = JOURNEY_STAGES[activeStageIndex];

  return (
    <section 
      id="story"
      data-analytics-section="lead_journey"
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Minimal Copy */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0077ff] text-[11px] font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            The Sales Movement
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            One lead. <span className="brand-gradient-text">Every next move.</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500 font-medium">
            Watch a single inquiry travel through the entire sales process.
          </p>
        </div>

        {/* 7-Stage Horizontal Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 pt-1 px-2 no-scrollbar">
            {JOURNEY_STAGES.map((stg, idx) => (
              <button
                key={stg.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeStageIndex === idx 
                    ? "bg-slate-900 text-white shadow-md font-bold scale-[1.02]" 
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span className={`text-[10px] ${activeStageIndex === idx ? "text-cyan-400" : "text-slate-400"}`}>
                  {stg.number}
                </span>
                <span>{stg.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Product Canvas */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* Top Stage Bar */}
          <div className="bg-slate-900 text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[#0077ff] text-white text-[10px] font-mono font-bold">
                STAGE {currentStage.number}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {currentStage.uiHeader}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={activeStageIndex === 0}
                onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous sales stage"
              >
                &larr;
              </button>
              <span className="text-xs font-mono text-slate-400">
                {activeStageIndex + 1} / {JOURNEY_STAGES.length}
              </span>
              <button
                disabled={activeStageIndex === JOURNEY_STAGES.length - 1}
                onClick={() => setActiveStageIndex((prev) => Math.min(JOURNEY_STAGES.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next sales stage"
              >
                &rarr;
              </button>
            </div>
          </div>

          {/* Canvas Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-10 space-y-6"
            >
              {/* Lead Identity Summary Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${currentStage.leadState.stageColor}`}>
                      {currentStage.leadState.stageBadge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {currentStage.leadState.buyer}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {currentStage.leadState.phone} &middot; Sample Lead
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {currentStage.leadState.project} &middot; {currentStage.leadState.unit}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Ticket Size</span>
                    <span className="text-lg font-extrabold text-[#0077ff]">
                      {formatINR(currentStage.leadState.budget)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-200 hidden sm:block" />
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Status</span>
                    <span className="text-xs font-bold text-slate-700">
                      {currentStage.leadState.keyMetric}
                    </span>
                  </div>
                </div>
              </div>

              {/* Real UI Event Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0077ff]" />
                    <span className="text-xs font-mono uppercase font-bold text-slate-800">
                      {currentStage.leadState.liveAction.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {currentStage.leadState.timeline}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {currentStage.leadState.liveAction.detail}
                </p>
              </div>

              {/* Contextual Real Estate Visual Anchor (When Stage Has Physical Evidence) */}
              {currentStage.leadState.visualAnchor && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-950 text-white">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="text-cyan-400 font-bold">{currentStage.leadState.visualAnchor.tag}</span>
                    <span className="text-[11px] truncate max-w-md text-slate-300">{currentStage.leadState.visualAnchor.caption}</span>
                  </div>
                  <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={currentStage.leadState.visualAnchor.src}
                      alt={currentStage.leadState.visualAnchor.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1000px"
                    />
                  </div>
                </div>
              )}

              {/* 4 Real Estate UI Detail Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {currentStage.leadState.uiDetails.map((dt) => (
                  <div key={dt.label} className="p-3 rounded-xl bg-white border border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      {dt.label}
                    </span>
                    <span className="text-xs font-bold text-slate-800 truncate block mt-0.5">
                      {dt.value}
                    </span>
                  </div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Bottom Interactive Prompt */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[11px] text-slate-500">
              Click any stage above to step through the sales journey
            </span>
            <button
              onClick={() => setActiveStageIndex((prev) => (prev + 1) % JOURNEY_STAGES.length)}
              className="text-xs font-bold text-[#0077ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{activeStageIndex === JOURNEY_STAGES.length - 1 ? "Replay Journey" : "Next Move"}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
