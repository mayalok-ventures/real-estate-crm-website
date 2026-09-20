export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { 
  saveLead, 
  getAllLeads, 
  updateLead, 
  deleteLead, 
  clearLeads,
  LeadStatus 
} from "@/lib/leads-store";
import { 
  sanitizeHtml, 
  sanitizeEmail, 
  sanitizePhone, 
  checkRateLimit,
  verifyAdminSessionToken 
} from "@/lib/security";
import { getCloudflareD1 } from "@/lib/cloudflare-context";

const VALID_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Demo Scheduled",
  "Converted",
  "Closed",
];

// Helper: verify admin session
async function verifyAdmin(request: NextRequest): Promise<boolean> {
  try {
    const token = request.cookies.get("sahyak_admin_session")?.value;
    if (!token) return false;
    const auth = await verifyAdminSessionToken(token);
    return auth.valid;
  } catch {
    return false;
  }
}

// -------------------------------------------------------------
// POST /api/contact — Public Inbound Lead Ingress
// -------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("cf-connecting-ip") ||
      "anonymous";

    // Rate limiting: 10 submissions per minute per IP
    const rateLimit = checkRateLimit(`contact:${ip}`, 10, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many inquiries sent. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Honeypot spam detection
    if (body._hp && typeof body._hp === "string" && body._hp.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: "Inquiry received." },
        { status: 200 }
      );
    }

    // Bot timing deterrence (form filled in < 400ms)
    if (body._ts && typeof body._ts === "number") {
      const elapsed = Date.now() - body._ts;
      if (elapsed < 400) {
        return NextResponse.json(
          { success: false, error: "Submission too fast. Please verify inputs." },
          { status: 400 }
        );
      }
    }

    const {
      name,
      email,
      phone,
      company,
      persona,
      role,
      inquiryType,
      leadVolume,
      teamSize,
      message,
      requirement,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      landing_page,
      referrer,
      visitorId,
      sessionId,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailResult = sanitizeEmail(email || "");
    if (!emailResult.valid) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid work email address." },
        { status: 400 }
      );
    }

    const phoneResult = sanitizePhone(phone || "");
    if (!phoneResult.valid) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid phone number (minimum 7 digits)." },
        { status: 400 }
      );
    }

    const leadId = `lead_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const db = getCloudflareD1(request);

    const leadRecord = {
      id: leadId,
      requestId: `req_${leadId}`,
      submittedAt: nowIso,
      name: sanitizeHtml(name.trim()),
      email: emailResult.email,
      phone: phoneResult.phone,
      company: sanitizeHtml((company || "").trim()) || "—",
      teamSize: sanitizeHtml((teamSize || leadVolume || "").trim()) || "—",
      requirement: sanitizeHtml((requirement || message || "").trim()),
      inquiryType: sanitizeHtml((role || persona || inquiryType || "Broker / Builder").trim()),
      source: "website_contact_form",
      utmSource: sanitizeHtml((utm_source || "").trim()),
      utmMedium: sanitizeHtml((utm_medium || "").trim()),
      utmCampaign: sanitizeHtml((utm_campaign || "").trim()),
      utmTerm: sanitizeHtml((utm_term || "").trim()),
      utmContent: sanitizeHtml((utm_content || "").trim()),
      landingPage: sanitizeHtml((landing_page || "/contact").trim()),
      referrer: sanitizeHtml((referrer || "").trim()),
      visitorId: sanitizeHtml((visitorId || "").trim()),
      sessionId: sanitizeHtml((sessionId || "").trim()),
      status: "New" as LeadStatus,
      ip,
    };

    const result = await saveLead(leadRecord, db);

    // Optional: Asynchronous outbound webhook forward to CRM engine if configured
    if (process.env.CRM_WEBHOOK_URL && process.env.CRM_WEBHOOK_URL.trim().length > 0) {
      try {
        fetch(process.env.CRM_WEBHOOK_URL.trim(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.CRM_API_KEY ? { "x-api-key": process.env.CRM_API_KEY } : {}),
          },
          body: JSON.stringify({
            event: "lead.ingress",
            timestamp: nowIso,
            source: "sahyak_marketing_website",
            lead: leadRecord,
          }),
        }).catch((err) => {
          console.warn("[CRM Webhook Forward Warning]:", err?.message);
        });
      } catch {
        // Non-blocking
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! Our team will contact you shortly.",
        leadId: result.lead.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process inquiry. Please try again or reach out on WhatsApp." },
      { status: 500 }
    );
  }
}

// -------------------------------------------------------------
// GET /api/contact — Admin Lead Retrieval
// -------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const isAuthed = await verifyAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const db = getCloudflareD1(request);
    let leads = await getAllLeads(db);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const status = searchParams.get("status")?.trim();

    if (status && status !== "all") {
      leads = leads.filter((l) => l.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(search) ||
          l.email.toLowerCase().includes(search) ||
          l.phone.includes(search) ||
          l.company.toLowerCase().includes(search) ||
          (l.requirement && l.requirement.toLowerCase().includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    console.error("Error in GET /api/contact:", error);
    return NextResponse.json({ error: "Failed to retrieve leads" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// PATCH /api/contact — Admin Lead Status / Notes Update
// -------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  try {
    const isAuthed = await verifyAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { id, status, notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status as LeadStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const db = getCloudflareD1(request);
    const result = await updateLead(
      id,
      {
        ...(status ? { status: status as LeadStatus } : {}),
        ...(notes !== undefined ? { notes: sanitizeHtml(String(notes)) } : {}),
      },
      db
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Lead ${id} updated successfully.`,
      lead: result.lead,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/contact:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

// -------------------------------------------------------------
// DELETE /api/contact — Admin Lead Deletion
// -------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const isAuthed = await verifyAdmin(request);
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action");
    const db = getCloudflareD1(request);

    if (action === "clear_all") {
      await clearLeads(db);
      return NextResponse.json({ success: true, message: "All leads cleared." });
    }

    if (!id) {
      return NextResponse.json({ error: "Lead ID or action=clear_all is required" }, { status: 400 });
    }

    const result = await deleteLead(id, db);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Delete failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Lead ${id} deleted successfully.` });
  } catch (error: any) {
    console.error("Error in DELETE /api/contact:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
