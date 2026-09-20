import { executeD1Query, executeD1Run, D1Database } from "@/lib/d1-database";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Demo Scheduled"
  | "Converted"
  | "Closed";

export interface StoredLead {
  id: string;
  requestId: string;
  submittedAt: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role?: string;
  persona?: string;
  city?: string;
  leadVolume?: string;
  teamSize: string;
  requirement: string;
  message?: string;
  inquiryType: string;
  source: string;
  campaign?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
  visitorId?: string;
  sessionId?: string;
  status: LeadStatus;
  notes?: string;
  ip?: string;
}

// In-memory fallback ring buffer for Node.js runtime and local development
const globalForLeads = globalThis as unknown as { __globalEdgeLeads?: StoredLead[] };
if (!globalForLeads.__globalEdgeLeads) {
  globalForLeads.__globalEdgeLeads = [];
}
const globalEdgeLeads = globalForLeads.__globalEdgeLeads;

export async function getAllLeads(db?: D1Database | null): Promise<StoredLead[]> {
  if (db) {
    try {
      const rows = await executeD1Query<{
        id: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        team_size: string;
        requirement: string;
        notes?: string;
        inquiry_type: string;
        source: string;
        utm_source: string;
        utm_medium: string;
        utm_campaign: string;
        utm_term: string;
        utm_content: string;
        landing_page: string;
        referrer: string;
        visitor_id: string;
        session_id: string;
        status: string;
        ip_address: string;
        created_at: string;
      }>(db, "SELECT * FROM leads ORDER BY created_at DESC LIMIT 500");

      return rows.map((r) => ({
        id: r.id,
        requestId: `req_${r.id}`,
        submittedAt: r.created_at,
        name: r.name,
        email: r.email,
        phone: r.phone,
        company: r.company || "—",
        teamSize: r.team_size || "—",
        requirement: r.requirement || "",
        notes: r.notes || "",
        inquiryType: r.inquiry_type || "General Inquiry",
        source: r.source || "website_contact_form",
        utmSource: r.utm_source,
        utmMedium: r.utm_medium,
        utmCampaign: r.utm_campaign,
        utmTerm: r.utm_term,
        utmContent: r.utm_content,
        landingPage: r.landing_page,
        referrer: r.referrer,
        visitorId: r.visitor_id,
        sessionId: r.session_id,
        status: (r.status as LeadStatus) || "New",
        ip: r.ip_address,
      }));
    } catch (err) {
      console.error("[D1 getAllLeads Error]:", err);
    }
  }

  return [...globalEdgeLeads].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export async function saveLead(
  lead: StoredLead,
  db?: D1Database | null
): Promise<{ success: boolean; lead: StoredLead }> {
  if (db) {
    try {
      const sql = `
        INSERT INTO leads (
          id, name, email, phone, company, team_size, requirement, notes,
          inquiry_type, source, utm_source, utm_medium, utm_campaign,
          utm_term, utm_content, landing_page, referrer, visitor_id,
          session_id, status, ip_address, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        lead.id,
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.teamSize,
        lead.requirement,
        lead.notes || "",
        lead.inquiryType,
        lead.source,
        lead.utmSource || "",
        lead.utmMedium || "",
        lead.utmCampaign || "",
        lead.utmTerm || "",
        lead.utmContent || "",
        lead.landingPage || "/",
        lead.referrer || "",
        lead.visitorId || "",
        lead.sessionId || "",
        lead.status,
        lead.ip || "",
        lead.submittedAt,
        lead.submittedAt,
      ];
      await executeD1Run(db, sql, params);
      return { success: true, lead };
    } catch (err) {
      console.error("[D1 saveLead Error]:", err);
    }
  }

  // Also update in-memory ring buffer
  const existingIdx = globalEdgeLeads.findIndex((l) => l.id === lead.id);
  if (existingIdx >= 0) {
    globalEdgeLeads[existingIdx] = lead;
  } else {
    globalEdgeLeads.unshift(lead);
  }
  if (globalEdgeLeads.length > 500) {
    globalEdgeLeads.pop();
  }
  return { success: true, lead };
}

export async function updateLead(
  id: string,
  updates: Partial<StoredLead>,
  db?: D1Database | null
): Promise<{ success: boolean; lead?: StoredLead; error?: string }> {
  const nowIso = new Date().toISOString();

  if (db) {
    try {
      const setClauses: string[] = ["updated_at = ?"];
      const params: unknown[] = [nowIso];

      if (updates.status !== undefined) {
        setClauses.push("status = ?");
        params.push(updates.status);
      }
      if (updates.notes !== undefined) {
        setClauses.push("notes = ?");
        params.push(updates.notes);
      }
      if (updates.company !== undefined) {
        setClauses.push("company = ?");
        params.push(updates.company);
      }
      if (updates.requirement !== undefined) {
        setClauses.push("requirement = ?");
        params.push(updates.requirement);
      }

      params.push(id);
      const sql = `UPDATE leads SET ${setClauses.join(", ")} WHERE id = ?`;
      await executeD1Run(db, sql, params);
    } catch (err: any) {
      console.error("[D1 updateLead Error]:", err);
      return { success: false, error: err?.message || "Failed to update lead in database" };
    }
  }

  const idx = globalEdgeLeads.findIndex((l) => l.id === id);
  if (idx >= 0) {
    globalEdgeLeads[idx] = {
      ...globalEdgeLeads[idx],
      ...updates,
    };
    return { success: true, lead: globalEdgeLeads[idx] };
  }

  return { success: true };
}

export async function deleteLead(
  id: string,
  db?: D1Database | null
): Promise<{ success: boolean; error?: string }> {
  if (db) {
    try {
      await executeD1Run(db, "DELETE FROM leads WHERE id = ?", [id]);
    } catch (err: any) {
      console.error("[D1 deleteLead Error]:", err);
      return { success: false, error: err?.message || "Failed to delete lead from database" };
    }
  }

  const idx = globalEdgeLeads.findIndex((l) => l.id === id);
  if (idx >= 0) {
    globalEdgeLeads.splice(idx, 1);
  }

  return { success: true };
}

export async function clearLeads(db?: D1Database | null): Promise<void> {
  if (db) {
    try {
      await executeD1Run(db, "DELETE FROM leads");
      return;
    } catch (err) {
      console.error("[D1 clearLeads Error]:", err);
    }
  }
  globalEdgeLeads.length = 0;
}
