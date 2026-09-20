export const GA_MEASUREMENT_ID = "G-HT97YXZZ3Q";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Strict blocklist to ensure zero PII is ever sent to GA4
const SENSITIVE_KEYS = new Set([
  "name",
  "fullname",
  "phone",
  "phonenumber",
  "mobile",
  "email",
  "message",
  "requirement",
  "company",
  "organization",
  "lead",
  "client",
  "password",
  "token",
  "secret",
  "address",
  "street",
  "pincode",
  "zipcode",
  "crm",
  "customer",
]);

/**
 * Sanitizes event parameters to strictly forbid any PII from entering GA4 payloads.
 */
export function sanitizeGaParams(params: Record<string, any> = {}): Record<string, any> {
  const safe: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) continue;

    if (typeof value === "string") {
      // Discard strings that contain email patterns
      if (value.includes("@") && value.includes(".")) continue;
      // Discard long free-text responses that could contain user inputs
      if (value.length > 100) {
        safe[key] = value.substring(0, 100);
      } else {
        safe[key] = value;
      }
    } else if (typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
    }
  }

  return safe;
}

/**
 * Dispatches a sanitized Google Analytics 4 event.
 * Never tracks if inside /admin.
 */
export function trackGaEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  // Enforce no tracking on internal admin views
  if (window.location.pathname.startsWith("/admin")) return;

  const sanitized = sanitizeGaParams(params);
  window.gtag("event", eventName, sanitized);
}

/**
 * Dispatches a standard page_view event with safe parameters.
 */
export function trackPageView(url: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  // Enforce no tracking on admin
  if (url.startsWith("/admin")) return;

  window.gtag("event", "page_view", {
    page_path: url,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : "",
  });
}
