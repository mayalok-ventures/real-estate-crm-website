export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export const siteConfig = {
  name: "Sahyak CRM",
  tagline: "The Serious CRM Built for Real Estate Sales",
  description:
    "Take property leads from inquiries to WhatsApp conversations, automated site visits, and booked units. Zero lead leakage, instant agent assignment, and real-time manager visibility.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sahyak.com",
  ogImage: "/android-chrome-512x512.png",
  appLoginUrl: process.env.NEXT_PUBLIC_CRM_LOGIN_URL || "https://crm.sahyak.com/login/",
  appSignupUrl: process.env.NEXT_PUBLIC_CRM_SIGNUP_URL || "https://crm.sahyak.com/signup/",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+91 87964 75107",
  whatsappSalesUrl:
    process.env.NEXT_PUBLIC_WHATSAPP_SALES_URL ||
    "https://wa.me/918796475107?text=Hi%20Sahyak%20Team%2C%20I%20want%20to%20see%20a%20demo%20for%20my%20real%20estate%20business.",
  contactEmail: "support@sahyak.com",
  supportEmail: "support@sahyak.com",
  salesEmail: "support@sahyak.com",
  socials: {
    linkedin: "https://linkedin.com/company/sahyakcrm",
    twitter: "https://twitter.com/sahyakcrm",
  },
  legal: {
    companyName: "Sahyak Technologies Pvt. Ltd.",
    registeredAddress: "Sector 62, Noida, Uttar Pradesh 201309, India",
    legalEmail: "legal@sahyak.com",
    privacyEmail: "privacy@sahyak.com",
    jurisdiction: "Noida / Gautam Buddha Nagar, Uttar Pradesh, India",
    effectiveDate: "September 2026",
  },
  freeOffer: {
    badge: "FREE STARTER",
    title: "Free Starter",
    leads: "20 Active Leads",
    users: "1 User Seat",
    whatsapp: "10 WhatsApp Actions",
    properties: "3 Properties / Units",
    noCardNeeded: true,
  },
};

export interface TierOption {
  label: string;
  value: number; // numeric upper limit or count
  priceMonthly: number; // additional price over base
  isCustom?: boolean;
}

export interface PlanConfiguration {
  userTierIndex: number;
  leadTierIndex: number;
  storageTierIndex: number;
  integrationTierIndex: number;
  isAnnual: boolean;
}

export interface PricingCalculationResult {
  baseMonthly: number;
  extraUsersCost: number;
  extraLeadsCost: number;
  extraStorageCost: number;
  extraIntegrationsCost: number;
  totalMonthly: number;
  effectiveMonthly: number;
  totalAnnual: number;
  annualSavings: number;
  discountPercent: number;
  selectedUserTier: TierOption;
  selectedLeadTier: TierOption;
  selectedStorageTier: TierOption;
  selectedIntegrationTier: TierOption;
  isCustomPlan: boolean;
}

export const USER_TIERS: TierOption[] = [
  { label: "1 User (Included)", value: 1, priceMonthly: 0 },
  { label: "Up to 5 Users", value: 5, priceMonthly: 899 },
  { label: "Up to 10 Users", value: 10, priceMonthly: 1799 },
  { label: "Up to 25 Users", value: 25, priceMonthly: 3999 },
  { label: "Up to 50 Users", value: 50, priceMonthly: 6999 },
  { label: "Up to 100 Users", value: 100, priceMonthly: 11999 },
  { label: "100+ Users (Custom)", value: 9999, priceMonthly: 0, isCustom: true },
];

export const LEAD_TIERS: TierOption[] = [
  { label: "2,000 Leads (Included)", value: 2000, priceMonthly: 0 },
  { label: "10,000 Leads", value: 10000, priceMonthly: 199 },
  { label: "25,000 Leads", value: 25000, priceMonthly: 499 },
  { label: "50,000 Leads", value: 50000, priceMonthly: 999 },
  { label: "100,000 Leads", value: 100000, priceMonthly: 1799 },
  { label: "250,000 Leads", value: 250000, priceMonthly: 3499 },
  { label: "500,000 Leads", value: 500000, priceMonthly: 5999 },
  { label: "500,000+ Leads (Custom)", value: 9999999, priceMonthly: 0, isCustom: true },
];

export const STORAGE_TIERS: TierOption[] = [
  { label: "5 GB (Included)", value: 5, priceMonthly: 0 },
  { label: "20 GB Storage", value: 20, priceMonthly: 199 },
  { label: "50 GB Storage", value: 50, priceMonthly: 499 },
  { label: "100 GB Storage", value: 100, priceMonthly: 899 },
  { label: "250 GB Storage", value: 250, priceMonthly: 1799 },
  { label: "500 GB Storage", value: 500, priceMonthly: 2999 },
  { label: "500 GB+ Storage (Custom)", value: 99999, priceMonthly: 0, isCustom: true },
];

