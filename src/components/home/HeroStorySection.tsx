"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ChevronRight, 
  Check, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Zap,
  Play,
  Pause
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { formatINR } from "@/lib/utils";

const LEAD_STAGES = [
  {
    id: 1,
    badge: "NEW INQUIRY",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    label: "Lead Captured",
    action: "Sub-15s Webhook Ingress",
    title: "Meta Ads · Luxury Sector 150",
    buyer: "Vikram Malhotra",
    phone: "+91 98112 •••••",
    project: "Godrej Palm Retreat",
    config: "3 BHK Luxury (2,150 sq.ft)",
    budget: 18500000,
    highlight: "High-ticket buyer looking for possession in 2026",
    statusText: "Ready for first action"
  },
  {
    id: 2,
    badge: "ASSIGNED",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    label: "Round-Robin Locked",
    action: "Territory Match: Sec 150 Specialist",
    title: "Assigned to Senior Closer",
    buyer: "Vikram Malhotra",
    phone: "+91 98112 •••••",
    project: "Godrej Palm Retreat",
    config: "3 BHK Luxury (2,150 sq.ft)",
    budget: 18500000,
    highlight: "Assigned to Rahul S. · 15-Min SLA Timer Started",
    statusText: "Lead locked to closer"
  },
  {
    id: 3,
    badge: "WHATSAPP DELIVERED",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Instant Engagement",
    action: "1-Tap Verified WhatsApp Dispatch",
    title: "Floor Plan & Brochure Sent",
    buyer: "Vikram Malhotra",
    phone: "+91 98112 •••••",
    project: "Godrej Palm Retreat",
    config: "Tower B · Floor Plan 1402",
    budget: 18500000,
    highlight: "Delivered in 1.4s · Brochure PDF (3.2 MB) Read",
    statusText: "Buyer engaged immediately"
  },
  {
    id: 4,
    badge: "FOLLOW-UP SCHEDULED",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Next Move Locked",
    action: "Automated Calendar Sync",
    title: "Show-Flat Discussion Due",
    buyer: "Vikram Malhotra",
    phone: "+91 98112 •••••",
    project: "Godrej Palm Retreat",
    config: "3 BHK Luxury (2,150 sq.ft)",
    budget: 18500000,
    highlight: "Scheduled: Today at 6:30 PM · Voice Note Logged",
    statusText: "No gaps in the pipeline"
  }
];

export default function HeroStorySection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-progress simulation every 4 seconds if autoplay is enabled
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % LEAD_STAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsAutoPlaying(false);
      setIsVideoPlaying(false);
      videoRef.current?.pause();
    }
  }, []);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  };

  const currentStage = LEAD_STAGES[activeStep];

  return (
    <section 
      data-analytics-section="hero_story"
      className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-200/80"
    >
      {/* Subtle Real Estate Environmental Horizon Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.07] bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-luxury-facade.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/60 via-white/90 to-white" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        
        {/* Eyebrow Real Estate Identifier */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-700">
            <span className="flex h-2 w-2 rounded-full bg-[#0077ff] animate-pulse" />
            <span className="font-semibold text-slate-900">Real Estate Sales CRM</span>
            <span className="text-slate-300">|</span>
            <span>Sub-15s Routing</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">1-Tap WhatsApp Actions</span>
          </div>
        </div>

        {/* Headline & Exact Copy Constraint: 1 Headline, 1 Supporting Line */}
        <div className="text-center max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] font-heading">
            From inquiry to site visit - <span className="brand-gradient-text">without the gaps.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl mx-auto">
            The serious CRM built for real estate sales teams.
          </p>

          {/* Primary & Secondary Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-brand text-white text-sm py-3.5 px-8 font-semibold group w-full sm:w-auto shadow-md"
            >
              <span>Start Free — 20 Leads</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#story"
              className="btn-pill-secondary text-sm py-3.5 px-7 font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>Watch It Work ↓</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          {/* Honest Proof Badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-1 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> Free Starter: 20 Leads &amp; 3 Properties
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> 10 WhatsApp Actions Included
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> No Credit Card Required
            </span>
          </div>
        </div>

        {/* PRODUCT EVIDENCE CENTERPIECE: Real Video + Interactive Pipeline Feed */}
        <div className="max-w-6xl mx-auto pt-2">
          <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden">
            
            {/* Header Bar */}
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>crm.sahyak.com/pipeline</span>
                </div>
              </div>

              {/* Stage Switcher Pills */}
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl">
                {LEAD_STAGES.map((stage, idx) => (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setActiveStep(idx);
                      setIsAutoPlaying(false);
                    }}
                    className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-mono transition-all cursor-pointer ${
                      activeStep === idx 
                        ? "bg-[#0077ff] text-white shadow-sm font-bold" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    0{stage.id} {stage.badge.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Video Pause/Play */}
              <button
                onClick={toggleVideoPlayback}
                className="text-slate-400 hover:text-white transition-colors p-1 cursor-pointer flex items-center gap-1 text-xs font-mono"
                aria-label={isVideoPlaying ? "Pause product video" : "Play product video"}
              >
                {isVideoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isVideoPlaying ? "Pause" : "Play"}</span>
              </button>
            </div>

            {/* Split Product Canvas: Real Video on Left + Live Pipeline Card on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-950">
              
              {/* 1. Real Speed-to-Lead Product Video (Dominant 7 Cols) */}
              <div className="lg:col-span-7 relative aspect-video lg:aspect-auto w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800">
                <video
                  ref={videoRef}
                  src="/videos/sahyak-speed-to-lead-hero-loop.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover select-none"
                  aria-label="Sahyak real estate speed-to-lead product loop"
                />
                <div className="absolute bottom-2 left-3 right-3 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-800 text-white text-[11px] font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Zap className="w-3 h-3 text-[#0077ff]" />
                    Speed-to-Lead Engine
                  </span>
                  <span className="text-slate-400 text-[10px]">Product UI Interface</span>
                </div>
              </div>

              {/* 2. Interactive Inbound Lead State Card (5 Cols) */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-900 text-white flex flex-col justify-between space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold border ${currentStage.badgeColor}`}>
                        {currentStage.badge}
                      </span>
                      <span className="text-[11px] font-mono text-cyan-400">
                        {currentStage.action}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-lg font-bold text-slate-100">
                        {currentStage.buyer}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {currentStage.phone} &middot; {currentStage.title}
                      </div>
                    </div>

                    {/* Property Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Project</span>
                        <span className="font-bold text-slate-200 truncate block">{currentStage.project}</span>
                      </div>
                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Budget</span>
                        <span className="font-bold text-cyan-300 block">{formatINR(currentStage.budget)}</span>
                      </div>
                    </div>

                    {/* Stage Action Banner */}
                    <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 space-y-1">
                      <div className="text-cyan-400 font-mono text-[10px] uppercase font-bold">Simulated Workflow Step</div>
                      <div className="font-medium text-slate-200">{currentStage.highlight}</div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Auto-advancing through pipeline</span>
                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % LEAD_STAGES.length)}
                    className="text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer"
                  >
                    Next Move &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
