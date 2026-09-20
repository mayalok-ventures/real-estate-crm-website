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

import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Data Security Architecture & Tenant Isolation — Sahyak CRM",
  description:
    "Explore Sahyak's security architecture: tenant-scoped data access, role-based permissions, secure transport, webhook verification, and auditable support access.",
  path: "/security",
  keywords: [
    "real estate CRM data security",
    "tenant isolation real estate",
    "CRM role based access control",
    "real estate webhook verification",
    "audit access logging CRM",
  ],
});

const ARCHITECTURE_STEPS = [
  {
    step: "01",
    title: "ORGANIZATION CONTEXT",
    tagline: "Workspace Boundary",
    detail: "Each organization operates within a tenant-scoped workspace boundary, with application queries and access paths scoped to the organization context.",
    badge: "IMPLEMENTED"
  },
  {
    step: "02",
    title: "TENANT ISOLATION",
    tagline: "Organization-Scoped Data Access",
    detail: "Application queries are scoped to the organization's workspace context, helping prevent one organization's CRM data from being accessed through another organization's normal application flow.",
    badge: "IMPLEMENTED"
  },
  {
    step: "03",
    title: "ACCESS CONTROL",
    tagline: "Role-Based Access Control",
    detail: "Role-based permissions control which users can view, create, edit, export, or administer CRM data according to their assigned access.",
    badge: "IMPLEMENTED"
  },
  {
    step: "04",
    title: "DATA PROTECTION",
    tagline: "Secure Transport & Access Controls",
    detail: "Sensitive CRM access is protected through HTTPS/TLS, role-based permissions and application-level access controls. Supported workflows can also restrict visibility of sensitive contact information.",
    badge: "IMPLEMENTED"
  },
  {
    step: "05",
    title: "AUDIT TRAIL",
    tagline: "Audited Activity Logging",
    detail: "Audited administrative and support activities are recorded to provide traceability for sensitive operational access.",
    badge: "IMPLEMENTED"
  }
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Security Architecture &middot; Controls &amp; Posture</span>
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto font-heading leading-tight break-words">
            Your Real Estate Sales Data, <span className="brand-gradient-text">Architecturally Protected.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Real estate teams handle sensitive buyer, sales and inventory data every day. Sahyak is built with tenant-scoped data access, role-based permissions, secure transport, webhook verification and auditable administrative access.
          </p>
        </div>
      </section>

      {/* 2. THE VISUAL ARCHITECTURE STORY: Step-Down Flow */}
      <section className="py-12 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">Step-Down Protection Model</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading">
              How Data Moves Through Sahyak&apos;s Defenses
            </h2>
          </div>

          {/* Sequential Step-Down Architecture Cards */}
          <div className="space-y-3 sm:space-y-4">
            {ARCHITECTURE_STEPS.map((step, idx) => (
              <div key={step.step} className="relative">
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 hover:border-slate-700 transition-all">
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
                    <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono font-extrabold text-base sm:text-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {step.step}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">{step.title}</span>
                        <span className="text-slate-600 hidden sm:inline">&middot;</span>
                        <span className="text-xs text-slate-400 font-mono">{step.tagline}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shrink-0 self-start md:self-auto">
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

          {/* Illustrative Security Architecture Visual Anchor */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/9] min-h-[220px] sm:min-h-0 shadow-2xl group">
            <Image
              src="/images/security-datacenter-vault.jpg"
              alt="Illustrative security architecture diagram"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 960px"
              className="object-cover object-center brightness-90 group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent p-4 sm:p-6 flex flex-col justify-end">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 sm:py-1 rounded inline-block">
                    Security Architecture Illustration
                  </span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white leading-snug">
                    Security Architecture &amp; Access Controls
                  </h3>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 sm:px-3 py-1 rounded-full shrink-0 self-start sm:self-auto">
                  Tenant Isolation &middot; RBAC &middot; HTTPS/TLS
                </span>
              </div>
            </div>
          </div>

          {/* Static Architecture Schema Diagram */}
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-slate-950 border border-slate-800 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                Logical Isolation Topology (Illustration)
              </span>
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400">Organization-Scoped Data Access</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono text-center">
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant A (Brokerage 1)</span>
                <span className="text-white font-bold block text-xs sm:text-sm">Organization-Scoped Access</span>
                <span className="text-emerald-400 text-[10px] block">Scoped Workspace Access</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant B (Brokerage 2)</span>
                <span className="text-white font-bold block text-xs sm:text-sm">Organization-Scoped Access</span>
                <span className="text-emerald-400 text-[10px] block">Scoped Workspace Access</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-400 uppercase text-[10px] block">Tenant C (Developer)</span>
                <span className="text-white font-bold block text-xs sm:text-sm">Organization-Scoped Access</span>
                <span className="text-emerald-400 text-[10px] block">Multi-Tower Inventory Access</span>
              </div>
            </div>
          </div>

          {/* Supporting Architecture Video */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <div className="p-3 sm:p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">security-architecture-model.mp4</span>
              </div>
              <span className="text-cyan-400 shrink-0 text-[11px] sm:text-xs">Architecture Overview Visual</span>
            </div>
            <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                aria-label="Sahyak security architecture video"
              >
                <source src="/videos/security-vault-architecture.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Progressive Disclosure: Implemented vs Alignment vs Roadmap */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-heading">
              Transparent Security Posture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Clear separation between implemented technical controls, compliance alignment, and architectural exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Column 1: Implemented Controls */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
                  IMPLEMENTED CONTROLS
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Tenant-Scoped Data Access:</span>
                  <p className="text-slate-600 leading-relaxed">
                    CRM queries and access paths are scoped to the organization&apos;s workspace context.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Role-Based Access Control:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Permissions are assigned according to user roles and operational responsibilities.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Secure Transport:</span>
                  <p className="text-slate-600 leading-relaxed">
                    HTTPS/TLS protects data while it moves between clients and the application.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Audited Support Access:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Administrative and support access is traceable through audit records.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Webhook Verification:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Supported inbound webhooks use HMAC SHA-256 verification to validate signed requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Alignment & Readiness */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded">
                  ALIGNMENT &amp; READINESS
                </span>
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">DPDP Readiness:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Sahyak&apos;s privacy and product architecture is being developed with principles such as data minimization, purpose limitation and appropriate consent handling in mind.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Data Minimization Principles:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Operational workflows capture and process only customer and transaction data required for active pipeline execution.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Administrative Governance:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Support access to production environments follows strict administrative separation and traceable activity logging.
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: Future Security Exploration */}
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                  FUTURE SECURITY EXPLORATION
                </span>
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Client-Side Field Encryption:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Exploring client-side encryption for selected sensitive fields.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Hardware Security Key / WebAuthn Support:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Exploring hardware security key / WebAuthn support for administrator accounts.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 block">Automated Anomaly Detection:</span>
                  <p className="text-slate-600 leading-relaxed">
                    Exploring automated anomaly detection for unusual data-access patterns.
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
