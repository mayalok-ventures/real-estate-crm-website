"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ArrowRight, 
  Building2, 
  Check, 
  Layers, 
  MessageSquare, 
  Share2, 
  Lock,
  Compass,
  MapPin
} from "lucide-react";
import { formatINR } from "@/lib/utils";

const DEMO_UNITS = [
  {
    id: "unit-1",
    project: "Skyline Residences",
    tower: "Tower B",
    unit: "Unit 1204",
    config: "2 BHK Luxury",
    area: "1,420 SQ.FT.",
    price: 14200000,
    status: "AVAILABLE",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    buyerMatch: "Matched to Ananya S. (Budget ₹1.5 Cr)",
    facing: "East (Park / Sunrise View)",
    floor: "12th Floor"
  },
  {
    id: "unit-2",
    project: "Skyline Residences",
    tower: "Tower A",
    unit: "Unit 1402",
    config: "3 BHK + Servant",
    area: "1,850 SQ.FT.",
    price: 18500000,
    status: "BLOCKED (48H)",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    buyerMatch: "Matched to Vikram M. (Budget ₹2.0 Cr)",
    facing: "North-East (Club View)",
    floor: "14th Floor"
  },
  {
    id: "unit-3",
    project: "Skyline Residences",
    tower: "Skyline Crown",
    unit: "Penthouse 1801",
    config: "4 BHK Penthouse",
    area: "2,950 SQ.FT.",
    price: 34500000,
    status: "AVAILABLE",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    buyerMatch: "Matched to Dr. Iyer (Budget ₹3.5 Cr)",
    facing: "360° Panoramic Skyline",
    floor: "18th Floor (Duplex)"
  }
];

export default function PropertyConnection() {
  const [selectedUnit, setSelectedUnit] = useState(DEMO_UNITS[0]);
  const [sentWhatsApp, setSentWhatsApp] = useState(false);
  const [visualTab, setVisualTab] = useState<"elevation" | "floorplan">("elevation");

  const handleSend = () => {
    setSentWhatsApp(true);
    setTimeout(() => setSentWhatsApp(false), 2200);
  };

  return (
    <section 
      id="property"
      data-analytics-section="property_connection"
      className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5" />
            Inventory &middot; Pipeline Connected
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            Leads don&apos;t buy leads. <span className="brand-gradient-text">They buy units.</span>
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-500 font-medium">
            Buyer requirements matched directly to live property inventory.
          </p>
        </div>

        {/* Real Estate Product Visual: BUYER → PROPERTY */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 1. Left: Buyer Card (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  BUYER REQUIREMENT
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-mono font-bold">
                  EXAMPLE BUYER
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Ananya Sharma</h3>
                <p className="text-xs text-slate-500 font-mono">+91 98112 ••••• &middot; Inbound Meta Lead</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Config:</span>
                  <span className="font-bold text-slate-800">2 BHK High Floor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Max Budget:</span>
                  <span className="font-bold text-[#0077ff]">₹1.50 Cr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location Preference:</span>
                  <span className="font-bold text-slate-800">Sector 150 Expressway</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 font-medium">
                {selectedUnit.buyerMatch}
              </div>

              {/* Verified Unit Blueprint Attachment Indicator */}
              <div className="pt-1 flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Unit Floor Plan Attached
                </span>
                <button
                  onClick={() => setVisualTab("floorplan")}
                  className="text-[#0077ff] hover:underline font-bold cursor-pointer"
                >
                  View 3D Layout &rarr;
                </button>
              </div>
            </div>

            {/* Middle: Connection Node */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
              <div className="w-10 h-10 rounded-full bg-[#0077ff] text-white flex items-center justify-center font-mono text-xs font-bold shadow-md shadow-blue-500/20">
                &rarr;
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase mt-1.5 font-bold">
                Direct Match
              </span>
            </div>

            {/* 2. Right: Custom Real Estate Product Visual with Real Architectural Context (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4">
              
              {/* Architectural Image Banner with View Mode Selector */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={visualTab === "elevation" ? "/images/skyline-residences-luxury-tower.jpg" : "/images/unit-1402-architectural-floorplan.jpg"}
                  alt={visualTab === "elevation" ? "Skyline Residences luxury high-rise condominium architecture" : "Unit 1402 architectural 3D floor plan layout"}
                  className={`w-full h-full ${visualTab === "elevation" ? "object-cover object-center" : "object-contain bg-white"} transform hover:scale-105 transition-all duration-500`}
                  loading="lazy"
                />
                <div className={`absolute inset-0 ${visualTab === "elevation" ? "bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" : "bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"}`} />
                
                {/* Floating Project Metadata & Visual Mode Switcher */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono uppercase font-bold border border-white/10">
                    PROJECT MASTER
                  </span>
                  
                  {/* Visual Mode Selector: Tower vs Floor Plan */}
                  <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-xs p-1 rounded-lg border border-slate-700">
                    <button
                      onClick={() => setVisualTab("elevation")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        visualTab === "elevation" 
                          ? "bg-[#0077ff] text-white font-bold" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Tower Exterior
                    </button>
                    <button
                      onClick={() => setVisualTab("floorplan")}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
                        visualTab === "floorplan" 
                          ? "bg-[#0077ff] text-white font-bold" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Floor Plan 3D
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">
                    {visualTab === "elevation" ? `PROJECT: ${selectedUnit.project}` : `UNIT BLUEPRINT: ${selectedUnit.unit}`}
                  </span>
                  <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sector 150, Noida</span>
                  </div>
                </div>
              </div>

              {/* Unit Controls & Specs */}
              <div className="p-5 pt-0 space-y-4">
                {/* Unit Switcher Tabs */}
                <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800 overflow-x-auto no-scrollbar">
                  {DEMO_UNITS.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => setSelectedUnit(unit)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                        selectedUnit.id === unit.id 
                          ? "bg-[#0077ff] text-white font-bold" 
                          : "bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {unit.unit}
                    </button>
                  ))}
                </div>

                {/* Unit Specifications */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-extrabold text-white">
                      {selectedUnit.tower} &middot; {selectedUnit.unit}
                    </h4>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${selectedUnit.badgeColor}`}>
                      {selectedUnit.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {selectedUnit.config} &middot; {selectedUnit.area} &middot; {selectedUnit.facing}
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">All Inclusive Agreement</span>
                    <span className="text-2xl font-black text-white font-heading">
                      {formatINR(selectedUnit.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Floor</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{selectedUnit.floor}</span>
                  </div>
                </div>

                {/* Action Trigger */}
                <div className="pt-1">
                  <button
                    onClick={handleSend}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {sentWhatsApp ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Floor Plan Dispatched via WhatsApp!</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Floor Plan on WhatsApp</span>
                      </>
                    )}
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
