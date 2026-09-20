import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Transparent Real Estate CRM Pricing — Free Starter to Enterprise | Sahyak CRM",
  description:
    "Simple, predictable pricing built for real estate. Start free with 20 leads and 1 user seat. Scale capacity with transparent modular add-ons and zero forced contracts.",
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
