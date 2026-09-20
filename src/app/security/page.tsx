import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  CheckCircle2, 
  Database, 
  EyeOff, 
  FileCheck, 
  KeyRound, 
  Lock, 
  Server, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  UserCheck,
  ArrowDown,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Data Security Architecture & Tenant Isolation — Sahyak CRM",
  description:
    "Explore the architectural layers of Sahyak: Organization context, cryptographic tenant isolation, role-based access control, anti-poaching phone masking, and immutable audit logs.",
  alternates: {
    canonical: "https://sahyak.com/security"
  }
};

const ARCHITECTURE_STEPS = [
  {
    step: "01",
    title: "ORGANIZATION CONTEXT",
    tagline: "Workspace Boundary",
    detail: "Every brokerage workspace operates in a logically separated tenant boundary. No shared tables or cross-tenant leaks.",
    badge: "IMPLEMENTED"
  },
  {
    step: "02",
    title: "TENANT ISOLATION",
    tagline: "Cryptographic Partitioning",
    detail: "Database queries are scoped by strict tenant cryptographic identifiers at the ORM layer before execution.",
    badge: "IMPLEMENTED"
  },
  {
    step: "03",
    title: "ACCESS CONTROL",
    tagline: "Granular Role Hierarchy",
    detail: "Brokers, Team Leads, Telecallers, and Admins have strictly partitioned view/edit permissions.",
    badge: "IMPLEMENTED"
  },
  {
    step: "04",
    title: "DATA PROTECTION",
    tagline: "Phone Masking & AES-256",
    detail: "Client numbers masked (+91 98112•••••) for telecallers; data encrypted in-flight (TLS 1.3) and at rest.",
    badge: "IMPLEMENTED"
  },
  {
    step: "05",
    title: "AUDIT TRAIL",
    tagline: "Immutable Event Logging",
    detail: "Every lead export, contact view, and proposal dispatch writes an immutable tamper-evident record.",
    badge: "IMPLEMENTED"
  }
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Security Architecture &middot; Visual Story</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight">
            Your High-Net-Worth Client Database is <span className="brand-gradient-text">Architecturally Protected.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In Indian real estate, lead theft and contact poaching by departing agents destroy brokerages. 
            Sahyak is built with step-down cryptographic isolation, phone masking, and strict audit logs.
          </p>
        </div>
      </section>

      {/* 2. THE VISUAL ARCHITECTURE STORY: Step-Down Flow */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">Step-Down Protection Model</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              How Data Moves Through Sahyak&apos;s Defenses
            </h2>
          </div>

          {/* Sequential Step-Down Architecture Cards */}
          <div className="space-y-4">
            {ARCHITECTURE_STEPS.map((step, idx) => (
              <div key={step.step} className="relative">
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono font-extrabold text-lg flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">{step.title}</span>
                        <span className="text-slate-600">&middot;</span>
                        <span className="text-xs text-slate-400 font-mono">{step.tagline}</span>
                      </div>
                      <p className="text-sm text-slate-300 font-medium mt-1">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0">
                    {step.badge}
                  </span>
                </div>

                {idx < ARCHITECTURE_STEPS.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowDown className="w-4 h-4 text-slate-700" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enterprise Datacenter Cryptographic Vault Visual Anchor */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 aspect-[21/9] sm:aspect-[24/9] shadow-2xl group">
            <Image
              src="/images/security-datacenter-vault.jpg"
              alt="High-security enterprise cryptographic datacenter server vault"
              fill
              sizes="(max-width: 1024px) 100vw, 960px"
              className="object-cover object-center brightness-90 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-1 rounded inline-block">
                    Physical &amp; Cryptographic Vault Infrastructure
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Regional Indian Datacenter Partitioning &middot; AES-256 Storage
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full shrink-0">
                  TLS 1.3 &middot; Zero Exfiltration
                </span>
              </div>
            </div>
          </div>

          {/* Static Architecture Schema Diagram */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                Static Logical Isolation Topology
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Zero Cross-Tenant Leakage</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-center">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant A (Brokerage 1)</span>
                <span className="text-white font-bold block">Isolated Token Scope</span>
                <span className="text-emerald-400 text-[10px]">Masked Contacts (+91 98112•••••)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant B (Brokerage 2)</span>
                <span className="text-white font-bold block">Isolated Token Scope</span>
                <span className="text-emerald-400 text-[10px]">Masked Contacts (+91 98223•••••)</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant C (Developer)</span>
                <span className="text-white font-bold block">Isolated Token Scope</span>
                <span className="text-emerald-400 text-[10px]">Multi-Tower Inventory DB</span>
              </div>
            </div>
          </div>

          {/* Supporting Architecture Video */}
          <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>security-vault-architecture.mp4</span>
              </div>
              <span className="text-cyan-400">Supporting Architecture Evidence</span>
            </div>
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label="Sahyak cryptographic security vault video"
              >
                <source src="/videos/security-vault-architecture.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Progressive Disclosure: Implemented vs Alignment vs Roadmap */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 font-heading">
              Transparent Security Posture
            </h2>
            <p className="text-sm text-slate-500">
              Clear separation between implemented technical controls, compliance alignment, and architectural roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Column 1: Implemented Controls */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                  IMPLEMENTED CONTROLS
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Anti-Poaching Phone Masking:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Raw buyer numbers (+91 98112•••••) masked from telecallers and agents to prevent client database exfiltration.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Cryptographic Tenant Scoping:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Every query enforces tenant identity checks at the ORM layer, preventing data leakage.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">In-Transit &amp; At-Rest Encryption:</span>
                  <p className="text-slate-600 leading-relaxed">
                    TLS 1.3 enforced for all browser sessions; AES-256 encryption on Cloudflare D1 storage.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Immutable Export Audit Logs:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Every CSV export writes an immutable audit record with actor, timestamp, IP, and lead count.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Alignment & Readiness */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                  ALIGNMENT &amp; READINESS
                </span>
                <Shield className="w-4 h-4 text-blue-600" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Role-Based Access Control (RBAC):</span>
                  <p className="text-slate-600 leading-relaxed">
                    Strict tenant segregation, granular permission hierarchies, and least-privilege administrative access policies.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">DPDP Act 2023 Readiness:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Designed around Indian data protection principles: data minimization, purpose limitation, and consent verification.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Indian Data Sovereignty:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Database storage nodes located in compliant regional infrastructure within India.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Future Roadmap */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                  ARCHITECTURAL ROADMAP
                </span>
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Client-Side Zero-Knowledge Encryption:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Evaluating cryptographic client-side field indexing for ultra-sensitive HNI financial net-worth data.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Hardware Security Key (FIDO2) Support:</span>
                  <p className="text-slate-600 leading-relaxed">
                    YubiKey and biometric WebAuthn logins for enterprise sales head and admin accounts.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Automated DLP Anomaly Alerts:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Real-time machine learning detection of anomalous bulk contact views or after-hours exports.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  );
}
