"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGaEvent } from "@/lib/gtag";

function getOrCreateStorageId(
  key: string,
  storage: Storage | null,
  prefix: string
): string {
  try {
    if (!storage) return `${prefix}_${Date.now()}`;
    let val = storage.getItem(key);
    if (!val) {
      val = `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      storage.setItem(key, val);
    }
    return val;
  } catch {
    return `${prefix}_fallback_${Date.now()}`;
  }
}

function getOrCreateSessionId(): string {
  try {
    const now = Date.now();
    const lastActiveStr = window.sessionStorage.getItem("_sahyak_last_active");
    const lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : 0;
    let sid = window.sessionStorage.getItem("_sahyak_sid");

    // 30-minute inactivity timeout creates a new session while retaining the same visitorId
    if (!sid || (lastActive > 0 && now - lastActive > 30 * 60 * 1000)) {
      sid = `s_${now.toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      window.sessionStorage.setItem("_sahyak_sid", sid);
    }
    window.sessionStorage.setItem("_sahyak_last_active", now.toString());
    return sid;
  } catch {
    return `s_fallback_${Date.now()}`;
  }
}

function parseUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    ["source", "medium", "campaign", "term", "content"].forEach((k) => {
      const val = params.get(`utm_${k}`);
      if (val) utm[k] = val;
    });
    return utm;
  } catch {
    return {};
  }
}

function sendTelemetry(payload: Record<string, unknown>): void {
  try {
    const vid = (payload.vid || payload.visitorId) as string | undefined;
    const sid = (payload.sid || payload.sessionId) as string | undefined;
    const path = (payload.path || payload.page) as string | undefined;
    const duration = (payload.durationSec ?? payload.duration) as number | undefined;

    let device = "Desktop";
    let browser = "Other";
    let os = "Other";

    if (typeof navigator !== "undefined") {
      const ua = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
        device = "Mobile";
      } else if (/tablet|ipad/i.test(ua)) {
        device = "Tablet";
      }

      if (/edg/i.test(ua)) browser = "Edge";
      else if (/chrome|crios/i.test(ua)) browser = "Chrome";
      else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
      else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";

      if (/windows/i.test(ua)) os = "Windows";
      else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
      else if (/android/i.test(ua)) os = "Android";
      else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
      else if (/linux/i.test(ua)) os = "Linux";
    }

    const body = JSON.stringify({
      ...payload,
      visitorId: vid,
      sessionId: sid,
      path: path,
      durationSec: duration,
      device: payload.device || device,
      browser: payload.browser || browser,
      os: payload.os || os,
      ts: Date.now(),
    });

    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.setItem("_sahyak_last_active", Date.now().toString());
      } catch {}
    }

    // Modern keepalive fetch is the most reliable cross-browser telemetry transport
    if (typeof fetch === "function") {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    }
  } catch {
    // Ignore telemetry delivery errors
  }
}

