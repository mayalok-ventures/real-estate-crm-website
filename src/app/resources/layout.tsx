import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Real Estate Sales Resources & Operating Hub | Sahyak CRM",
  description:
    "Practical guides, interactive calculators, field checklists, and sales operating resources built for real estate sales teams, brokers, and property developers.",
  path: "/resources",
  keywords: [
    "real estate sales resources",
    "real estate CRM tools",
    "lead response time calculator",
    "real estate commission calculator",
    "real estate lead leakage calculator",
    "real estate WhatsApp templates",
    "site visit checklist",
    "real estate CRM migration",
  ],
});

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
