"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Check, 
  Code2, 
  Copy, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Terminal, 
  Users, 
  Zap,
  CalendarCheck,
  CheckCircle2,
  Share2,
  Clock,
  Download,
  ShieldCheck,
  MapPin,
  PhoneCall,
  CheckCheck
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const SAMPLE_WHATSAPP_SCRIPT = `Hi {{buyer_name}}, thank you for inquiring about {{project_name}} ({{unit_config}}).

I have attached the verified architectural floor plan and approved brochure PDF below:
📄 {{brochure_pdf_link}}

Key Highlights:
• Location: {{location_sector}}
• Possession: {{possession_date}}
• Price: {{all_inclusive_price}}

Would you like to walk through the sample suite this Saturday at 11:30 AM or 3:00 PM?
I can send a live Google Maps location pin and gate visitor pass directly on WhatsApp.`;

const SAMPLE_SITE_VISIT_CHECKLIST = `[ ] 1. T-24h: WhatsApp confirmation sent with Google Maps pin & project gate pass QR.
[ ] 2. T-2h: Automated WhatsApp reminder sent to client with driver/self-drive directions.
[ ] 3. T-30m: Show flat inspected (air-conditioning active, lighting on, ambient fragrance).
[ ] 4. T-15m: Closer present at reception with printed CLP cost sheets & tower inventory matrix.
[ ] 5. During Visit: 1,420 sq.ft carpet area walked; club amenities & sunrise facing highlighted.
[ ] 6. Post Visit (Immediate): 30-second closer voice note transcribed into Sahyak CRM.
[ ] 7. T+2h: Follow-up quotation sent via WhatsApp with 48-hour unit block token option.`;

const SAMPLE_FOLLOWUP_CADENCE = `TOUCH 1 (0 to 15 mins): 1-Tap WhatsApp brochure + introductory call.
TOUCH 2 (Day 1 · 11:30 AM): Tower A vs Tower B comparison & CLP payment plan breakdown.
TOUCH 3 (Day 3 · 6:00 PM): Weekend show-flat calendar invite + driving directions pin.
TOUCH 4 (Day 7): Fresh inventory alert (e.g. Unit 1204 released on higher floor).
TOUCH 5 (Day 14): Final status check: Active inquiry or archive with re-engagement alert.`;

const SAMPLE_WEBHOOK_PAYLOAD = `{
  "event": "lead.inbound",
  "timestamp": "2026-09-20T10:45:00Z",
  "endpoint": "https://api.sahyak.com/v1/ingress/webhook",
  "tenant_id": "org_ncr_realty_01",
  "lead": {
    "name": "Ananya Sharma",
    "phone": "+919811234567",
    "email": "ananya.sharma@example.com",
    "city": "Noida",
    "project_id": "skyline-residences",
    "unit_config": "2BHK",
    "budget_inr": 15000000,
    "source": "meta_ads",
    "utm_campaign": "sec150_luxury_q3"
  }
}`;

