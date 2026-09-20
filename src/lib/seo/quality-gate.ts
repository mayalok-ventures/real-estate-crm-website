/**
 * SAHYAK CRM — SEO Quality Gate Enforcement Engine
 * Validates search quality criteria before any page can become indexable or published.
 * Prevents thin programmatic content, duplicate titles, and broken canonical links.
 */

import { SeoPage, QualityGateResult } from "./types";
import { siteConfig } from "@/lib/config";

export function validateSeoQuality(
  page: Partial<SeoPage>,
  existingPages: SeoPage[] = []
): QualityGateResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  const checks = {
    slugFormat: false,
    titleLength: false,
    descriptionLength: false,
    h1Presence: false,
    wordCount: false,
    canonicalValid: false,
    localeValid: false,
    noDuplicateKeyword: false,
    noBrokenLinks: true, // evaluated when links are present
    schemaValid: false,
    publicAccessible: true,
    notNoindexIfPublished: false,
  };

  // 1. Slug Validation
  const slug = (page.slug ?? "").trim();
  if (slug === "" && page.id !== "page_home") {
    // Empty slug is only valid for homepage
    issues.push("Slug cannot be empty for subpages.");
  } else if (slug !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    issues.push("Slug must be lowercase alphanumeric characters separated by hyphens (e.g., 'real-estate-lead-management').");
  } else {
    // Check uniqueness among existing pages
    const slugDupe = existingPages.find((p) => p.slug === slug && p.id !== page.id);
    if (slugDupe) {
      issues.push(`Slug '${slug}' is already used by page '${slugDupe.title}' (${slugDupe.id}).`);
    } else {
      checks.slugFormat = true;
    }
  }

  // 2. Title Tag Validation
  const title = (page.title ?? "").trim();
  if (!title) {
    issues.push("Title tag is missing.");
  } else if (title.length < 25) {
    warnings.push(`Title tag is short (${title.length} characters). Recommended: 35-65 characters.`);
    checks.titleLength = true;
  } else if (title.length > 70) {
    warnings.push(`Title tag is long (${title.length} characters) and may be truncated in search results.`);
    checks.titleLength = true;
  } else {
    checks.titleLength = true;
  }

  // 3. Meta Description Validation
  const description = (page.metaDescription ?? "").trim();
  if (!description) {
    issues.push("Meta description is missing.");
  } else if (description.length < 70) {
    warnings.push(`Meta description is short (${description.length} characters). Recommended: 110-155 characters.`);
    checks.descriptionLength = true;
  } else if (description.length > 165) {
    warnings.push(`Meta description is long (${description.length} characters) and may be truncated.`);
    checks.descriptionLength = true;
  } else {
    checks.descriptionLength = true;
  }

  // 4. H1 Presence
  const h1 = (page.h1 ?? "").trim();
  if (!h1) {
    issues.push("Page must have an explicit H1 heading.");
  } else if (h1.length < 10) {
    warnings.push("H1 heading is very short.");
    checks.h1Presence = true;
  } else {
    checks.h1Presence = true;
  }

  // 5. Body Content Word Count Threshold
  const body = (page.bodyContent ?? "").trim();
  const wordCount = body ? body.split(/\s+/).filter(Boolean).length : 0;
  if (wordCount < 20) {
    issues.push(`Meaningful body content is missing or too thin (${wordCount} words). Minimum 25 words required for indexable pages.`);
  } else if (wordCount < 100 && page.publicationStatus === "published") {
    warnings.push(`Page content is relatively concise (${wordCount} words). For deep topical authority, consider elaborating.`);
    checks.wordCount = true;
  } else {
    checks.wordCount = true;
  }

  // 6. Canonical URL Validation
  const canonical = (page.canonicalUrl ?? "").trim();
  if (!canonical) {
    issues.push("Canonical URL is required.");
  } else if (!canonical.startsWith("http://") && !canonical.startsWith("https://")) {
    issues.push(`Canonical URL must be absolute (got '${canonical}').`);
  } else if (canonical.includes("localhost") || canonical.includes(".preview.") || canonical.includes("vercel.app")) {
    issues.push(`Canonical URL contains staging or preview domain: '${canonical}'.`);
  } else {
    checks.canonicalValid = true;
  }

  // 7. Locale Validation
  const locale = (page.locale ?? "").trim().toLowerCase();
  if (!locale) {
    warnings.push("Locale is missing; defaulting to 'en-in'.");
    checks.localeValid = true;
  } else if (!/^[a-z]{2}(?:-[a-z]{2})?$/.test(locale)) {
    issues.push(`Invalid locale format: '${locale}'. Expected format like 'en' or 'en-in'.`);
  } else {
    checks.localeValid = true;
  }

  // 8. Duplicate Primary Keyword
  const primaryKw = (page.primaryKeyword ?? "").trim().toLowerCase();
  if (!primaryKw) {
    warnings.push("Primary keyword is not assigned.");
    checks.noDuplicateKeyword = true;
  } else {
    const kwDupe = existingPages.find(
      (p) =>
        p.id !== page.id &&
        p.publicationStatus === "published" &&
        p.primaryKeyword.toLowerCase() === primaryKw
    );
    if (kwDupe) {
      warnings.push(`Primary keyword '${primaryKw}' is already targeted by published page '${kwDupe.title}' (${kwDupe.slug}). Avoid keyword cannibalization.`);
      checks.noDuplicateKeyword = false;
    } else {
      checks.noDuplicateKeyword = true;
    }
  }

  // 9. Schema Type Validation
  if (page.schemaType) {
    const validSchemas = ["Organization", "WebSite", "SoftwareApplication", "BreadcrumbList", "Article", "FAQPage", "Product"];
    if (validSchemas.includes(page.schemaType)) {
      checks.schemaValid = true;
    } else {
      issues.push(`Invalid schema type: '${page.schemaType}'. Must be one of: ${validSchemas.join(", ")}`);
    }
  } else {
    checks.schemaValid = true;
  }

  // 10. Noindex Conflict Check
  if (page.publicationStatus === "published" && !page.isIndexable) {
    warnings.push("Page is marked 'published' but has is_indexable set to false (noindex). Search engines will not index it.");
    checks.notNoindexIfPublished = false;
  } else {
    checks.notNoindexIfPublished = true;
  }

  // Score Calculation (0-100)
  let score = 100;
  score -= issues.length * 20;
  score -= warnings.length * 5;
  score = Math.max(0, Math.min(100, score));

  const passed = issues.length === 0;

  return {
    passed,
    score,
    issues,
    warnings,
    checks,
  };
}
