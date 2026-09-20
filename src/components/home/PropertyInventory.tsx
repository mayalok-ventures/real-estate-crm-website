"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Check, 
  Copy, 
  Compass, 
  Eye, 
  Layers, 
  Maximize2, 
  MessageSquare, 
  Share2, 
  SlidersHorizontal 
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PropertyUnit {
  id: string;
  unitNumber: string;
  tower: "Tower A" | "Tower B" | "Sky Villas";
  floor: number;
  config: "2BHK" | "3BHK" | "4BHK Penthouse";
  carpetArea: number; // sq ft
  superBuiltUp: number; // sq ft
  facing: string;
  price: number;
  status: "Available" | "Blocked (48h)" | "Booked";
  clpStage: string;
}

const UNITS: PropertyUnit[] = [
  {
    id: "unit-1",
    unitNumber: "A-1201",
    tower: "Tower A",
    floor: 12,
    config: "3BHK",
    carpetArea: 1680,
    superBuiltUp: 2150,
    facing: "North-East (Club View)",
    price: 24500000,
    status: "Available",
    clpStage: "14th Slab Completed"
  },
  {
    id: "unit-2",
    unitNumber: "A-1402",
    tower: "Tower A",
    floor: 14,
    config: "3BHK",
    carpetArea: 1720,
    superBuiltUp: 2200,
    facing: "East (Sunrise / Green Belt)",
    price: 25200000,
    status: "Blocked (48h)",
    clpStage: "14th Slab Completed"
  },
  {
    id: "unit-3",
    unitNumber: "A-1804",
    tower: "Tower A",
    floor: 18,
    config: "4BHK Penthouse",
    carpetArea: 2850,
    superBuiltUp: 3650,
    facing: "North (Panoramic Skyline)",
    price: 48500000,
    status: "Available",
    clpStage: "Terrace Waterproofing"
  },
  {
    id: "unit-4",
    unitNumber: "B-0803",
    tower: "Tower B",
    floor: 8,
    config: "2BHK",
    carpetArea: 980,
    superBuiltUp: 1320,
    facing: "South-East (Courtyard)",
    price: 13500000,
    status: "Booked",
    clpStage: "Finishing & Electricals"
  },
  {
    id: "unit-5",
    unitNumber: "B-1102",
    tower: "Tower B",
    floor: 11,
    config: "2BHK",
    carpetArea: 1040,
    superBuiltUp: 1380,
    facing: "East (Park View)",
    price: 14200000,
    status: "Available",
    clpStage: "Finishing & Electricals"
  },
  {
    id: "unit-6",
    unitNumber: "SV-02",
    tower: "Sky Villas",
    floor: 22,
    config: "4BHK Penthouse",
    carpetArea: 3400,
    superBuiltUp: 4450,
    facing: "360° Wrap-around Deck",
    price: 62000000,
    status: "Blocked (48h)",
    clpStage: "Structural Handover"
  }
];

export default function PropertyInventory() {
  const [selectedTower, setSelectedTower] = useState<string>("All");
  const [selectedConfig, setSelectedConfig] = useState<string>("All");
  const [activeUnit, setActiveUnit] = useState<PropertyUnit>(UNITS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [whatsAppSent, setWhatsAppSent] = useState<boolean>(false);

  const filteredUnits = UNITS.filter((u) => {
    const towerMatch = selectedTower === "All" || u.tower === selectedTower;
    const configMatch = selectedConfig === "All" || u.config === selectedConfig;
    return towerMatch && configMatch;
  });

  const handleShareQuote = () => {
    setWhatsAppSent(true);
    setTimeout(() => setWhatsAppSent(false), 3000);
  };

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText(
      `Unit ${activeUnit.unitNumber} (${activeUnit.config}) - ${activeUnit.tower}. Price: ${formatINR(activeUnit.price)}, Area: ${activeUnit.superBuiltUp} sq.ft. Facing: ${activeUnit.facing}`
    );
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      id="inventory" 
      data-analytics-section="property_inventory"
      className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5 text-cyan-600" />
            Live Property &amp; Unit Matrix
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Stop Selling Units That Were Blocked 20 Minutes Ago
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Real estate inventory that synchronizes live between head office, site sales executive, and channel partners with 1-click WhatsApp quote sharing.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Towers:
            </span>
            {["All", "Tower A", "Tower B", "Sky Villas"].map((tower) => (
              <button
                key={tower}
                onClick={() => setSelectedTower(tower)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedTower === tower
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tower}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 mr-2">Config:</span>
            {["All", "2BHK", "3BHK", "4BHK Penthouse"].map((cfg) => (
              <button
                key={cfg}
                onClick={() => setSelectedConfig(cfg)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedConfig === cfg
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cfg}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Unit Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredUnits.map((unit) => {
              const isSelected = activeUnit.id === unit.id;
              let statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
              if (unit.status === "Blocked (48h)") {
                statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
              } else if (unit.status === "Booked") {
                statusBadgeClass = "bg-slate-100 text-slate-500 border-slate-200";
              }

              return (
                <div
                  key={unit.id}
                  onClick={() => setActiveUnit(unit)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-white border-cyan-500 ring-2 ring-cyan-500/20 shadow-md"
                      : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-base text-slate-900">{unit.unitNumber}</span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {unit.tower}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}>
                      {unit.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type:</span>
                      <span className="font-semibold text-slate-800">{unit.config}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Super Area:</span>
                      <span className="font-semibold text-slate-800">{unit.superBuiltUp} sq.ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Orientation:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">{unit.facing}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-400">Total Price</div>
                    <div className="text-sm font-bold text-slate-900">{formatINR(unit.price)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unit Detail & 1-Click WhatsApp Share Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold text-cyan-600 tracking-wider uppercase">Unit Spec Sheet</span>
                <h3 className="text-2xl font-black text-slate-900">{activeUnit.unitNumber}</h3>
                <p className="text-xs text-slate-500">{activeUnit.tower} • Floor {activeUnit.floor}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Ticket Size</span>
                <span className="text-xl font-extrabold text-slate-900">{formatINR(activeUnit.price)}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-slate-400 block mb-0.5">Carpet Area (RERA)</span>
                  <span className="text-sm font-bold text-slate-800">{activeUnit.carpetArea} sq.ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Super Built-Up Area</span>
                  <span className="text-sm font-bold text-slate-800">{activeUnit.superBuiltUp} sq.ft</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Vastu / Facing</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-600" />
                    {activeUnit.facing}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Construction Stage</span>
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    {activeUnit.clpStage}
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-100 flex items-center justify-between text-cyan-900">
                <span>Inventory Status:</span>
                <span className="font-bold">{activeUnit.status}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={handleShareQuote}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                {whatsAppSent ? "Brochure & Floor Plan Sent via WhatsApp!" : "1-Click Share Floor Plan & Quote to WhatsApp"}
              </button>

              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied Spec to Clipboard" : "Copy Quote Summary for Email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
