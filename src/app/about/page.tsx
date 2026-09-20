import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Layers, 
  MessageSquare, 
  Sparkles, 
  Target, 
  Zap 
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "About Sahyak — Real Estate First Sales Velocity Engine",
  description:
    "Why Sahyak exists: Solving speed-to-lead and mobile closer execution for the most demanding high-ticket sales cycle in modern commerce.",
  alternates: {
    canonical: "https://sahyak.com/about"
  }
};

const THESIS_STAGES = [
  { step: "01", label: "LEAD", desc: "Sub-15s Webhook Ingress" },
  { step: "02", label: "CONVERSATION", desc: "1-Tap WhatsApp Actions" },
  { step: "03", label: "VISIT", desc: "Show-Flat Logistics & Maps" },
  { step: "04", label: "PROPERTY", desc: "Tower & Unit Availability" },
  { step: "05", label: "DEAL", desc: "Token Advance & Agreement" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Brand Thesis Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0077ff] text-xs font-semibold">
            <Target className="w-3.5 h-3.5" />
            <span>The Real Estate First Thesis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight">
            We Rebuilt CRM for How High-Ticket <span className="brand-gradient-text">Deals Actually Close.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Generic CRM software was built for Silicon Valley SaaS companies sending cold emails. 
            Real estate in India runs on WhatsApp, traffic, site visits, and instant inventory checks.
          </p>
        </div>
      </section>

      {/* 2. Visual Core Thesis Progression */}
      <section className="py-12 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">
              The Real Estate Sales Motion
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
            {THESIS_STAGES.map((stg, idx) => (
              <div key={stg.step} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-cyan-400 block font-bold">{stg.step}</span>
                <span className="text-sm font-extrabold text-white block">{stg.label}</span>
                <span className="text-[10px] text-slate-400 block truncate">{stg.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The Three Direct Answers (Zero Fluff) */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Question 1: WHY SAHYAK EXISTS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-100 pb-12">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block mb-1">
                Question 01
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                Why Sahyak Exists
              </h2>
            </div>
            <div className="md:col-span-8 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-base">
                When property inquiries sit in personal email inboxes or unmonitored WhatsApp chats, buyers disappear.
              </p>
              <p>
                A customer inquiring on a ₹2 Cr property on a Sunday afternoon expects a floor plan in 30 seconds. If they wait 4 hours for a sales rep to check a spreadsheet, they have already scheduled a site visit with another project down the road.
              </p>
              <p>
                Sahyak exists to eliminate the operational gaps between incoming lead interest, closer assignment, WhatsApp engagement, and booked show-flat visits.
              </p>
            </div>
          </div>

          {/* Question 2: WHY REAL ESTATE */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b border-slate-100 pb-12">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block mb-1">
                Question 02
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                Why Real Estate
              </h2>
            </div>
            <div className="md:col-span-8 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-base">
                Real estate is the ultimate high-ticket, high-friction sales environment.
              </p>

              {/* Real Estate Sales Gallery Experience Visual */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] shadow-sm my-3 group">
                <Image
                  src="/images/about-sales-gallery-consultation.jpg"
                  alt="High-end real estate developer sales gallery with architectural scale model"
                  fill
                  sizes="(max-width: 768px) 100vw, 650px"
                  className="object-cover object-center brightness-95 group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                  <span className="text-xs font-mono text-cyan-300 font-medium">
                    Where high-ticket transactions happen: Site sales galleries &middot; Physical model walkthroughs
                  </span>
                </div>
              </div>

              <p>
                Transactions are not closed behind computer desks. Closers navigate highway traffic, walk construction sites with buyers, coordinate driver gate passes, and negotiate payment schedules.
              </p>
              <p>
                By engineering a CRM that works with 1 hand on a phone and connects buyer budgets directly to physical inventory units, we solve the most demanding high-ticket sales cycle in commerce.
              </p>
            </div>
          </div>

          {/* Question 3: WHAT IS BEING BUILT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-xs font-mono font-bold uppercase text-[#0077ff] block mb-1">
                Question 03
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
                What is Being Built
              </h2>
            </div>
            <div className="md:col-span-8 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900 text-base">
                A purpose-built real estate sales platform today &middot; scalable high-ticket architecture for tomorrow.
              </p>
              <p>
                Sahyak is focused 100% on real estate operations today: portal webhooks, round-robin territory routing, 1-tap WhatsApp brochures, and tower inventory tracking.
              </p>
              <p>
                Underneath the product lies the modular CoreSetu multi-tenant foundation: strict cryptographic tenant boundaries, high-throughput webhook ingress, and role-based data isolation designed for high-stakes enterprise scale.
              </p>
            </div>
          </div>

          {/* Supporting Architecture Video Evidence */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 text-white shadow-xl">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">Platform Foundation Bridge</span>
              <span>about-coresetu-bridge.mp4</span>
            </div>
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label="Sahyak and CoreSetu architectural foundation bridge video"
              >
                <source src="/videos/about-coresetu-bridge.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
