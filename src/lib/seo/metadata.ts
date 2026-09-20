/**
 * SAHYAK CRM — Reusable SEO Metadata Engine
 * Generates canonical, hreflang, OpenGraph, Twitter/X, and robots directives.
 */

import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { HreflangReference } from "./types";

export interface SeoMetadataInput {
  title: string;
  description: string;
  path: string; // e.g. "/features", "/pricing"
  isIndexable?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  hreflangReferences?: HreflangReference[];
  locale?: string;
}

/**
 * Strict Canonical URL Resolution
 * Strips tracking parameters, query filters, preview tokens, and trailing slashes.
 */
export function generateCanonicalUrl(path: string): string {
  const baseUrl = (siteConfig.url || "https://sahyak.com").replace(/\/+$/, "");
  const cleanPath = path.split("?")[0].split("#")[0].replace(/^\/+|\/+$/g, "");
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
}

/**
 * Reusable App Router Metadata Builder
 */
export function generateSeoMetadata(input: SeoMetadataInput): Metadata {
  const canonicalUrl = generateCanonicalUrl(input.path);
  const isIndexable = input.isIndexable !== false;
  const ogImageUrl = input.ogImage || siteConfig.ogImage || "/android-chrome-512x512.png";
  const absoluteOgImage = ogImageUrl.startsWith("http")
    ? ogImageUrl
    : `${siteConfig.url.replace(/\/+$/, "")}${ogImageUrl.startsWith("/") ? "" : "/"}${ogImageUrl}`;

  // Build languages object for hreflang alternates
  const languages: Record<string, string> = {};
  if (input.hreflangReferences && input.hreflangReferences.length > 0) {
    for (const ref of input.hreflangReferences) {
      languages[ref.lang] = ref.url;
    }
  } else {
    // Standard self-referencing and x-default
    languages["en"] = canonicalUrl;
    languages["x-default"] = canonicalUrl;
  }

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords && input.keywords.length > 0 ? input.keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: languages,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: input.locale || "en_IN",
      type: input.ogType || "website",
      images: [
        {
          url: absoluteOgImage,
          width: 512,
          height: 512,
          alt: `${siteConfig.name} - Real Estate CRM`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [absoluteOgImage],
      creator: "@sahyakcrm",
    },
    robots: {
      index: isIndexable,
      follow: true,
      googleBot: {
        index: isIndexable,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
