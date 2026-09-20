"use client";

import React, { useState } from "react";
import { 
  CheckCircle2, 
  Mic, 
  PhoneCall, 
  ShieldCheck, 
  Smartphone, 
  WifiOff, 
  Zap,
  Volume2
} from "lucide-react";

export default function MobileCloserEngine() {
  const [activeVoiceTab, setActiveVoiceTab] = useState<boolean>(true);

  return (
    <section 
      id="mobile-closer" 
      data-analytics-section="mobile_closer_engine"
      className="py-24 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 text-xs font-semibold mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            Field Agent Operating System
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for the Agent in the Car, Not at a Desk
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Real estate deals are won at the show flat, in traffic, and over WhatsApp. 
            Sahyak is optimized for 1-hand mobile execution with zero form friction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Mobile Video Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[320px] rounded-[42px] p-3 bg-slate-900 shadow-2xl shadow-cyan-950/20 border-4 border-slate-800 ring-1 ring-slate-700/50">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20" />
              
              {/* Phone Screen */}
              <div className="relative rounded-[32px] overflow-hidden bg-slate-950 aspect-[9/18.5] flex flex-col justify-between">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/sahyak-mobile-closer-demo.mp4" type="video/mp4" />
                </video>

                {/* Floating overlay badge */}
                <div className="absolute bottom-4 left-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl text-white text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-[11px] text-cyan-300">1-Tap WhatsApp Inbound</span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Direct chat initiated without saving contact to phone book.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key Field Features */}
          <div className="lg:col-span-7 space-y-6">
            {/* Feature 1: 1-Tap Direct WhatsApp */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 hover:border-cyan-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    1-Tap WhatsApp Without Saving Numbers
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Brokers don&apos;t want 2,000 unverified leads clogging their personal Google contacts. 
                    Tap &ldquo;WhatsApp Lead&rdquo; inside Sahyak and jump directly into the conversation with pre-loaded project brochures and custom greeting templates.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saves 45 seconds per lead outreach
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Voice Note Audio Parsing */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 hover:border-cyan-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">
                      Voice Note Field Intelligence
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
                      Hinglish Native
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    After walking out of a show flat, the broker records a 15-second voice note while driving. 
                    Sahyak extracts key data points automatically into structured CRM fields.
                  </p>

                  {/* Audio transcription simulation */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-600" />
                        voice_note_sitevisit_malhotra.m4a
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">0:14s</span>
                    </div>
                    <div className="italic text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg">
                      &ldquo;Sir liked the 14th floor 3BHK view, budget tight around 2.3 Cr including car parking. Wife wants to re-visit on Sunday with family.&rdquo;
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
                      <div className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <strong>Budget:</strong> ₹2.30 Cr (All-Inc)
                      </div>
                      <div className="text-cyan-700 bg-cyan-50 px-2 py-1 rounded">
                        <strong>Follow-up:</strong> Sunday Re-Visit
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Low-Signal Offline Caching */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 hover:border-cyan-200 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Basement &amp; Low-Signal Offline Sync
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Underground parking lots and under-construction tower sites routinely have zero cellular coverage. 
                    Sahyak queues your client notes, visit logs, and token details locally on device and syncs seamlessly the second you hit 4G/5G.
                  </p>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Zero data loss guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
