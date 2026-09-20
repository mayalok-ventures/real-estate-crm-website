"use client";

import React, { useState } from "react";
import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Navigation, 
  Send, 
  Star, 
  UserCheck 
} from "lucide-react";

interface VisitSchedule {
  id: string;
  client: string;
  project: string;
  date: string;
  time: string;
  assignedTo: string;
  driverStatus: string;
  locationStatus: string;
  reminderStatus: string;
  feedbackStatus: string;
}

const UPCOMING_VISITS: VisitSchedule[] = [
  {
    id: "sv-1",
    client: "Vikram Malhotra",
    project: "Godrej Palm Retreat • Show Flat #302",
    date: "Saturday, 21 Sep",
    time: "11:30 AM",
    assignedTo: "Rajesh S. (Senior Consultant)",
    driverStatus: "Cab Dispatched (Swift Dzire #DL-3C-8910)",
    locationStatus: "Live Google Maps Pin Delivered via WhatsApp",
    reminderStatus: "Automated Reminder T-2h Scheduled (09:30 AM)",
    feedbackStatus: "Post-Visit Feedback Form Queued (12:30 PM)"
  },
  {
    id: "sv-2",
    client: "Dr. Ananya Iyer",
    project: "DLF Privana West • 4BHK Sample Suite",
    date: "Saturday, 21 Sep",
    time: "02:00 PM",
    assignedTo: "Priya V. (Luxury Portfolio Lead)",
    driverStatus: "Self-Drive (Gate Pass QR Code Generated)",
    locationStatus: "Show Flat Pin + Club House Access Sent",
    reminderStatus: "Automated Reminder Scheduled (12:00 PM)",
    feedbackStatus: "Feedback Automation Active"
  },
  {
    id: "sv-3",
    client: "Rohit Bansal (NRI)",
    project: "M3M Crown • Tower C Penthouse",
    date: "Sunday, 22 Sep",
    time: "10:00 AM",
    assignedTo: "Amit Verma (Channel Partner Lead)",
    driverStatus: "Airport Pickup Arranged (T3 to Site)",
    locationStatus: "Interactive 3D Virtual Tour Pre-Sent",
    reminderStatus: "WhatsApp + Email Confirmation Sent",
    feedbackStatus: "NRI Spec Sheet Pack Queued"
  }
];

export default function SiteVisitCommand() {
  const [activeVisit, setActiveVisit] = useState<VisitSchedule>(UPCOMING_VISITS[0]);
  const [pinSent, setPinSent] = useState<boolean>(false);

  const handleSendPin = () => {
    setPinSent(true);
    setTimeout(() => setPinSent(false), 2500);
  };

  return (
    <section 
      id="site-visits" 
      data-analytics-section="site_visit_command"
      className="py-24 bg-white relative overflow-hidden border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-700 text-xs font-semibold mb-4">
            <Navigation className="w-3.5 h-3.5" />
            Show Flat Logistics
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Site Visit Command Center
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            35% of Indian property site visits fail due to lost directions, forgotten appointments, and delayed sales reps. 
            Sahyak reduces no-shows to under 8% through automated WhatsApp logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Schedule List */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Today &amp; Weekend Site Visits
            </span>
            {UPCOMING_VISITS.map((visit) => {
              const isSelected = activeVisit.id === visit.id;
              return (
                <div
                  key={visit.id}
                  onClick={() => setActiveVisit(visit)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-cyan-50/50 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-sm">{visit.client}</h3>
                    <span className="text-xs font-mono font-semibold text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded">
                      {visit.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate mb-2">{visit.project}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>{visit.date}</span>
                    <span className="font-semibold text-slate-700">{visit.assignedTo.split(" ")[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Interactive Command Panel */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                    Confirmed Visit Docket
                  </span>
                  <h3 className="text-xl font-bold text-white">{activeVisit.client}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeVisit.project}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Scheduled Time</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {activeVisit.date} • {activeVisit.time}
                  </span>
                </div>
              </div>

              {/* Logistics Timeline */}
              <div className="space-y-4 text-xs mb-8">
                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Live Navigation Pin</span>
                    <span className="font-medium text-slate-200">{activeVisit.locationStatus}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Transit Logistics</span>
                    <span className="font-medium text-slate-200">{activeVisit.driverStatus}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Automated No-Show Guard</span>
                    <span className="font-medium text-slate-200">{activeVisit.reminderStatus}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Post-Visit Rating &amp; Feedback</span>
                    <span className="font-medium text-slate-200">{activeVisit.feedbackStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <span className="text-xs text-slate-400">
                Host Assigned: <strong className="text-white">{activeVisit.assignedTo}</strong>
              </span>
              <button
                onClick={handleSendPin}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                {pinSent ? "WhatsApp Location Sent!" : "Re-Send WhatsApp Location Pin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
