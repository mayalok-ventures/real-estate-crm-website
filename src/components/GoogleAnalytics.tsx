"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/gtag";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // The initial page view is automatically fired by gtag('config', ID).
    // Subsequent client-side route transitions are tracked here.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    trackPageView(pathname);
  }, [pathname, isAdmin]);

  // Public website traffic only: Never load Google Analytics scripts or tags on admin routes
  if (isAdmin) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = function gtag(){window.dataLayer.push(arguments);};
            window.gtag('js', new Date());
            window.gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
