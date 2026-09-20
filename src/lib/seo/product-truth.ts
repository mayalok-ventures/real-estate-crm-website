import { ProductClaimTruth, ProductClaimStatus } from "./types";

/**
 * SAHYAK CRM — Centralized Product Truth Registry
 *
 * This registry acts as the authoritative internal source of truth for all public-facing
 * marketing, SEO, calculator, and product claims.
 *
 * Status Definitions:
 * - implemented: Feature is live, coded, and operational in current production software.
 * - partial: Operational with explicit caveats or user configuration required.
 * - planned: On future engineering roadmap; MUST NOT be claimed as live capability.
 * - external_dependency: Dependent on 3rd-party portal APIs, carrier approval, or Meta review.
 * - unsupported: False or uncertified; strictly prohibited across all public materials.
 */
export const PRODUCT_CLAIMS_REGISTRY: ProductClaimTruth[] = [
  // 1. Lead Ingress & Webhooks
  {
    id: "claim_portal_webhooks",
    claim: "Sub-15s webhook ingestion from Indian property portals (MagicBricks, 99acres, Housing.com, Meta Ads)",
    category: "lead_ingress",
    status: "implemented",
    evidence: "src/app/api/contact/route.ts & portal payload adapters with sub-15s async routing",
    lastVerified: "2026-09-20",
    constraints: "Requires active portal developer account and webhook secret key configuration."
  },
  {
    id: "claim_guaranteed_ingress_sla",
    claim: "Contractually guaranteed sub-2s latency SLA for all portal leads",
    category: "lead_ingress",
    status: "unsupported",
    evidence: "Portal network hops, mobile carrier queues, and webhook delivery retries vary between 2s and 15s. No financial SLA contract exists.",
    lastVerified: "2026-09-20",
    constraints: "Strictly prohibited claim. State 'Sub-15s ingestion speed' instead."
  },

  // 2. WhatsApp Business Messaging
  {
    id: "claim_official_whatsapp_cloud_api",
    claim: "Official Meta Cloud API WhatsApp integration for instant brochure dispatch without contact saves",
    category: "whatsapp",
    status: "implemented",
    evidence: "src/components/FloatingWhatsAppButton.tsx & WhatsApp message automation pipeline using registered BSP phone IDs",
    lastVerified: "2026-09-20",
    constraints: "Requires Meta Business Verification and template message pre-approval."
  },
  {
    id: "claim_unofficial_whatsapp_scraping",
    claim: "Automated bulk WhatsApp blasting via unofficial web scraping or ban-proof accounts",
    category: "whatsapp",
    status: "unsupported",
    evidence: "SAHYAK exclusively supports official Meta Cloud API protocols. Unofficial scraping violates Meta ToS.",
    lastVerified: "2026-09-20",
    constraints: "Strictly prohibited claim. Zero unofficial scraping supported."
  },

  // 3. Property Inventory & Locking
  {
    id: "claim_unit_locks",
    claim: "48-hour temporary inventory unit locks to prevent double-booking across broker networks",
    category: "inventory",
    status: "implemented",
    evidence: "src/app/features/page.tsx inventory unit state machine with automated expiry timers",
    lastVerified: "2026-09-20",
    constraints: "Lock timer configurable by builder admin (default 24h to 72h)."
  },

  // 4. Brokerage Commission Calculations
  {
    id: "claim_commission_calculator",
    claim: "Multi-tier brokerage commission split calculations with TDS Section 194H (2% / 5%) and 18% GST deductions",
    category: "commission",
    status: "implemented",
    evidence: "src/components/tools/CommissionCalculator.tsx with statutory tax parameter validation",
    lastVerified: "2026-09-20",
    constraints: "Statutory tax deductions reflect Indian Income Tax & GST rules as of FY 2025-26."
  },

  // 5. Site Visits & Field Sales
  {
    id: "claim_site_visit_gps",
    claim: "Field sales site visit dispatch with WhatsApp show-flat location pin and automated status logging",
    category: "site_visits",
    status: "implemented",
    evidence: "src/app/solutions/real-estate-site-visits with Google Maps pin dispatch and client check-in status",
    lastVerified: "2026-09-20",
    constraints: "Requires mobile client location permissions and active WhatsApp connectivity."
  },
  {
    id: "claim_phone_masking",
    claim: "Virtual phone masking to prevent unauthorized client poaching by junior agents",
    category: "security",
    status: "partial",
    evidence: "Software RBAC limits raw phone export; carrier-level dual-channel proxy click-to-call requires external telephony provider (Exotel/Knowlarity).",
    lastVerified: "2026-09-20",
    constraints: "In-app number obscuring implemented; PSTN carrier masking requires telephony bridge add-on."
  },

  // 6. Regulatory & Security Certifications
  {
    id: "claim_soc2_certification",
    claim: "SOC 2 Type II Certified Organization",
    category: "compliance",
    status: "unsupported",
    evidence: "No external independent CPA SOC 2 audit report exists for SAHYAK CRM at this time.",
    lastVerified: "2026-09-20",
    constraints: "Prohibited from marketing. State 'Role-Based Access Control (RBAC) & Enterprise Security Architecture' instead."
  },
  {
    id: "claim_iso_27001",
    claim: "ISO 27001 Certified Information Security Management System",
    category: "compliance",
    status: "unsupported",
    evidence: "No external ISO registrar audit completed.",
    lastVerified: "2026-09-20",
    constraints: "Prohibited from marketing copy."
  },
  {
    id: "claim_dpdp_readiness",
    claim: "India Digital Personal Data Protection (DPDP) Act 2023 Readiness",
    category: "compliance",
    status: "partial",
    evidence: "First-party anonymous session tracking, zero 3rd-party ad trackers, consent-based contact capture, right-to-forget database support.",
    lastVerified: "2026-09-20",
    constraints: "Software is designed for DPDP technical readiness; cannot claim government certification as no certification body exists."
  },
  {
    id: "claim_rera_alignment",
    claim: "RERA Real Estate Regulatory Authority Compliance Software",
    category: "compliance",
    status: "partial",
    evidence: "Promotes carpet-area transparency, milestone payment tracking, and project registration disclosure fields.",
    lastVerified: "2026-09-20",
    constraints: "SAHYAK is software for real estate professionals, not an authorized RERA government entity or registered broker agency."
  }
];

export function getProductClaim(id: string): ProductClaimTruth | undefined {
  return PRODUCT_CLAIMS_REGISTRY.find((c) => c.id === id);
}

export function getVerifiedClaims(): ProductClaimTruth[] {
  return PRODUCT_CLAIMS_REGISTRY.filter((c) => c.status === "implemented");
}

export function getUnsupportedClaims(): ProductClaimTruth[] {
  return PRODUCT_CLAIMS_REGISTRY.filter((c) => c.status === "unsupported");
}
