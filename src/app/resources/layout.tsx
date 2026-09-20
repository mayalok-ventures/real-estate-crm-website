import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Real Estate Sales Playbooks, WhatsApp Scripts & API Specs | Sahyak CRM",
  description:
    "Actionable operational resources for real estate brokers and developers. High-converting WhatsApp templates, Sunday site visit logistics checklist, and webhook specs.",
  path: "/resources",
  keywords: [
    "real estate sales playbooks",
    "real estate WhatsApp templates",
    "site visit checklist",
    "property lead webhook API",
    "broker follow-up scripts",
  ],
});

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
