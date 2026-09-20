/**
 * Sahyak Production Analytics Export Generator
 */

import { AdminAnalyticsData } from "@/lib/analytics-store";
import type { StoredLead } from "@/lib/leads-store";

export function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = String(val);

  // Prevent spreadsheet formula injection (=, +, -, @)
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function createCsvRow(cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(",");
}

export function generateAnalyticsCsv(data: AdminAnalyticsData): string {
  const lines: string[] = [];
  const exportDate = new Date().toISOString();

  lines.push(createCsvRow(["# SAHYAK REAL ESTATE CRM — TELEMETRY EXPORT"]));
  lines.push(createCsvRow(["# Export Timestamp", exportDate]));
  lines.push(createCsvRow(["# Time Window", data.timeWindow]));
  lines.push("");

  lines.push(createCsvRow(["## 1. EXECUTIVE SUMMARY METRICS"]));
  lines.push(
    createCsvRow([
      "Total Unique Visitors",
      "Total Pageviews",
      "Total Sessions",
      "Bounce Rate",
      "Avg Session Duration (sec)",
      "Total Leads Captured",
      "Visitor-to-Lead Conversion Rate",
      "Live Active Visitors",
    ])
  );
  lines.push(
    createCsvRow([
      data.summary.totalVisitors,
      data.summary.totalPageviews,
      data.summary.totalSessions,
      data.summary.bounceRate,
      data.summary.avgSessionDurationSec,
      data.summary.totalLeads,
      data.summary.conversionRate,
      data.summary.liveActiveVisitors,
    ])
  );

  return lines.join("\r\n");
}

export function generateLeadsCsv(leads: StoredLead[]): string {
  const lines: string[] = [];
  lines.push(createCsvRow(["# SAHYAK REAL ESTATE CRM — INBOUND LEADS EXPORT"]));
  lines.push(createCsvRow(["# Export Timestamp", new Date().toISOString()]));
  lines.push("");

  lines.push(createCsvRow([
    "Lead ID",
    "Full Name",
    "Phone Number",
    "Work Email",
    "Company",
    "Role",
    "City",
    "Monthly Lead Volume",
    "Team Size",
    "Inquiry Type",
    "Requirement / Message",
    "Pipeline Status",
    "Closer Internal Notes",
    "Campaign / UTM",
    "Attribution Source",
    "Submitted Timestamp"
  ]));

  for (const lead of leads) {
    lines.push(createCsvRow([
      lead.id,
      lead.name,
      lead.phone,
      lead.email,
      lead.company || "",
      lead.role || lead.persona || "",
      lead.city || "",
      lead.leadVolume || "",
      lead.teamSize || "",
      lead.inquiryType || "",
      lead.requirement || lead.message || "",
      lead.status || "New",
      lead.notes || "",
      lead.utmCampaign || lead.campaign || "",
      lead.source || "Website Inbound",
      lead.submittedAt
    ]));
  }

  return lines.join("\r\n");
}

export function generateLeadsJson(leads: StoredLead[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      recordCount: leads.length,
      leads: leads.map((l) => ({
        ...l,
        status: l.status || "New",
        notes: l.notes || ""
      }))
    },
    null,
    2
  );
}

export function generateAnalyticsJson(data: AdminAnalyticsData): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      analytics: data
    },
    null,
    2
  );
}
