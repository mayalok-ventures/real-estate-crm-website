/**
 * Sahyak International Multi-Currency Conversion Engine
 *
 * CRITICAL BILLING ARCHITECTURE:
 * - Authoritative Billing Currency: INR (₹)
 * - Display Currencies: Dynamically converted for international visitors using
 *   cached foreign exchange rates with clean localized rounding.
 */

export type SupportedCurrency = "INR" | "USD" | "GBP" | "EUR" | "AED" | "CAD" | "AUD" | "SGD";

export const AUTHORITATIVE_BILLING_CURRENCY: SupportedCurrency = "INR";
export function getBillingCurrency(): SupportedCurrency {
  return AUTHORITATIVE_BILLING_CURRENCY;
}

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  decimals: number;
  flag: string;
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 0, flag: "🇮🇳" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", decimals: 0, flag: "🇺🇸" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", decimals: 0, flag: "🇬🇧" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", decimals: 0, flag: "🇪🇺" },
  AED: { code: "AED", symbol: "AED ", name: "UAE Dirham", decimals: 0, flag: "🇦🇪" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", decimals: 0, flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", decimals: 0, flag: "🇦🇺" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", decimals: 0, flag: "🇸🇬" }
};

// Fallback parity exchange rates against 1 INR if external rate API is unreachable
export const FALLBACK_INR_RATES: Record<SupportedCurrency, number> = {
  INR: 1.0,
  USD: 0.0116,   // ~₹86 per USD
  GBP: 0.0091,   // ~₹110 per GBP
  EUR: 0.0106,   // ~₹94 per EUR
  AED: 0.0425,   // ~₹23.5 per AED
  CAD: 0.0158,   // ~₹63.5 per CAD
  AUD: 0.0178,   // ~₹56 per AUD
  SGD: 0.0155    // ~₹64.5 per SGD
};

// In-memory 24-hour cache for server-side rate fetching
interface CachedRates {
  rates: Record<SupportedCurrency, number>;
  timestamp: number;
}

let ratesCache: CachedRates | null = null;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function getExchangeRates(): Promise<{
  rates: Record<SupportedCurrency, number>;
  isCached: boolean;
  lastUpdated: string;
}> {
  const now = Date.now();

  if (ratesCache && now - ratesCache.timestamp < CACHE_TTL_MS) {
    return {
      rates: ratesCache.rates,
      isCached: true,
      lastUpdated: new Date(ratesCache.timestamp).toISOString()
    };
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      next: { revalidate: 86400 }
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.rates) {
        const freshRates: Record<SupportedCurrency, number> = {
          INR: 1.0,
          USD: data.rates.USD || FALLBACK_INR_RATES.USD,
          GBP: data.rates.GBP || FALLBACK_INR_RATES.GBP,
          EUR: data.rates.EUR || FALLBACK_INR_RATES.EUR,
          AED: data.rates.AED || FALLBACK_INR_RATES.AED,
          CAD: data.rates.CAD || FALLBACK_INR_RATES.CAD,
          AUD: data.rates.AUD || FALLBACK_INR_RATES.AUD,
          SGD: data.rates.SGD || FALLBACK_INR_RATES.SGD
        };

        ratesCache = {
          rates: freshRates,
          timestamp: now
        };

        return {
          rates: freshRates,
          isCached: false,
          lastUpdated: new Date(now).toISOString()
        };
      }
    }
  } catch (err) {
    console.warn("[Exchange Rate Fetch Warning - Using Fallback Parity]:", err);
  }

  ratesCache = {
    rates: FALLBACK_INR_RATES,
    timestamp: now
  };

  return {
    rates: FALLBACK_INR_RATES,
    isCached: true,
    lastUpdated: new Date(now).toISOString()
  };
}

/**
 * Converts an INR amount to target currency with clean, localized rounding
 * (e.g. ₹499 -> $6, not $5.7884)
 */
export function convertInrToTarget(
  inrAmount: number,
  targetCurrency: SupportedCurrency,
  rates: Record<SupportedCurrency, number> = FALLBACK_INR_RATES
): number {
  if (targetCurrency === "INR" || inrAmount === 0) {
    return inrAmount;
  }

  const rate = rates[targetCurrency] || FALLBACK_INR_RATES[targetCurrency] || 1;
  const rawConverted = inrAmount * rate;

  // Clean rounding: if < 50, round to nearest whole integer or half
  if (rawConverted < 10) {
    return Math.round(rawConverted);
  } else if (rawConverted < 100) {
    return Math.round(rawConverted);
  } else {
    // Round to nearest 5 or 10 for clean international pricing presentation
    return Math.round(rawConverted / 5) * 5;
  }
}

/**
 * Formats a numeric price into a locale-aware string with currency symbol
 */
export function formatDisplayCurrency(
  amount: number,
  currency: SupportedCurrency
): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.INR;

  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: config.code,
      maximumFractionDigits: config.decimals,
      minimumFractionDigits: config.decimals
    });
    return formatter.format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Auto-detects supported currency from country code or browser locale
 */
export function detectCurrency(countryCodeOrLocale?: string): SupportedCurrency {
  if (!countryCodeOrLocale) return "INR";

  const upper = countryCodeOrLocale.toUpperCase();

  if (upper === "IN" || upper.includes("EN-IN") || upper.includes("HI")) return "INR";
  if (upper === "US" || upper.includes("EN-US")) return "USD";
  if (upper === "GB" || upper.includes("EN-GB") || upper === "UK") return "GBP";
  if (
    upper === "EU" ||
    upper === "DE" ||
    upper === "FR" ||
    upper === "ES" ||
    upper === "IT" ||
    upper === "NL" ||
    upper.includes("DE-") ||
    upper.includes("FR-")
  ) {
    return "EUR";
  }
  if (upper === "AE" || upper.includes("AR-AE")) return "AED";
  if (upper === "CA" || upper.includes("EN-CA")) return "CAD";
  if (upper === "AU" || upper.includes("EN-AU")) return "AUD";
  if (upper === "SG" || upper.includes("EN-SG")) return "SGD";

  // Default international visitors outside India to USD for universal recognition
  return "USD";
}
