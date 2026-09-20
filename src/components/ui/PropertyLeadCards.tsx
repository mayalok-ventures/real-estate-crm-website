import React from "react";
import {
  Building2,
  FileCheck2,
  MapPin,
  Mic,
  Calendar,
  CheckCircle2,
  Trophy,
  Layers,
  Sparkles,
  Phone,
  Send,
  Zap,
} from "lucide-react";

/**
 * 1. Real Estate Inbound Lead Source Card
 */
export function RealEstateLeadBadge({
  source = "Meta Property Campaign",
  project = "Godrej Palm Retreat",
  unitPreference = "3BHK Luxury Penthouse",
  budget = "₹1.85 Cr",
  buyerName = "Vikram Malhotra",
  className = "",
}: {
  source?: string;
  project?: string;
  unitPreference?: string;
  budget?: string;
  buyerName?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-left ${className}`}
    >
      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0077ff] flex items-center justify-center shrink-0 border border-blue-200">
        <Building2 className="w-4 h-4" />
      </div>
      <div className="leading-tight space-y-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
            {source}
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            {budget}
          </span>
        </div>
        <div className="text-xs font-bold text-slate-900 font-heading truncate max-w-[190px]">
          {buyerName} — {project}
        </div>
        <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
          {unitPreference}
        </div>
      </div>
    </div>
  );
}

/**
 * 2. Floating Verified Floor Plan / Proposal PDF Card
 */
export function FloatingProposalCard({
  title = "FloorPlan_Godrej_UnitB1402.pdf",
  size = "1.4 MB",
  verified = true,
  className = "",
}: {
  title?: string;
  size?: string;
  verified?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`p-3 sm:p-3.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl space-y-2 text-left transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold text-slate-900 font-heading truncate max-w-[160px]">
              {title}
            </div>
            <div className="text-[10px] font-mono text-slate-400">{size} • 1-Tap Ready</div>
          </div>
        </div>
        {verified && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-300">
            VERIFIED
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * 3. Scheduled Site Visit Chip
 */
export function SiteVisitChip({
  location = "Tower B, Sector 150, Noida",
  time = "Sunday 11:30 AM",
  agent = "Aditya V. (Assigned Closer)",
  className = "",
}: {
  location?: string;
  time?: string;
  agent?: string;
  className?: string;
}) {
  return (
    <div
      className={`p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl space-y-1.5 text-left ${className}`}
    >
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1 font-semibold text-slate-700">
          <Calendar className="w-3 h-3 text-[#0077ff]" />
          <span>{time}</span>
        </span>
        <span className="text-emerald-600 font-bold">CONFIRMED</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-800">
        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <span className="font-semibold truncate max-w-[180px]">{location}</span>
      </div>
      <div className="text-[10px] text-slate-500 font-mono truncate">
        {agent}
      </div>
    </div>
  );
}

/**
 * 4. Audio Voice Note AI Extraction Strip
 */
export function VoiceNoteWaveformStrip({
  duration = "0:15",
  transcript = "Client confirmed budget ₹1.85 Cr, wants high floor 3BHK, scheduled Sunday visit.",
  className = "",
}: {
  duration?: string;
  transcript?: string;
  className?: string;
}) {
  return (
    <div
      className={`p-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg space-y-1.5 text-left ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
          <Mic className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-0.5 flex-1 h-3">
          {[4, 8, 12, 6, 14, 10, 8, 14, 12, 6, 10, 4, 8, 12, 10, 6, 4, 8, 12, 6].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-indigo-400/80"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500">{duration}</span>
      </div>
      <div className="text-[11px] text-slate-600 italic line-clamp-1 pl-1.5 border-l-2 border-indigo-400">
        &ldquo;{transcript}&rdquo;
      </div>
    </div>
  );
}

/**
 * 5. Unit Inventory Status Badge / Card
 */
export function UnitInventoryCard({
  unit = "Unit #B-1402",
  config = "3BHK Luxury + Servant",
  carpetArea = "1,850 sq.ft",
  status = "Available",
  price = "₹1.85 Cr",
  className = "",
}: {
  unit?: string;
  config?: string;
  carpetArea?: string;
  status?: "Available" | "Blocked" | "Booked";
  price?: string;
  className?: string;
}) {
  const statusColor =
    status === "Available"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : status === "Blocked"
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-slate-200 text-slate-700 border-slate-300";

  return (
    <div
      className={`p-3 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-left ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-heading font-extrabold text-xs text-slate-900">{unit}</span>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="text-[11px] text-slate-600 leading-snug">
        <div>{config}</div>
        <div className="text-[10px] text-slate-400 font-mono">{carpetArea} • High Floor</div>
      </div>
      <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 font-numeric">
        <span>{price}</span>
        <span className="text-[10px] font-mono text-[#0077ff] font-semibold">20:80 CLP</span>
      </div>
    </div>
  );
}

/**
 * 6. Booking Won / Transaction Milestone Marker
 */
export function BookingOutcomeMarker({
  unit = "Unit #B-1402",
  amount = "₹1,85,00,000",
  tokenReceived = "Token ₹5,00,000 Verified",
  timeToClose = "3.4 Days",
  className = "",
}: {
  unit?: string;
  amount?: string;
  tokenReceived?: string;
  timeToClose?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 shadow-md text-slate-900 ${className}`}
    >
      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
        <Trophy className="w-4 h-4" />
      </div>
      <div className="text-left leading-tight">
        <div className="text-xs font-bold text-emerald-900 font-numeric">{amount} ({unit})</div>
        <div className="text-[10px] font-mono text-emerald-700 font-semibold">
          {tokenReceived} • Closed in {timeToClose}
        </div>
      </div>
    </div>
  );
}