export default function ResourcesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practical Real Estate Sales Toolbox</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight">
            Practical Tools, Not Marketing Essays.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Ready-to-use WhatsApp conversion scripts, show-flat visit checklists, and developer webhook payloads. Copy, download, and use directly in your sales operations.
          </p>
        </div>
      </section>

      {/* 2. Practical Sales Tools Grid */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Tool 1: WhatsApp Script -> Realistic WhatsApp Chat Bubble Mockup */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                    WHATSAPP SCRIPT
                  </span>
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    1-Tap First-Response Brochure Drop
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <div><strong>FOR:</strong> Closers &amp; CPs</div>
                    <div><strong>TYPE:</strong> WhatsApp Template</div>
                    <div><strong>FORMAT:</strong> Copy-Paste</div>
                  </div>
                </div>

                {/* Realistic WhatsApp Chat Frame */}
                <div className="rounded-2xl border border-slate-200 bg-[#efeae2] overflow-hidden shadow-inner">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center text-xs">
                        AS
                      </div>
                      <div>
                        <div className="font-semibold leading-tight">Ananya Sharma</div>
                        <div className="text-[10px] text-emerald-100">Online &middot; Sector 150 Lead</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200 font-mono">
                      Verified Business
                    </span>
                  </div>

                  {/* Chat Area */}
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex justify-end">
                      <div className="max-w-[90%] bg-[#d9fdd3] text-slate-800 rounded-2xl rounded-tr-xs p-3 shadow-xs space-y-2 border border-emerald-200/60">
                        {/* PDF Attachment Chip */}
                        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-emerald-300/60">
                          <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <div className="font-bold text-[11px] text-slate-900 truncate">Skyline_Residences_3BHK_Brochure.pdf</div>
                            <div className="text-[9px] text-slate-500">12.4 MB &middot; Floor plans &amp; CLP breakdown</div>
                          </div>
                          <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>

                        {/* Text Content */}
                        <p className="text-[11px] leading-relaxed whitespace-pre-line text-slate-700">
                          Hi <strong className="text-slate-900">Ananya</strong>, thank you for inquiring about <strong className="text-slate-900">Skyline Residences (3BHK Luxury)</strong>.
                          {"\n\n"}
                          • <span className="font-semibold text-slate-900">Location:</span> Sector 150 Expressway{"\n"}
                          • <span className="font-semibold text-slate-900">Possession:</span> Q4 2027{"\n"}
                          • <span className="font-semibold text-slate-900">Price:</span> ₹1.85 Cr All-Inclusive
                          {"\n\n"}
                          Would you like to walk through the sample suite this Saturday at 11:30 AM or 3:00 PM? I can dispatch an automated Google Maps pin &amp; visitor gate pass QR.
                        </p>

                        <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 font-mono">
                          <span>10:45 AM</span>
                          <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("wa-script", SAMPLE_WHATSAPP_SCRIPT)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "wa-script" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "wa-script" ? "Copied to Clipboard!" : "Copy WhatsApp Script"}</span>
              </button>
            </div>

            {/* Tool 2: Site Visit Show Flat Checklist -> Realistic Field SOP Docket */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-700 bg-cyan-100 px-2.5 py-0.5 rounded">
                    SITE VISIT CHECKLIST
                  </span>
                  <CalendarCheck className="w-4 h-4 text-cyan-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Zero No-Show Site Visit Protocol
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <div><strong>FOR:</strong> Site Sales &amp; CPs</div>
                    <div><strong>TYPE:</strong> Field SOP</div>
                    <div><strong>FORMAT:</strong> Checklist</div>
                  </div>
                </div>

                {/* Embossed Field SOP Document Mockup */}
                <div className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200/70 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-900 tracking-wider">
                        STANDARD ON-SITE PROTOCOL &middot; REV 4.2
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">
                      VERIFIED SOP
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700 font-mono">
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-24h:</strong> Automated WhatsApp reminder with Google Maps pin &amp; project gate pass QR.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-2h:</strong> Chauffeur/self-drive route check alert sent to buyer.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">T-30m:</strong> Show flat pre-conditioned (climate control 22°C, soft lighting active).
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">During Visit:</strong> 1,420 sq.ft carpet walkthrough &middot; sunrise orientation shown.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-emerald-600 font-bold shrink-0">✓</span>
                      <div>
                        <strong className="text-slate-900">Post Visit (T+2h):</strong> Personalized quote dispatch with 48h unit block option.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("visit-sop", SAMPLE_SITE_VISIT_CHECKLIST)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "visit-sop" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "visit-sop" ? "Copied to Clipboard!" : "Copy Site Visit SOP"}</span>
              </button>
            </div>

            {/* Tool 3: Follow-Up Cadence Playbook -> Visual Timeline Matrix */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">
                    FOLLOW-UP PLAYBOOK
                  </span>
                  <Zap className="w-4 h-4 text-indigo-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    5-Touch Timing Sequence
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <div><strong>FOR:</strong> Telecallers</div>
                    <div><strong>TYPE:</strong> Cadence Guide</div>
                    <div><strong>FORMAT:</strong> Timing Matrix</div>
                  </div>
                </div>

                {/* Visual Cadence Timeline Nodes */}
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] font-mono text-cyan-400">
                    <span>CADENCE DISPATCH TIMELINE</span>
                    <span>100% SLA COMPLIANT</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-emerald-500/30">
                        1
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-emerald-400 font-bold">TOUCH 1 &middot; 0-15m</span>
                          <span>WhatsApp + Intro Call</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">1-Tap verified brochure PDF dispatch &middot; SLA call</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-cyan-500/30">
                        2
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-cyan-400 font-bold">TOUCH 2 &middot; Day 1 (11:30 AM)</span>
                          <span>Cost Analysis</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Tower A vs B comparison &middot; CLP payment schedule</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-indigo-500/30">
                        3
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-indigo-400 font-bold">TOUCH 3 &middot; Day 3 (6:00 PM)</span>
                          <span>Site Visit Invite</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Weekend show-flat calendar invite + driving Maps pin</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-amber-950 text-amber-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-amber-500/30">
                        4
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-amber-400 font-bold">TOUCH 4 &middot; Day 7</span>
                          <span>Inventory Alert</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">High floor unit allotment release alert</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="w-6 h-6 rounded-lg bg-rose-950 text-rose-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 border border-rose-500/30">
                        5
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-rose-400 font-bold">TOUCH 5 &middot; Day 14</span>
                          <span>Final Audit</span>
                        </div>
                        <div className="text-[11px] text-slate-200 font-medium truncate">Status confirmation &middot; Auto-archive to nurture pool</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("followup-playbook", SAMPLE_FOLLOWUP_CADENCE)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "followup-playbook" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "followup-playbook" ? "Copied to Clipboard!" : "Copy Cadence Matrix"}</span>
              </button>
            </div>

            {/* Tool 4: Developer Webhook Spec -> IDE Code Editor Window Mockup */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                    DEVELOPER WEBHOOK
                  </span>
                  <Code2 className="w-4 h-4 text-purple-600" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Standard Inbound Lead JSON Spec
                  </h3>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                    <div><strong>FOR:</strong> Engineers &amp; Growth</div>
                    <div><strong>METHOD:</strong> POST</div>
                    <div><strong>FORMAT:</strong> JSON Payload</div>
                  </div>
                </div>

                {/* IDE Code Editor Window Mockup */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
                  {/* IDE Window Top Bar */}
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-slate-400 ml-2 text-[11px]">inbound_lead_spec.json</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2 py-0.5 rounded">
                      POST 200 OK
                    </span>
                  </div>

                  {/* Code Body with Syntax Highlighting */}
                  <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto text-slate-300">
                    <pre className="text-cyan-300">
                      <code>{SAMPLE_WEBHOOK_PAYLOAD}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy("webhook-json", SAMPLE_WEBHOOK_PAYLOAD)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedId === "webhook-json" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedId === "webhook-json" ? "Copied to Clipboard!" : "Copy Webhook JSON"}</span>
              </button>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