export function AnalyticsBeacon() {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(Date.now());
  const activeDurationRef = useRef<number>(0);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastVisibilityChangeRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(pathname);
  const isFirstPageRef = useRef<boolean>(true);

  const sectionDwellMapRef = useRef<Map<string, { startTime: number; totalDwell: number }>>(
    new Map()
  );

  currentPathRef.current = pathname;

  // 1. Page View & Duration on Route Change
  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) return;

    const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
    const sid = getOrCreateSessionId();
    const landingPage =
      getOrCreateStorageId("_sahyak_landing", window.sessionStorage, "lp") === "lp"
        ? pathname
        : window.sessionStorage.getItem("_sahyak_landing") || pathname;

    if (!window.sessionStorage.getItem("_sahyak_landing")) {
      try {
        window.sessionStorage.setItem("_sahyak_landing", pathname);
      } catch {}
    }

    const utm = parseUtmParams();
    const referrer = document.referrer || "";
    const locale = typeof navigator !== "undefined" ? navigator.language : "en";

    sendTelemetry({
      type: "pageview",
      vid,
      sid,
      page: pathname,
      title: document.title || "",
      referrer,
      landing_page: landingPage,
      isEntry: isFirstPageRef.current,
      locale,
      ...utm,
    });

    isFirstPageRef.current = false;
    pageStartTimeRef.current = Date.now();
    activeDurationRef.current = 0;
    lastVisibilityChangeRef.current = Date.now();
    isTabVisibleRef.current = !document.hidden;

    return () => {
      let duration = activeDurationRef.current;
      if (isTabVisibleRef.current) {
        duration += Math.round((Date.now() - lastVisibilityChangeRef.current) / 1000);
      }

      if (duration >= 1) {
        sendTelemetry({
          type: "page_duration",
          vid,
          sid,
          page: pathname,
          duration,
          isExit: false,
        });
      }
    };
  }, [pathname]);

  // 2. Visibility & Unload Tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
      const sid = getOrCreateStorageId("_sahyak_sid", window.sessionStorage, "s");
      const currentPath = currentPathRef.current;

      if (document.hidden) {
        if (isTabVisibleRef.current) {
          activeDurationRef.current += Math.round(
            (Date.now() - lastVisibilityChangeRef.current) / 1000
          );
          isTabVisibleRef.current = false;
        }
      } else {
        isTabVisibleRef.current = true;
        lastVisibilityChangeRef.current = Date.now();

        if (!currentPath.startsWith("/admin")) {
          sendTelemetry({
            type: "heartbeat",
            vid,
            sid,
            page: currentPath,
          });
        }
      }
    };

    const handlePageHide = () => {
      const currentPath = currentPathRef.current;
      if (currentPath.startsWith("/admin")) return;

      const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
      const sid = getOrCreateStorageId("_sahyak_sid", window.sessionStorage, "s");

      let totalSec = activeDurationRef.current;
      if (isTabVisibleRef.current) {
        totalSec += Math.round((Date.now() - lastVisibilityChangeRef.current) / 1000);
      }

      if (totalSec >= 1) {
        sendTelemetry({
          type: "page_duration",
          vid,
          sid,
          page: currentPath,
          duration: totalSec,
          isExit: true,
        });
      }

      sectionDwellMapRef.current.forEach((val, sectionId) => {
        const dwell =
          val.totalDwell +
          (val.startTime > 0 ? Math.round((Date.now() - val.startTime) / 1000) : 0);
        if (dwell >= 2) {
          sendTelemetry({
            type: "section_engagement",
            vid,
            sid,
            page: currentPath,
            sectionId,
            duration: dwell,
          });
        }
      });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("beforeunload", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("beforeunload", handlePageHide);
    };
  }, []);

  // 3. Heartbeat every 25s
  useEffect(() => {
    const interval = setInterval(() => {
      const currentPath = currentPathRef.current;
      if (document.hidden || currentPath.startsWith("/admin")) return;

      const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
      const sid = getOrCreateStorageId("_sahyak_sid", window.sessionStorage, "s");

      sendTelemetry({
        type: "heartbeat",
        vid,
        sid,
        page: currentPath,
      });
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  // 4. Section Engagement Observer
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (typeof IntersectionObserver === "undefined") return;

    const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
    const sid = getOrCreateStorageId("_sahyak_sid", window.sessionStorage, "s");

    const observer = new IntersectionObserver(
      (entries) => {
        const now = Date.now();
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const sectionId = target.dataset.analyticsSection;
          if (!sectionId) return;

          let data = sectionDwellMapRef.current.get(sectionId);
          if (!data) {
            data = { startTime: 0, totalDwell: 0 };
            sectionDwellMapRef.current.set(sectionId, data);
          }

          if (entry.isIntersecting) {
            if (data.startTime === 0) {
              data.startTime = now;
            }
          } else {
            if (data.startTime > 0) {
              const elapsed = Math.round((now - data.startTime) / 1000);
              data.totalDwell += elapsed;
              data.startTime = 0;

              if (data.totalDwell >= 2) {
                sendTelemetry({
                  type: "section_engagement",
                  vid,
                  sid,
                  page: pathname,
                  sectionId,
                  duration: data.totalDwell,
                });
                data.totalDwell = 0;
              }
            }
          }
        });
      },
      { threshold: 0.35 }
    );

    const elements = document.querySelectorAll("[data-analytics-section]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  // 5. CTA Click Tracking (Conversion Micro-Action)
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const handleCtaClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button") as HTMLElement | null;
      if (!target) return;

      const href = target.getAttribute("href") || "";
      const text = (target.textContent || "").trim();
      const isCta =
        target.dataset.analyticsCta !== undefined ||
        href.includes("/contact") ||
        /book.*demo|start.*free|schedule.*demo|try.*demo|get.*started/i.test(text);

      if (isCta) {
        const vid = getOrCreateStorageId("_sahyak_vid", window.localStorage, "v");
        const sid = getOrCreateSessionId();
        const landingPage =
          window.sessionStorage.getItem("_sahyak_landing") || pathname;

        sendTelemetry({
          type: "cta_click",
          vid,
          sid,
          page: pathname,
          landing_page: landingPage,
          content: text.substring(0, 40),
        });

        // Coexist with GA4 without duplicate listeners
        const ctaLocation = target.dataset.analyticsLocation || "page";
        const ctaName = text.substring(0, 50) || "CTA";
        const pageLocation = typeof window !== "undefined" ? window.location.href : "";

        trackGaEvent("cta_click", {
          cta_name: ctaName,
          cta_location: ctaLocation,
          page_location: pageLocation,
        });

        if (/book.*demo|schedule.*demo|try.*demo/i.test(text)) {
          trackGaEvent("book_demo_click", {
            cta_name: ctaName,
            cta_location: ctaLocation,
            page_location: pageLocation,
          });
        }
      }

      // Check for WhatsApp interactions
      const isWhatsApp =
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        /whatsapp/i.test(text) ||
        target.dataset.analyticsWhatsapp !== undefined;

      if (isWhatsApp) {
        trackGaEvent("whatsapp_click", {
          cta_name: "whatsapp_sales",
          cta_location: target.dataset.analyticsLocation || "floating_whatsapp",
          page_location: typeof window !== "undefined" ? window.location.href : "",
        });
      }
    };

    document.addEventListener("click", handleCtaClick, { capture: true, passive: true });
    return () => {
      document.removeEventListener("click", handleCtaClick, { capture: true });
    };
  }, [pathname]);

  return null;
}

