import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Real Estate CRM Pricing — ₹499 Base Access | Sahyak",
  description:
    "Simple real estate CRM pricing built around capacity. Start at ₹499 and scale users, leads, storage, and integrations as your sales operation grows.",
  path: "/pricing",
  keywords: [
    "real estate CRM pricing",
    "free real estate CRM",
    "broker CRM software pricing",
    "property CRM cost",
    "real estate sales CRM INR",
  ],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
