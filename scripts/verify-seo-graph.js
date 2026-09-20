const fs = require("fs");
const path = require("path");

// Read store.ts and extract SEED_PAGES and SEED_INTERNAL_LINKS
const storePath = path.join(__dirname, "../src/lib/seo/store.ts");
const storeContent = fs.readFileSync(storePath, "utf-8");

console.log("Auditing SEO store data from:", storePath);

// Verify that all 12 candidate pages exist in store
const targetSlugs = [
  "solutions/real-estate-lead-management",
  "solutions/real-estate-lead-follow-up",
  "solutions/real-estate-sales-pipeline",
  "solutions/site-visit-management",
  "solutions/real-estate-whatsapp-crm",
  "solutions/property-inventory-management",
  "industry/real-estate-brokers",
  "industry/property-developers",
  "tools/lead-response-time-calculator",
  "tools/real-estate-commission-calculator",
  "compare/real-estate-crm-vs-excel",
  "compare/real-estate-crm-vs-whatsapp"
];

let missingSlugs = [];
for (const slug of targetSlugs) {
  if (!storeContent.includes(`slug: "${slug}"`)) {
    missingSlugs.push(slug);
  }
}

if (missingSlugs.length > 0) {
  console.error("FAIL: Missing target slugs in store:", missingSlugs);
  process.exit(1);
} else {
  console.log("SUCCESS: All 12 candidate pages are defined in SEED_PAGES.");
}

// Check internal link connectivity
let unlinkedSlugs = [];
for (const slug of targetSlugs) {
  const targetPath = `/${slug}`;
  if (!storeContent.includes(`targetPath: "${targetPath}"`)) {
    unlinkedSlugs.push(slug);
  }
}

if (unlinkedSlugs.length > 0) {
  console.error("FAIL: Unlinked slugs (potential orphans):", unlinkedSlugs);
  process.exit(1);
} else {
  console.log("SUCCESS: All 12 candidate pages have inbound links (0 orphans).");
}

console.log("AUDIT VALIDATION COMPLETED WITH ZERO ERRORS.");
