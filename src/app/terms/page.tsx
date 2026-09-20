import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Sahyak CRM",
  description: "Sahyak CRM Terms of Service: Master subscription agreement, billing policies, user obligations, and platform usage terms.",
  alternates: {
    canonical: "https://sahyak.com/terms"
  }
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="pt-20 pb-12 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold mb-4">
            <FileText className="w-3.5 h-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Last updated: September 2026 • Governing Law: Jurisdiction of New Delhi, India
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate text-slate-700 text-xs sm:text-sm space-y-8 leading-relaxed">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the website at sahyak.com or the application at crm.sahyak.com (collectively, the &ldquo;Service&rdquo;), you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of a brokerage agency, developer, or legal entity, you represent that you have the authority to bind that entity.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">2. Description of Service &amp; Free Starter Tier</h2>
            <p>
              Sahyak provides a multi-tenant cloud-based real estate sales velocity and CRM platform. We offer a Free Starter Tier comprising <strong>20 inbound leads, 1 user seat, 10 WhatsApp messages, and 3 active property listings</strong>. The Free Starter Tier requires no credit card and does not expire unless explicitly terminated for violation of these terms.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">3. Subscriptions &amp; GST Invoicing</h2>
            <p>
              Paid subscriptions (Base Access Plan and Capacity Add-ons) are billed either monthly or annually in advance. All quoted prices are in Indian Rupees (INR) and are exclusive of applicable Indian Goods and Services Tax (GST 18%), which will be charged and itemized on compliant tax invoices citing your registered GSTIN.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">4. Customer Data Ownership &amp; Acceptable Use</h2>
            <p>
              You retain all right, title, and interest in and to all data you upload or ingest into the CRM. You agree not to use the Service for sending unsolicited spam messages, violating WhatsApp Business policy guidelines, harvesting unauthorized contact lists, or uploading malicious code.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted under Indian law, Sahyak and its affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages, including loss of profits, lost deals, or data corruption. Our total liability for any claim arising out of this agreement shall not exceed the amount actually paid by you in the 12 months preceding the event.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">6. Governing Law &amp; Jurisdiction</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal dispute or proceeding arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts located in New Delhi, India.
            </p>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">7. Questions Regarding Terms</h2>
            <p>
              For legal inquiries or questions regarding this agreement, please email <a href="mailto:legal@sahyak.com" className="text-cyan-600 font-bold">legal@sahyak.com</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
