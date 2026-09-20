"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  MapPin, 
  MessageSquare, 
  Navigation, 
  QrCode, 
  Send, 
  Sparkles,
  UserCheck 
} from "lucide-react";

export default function SiteVisitMoments() {
  const [visitStatus, setVisitStatus] = useState<"scheduled" | "dispatched" | "visited">("scheduled");
  const [pinSentNotice, setPinSentNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "pavilion" | "whatsapp" | "gatepass">("map");

  const handleTriggerPin = () => {
    setPinSentNotice(true);
    setVisitStatus("dispatched");
    setActiveTab("whatsapp");
    setTimeout(() => setPinSentNotice(false), 2500);
  };

  return (
    <section 
      id="site-visits"
      data-analytics-section="site_visit_moments"
      className="py-16 sm:py-24 bg-white relative overflow-hidden border-b border-slate-200/80"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Minimal Copy */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-mono uppercase tracking-wider mb-3">
            <Navigation className="w-3.5 h-3.5" />
            Show Flat Logistics
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
            The site visit is where decisions happen.
          </h2>
          <p className="mt-2 text-base sm:text-lg text-slate-500 font-medium">
            Automated WhatsApp directions, calendar invites, and arrival tracking.
          </p>
        </div>

        {/* The Live Site Visit Event Canvas */}
        <div className="max-w-5xl mx-auto bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Event Details & Checklist (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 space-y-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0077ff]" />
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                    Saturday &middot; 11:30 AM
                  </span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase border transition-colors ${
                  visitStatus === "visited"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : visitStatus === "dispatched"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }`}>
                  {visitStatus === "visited" ? "VISITED" : visitStatus === "dispatched" ? "DIRECTIONS SENT" : "SCHEDULED"}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-extrabold text-slate-900">
                  Godrej Palm Retreat &middot; Show Flat #302
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Buyer: Vikram Malhotra &middot; Host Closer: Rahul Sharma
                </p>
              </div>

              {/* Status Checklist */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Calendar Invite Accepted (Google Calendar Sync)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <CheckCircle2 className={`w-4 h-4 ${visitStatus !== "scheduled" ? "text-emerald-500" : "text-slate-300"} shrink-0`} />
                  <span>Live Google Maps Pin Delivered via WhatsApp</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-700">
                  <CheckCircle2 className={`w-4 h-4 ${visitStatus === "visited" ? "text-emerald-500" : "text-slate-300"} shrink-0`} />
                  <span>Show-Flat Inspection Concluded &middot; Next Move: CLP Quotation</span>
                </div>
              </div>

              {/* Interactive View Mode Tabs */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">
                  Preview:
                </span>
                <button
                  onClick={() => setActiveTab("map")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === "map"
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  GPS Route
                </button>
                <button
                  onClick={() => setActiveTab("pavilion")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === "pavilion"
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Show-Flat Experience
                </button>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === "whatsapp"
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  WhatsApp Pin
                </button>
                <button
                  onClick={() => setActiveTab("gatepass")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeTab === "gatepass"
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Gate Pass QR
                </button>
              </div>
            </div>

            {/* Right: Interactive Triggers (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1">
                Show Flat Triggers
              </span>

              <button
                onClick={handleTriggerPin}
                className="w-full p-3.5 rounded-xl bg-[#0077ff] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{pinSentNotice ? "Pin Sent on WhatsApp!" : "Send Google Maps Pin"}</span>
                </div>
                <Send className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setVisitStatus("dispatched");
                  setActiveTab("gatepass");
                }}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-600" />
                  <span>Generate Visitor Gate Pass</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">QR Code</span>
              </button>

              <button
                onClick={() => setVisitStatus("visited")}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Mark Site Visit Attended</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">Done</span>
              </button>

              <div className="p-2 text-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  No lost buyers. No missed appointments.
                </span>
              </div>
            </div>

          </div>

          {/* REALISTIC CODED GPS ROUTE & LOGISTICS DISPLAY */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {activeTab === "map" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#0077ff]" />
                    <span className="text-xs font-bold text-slate-800">
                      Automated Visit Directions &middot; Noida-Greater Noida Expressway
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Estimated Transit: 24 mins (18.4 km)</span>
                  </div>
                </div>

                {/* SVG Visual GPS Route */}
                <div className="relative h-44 sm:h-52 w-full rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center">
                  {/* Subtle Grid Lines */}
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{
                      backgroundImage: "linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)",
                      backgroundSize: "28px 28px"
                    }}
                  />

                  {/* SVG Road Layout and Animated GPS Path */}
                  <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 600 200">
                    {/* Background Highway Arteries */}
                    <path d="M 0,80 L 600,120" stroke="#334155" strokeWidth="12" strokeLinecap="round" fill="none" />
                    <path d="M 120,0 L 220,200" stroke="#1e293b" strokeWidth="8" fill="none" />
                    <path d="M 400,0 L 460,200" stroke="#1e293b" strokeWidth="8" fill="none" />
                    
                    {/* Active Navigation Route Line */}
                    <path 
                      d="M 60,140 Q 200,60 380,100 T 540,70" 
                      stroke="#0077ff" 
                      strokeWidth="5" 
                      strokeDasharray="6 4" 
                      strokeLinecap="round" 
                      fill="none" 
                    />

                    {/* Start Pin: Closer Dispatch Point */}
                    <circle cx="60" cy="140" r="7" fill="#0077ff" />
                    <circle cx="60" cy="140" r="14" fill="#0077ff" opacity="0.25" />

                    {/* Destination Pin: Godrej Palm Retreat Gate 2 */}
                    <circle cx="540" cy="70" r="9" fill="#10b981" />
                    <circle cx="540" cy="70" r="18" fill="#10b981" opacity="0.3" className="animate-ping" />
                  </svg>

                  {/* Origin Badge */}
                  <div className="absolute left-4 bottom-4 bg-slate-950/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-left shadow-lg">
                    <span className="text-[9px] font-mono uppercase text-slate-400 block">Host Origin</span>
                    <span className="text-xs font-bold text-slate-200">Rahul Sharma (Closer)</span>
                  </div>

                  {/* Destination Tag */}
                  <div className="absolute right-4 top-4 bg-slate-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-right shadow-lg">
                    <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold block">Destination Gate 2</span>
                    <span className="text-xs font-bold text-slate-100">Godrej Palm Retreat, Sector 150</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                  <span className="font-mono text-[11px]">
                    Waypoint: Pari Chowk interchange &rarr; Sector 150 Green Corridor
                  </span>
                  <span className="font-mono text-[11px] text-[#0077ff] font-bold">
                    Google Maps pin queued for buyer WhatsApp delivery
                  </span>
                </div>
              </div>
            )}

            {activeTab === "pavilion" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Destination &middot; Experience Centre &amp; Verified Show Flats
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    Grand Reserve &middot; Reception Portico
                  </span>
                </div>

                <div className="relative h-56 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner">
                  <img
                    src="/images/site-visit-pavilion-exterior.jpg"
                    alt="Experience Center and Show Flats entrance pavilion with fountain and concierge"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                    <span className="font-bold">Arrival Drop-off &middot; Circular Driveway &middot; Gate 2</span>
                    <span className="text-emerald-400 bg-black/60 px-2 py-0.5 rounded text-[10px]">Concierge On Duty</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  The buyer arrives directly at the dedicated show-flat reception pavilion. Concierge scans the visitor QR gate pass on arrival, notifying the sales rep instantly on WhatsApp.
                </p>
              </div>
            )}

            {activeTab === "whatsapp" && (
              <div className="p-5 sm:p-6 bg-slate-950 text-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      Dispatched WhatsApp Location Payload
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    STATUS: DELIVERED (✓✓)
                  </span>
                </div>

                {/* WhatsApp Chat Bubble Simulation */}
                <div className="max-w-md bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>Sahyak Auto-Dispatch</span>
                    <span>11:00 AM</span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Hello <span className="font-bold text-white">Vikram Malhotra</span>, looking forward to welcoming you at <span className="font-bold text-white">Godrej Palm Retreat</span> today at 11:30 AM for Show Flat #302.
                  </p>

                  <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>Godrej Palm Retreat &middot; Gate 2 Visitor Parking</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      https://maps.google.com/?q=Godrej+Palm+Retreat+Sector+150
                    </div>
                    <div className="text-[10px] font-mono text-cyan-400">
                      Host Contact: Rahul Sharma (+91 98112 •••••)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "gatepass" && (
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 text-white">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-block px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 text-[10px] font-mono font-bold border border-purple-700">
                    VISITOR ENTRY CLEARANCE (SAMPLE)
                  </div>
                  <h4 className="text-lg font-extrabold text-white">
                    Show-Flat Security Gate Pass
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Pre-registered visitor pass format for residential society security desks and gate arrival identification.
                  </p>
                  <div className="text-xs font-mono text-slate-300 pt-1">
                    Pass ID: <span className="text-purple-400 font-bold">GPR-150-302-VM</span> &middot; Valid Saturday Only
                  </div>
                </div>

                {/* SVG QR Code Simulation */}
                <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 shrink-0 text-center space-y-1">
                  <div className="w-28 h-28 bg-slate-950 p-2 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-white" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-600 block">Scan at Gate 2</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

