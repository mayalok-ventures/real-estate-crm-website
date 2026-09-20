import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Sahyak CRM",
  description: "Sahyak Privacy Policy: Learn how we protect, store, and govern customer and lead data under the Digital Personal Data Protection (DPDP) Act.",
  alternates: {
    canonical: "https://sahyak.com/privacy"
  }
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Data Governance &amp; DPDP Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Last updated: September 2026 • Governed under the Laws of India
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-slate-700 text-xs sm:text-sm space-y-8 leading-relaxed">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">1. Core Commitment: Zero Lead Monetization</h2>
            <p>
              At Sahyak, we recognize that your real estate client database is the lifeblood of your brokerage or development firm. <strong>We do not sell, rent, monetize, or share your leads, buyer contacts, or transaction details with any third party, competing broker, developer, or advertising network.</strong> You retain 100% full ownership of all data ingested into your tenant account.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p>We collect information to provide and operate the Sahyak CRM platform:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Account Information:</strong> Name, work email address, company name, phone number, and billing details provided during registration.</li>
              <li><strong>Customer Ingested Data:</strong> Property lead details, inquiry timestamps, site visit schedules, notes, and property inventory records submitted via webhooks or manual entry.</li>
              <li><strong>Usage &amp; Telemetry Data:</strong> Browser session information, IP addresses, feature dwell time, and diagnostic crash reports collected to ensure platform performance and security.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">3. How Your Data Is Stored &amp; Protected</h2>
            <p>
              Customer data in transit is protected using HTTPS/TLS encryption. Application access and database queries are tenant-scoped to the organization workspace boundary, helping prevent cross-tenant data access.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">4. DPDP Act &amp; Individual Data Rights</h2>
            <p>
              In accordance with India&apos;s Digital Personal Data Protection (DPDP) Act, you and your clients have the right to request access to personal data, request correction of inaccurate records, or request complete deletion of customer records (&ldquo;Right to be Forgotten&rdquo;) upon written request to our Data Protection Officer.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">5. Third-Party Integrations</h2>
            <p>
              When you connect third-party platforms (such as the WhatsApp Business API or webhook providers), information is transmitted strictly according to the permissions you configure. We are not responsible for the privacy practices of external services you link to your account.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">6. Website Analytics &amp; Performance Measurement</h2>
            <p>
              To maintain high platform availability, analyze public website traffic patterns, and optimize user experience, we utilize two distinct tiers of telemetry:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>First-Party Analytics:</strong> We operate an internal, first-party telemetry service that records anonymized technical signals (such as page rendering latency, feature dwell time, and user interaction states). This telemetry is stored in isolated internal databases and is never shared with or sold to external advertising networks.
              </li>
              <li>
                <strong>Google Analytics 4 (Public Website Traffic):</strong> On our public-facing marketing website, we deploy Google Analytics 4 (Measurement ID: <code>G-HT97YXZZ3Q</code>) to evaluate aggregate visitor acquisition, session duration, and general navigation flow.
              </li>
              <li>
                <strong>Strict PII Exclusion Guarantee:</strong> We enforce automated parameter sanitization on all Google Analytics 4 dispatches. Under no circumstances do we transmit Personally Identifiable Information (PII) — including names, phone numbers, email addresses, lead form inputs, property inquiries, or tenant CRM data — to Google Analytics. Google Analytics tracking is strictly disabled on all internal administrative (<code>/admin</code>) surfaces.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">7. Contact Our Privacy Team</h2>
            <p>
              If you have any questions or data governance inquiries regarding this Privacy Policy, please contact our team:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-3 font-mono text-xs">
              <div>Email: <a href="mailto:privacy@sahyak.com" className="text-cyan-600 font-bold">privacy@sahyak.com</a></div>
              <div className="mt-1">WhatsApp Sales &amp; Support: +91 87964 75107</div>
              <div className="mt-1">Support Email: <a href="mailto:support@sahyak.com" className="text-cyan-600 font-bold">support@sahyak.com</a></div>
              <div className="mt-1">Website: https://sahyak.com</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
