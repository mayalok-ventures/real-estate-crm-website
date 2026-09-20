const fs = require("fs");
const path = require("path");

const storePath = path.join(__dirname, "../src/lib/seo/store.ts");
const storeContent = fs.readFileSync(storePath, "utf-8");

// Parse SEED_PAGES and SEED_INTERNAL_LINKS approximately or check via regex
const pageRegex = /id:\s*"(page_[^"]+)",\s*slug:\s*"([^"]*)",[\s\S]*?title:\s*"([^"]+)",\s*metaDescription:\s*"([^"]+)",\s*h1:\s*"([^"]+)",[\s\S]*?canonicalUrl:\s*"([^"]+)"/g;
let pages = [];
let match;
while ((match = pageRegex.exec(storeContent)) !== null) {
  pages.push({
    id: match[1],
    slug: match[2],
    title: match[3],
    metaDescription: match[4],
    h1: match[5],
    canonicalUrl: match[6]
  });
}

console.log(`Parsed ${pages.length} pages from store.`);

const linkRegex = /id:\s*"(link_[^"]+)",\s*sourcePageId:\s*"([^"]+)",\s*sourcePath:\s*"([^"]+)",\s*targetPageId:\s*"([^"]+)",\s*targetPath:\s*"([^"]+)"/g;
let links = [];
while ((match = linkRegex.exec(storeContent)) !== null) {
  links.push({
    id: match[1],
    sourcePageId: match[2],
    sourcePath: match[3],
    targetPageId: match[4],
    targetPath: match[5]
  });
}

console.log(`Parsed ${links.length} internal links from store.`);

// 1. Audit check: Missing fields
let errors = [];
let warnings = [];

pages.forEach(p => {
  if (!p.title || p.title.length < 10) errors.push(`Page ${p.slug}: short/missing title`);
  if (!p.metaDescription || p.metaDescription.length < 20) errors.push(`Page ${p.slug}: short/missing metaDescription`);
  if (!p.h1) errors.push(`Page ${p.slug}: missing h1`);
  if (!p.canonicalUrl.startsWith("https://sahyak.com")) errors.push(`Page ${p.slug}: invalid canonicalUrl ${p.canonicalUrl}`);
});

// 2. Duplicate titles & descriptions
const titles = new Map();
const descs = new Map();
pages.forEach(p => {
  if (titles.has(p.title)) {
    errors.push(`Duplicate title '${p.title}' on ${p.slug} and ${titles.get(p.title)}`);
  } else {
    titles.set(p.title, p.slug);
  }

  if (descs.has(p.metaDescription)) {
    warnings.push(`Duplicate metaDescription on ${p.slug} and ${descs.get(p.metaDescription)}`);
  } else {
    descs.set(p.metaDescription, p.slug);
  }
});

// 3. Known paths & broken links
const knownPaths = new Set(pages.map(p => p.slug === "" ? "/" : `/${p.slug}`));
links.forEach(l => {
  if (!knownPaths.has(l.targetPath) && !l.targetPath.startsWith("/#") && l.targetPath !== "/") {
    errors.push(`Broken link ${l.id}: targetPath '${l.targetPath}' not in known paths.`);
  }
});

// 4. Orphan pages
const inboundCount = new Map();
knownPaths.forEach(path => inboundCount.set(path, 0));
links.forEach(l => {
  if (inboundCount.has(l.targetPath)) {
    inboundCount.set(l.targetPath, inboundCount.get(l.targetPath) + 1);
  }
});

knownPaths.forEach((count, path) => {
  if (path !== "/" && count === 0) {
    errors.push(`Orphan page: '${path}' has 0 inbound links.`);
  }
});

console.log("\n================ AUDIT REPORT ================");
console.log(`Total Pages Scanned: ${pages.length}`);
console.log(`Total Internal Links: ${links.length}`);
console.log(`Critical Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.error("ERRORS FOUND:", errors);
  process.exit(1);
} else {
  console.log("HEALTH SCORE: 100/100 (PASSED ALL AUDIT CHECKS WITH ZERO ERRORS)");
}
