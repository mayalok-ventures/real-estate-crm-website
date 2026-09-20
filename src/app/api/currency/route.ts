import { NextResponse } from "next/server";
import { getExchangeRates, SUPPORTED_CURRENCIES } from "@/lib/currency";

export async function GET() {
  try {
    const { rates, isCached, lastUpdated } = await getExchangeRates();

    return NextResponse.json({
      success: true,
      base: "INR",
      rates,
      supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
      meta: {
        isCached,
        lastUpdated,
        authoritativeBillingCurrency: "INR",
        notice: "Display currency is estimated based on foreign exchange rates. Billing is in INR."
      }
    });
  } catch (error: any) {
    console.error("GET /api/currency error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch currency rates" },
      { status: 500 }
    );
  }
}
