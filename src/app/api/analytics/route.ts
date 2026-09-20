import { NextRequest, NextResponse } from "next/server";
import { getCloudflareD1 } from "@/lib/cloudflare-context";
import { recordAnalyticsEvent, IngestEvent } from "@/lib/analytics-store";

export async function POST(request: NextRequest) {
  try {
    const db = getCloudflareD1(request);
    let body: any = null;

    try {
      body = await request.json();
    } catch {
      try {
        const text = await request.text();
        if (text) {
          body = JSON.parse(text);
        }
      } catch {
        body = null;
      }
    }

    const visitorId = body?.visitorId || body?.vid;
    if (!body || !body.type || !visitorId) {
      // Graceful 200 return to avoid client-side beacon console clutter if partial payload arrives on exit
      return NextResponse.json({ success: false, warning: "Incomplete event packet" }, { status: 200 });
    }

    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const isBot = /bot|googlebot|bingbot|crawler|spider|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|headlesschrome|curl|wget|python-requests|node-fetch/i.test(ua);
    if (isBot) {
      return NextResponse.json({ success: true, ignored: "bot_traffic" }, { status: 200 });
    }

    const cfCountry = request.headers.get("cf-ipcountry");
    const country = cfCountry && cfCountry.length === 2 ? cfCountry.toUpperCase() : (body.country || "IN");

    let device = body.device;
    if (!device) {
      if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(ua)) {
        device = "Mobile";
      } else if (/tablet|ipad/i.test(ua)) {
        device = "Tablet";
      } else {
        device = "Desktop";
      }
    }

    let browser = body.browser;
    if (!browser) {
      if (/edg/i.test(ua)) browser = "Edge";
      else if (/chrome|crios/i.test(ua)) browser = "Chrome";
      else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
      else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
      else browser = "Other";
    }

    let os = body.os;
    if (!os) {
      if (/windows/i.test(ua)) os = "Windows";
      else if (/macintosh|mac os x/i.test(ua)) os = "macOS";
      else if (/android/i.test(ua)) os = "Android";
      else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
      else if (/linux/i.test(ua)) os = "Linux";
      else os = "Other";
    }

    let source = body.source;
    const ref = (body.referrer || "").toLowerCase();
    if (!source) {
      if (body.campaign || body.utm_campaign) source = "Paid Campaign";
      else if (ref.includes("whatsapp")) source = "WhatsApp Conduit";
      else if (ref.includes("google") || ref.includes("bing") || ref.includes("yahoo")) source = "Organic Search";
      else if (ref.includes("facebook") || ref.includes("instagram") || ref.includes("linkedin") || ref.includes("twitter")) source = "Social Media";
      else if (ref && !ref.includes("sahyak.com") && !ref.includes("localhost")) source = "Referrals";
      else source = "Direct Navigation";
    }

    const event: IngestEvent = {
      type: body.type,
      visitorId,
      sessionId: body.sessionId || body.sid || "unknown_session",
      path: body.path || body.page || "/",
      title: body.title,
      referrer: body.referrer,
      source,
      medium: body.medium,
      campaign: body.campaign,
      term: body.term,
      content: body.content,
      landingPage: body.landingPage || body.landing_page,
      durationSec: body.durationSec ?? body.duration,
      sectionId: body.sectionId,
      isEntry: body.isEntry,
      isExit: body.isExit,
      country,
      city: body.city,
      device,
      browser,
      os,
      ts: body.ts || Date.now()
    };

    await recordAnalyticsEvent(event, db);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Return graceful 200 for telemetry failures so client telemetry beacons don't crash
    return NextResponse.json({ success: false, error: error?.message || "Telemetry error" }, { status: 200 });
  }
}
