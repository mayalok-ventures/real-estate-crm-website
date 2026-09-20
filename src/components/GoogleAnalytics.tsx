"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/gtag";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const lastTrackedRef = useRef<string | null>(null);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    // Track on initial load and route changes (avoiding duplicates)
    if (lastTrackedRef.current !== pathname) {
      lastTrackedRef.current = pathname;
      const timeout = setTimeout(() => {
        trackPageView(pathname);
      }, 50);
      return () => clearTimeout(timeout);
    }
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
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}
