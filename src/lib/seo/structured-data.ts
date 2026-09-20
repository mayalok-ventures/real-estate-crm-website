/**
 * SAHYAK CRM — Truthful Structured Data (JSON-LD) Engine
 * Produces valid Schema.org entities matching actual visible content.
 * Strictly zero fake data: No fabricated reviews, invented ratings, or artificial awards.
 */

import { siteConfig } from "@/lib/config";
import { BreadcrumbItem } from "./types";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

/**
 * Organization Schema matching real registered company information
 */
export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    "name": siteConfig.name,
    "legalName": siteConfig.legal.companyName,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/android-chrome-512x512.png`,
    "sameAs": [
      siteConfig.socials.linkedin,
      siteConfig.socials.twitter,
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": siteConfig.salesEmail,
      "telephone": siteConfig.whatsappNumber,
      "availableLanguage": ["English", "Hindi"],
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sector 62",
      "addressLocality": "Noida",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "201309",
      "addressCountry": "IN",
    },
  };
}

/**
 * WebSite Schema with potential internal search action
 */
export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    "url": siteConfig.url,
    "name": siteConfig.name,
    "description": siteConfig.description,
    "publisher": {
      "@id": `${siteConfig.url}/#organization`,
    },
    "inLanguage": "en",
  };
}

/**
 * SoftwareApplication Schema matching truthful Free Starter and Base plans
 */
export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteConfig.url}/#software`,
    "name": siteConfig.name,
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Real Estate CRM & Sales Pipeline Automation",
    "operatingSystem": "Web, iOS, Android (PWA)",
    "description": siteConfig.description,
    "url": siteConfig.url,
    "image": `${siteConfig.url}/android-chrome-512x512.png`,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Starter",
        "price": "0",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Free Starter Tier: 20 Active Leads, 1 User Seat, 10 WhatsApp Actions, 3 Properties included. No card required.",
      },
      {
        "@type": "Offer",
        "name": "Base Plan",
        "price": "499",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Base Plan: 1 Organization Workspace, 1 Active User Seat, 2,000 Active Leads, 5 GB Document Storage.",
      },
    ],
  };
}

/**
 * BreadcrumbList Schema for crawlable navigation hierarchies
 */
export function buildBreadcrumbSchema(crumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.item,
    })),
  };
}

/**
 * Article Schema for educational, resource, and technical guides
 */
export function buildArticleSchema(input: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": input.headline,
    "description": input.description,
    "url": input.url,
    "image": input.image || `${siteConfig.url}/android-chrome-512x512.png`,
    "datePublished": input.datePublished || "2026-09-20T00:00:00Z",
    "dateModified": input.dateModified || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": input.authorName || "Sahyak Product & Solutions Team",
      "url": siteConfig.url,
    },
    "publisher": {
      "@id": `${siteConfig.url}/#organization`,
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": input.url,
    },
  };
}

/**
 * FAQPage Schema matching visible questions and answers
 */
export function buildFAQSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

/**
 * HowTo Schema for step-by-step real estate workflows
 */
export function buildHowToSchema(name: string, description: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((s, idx) => ({
      "@type": "HowToStep",
      "position": idx + 1,
      "name": s.name,
      "text": s.text,
      ...(s.url ? { "url": s.url } : {})
    }))
  };
}

/**
 * WebApplication Schema for interactive real estate tools
 */
export function buildWebApplicationSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All modern web browsers",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
}
