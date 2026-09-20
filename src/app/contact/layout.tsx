import type { Metadata } from "next";
import { generateSeoMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSeoMetadata({
  title: "Book a Live Architecture Demo & Sales Consultation | Sahyak CRM",
  description:
    "Speak directly with our real estate systems specialists. Schedule a live product walkthrough, review your agency pipeline requirements, or start with 20 free leads.",
  path: "/contact",
  keywords: [
    "contact Sahyak CRM",
    "book real estate CRM demo",
    "real estate sales consultation",
    "Sahyak office Noida",
    "property CRM support",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