export const INTEGRATION_TIERS: TierOption[] = [
  { label: "Manual & CSV (Included)", value: 0, priceMonthly: 0 },
  { label: "1 Connected Platform", value: 1, priceMonthly: 399 },
  { label: "Up to 3 Platforms", value: 3, priceMonthly: 999 },
  { label: "Up to 5 Platforms", value: 5, priceMonthly: 1499 },
  { label: "Up to 10 Platforms", value: 10, priceMonthly: 2499 },
  { label: "10+ Platforms (Custom)", value: 999, priceMonthly: 0, isCustom: true },
];

export const pricingConfig = {
  // Free Starter
  freeStarter: {
    id: "free-starter",
    name: "Free Starter",
    badge: "EVALUATION TIER",
    price: 0,
    pricePeriod: "Free",
    description: "Experience the real-estate pipeline with zero risk or card required.",
    ctaText: "Start Free",
    ctaHref: "https://crm.sahyak.com/signup/",
    inclusions: [
      "20 Active Leads",
      "1 User Seat",
      "10 WhatsApp Actions",
      "3 Properties / Catalogs",
      "Mobile PWA & field access",
      "Lead status pipeline tracking",
      "Follow-up date reminders",
    ],
  },

  // Base Access Plan
  basePlan: {
    id: "base-access",
    name: "Base Plan",
    monthlyPrice: 499,
    annualPricePerMonth: 449, // 10% discount
    description: "The foundational real estate sales engine for individual brokers and growing agencies.",
    ctaText: "Start Base Plan",
    ctaHref: "https://crm.sahyak.com/signup/",
    includedUsers: 1,
    includedLeads: 2000,
    includedStorageGB: 5,
    includedIntegrations: 0,
    inclusions: [
      "1 Organization workspace",
      "1 Active User Seat included",
      "2,000 Stored Active Leads included",
      "5 GB Document & Media Storage included",
      "1 Inbound Website Webhook Endpoint included",
      "Unlimited Projects & Catalogs",
      "Unlimited Products / Inventory Units",
      "Unlimited Buyer Groups",
      "Pipeline & Deal Stage Tracking",
      "Follow-ups & Task Reminders",
      "Mobile PWA & Field Access",
      "WhatsApp Hub & Verified Templates",
      "Groups & Bulk Messaging Tools",
      "CSV Data Import & Export",
      "Core Sales Analytics & Reports",
      "Team & Designation Role Structure",
      "Real-time Notifications",
    ],
  },

  userTiers: USER_TIERS,
  leadTiers: LEAD_TIERS,
  storageTiers: STORAGE_TIERS,
  integrationTiers: INTEGRATION_TIERS,

  calculatePlanPrice(config: PlanConfiguration): PricingCalculationResult {
    const selectedUserTier = USER_TIERS[config.userTierIndex] || USER_TIERS[0];
    const selectedLeadTier = LEAD_TIERS[config.leadTierIndex] || LEAD_TIERS[0];
    const selectedStorageTier = STORAGE_TIERS[config.storageTierIndex] || STORAGE_TIERS[0];
    const selectedIntegrationTier = INTEGRATION_TIERS[config.integrationTierIndex] || INTEGRATION_TIERS[0];

    const isCustomPlan = 
      Boolean(selectedUserTier.isCustom || 
      selectedLeadTier.isCustom || 
      selectedStorageTier.isCustom || 
      selectedIntegrationTier.isCustom);

    const baseMonthly = 499;
    const extraUsersCost = selectedUserTier.priceMonthly;
    const extraLeadsCost = selectedLeadTier.priceMonthly;
    const extraStorageCost = selectedStorageTier.priceMonthly;
    const extraIntegrationsCost = selectedIntegrationTier.priceMonthly;

    const totalMonthly = baseMonthly + extraUsersCost + extraLeadsCost + extraStorageCost + extraIntegrationsCost;
    
    // 10% discount on committed capacity for annual billing
    const discountPercent = config.isAnnual ? 10 : 0;
    const effectiveMonthly = config.isAnnual ? Math.round(totalMonthly * 0.9) : totalMonthly;
    const totalAnnual = config.isAnnual ? Math.round(totalMonthly * 12 * 0.9) : totalMonthly * 12;
    const annualSavings = config.isAnnual ? (totalMonthly * 12) - totalAnnual : 0;

    return {
      baseMonthly,
      extraUsersCost,
      extraLeadsCost,
      extraStorageCost,
      extraIntegrationsCost,
      totalMonthly,
      effectiveMonthly,
      totalAnnual,
      annualSavings,
      discountPercent,
      selectedUserTier,
      selectedLeadTier,
      selectedStorageTier,
      selectedIntegrationTier,
      isCustomPlan,
    };
  },
};
