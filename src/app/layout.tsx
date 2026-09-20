import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { GlobalNavbar } from "@/components/GlobalNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { PageTransition } from "@/components/PageTransition";
import { AnalyticsBeacon } from "@/components/AnalyticsBeacon";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#FAFAFA",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sahyak.com"),
  title: {
    default: "Sahyak CRM — The Serious CRM Built for Real Estate Sales",
    template: "%s | Sahyak Real Estate CRM",
  },
  description:
    "Take property leads from inquiry to WhatsApp chat, site visit, and booking. Sub-15s webhook ingress, instant agent routing, and real-time pipeline visibility.",
  keywords: [
    "Real Estate CRM",
    "Real Estate CRM India",
    "Real Estate WhatsApp CRM",
    "Property Lead Management",
    "Broker CRM Software",
    "Builder Sales CRM",
    "Site Visit Tracking CRM",
    "Delhi NCR Real Estate CRM",
    "Real Estate Follow-up App",
    "High-Ticket Property Sales System",
  ],
  authors: [{ name: "Sahyak Product & Solutions Team" }],
  creator: "Sahyak CRM",
  publisher: "Sahyak Technologies Pvt. Ltd.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://sahyak.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sahyak.com",
    title: "Sahyak CRM — The Serious CRM Built for Real Estate Sales",
    description:
      "Take property leads from inquiry to WhatsApp chat, site visit, and booking. Sub-15s webhook ingress, instant agent routing, and real-time pipeline visibility.",
    siteName: "Sahyak CRM",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Sahyak Real Estate CRM Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sahyak CRM — The Serious CRM Built for Real Estate Sales",
    description:
      "Take property leads from inquiries to WhatsApp conversations, automated site visits, and booked units. Zero lead leakage, instant agent assignment, and real-time manager visibility.",
    images: ["/android-chrome-512x512.png"],
    creator: "@sahyakcrm",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Truthful Schema.org Structured Data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://sahyak.com/#software",
      "name": "Sahyak CRM",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Real Estate CRM & Sales Pipeline Automation",
      "operatingSystem": "Web, iOS, Android (PWA)",
      "description":
        "The serious CRM built specifically around how real estate sales actually work. Features 1-tap WhatsApp proposals, site visit tracking, property matching, and team lead assignment.",
      "url": "https://sahyak.com",
      "image": "https://sahyak.com/android-chrome-512x512.png",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "description": "Free Starter Tier: 20 Active Leads, 1 User Seat, 10 WhatsApp Actions, 3 Properties included.",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://sahyak.com/#organization",
      "name": "Sahyak CRM",
      "legalName": "Sahyak Technologies Pvt. Ltd.",
      "url": "https://sahyak.com",
      "logo": "https://sahyak.com/android-chrome-512x512.png",
      "sameAs": [
        "https://linkedin.com/company/sahyakcrm",
        "https://twitter.com/sahyakcrm",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": siteConfig.salesEmail,
        "availableLanguage": ["English", "Hindi"],
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 62",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201309",
        "addressCountry": "IN",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth antialiased overflow-x-clip`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-[#FAFAFA] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white overflow-x-clip max-w-full">
        <GoogleAnalytics />
        <AnalyticsBeacon />
        <GlobalNavbar />
        <main className="flex-1 flex flex-col w-full overflow-x-clip max-w-full">
          <PageTransition>{children}</PageTransition>
        </main>
        <GlobalFooter />
        <FloatingWhatsAppButton />
      </body>
    </html>
  );
}
