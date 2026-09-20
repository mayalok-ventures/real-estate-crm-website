"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Check,
  Building2,
  Zap,
  ShieldCheck,
  Pause,
  Play,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import {
  RealEstateLeadBadge,
  FloatingProposalCard,
} from "@/components/ui/PropertyLeadCards";

export function HeroSection() {
  const customEasing = [0.16, 1, 0.3, 1] as const;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setIsPlaying(false);
      videoRef.current?.pause();
    }
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section
      data-analytics-section="hero"
      className="relative pt-10 pb-16 lg:pt-18 lg:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-10">
        {/* Eyebrow Real Estate Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: customEasing }}
          className="flex justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] sm:text-xs font-medium text-slate-700 text-center">
            <span className="flex h-2 w-2 rounded-full bg-[#0077ff] animate-pulse shrink-0" />
            <span className="font-semibold text-slate-900">Real Estate CRM</span>
            <span className="text-slate-300">|</span>
            <span>Sub-15s Lead Routing</span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline">WhatsApp Floor Plans</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-500 font-mono text-[11px]">Mobile Field Closer</span>
          </div>
        </motion.div>

        {/* Main Headline & Positioning */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: customEasing }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] font-heading"
          >
            The serious CRM built for{" "}
            <span className="brand-gradient-text">real estate sales</span> teams.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: customEasing }}
            className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto"
          >
            Take property leads from inquiries to WhatsApp conversations, automated site visits, and booked units. Stop losing buyers between messy spreadsheets and buried chats.
          </motion.p>

          {/* Direct Free Start CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: customEasing }}
            className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href={siteConfig.appSignupUrl}
              className="btn-pill-brand text-white text-sm py-3.5 px-8 font-semibold group w-full sm:w-auto shadow-md"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#engine"
              className="btn-pill-secondary text-sm py-3.5 px-7 font-semibold flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </motion.div>

          {/* Honest Free Offer Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500 font-medium"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> Free Starter: 20 Leads &amp; 3 Properties
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> 10 WhatsApp Actions Included
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#0077ff] font-bold" /> No Credit Card Required
            </span>
          </motion.div>
        </div>

        {/* Real Estate Product Sandbox Frame */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: customEasing }}
          className="pt-2 max-w-6xl mx-auto"
        >
          <div className="w-full relative group">
            <div
              className="absolute inset-0 sm:-inset-6 rounded-3xl stage-ambient-glow pointer-events-none -z-10 blur-xl opacity-80"
              aria-hidden="true"
            />

            {/* Floating Inbound Real Estate Lead Badge (Desktop Depth) */}
            <div className="hidden lg:block absolute -top-5 -left-4 z-20 animate-fade-in pointer-events-none">
              <RealEstateLeadBadge
                source="Meta Property Campaign"
                project="Godrej Palm Retreat"
                unitPreference="3BHK Luxury Penthouse"
                budget="₹1.85 Cr"
                buyerName="Vikram Malhotra"
                className="shadow-xl"
              />
            </div>

            {/* Desktop CRM Frame */}
            <div className="w-full rounded-2xl bg-white border border-slate-200/90 shadow-2xl overflow-hidden relative z-10">
              {/* Window Header */}
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/40" />
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400/40" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 text-slate-500 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>https://crm.sahyak.com/pipeline/real-estate</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold text-slate-700">ACTIVE PIPELINE</span>
                  </div>

                  <button
                    onClick={togglePlayback}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                    aria-label={isPlaying ? "Pause product demo video" : "Play product demo video"}
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span className="hidden md:inline font-mono text-[10px] uppercase">
                      {isPlaying ? "Pause" : "Play"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Looping Product Demonstration Canvas */}
              <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  src="/videos/sahyak-speed-to-lead-hero-loop.mp4"
                  autoPlay={!isReducedMotion}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover select-none"
                  aria-label="Sahyak real estate speed to lead pipeline demo"
                />

                {/* Live Real Estate Telemetry Caption Strip */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-3 sm:p-4 flex items-center justify-between text-white text-xs pointer-events-none">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <Zap className="w-3.5 h-3.5 text-[#0077ff]" />
                    <span className="font-semibold text-slate-200">
                      Inbound Ingress &rarr; Round-Robin Routing &rarr; WhatsApp Floor Plan
                    </span>
                  </div>
                  <div className="hidden sm:inline-flex items-center text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    Direct Webhook Ready
                  </div>
                </div>
              </div>

              {/* Bottom Real Estate Capabilities */}
              <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077ff]" />
                  <span className="font-semibold">Direct Webhook Ingress Ready</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077ff]" />
                  <span className="font-semibold">Project &amp; Territory Round-Robin</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077ff]" />
                  <span className="font-semibold">1-Tap WhatsApp PDF Brochures</span>
                </div>
              </div>
            </div>

            {/* Floating Verified Proposal Card (Desktop Depth) */}
            <div className="hidden lg:block absolute -bottom-6 -right-5 z-30 pointer-events-none">
              <FloatingProposalCard
                title="FloorPlan_Godrej_UnitB1402.pdf"
                size="1.4 MB"
                className="w-72 shadow-2xl border-slate-200/90"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
