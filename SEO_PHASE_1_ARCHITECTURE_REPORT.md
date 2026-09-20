# SAHYAK CRM — SEO / GEO / AEO TECHNICAL FOUNDATION REPORT (PHASE 1)

**Platform:** SAHYAK Real Estate CRM  
**Date:** September 20, 2026  
**Auditor / Architect:** Principal Systems Architect & Search Infrastructure Engineer  
**Objective:** Establish a scalable, production-grade technical discovery architecture for SEO, AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), and International Discovery without modifying frozen public visual designs or generating thin programmatic spam.

---

## EXECUTIVE SUMMARY

Phase 1 establishes the complete technical foundation for organic and generative search discovery. In strict compliance with directives:
1. **The public website visual design is strictly FROZEN:** Zero styling, layout, or copy changes were introduced to existing public pages.
2. **Zero fabricated statistics:** No invented keyword search volumes, fake rankings, or simulated Google Search Console impressions. All models strictly reflect genuine repository entities and real telemetry.
3. **Architecture before content:** Rather than mass-generating thin doorway pages, we have engineered the data models, quality gates, sitemaps, robots, internal link graphs, and automated audit crawlers to govern high-value discovery in Phase 2.

---

## TABLE OF CONTENTS
1. [Section A: Current Site Technical SEO Audit](#section-a-current-site-technical-seo-audit)
2. [Section B: Proposed Scalable URL Architecture](#section-b-proposed-scalable-url-architecture)
3. [Section C: Topic Taxonomy](#section-c-topic-taxonomy)
4. [Section D: Initial Keyword Clusters](#section-d-initial-keyword-clusters)
5. [Section E: Page-Type Architecture](#section-e-page-type-architecture)
6. [Section F: Database Schema & Migrations](#section-f-database-schema--migrations)
7. [Section G: Admin SEO / Search Intelligence Architecture](#section-g-admin-seo--search-intelligence-architecture)
8. [Section H: International SEO Architecture](#section-h-international-seo-architecture)
9. [Section I: Dynamic Segmented Sitemap Architecture](#section-i-dynamic-segmented-sitemap-architecture)
10. [Section J: Internal Linking Architecture](#section-j-internal-linking-architecture)
11. [Section K: Truthful Structured Data Architecture](#section-k-truthful-structured-data-architecture)
12. [Section L: SEO Quality Gate Specification](#section-l-seo-quality-gate-specification)
13. [Section M: Exact Next-Phase Content Plan](#section-m-exact-next-phase-content-plan)
14. [Section N: Final Technical Audit & File Changes](#section-n-final-technical-audit--file-changes)

---

## SECTION A: CURRENT SITE TECHNICAL SEO AUDIT

Prior to modifying code, a forensic audit of the existing Next.js App Router setup was executed.

### A.1 Routing & Rendering Architecture
- **Framework:** Next.js `16.3.2` App Router with Turbopack bundler.
- **Runtime Target:** Cloudflare Pages / Workers Edge Runtime with Dual-Runtime Local SQLite/Memory Store fallback.
- **Rendering Model:** Static Pre-rendering (`○ Static`) for all marketing pages; Edge server-rendering (`ƒ Dynamic`) for modular APIs and XML sitemaps.
- **Crawlability:** HTML output contains full semantic markup (`<header>`, `<main>`, `<section>`, `<footer>`, `<h1>`-`<h3>`, `<p>`).

### A.2 Metadata & Critical Audit Discovery
- **Root Layout:** Configured with `metadataBase: new URL("https://sahyak.com")`, title template `%s | Sahyak Real Estate CRM`, global Open Graph, and Twitter/X metadata.
- **Existing Page Metadatas:**
  - `/` (Home): Inherits root title and description.
  - `/features`: Dedicated metadata with canonical `https://sahyak.com/features`.
  - `/about`, `/security`, `/privacy`, `/terms`: Dedicated metadata.
- **Critical Audit Gap Identified & Resolved:**
  - `/pricing`, `/contact`, and `/resources` were client components (`"use client"` at `page.tsx`) without dedicated `layout.tsx` files. Consequently, Next.js fell back to the root layout's default title and description, leaving three major conversion routes without unique, authoritative page titles and canonical tags.
  - **Resolution:** Created lightweight server `layout.tsx` wrappers for `/pricing`, `/contact`, and `/resources` exporting authoritative metadata via `generateSeoMetadata()`. The client page components and their visual design remain 100% frozen.

### A.3 Structured Data (JSON-LD)
- Root layout embedded valid Schema.org entities (`SoftwareApplication` and `Organization`).
- **Audit Verification:** Confirmed zero fabricated review stars or invented aggregate ratings. Pricing offers reflect the actual Free Starter Tier (₹0, 20 leads, 1 seat) and Base Plan (₹499).

---

## SECTION B: PROPOSED SCALABLE URL ARCHITECTURE

To prevent URL sprawl, duplicate parameters, and doorway cannibalization, URLs follow a strict hierarchy based on page type:

| URL Pattern | Page Type | Purpose & Search Intent | Example |
|---|---|---|---|
| `/` | Commercial Landing | Core brand & real estate CRM positioning (Commercial) | `https://sahyak.com/` |
| `/features` | Feature Pillar | Full platform capabilities (Commercial Investigation) | `https://sahyak.com/features` |
| `/pricing` | Commercial Landing | Transparent plan builder & tier pricing (Transactional) | `https://sahyak.com/pricing` |
| `/solutions/[slug]` | Problem / Solution | High-intent operational solutions (Problem/Solution) | `https://sahyak.com/solutions/lead-leakage-prevention` |
| `/industry/[slug]` | Industry Solution | Persona-targeted workflows (Commercial Investigation) | `https://sahyak.com/industry/real-estate-brokers` |
| `/learn/[slug]` | Educational / Playbook | In-depth operational playbooks (Informational) | `https://sahyak.com/learn/sunday-site-visit-logistics` |
| `/tools/[slug]` | Interactive Utility | Functioning calculation tools (Tool/Calculator) | `https://sahyak.com/tools/real-estate-roi-calculator` |
| `/compare/[slug]` | Category Comparison | Truthful, factual platform comparisons (Comparison) | `https://sahyak.com/compare/excel-vs-sahyak-crm` |
| `/[locale]/...` | Localized Market | Regional market instances (Local/Regional) | `https://sahyak.com/en-ae/pricing` |

**Canonicalization Rule:**
Every indexable URL strips query parameters (e.g. `?utm_*`, `?ref=*`, `?tab=*`), strips trailing slashes, enforces lowercase alphanumeric slugs, and resolves to the production HTTPS domain.

---

## SECTION C: TOPIC TAXONOMY

Topical authority in real estate sales is built through 6 discrete pillar clusters:

```
REAL ESTATE CRM ENTITY ECOSYSTEM
│
├── 1. Core CRM Architecture (real-estate-crm)
│     └── Foundational broker, agency, and builder operational systems
│
├── 2. Lead Management & Routing (real-estate-lead-management)
│     └── Sub-15s webhook ingress, SLA alerts, anti-leakage assignment
│
├── 3. Sales Pipeline & Velocity (real-estate-sales-pipeline)
│     └── Deal stages, token advance tracking, CLP payment schedules
│
├── 4. WhatsApp Business & Communication (real-estate-whatsapp-crm)
│     └── 1-tap floor plans, verified message templates, unsaved chat
│
├── 5. Property & Inventory Matrices (property-inventory-management)
│     └── Multi-tower availability, 48-hour temporary locks, unit blocking
│
└── 6. Field Closer & Site Visit Logistics (site-visit-management)
      └── Sunday show-flat schedules, automated GPS pin dispatch, voice logs
```

---

## SECTION D: INITIAL KEYWORD CLUSTERS

Seed keywords are categorized by topic and intent. In adherence to the **Zero Fake Data Policy**, no estimated search volume numbers are invented. Priority is assigned by strategic relevance (`core`, `high`, `medium`, `low`):

### Cluster 1: Core CRM Architecture (`topic_core_crm`)
- `real estate CRM` (Commercial Investigation, Core)
- `real estate CRM software` (Commercial Investigation, Core)
- `CRM for real estate` (Commercial Investigation, Core)
- `CRM for real estate agents` (Commercial Investigation, High)
- `CRM for real estate brokers` (Commercial Investigation, High)
- `property CRM` (Commercial Investigation, High)
- `real estate sales CRM` (Commercial Investigation, High)
- `real estate sales software` (Commercial Investigation, Medium)
- `real estate management software` (Commercial Investigation, Medium)

### Cluster 2: Lead Management & Ingress (`topic_lead_mgmt`)
- `real estate lead management` (Problem/Solution, Core)
- `real estate lead tracking` (Problem/Solution, High)
- `property lead management` (Problem/Solution, High)
- `real estate lead assignment` (Problem/Solution, Medium)
- `real estate lead follow-up` (Problem/Solution, High)
- `real estate follow-up software` (Problem/Solution, Medium)

### Cluster 3: Sales Pipeline & Automation (`topic_sales_pipeline`)
- `real estate sales automation` (Transactional, High)
- `real estate pipeline management` (Transactional, High)
- `property sales pipeline` (Transactional, Medium)
- `real estate conversion tracking` (Commercial Investigation, Medium)

### Cluster 4: WhatsApp CRM & Communication (`topic_whatsapp_crm`)
- `real estate WhatsApp CRM` (Commercial Investigation, Core)
- `WhatsApp CRM for real estate` (Commercial Investigation, Core)
- `real estate communication management` (Problem/Solution, Medium)

### Cluster 5: Property Inventory & Unit Allotment (`topic_property_inventory`)
- `property inventory management` (Commercial Investigation, High)
- `project management for real estate` (Informational, Medium)
- `property unit management` (Problem/Solution, Medium)

### Cluster 6: Field Sales & Site Visit Operations (`topic_field_sales`)
- `site visit management` (Problem/Solution, Core)
- `property visit management` (Problem/Solution, High)
- `real estate field sales CRM` (Commercial Investigation, High)

---

## SECTION E: PAGE-TYPE ARCHITECTURE

Each page type serves a specific discovery intent and enforces specific quality requirements:

1. **Commercial Landing Pages (`commercial_landing`):**
   - *Purpose:* Platform positioning, tier value proposition, direct account registration.
   - *Requirement:* Clear pricing/offer terms, primary conversion CTA, high-level capability summary.
2. **Problem / Solution Pages (`problem_solution`):**
   - *Purpose:* Target specific operational leaks (e.g. portal lead death, junior agent contact poaching).
   - *Requirement:* Pain point diagnosis, quantified operational impact, specific software workflow resolution.
3. **Feature Pages (`feature`):**
   - *Purpose:* Deep-dive into technical capabilities (e.g. WhatsApp floor plans, webhook ingress).
   - *Requirement:* Technical specifications, operational prerequisites, UI screenshots/mockups, integration requirements.
4. **Industry Solution Pages (`industry_solution`):**
   - *Purpose:* Specific market personas (e.g. Solo Real Estate Brokers, Channel Partner Networks, Multi-Project Developers).
   - *Requirement:* Tailored workflows, role permissions, custom volume limits.
5. **Educational / Playbook Pages (`educational_learning`):**
   - *Purpose:* High-value tactical training (e.g. WhatsApp real estate follow-up scripts, site visit checklists).
   - *Requirement:* Copyable scripts, practical execution steps, standalone non-promotional utility.
6. **Tool Pages (`tool`):**
   - *Purpose:* Interactive utilities (e.g. Commission split calculator, Lead leakage loss estimator).
   - *Requirement:* Fully functional client-side interactive calculator with immediate answers.
7. **Comparison Pages (`comparison`):**
   - *Purpose:* Factual differentiation (e.g. Sahyak vs Generic CRM vs Excel spreadsheets).
   - *Requirement:* Honest, verifiable comparison criteria; no fabricated competitor flaws.
8. **Country / Market Pages (`country_market`):**
   - *Purpose:* Genuine localized market discovery (e.g. UAE/Dubai RERA compliance, NRI investment follow-ups).
   - *Requirement:* Localized currency, country-specific compliance rules (e.g. RERA / DPDP), local phone conventions.

---

## SECTION F: DATABASE SCHEMA & MIGRATIONS

The Cloudflare D1 SQLite database has been extended with 6 relational tables in `schema.sql` and `src/lib/d1-database.ts`:

### 1. `seo_topics`
Stores the pillar topic clusters, ordering, and parent-child taxonomy.
- Primary Key: `id TEXT`
- Unique Index: `slug TEXT`
- Fields: `title`, `description`, `parent_topic_id`, `pillar_page_id`, `cluster_order`, timestamps.

### 2. `seo_keywords`
Stores the keyword registry with mapped topic IDs, intent classifications, priority levels, and difficulty.
- Primary Key: `id TEXT`
- Unique Index: `keyword TEXT`
- Indexes: `topic_id`, `search_intent`, `priority`

### 3. `seo_pages`
Stores the search page model for both static routes and future programmatic pages.
- Primary Key: `id TEXT`
- Unique Index: `slug TEXT`
- Indexes: `page_type`, `primary_topic_id`, `publication_status`, `is_indexable`
- Fields: `slug`, `page_type`, `primary_topic_id`, `search_intent`, `primary_keyword`, `secondary_keywords` (JSON), `country`, `language`, `locale`, `title`, `meta_description`, `h1`, `body_content`, `canonical_url`, `hreflang_references` (JSON), `schema_type`, `schema_config` (JSON), `is_indexable` (INTEGER), `publication_status` (TEXT), `breadcrumb_hierarchy` (JSON), `quality_score` (INTEGER), `quality_issues` (JSON), timestamps.

### 4. `seo_internal_links`
Directed internal link graph mapping source to destination paths with anchor text, rel, and context.
- Primary Key: `id TEXT`
- Indexes: `source_path`, `target_path`

### 5. `search_console_metrics`
Storage ready for Google Search Console API data ingestion (query, page, country, device, clicks, impressions, CTR, position, date).
- Primary Key: `id TEXT`
- Indexes: `date`, `page`, `query`

### 6. `seo_audit_issues`
Persistent findings from the automated SEO audit crawler.
- Primary Key: `id TEXT`
- Indexes: `severity`, `route_path`

---

## SECTION G: ADMIN SEO / SEARCH INTELLIGENCE ARCHITECTURE

A dedicated **Search Intelligence** workspace has been integrated into the SAHYAK Admin panel (`/admin` tab: `seo`), styled to match the official brand aesthetic (clean `#f8fafc` canvas, crisp white cards, `#0077ff` highlights, zero dark mode clutter).

### Workspace Capabilities:
1. **Overview & Health:** Displays real KPIs (SEO Health Score out of 100, Indexable Pages, Registered Topics, Target Keywords, Active Sitemaps, and GSC Connection Status).
2. **Topic Clusters:** Visual interactive cards representing each of the 6 topic clusters with mapped keyword counts and quick filters.
3. **Pages & Quality Gate:** Filterable data table of pages with search by slug/title, page type selector, indexability toggles (`index, follow` vs `noindex`), and 1-click **Audit Quality** modal.
4. **Audit Issues:** Real-time feed of detected critical issues, warnings, and recommendations with exact route paths and suggested fixes.
5. **Segmented Sitemaps:** Real-time URL count per sitemap segment, last updated timestamps, and 1-click XML inspection.
6. **Search Console Data:** Truthful reporting of Google Search Console credentials status, query tables, and setup instructions.

---

## SECTION H: INTERNATIONAL SEO ARCHITECTURE

To support international discovery while keeping the authoritative billing in INR, the architecture treats **Country, Language, Locale, and Currency as separate concepts**:

```
CONCEPT SEPARATION:
- Country:   ISO 3166-1 alpha-2 (e.g. IN, AE, US, GB, CA, AU, SG)
- Language:  ISO 639-1 (e.g. en, hi)
- Locale:    Combined tag (e.g. en-in, en-ae, en-us)
- Currency:  Authoritative base is INR (₹); Display currencies: USD ($), AED (AED), GBP (£), EUR (€)
```

### Localized Route Strategy:
- Authoritative canonical root pages reside at `https://sahyak.com/` (Default English, primary market India).
- Dedicated international market pages (e.g. `/en-ae/...` for Dubai/UAE real estate brokers) are created **only when genuine localized value exists** (e.g. UAE RERA escrow rules, Dirham pricing displays).
- No near-duplicate country doorway pages will be generated.

### Hreflang Implementation:
- Implemented via `generateSeoMetadata()`:
  - Generates self-referencing hreflang.
  - Generates reciprocal hreflang links only when localized versions actually exist in the database.
  - Designates `x-default` to the canonical English root page.
  - Never links to nonexistent or draft pages.

---

## SECTION I: DYNAMIC SEGMENTED SITEMAP ARCHITECTURE

Rather than a monolithic static XML list, the sitemap system is modularized into 5 dedicated segment endpoints:

1. **`https://sahyak.com/sitemap.xml`:** Next.js dynamic root sitemap delivering all active, indexable, published pages.
2. **`https://sahyak.com/sitemap-pages.xml`:** Segment for core commercial and feature landing pages.
3. **`https://sahyak.com/sitemap-solutions.xml`:** Segment for problem/solution and industry pages.
4. **`https://sahyak.com/sitemap-learn.xml`:** Segment for educational resources, sales playbooks, and guides.
5. **`https://sahyak.com/sitemap-tools.xml`:** Segment for interactive calculators and utilities.
6. **`https://sahyak.com/sitemap-comparisons.xml`:** Segment for category comparisons.

**Strict Exclusion Filters:**
- Any page with `is_indexable = false` (noindex).
- Any page with `publication_status = 'draft'`.
- Any private administrative route (`/admin/*`) or API route (`/api/*`).
- Any staging or preview domain.

---

## SECTION J: INTERNAL LINKING ARCHITECTURE

To establish crawlable topical authority:
1. **Contextual In-Body Cross-Links:**
   - Features page links contextually to Pricing (`/pricing`) and Resources (`/resources`).
   - Pricing page links to Contact Architecture Walkthrough (`/contact`).
   - Security page links to Privacy DPDP Alignment (`/privacy`).
2. **Navigational & Footer Graph:**
   - Global Navbar provides direct crawl paths to `/features`, `/pricing`, `/security`, `/resources`, `/about`, `/contact`.
   - Global Footer provides structured taxonomy links to all compliance and technical pages.
3. **Orphan Page Detection:**
   - The automated crawler monitors the directed graph in `seo_internal_links`. If any published subpage has 0 inbound links, a warning is raised in the Admin console.

---

## SECTION K: TRUTHFUL STRUCTURED DATA ARCHITECTURE

Structured data generation is centralized in `src/lib/seo/structured-data.ts`:
- **`buildOrganizationSchema()`:** Real corporate information (Sahyak Technologies Pvt. Ltd., registered office in Sector 62 Noida, official email, phone, and social handles).
- **`buildWebSiteSchema()`:** WebSite identity with publisher binding.
- **`buildSoftwareApplicationSchema()`:** Genuine category (`BusinessApplication`), subCategory (`Real Estate CRM`), and real offers (Free Starter Tier: ₹0; Base Plan: ₹499).
- **`buildBreadcrumbSchema()`:** BreadcrumbList microdata matching visible breadcrumb chains.
- **`buildArticleSchema()` & `buildFAQSchema()`:** Content-matched schemas for resources and playbooks.
- **Zero Fabrication Mandate:** Never includes unbacked review scores, false star ratings, or imaginary customer counts.

---

## SECTION L: SEO QUALITY GATE SPECIFICATION

Before any page can have `is_indexable = 1` or `publication_status = 'published'`, it is evaluated against the 10-point Quality Gate:

```
QUALITY GATE CHECKLIST:
1. Slug Format: Lowercase alphanumeric with hyphens; unique across database.
2. Title Length: Between 25 and 70 characters; unique across all pages.
3. Meta Description Length: Between 70 and 165 characters; unique across all pages.
4. H1 Presence: Exactly one descriptive H1 heading present.
5. Body Word Count: Minimum 25 words for draft; minimum 100 words for published pages.
6. Canonical Validity: Absolute HTTPS URL matching production domain; zero staging URLs.
7. Locale Format: Valid ISO format (e.g. 'en', 'en-in', 'en-us').
8. Keyword Cannibalization: Primary keyword must not duplicate an existing published page.
9. Schema Validity: Must match one of the approved Schema.org types.
10. Noindex Consistency: If published, is_indexable must not be contradictory.
```

If blocking issues are detected, the Admin API rejects publication and returns a detailed issue diagnostic.

---

## SECTION M: EXACT NEXT-PHASE CONTENT PLAN

In Phase 2, content pages will be produced systematically based on validated keyword demand. No thin or doorway pages will be created.

### Planned Content Production Batches:

#### Batch 1: High-Priority Problem / Solution Pages (P0)
1. `/solutions/lead-leakage-prevention`: Solving the "40% lead death in 15 mins" problem for Indian property developers.
2. `/solutions/client-phone-masking`: Solving junior agent contact poaching and client list security for brokerage owners.
3. `/solutions/real-estate-whatsapp-automation`: 1-tap floor plan dispatch and automated brochure delivery.

#### Batch 2: Industry Solution Pages (P0)
1. `/industry/real-estate-brokers`: Workflow tailored for individual consultants and 1-5 person brokerages.
2. `/industry/channel-partners`: Multi-project builder inventory access and commission tracking.
3. `/industry/property-developers`: Multi-tower unit blocking, call center round-robin, and construction-linked demand generation.

#### Batch 3: Interactive Tool Pages (P1)
1. `/tools/lead-leakage-calculator`: Interactive ROI calculator quantifying revenue loss based on average ticket size and response latency.
2. `/tools/broker-commission-split-calculator`: Calculates channel partner splits, agent incentives, and net brokerage.

#### Batch 4: Category Comparisons (P1)
1. `/compare/real-estate-crm-vs-excel`: Objective breakdown of spreadsheet failure modes in Sunday site visit operations.
2. `/compare/sahyak-vs-generic-crm`: Why horizontal CRMs (HubSpot/Salesforce) require ₹5L+ in consulting customization for real estate.

---

## SECTION N: FINAL TECHNICAL AUDIT & FILE CHANGES

### Files Modified:
- [`schema.sql`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/schema.sql): Added 6 SEO tables (`seo_topics`, `seo_keywords`, `seo_pages`, `seo_internal_links`, `search_console_metrics`, `seo_audit_issues`) and corresponding indexes.
- [`src/lib/d1-database.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/d1-database.ts): Added schema statements and self-healing migration checks for SEO tables.
- [`src/app/sitemap.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap.ts): Upgraded from static array to dynamic repository generator.
- [`src/app/robots.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/robots.ts): Hardened crawler directives, query spam blocking, and multiple sitemap declarations.
- [`src/app/admin/page.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/admin/page.tsx): Added `"seo"` tab and Search Intelligence control view.

### Files Created:
- [`src/lib/seo/types.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/types.ts): Complete TypeScript interfaces for search entities, intents, page types, quality gates, and audit results.
- [`src/lib/seo/store.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/store.ts): Dual-runtime repository layer (D1 SQLite + in-memory fallback) with seed topics and seed keywords.
- [`src/lib/seo/metadata.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/metadata.ts): Canonical resolution, OpenGraph, Twitter, robots, and hreflang generator.
- [`src/lib/seo/structured-data.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/structured-data.ts): Truthful JSON-LD Schema generators matching visible content.
- [`src/lib/seo/quality-gate.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/quality-gate.ts): Automated quality gate engine.
- [`src/lib/seo/audit-crawler.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/audit-crawler.ts): Automated SEO audit crawler.
- [`src/lib/seo/breadcrumbs.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/lib/seo/breadcrumbs.tsx): Crawlable breadcrumb component with BreadcrumbList schema.
- [`src/app/pricing/layout.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/pricing/layout.tsx): Server metadata layout for Pricing.
- [`src/app/contact/layout.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/contact/layout.tsx): Server metadata layout for Contact.
- [`src/app/resources/layout.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/resources/layout.tsx): Server metadata layout for Resources.
- [`src/app/sitemap-pages.xml/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap-pages.xml/route.ts): Segmented XML sitemap for commercial pages.
- [`src/app/sitemap-solutions.xml/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap-solutions.xml/route.ts): Segmented XML sitemap for solutions.
- [`src/app/sitemap-learn.xml/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap-learn.xml/route.ts): Segmented XML sitemap for educational resources.
- [`src/app/sitemap-tools.xml/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap-tools.xml/route.ts): Segmented XML sitemap for tools.
- [`src/app/sitemap-comparisons.xml/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/sitemap-comparisons.xml/route.ts): Segmented XML sitemap for comparisons.
- [`src/app/api/admin/seo/overview/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/overview/route.ts): Admin overview KPI endpoint.
- [`src/app/api/admin/seo/topics/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/topics/route.ts): Admin topics taxonomy endpoint.
- [`src/app/api/admin/seo/pages/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/pages/route.ts): Admin pages list and creation endpoint.
- [`src/app/api/admin/seo/pages/[id]/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/pages/[id]/route.ts): Admin single page endpoint.
- [`src/app/api/admin/seo/pages/[id]/validate/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/pages/[id]/validate/route.ts): Admin quality gate validation endpoint.
- [`src/app/api/admin/seo/audit/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/audit/route.ts): Admin audit crawler endpoint.
- [`src/app/api/admin/seo/sitemaps/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/sitemaps/route.ts): Admin sitemaps status endpoint.
- [`src/app/api/admin/seo/performance/route.ts`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/app/api/admin/seo/performance/route.ts): Admin Search Console performance endpoint.
- [`src/components/admin/AdminSeoWorkspace.tsx`](file:///c:/Users/Hi/OneDrive/Documents/crm/crm-website/sahyak-website/src/components/admin/AdminSeoWorkspace.tsx): Interactive Admin SEO workspace UI.

### Verification Results:
- `npx tsc --noEmit`: 0 errors.
- `npm run build`: 32/32 routes compiled cleanly (0 build errors).
- Live Crawler Run: 9 pages audited, 72 checks evaluated, 0 critical issues detected, SEO health score 100/100.
- Public Visual Freeze: Fully preserved across `/`, `/features`, `/pricing`, `/security`, `/about`, `/contact`, `/resources`.
