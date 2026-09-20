"use client";

import React, { useState, useRef } from "react";
import { Smartphone, Zap, MessageSquare, Mic, MapPin, Play, Pause } from "lucide-react";

export default function FieldCloserMobile() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      id="field-closer"
      data-analytics-section="field_closer_mobile"
      className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Maximum 1 Short Sentence */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            Field Closer OS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Sales happens outside the desk.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-500 font-medium">
            1-hand mobile execution for the agent on the move.
          </p>
        </div>

        {/* Environmental Real Estate Field Sales Stage */}
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950">
          {/* Real-World Environment Background Image with subtle dark gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/field-sales-lounge-env.jpg"
              alt="Indian real estate site sales pavilion and active property development"
              className="w-full h-full object-cover opacity-30 filter blur-[1px] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/60" />
          </div>

          {/* Environmental Context Badge */}
          <div className="relative z-10 px-5 py-3.5 flex items-center justify-between border-b border-slate-800/80 text-xs font-mono text-slate-300 bg-slate-900/40 backdrop-blur-xs">
            <span className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SITE SALES LOUNGE &middot; FIELD OPERATIONS
            </span>
            <span className="hidden sm:inline text-slate-400">Outdoor Experience Pavilion &middot; Active Site</span>
          </div>

          {/* Central Realistic Smartphone Device Composition */}
          <div className="relative z-10 py-8 sm:py-12 flex flex-col items-center justify-center px-4">
            
            <div className="relative w-full max-w-[310px] sm:max-w-[330px] rounded-[48px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
              
              {/* Dynamic Island Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-end px-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Screen Video Container */}
              <div className="relative rounded-[36px] overflow-hidden bg-slate-950 aspect-[9/19] flex flex-col justify-between">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover select-none"
                  aria-label="Sahyak mobile closer demo"
                >
                  <source src="/videos/sahyak-mobile-closer-demo.mp4" type="video/mp4" />
                </video>

                {/* In-Phone Live Action Pill Overlay */}
                <div className="absolute bottom-4 inset-x-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      1-Tap WhatsApp
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Zero Contact Save</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-tight">
                    Dispatches verified brochure PDF &amp; Google Maps pin with 1 thumb in traffic.
                  </p>
                </div>
              </div>

            </div>

            {/* Clean device control toggle */}
            <div className="mt-5 flex items-center gap-3 text-xs font-mono text-slate-400">
              <button
                onClick={togglePlayback}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause Mobile Demo" : "Play Mobile Demo"}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
