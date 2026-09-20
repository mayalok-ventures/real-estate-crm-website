/**
 * SAHYAK CRM — Topic Authority Graph & Internal Link Intelligence Engine
 *
 * Formalizes the 9 core real estate clusters:
 * - Pillar page
 * - Supporting pages
 * - Related tools
 * - Related comparisons
 * - Related resources
 * - Internal link topology
 * - Semantic entity relationships
 *
 * Generates contextual internal linking recommendations without link stuffing.
 */

import { TopicGraphCluster, InternalLinkRecommendation } from "./types";
import { getTopics, getPages, getInternalLinks } from "./store";

export async function getTopicAuthorityGraph(): Promise<{
  clusters: TopicGraphCluster[];
  linkRecommendations: InternalLinkRecommendation[];
  stats: {
    totalClusters: number;
    totalPillars: number;
    totalSupportingPages: number;
    crossClusterLinksCount: number;
  };
}> {
  const [topics, pages, links] = await Promise.all([
    getTopics(),
    getPages(),
    getInternalLinks(),
  ]);

  const pagePathMap = new Map<string, string>(); // path -> title
  for (const p of pages) {
    const route = p.slug === "" ? "/" : `/${p.slug}`;
    pagePathMap.set(route, p.title);
  }

  // Count inbound and outbound links
  const inboundCount = new Map<string, number>();
  const outboundCount = new Map<string, number>();
  for (const l of links) {
    const s = l.sourcePath.startsWith("/") ? l.sourcePath : `/${l.sourcePath}`;
    const t = l.targetPath.startsWith("/") ? l.targetPath : `/${l.targetPath}`;
    outboundCount.set(s, (outboundCount.get(s) || 0) + 1);
    inboundCount.set(t, (inboundCount.get(t) || 0) + 1);
  }

  // Define semantic entities per cluster
  const CLUSTER_ENTITIES: Record<string, string[]> = {
    topic_core_crm: ["RealEstateAgent", "SoftwareApplication", "CustomerRelationshipManagement", "SalesWorkflow"],
    topic_lead_mgmt: ["LeadCapture", "WebhookIngress", "MagicBricksLead", "NinetyNineAcresLead", "LeadAssignment"],
    topic_sales_pipeline: ["SalesPipelineStage", "TokenAdvance", "BuilderAgreement", "CommissionClearance"],
    topic_whatsapp_crm: ["MetaCloudAPI", "WhatsAppBusiness", "InstantBrochureDispatch", "ConversationLedger"],
    topic_property_inventory: ["PropertyInventory", "TowerUnitMatrix", "TemporaryUnitLock", "DoubleBookingPrevention"],
    topic_field_sales: ["ShowFlatVisit", "SiteVisitScheduling", "GoogleMapsGPSPin", "FieldAgentVoiceNote"],
    topic_industry_personas: ["ChannelPartnerBrokerage", "PropertyDeveloperBuilder", "MandateSalesForce"],
    topic_tools: ["LeadResponseDecayMath", "SpeedToLead", "BrokerCommissionSplit", "TDSSection194H"],
    topic_comparisons: ["SpreadsheetVsCRM", "WhatsAppPersonalVsCRM", "DataGovernanceAudit"],
  };

  const clusters: TopicGraphCluster[] = [];

  for (const topic of topics) {
    const clusterPages = pages.filter(
      (p) => p.primaryTopicId === topic.id || p.parentTopic === topic.slug
    );

    let pillar = "/";
    if (topic.id === "topic_core_crm") pillar = "/";
    else if (topic.id === "topic_lead_mgmt") pillar = "/solutions/real-estate-lead-management";
    else if (topic.id === "topic_sales_pipeline") pillar = "/solutions/real-estate-sales-pipeline";
    else if (topic.id === "topic_whatsapp_crm") pillar = "/solutions/real-estate-whatsapp-crm";
    else if (topic.id === "topic_property_inventory") pillar = "/solutions/property-inventory-management";
    else if (topic.id === "topic_field_sales") pillar = "/solutions/site-visit-management";
    else if (topic.id === "topic_industry_personas") pillar = "/industry/real-estate-brokers";
    else if (topic.id === "topic_tools") pillar = "/tools/lead-response-time-calculator";
    else if (topic.id === "topic_comparisons") pillar = "/compare/real-estate-crm-vs-excel";

    const supporting = clusterPages
      .filter((p) => {
        const r = p.slug === "" ? "/" : `/${p.slug}`;
        return r !== pillar && p.pageType !== "tool" && p.pageType !== "comparison";
      })
      .map((p) => ({
        path: p.slug === "" ? "/" : `/${p.slug}`,
        title: p.title,
        intent: p.searchIntent,
      }));

    const tools = clusterPages
      .filter((p) => p.pageType === "tool")
      .map((p) => ({
        path: p.slug === "" ? "/" : `/${p.slug}`,
        title: p.title,
      }));

    const comparisons = clusterPages
      .filter((p) => p.pageType === "comparison")
      .map((p) => ({
        path: p.slug === "" ? "/" : `/${p.slug}`,
        title: p.title,
      }));

    clusters.push({
      topicId: topic.id,
      topicTitle: topic.title,
      slug: topic.slug,
      pillarPage: pillar,
      supportingPages: supporting,
      tools,
      comparisons,
      entityRelationships: CLUSTER_ENTITIES[topic.id] || ["RealEstateSoftware"],
      inboundInternalLinksCount: inboundCount.get(pillar) || 0,
      outboundInternalLinksCount: outboundCount.get(pillar) || 0,
    });
  }

  // Internal Link Intelligence: Generate contextual link recommendations
  const linkRecommendations: InternalLinkRecommendation[] = [
    {
      id: "rec_lead_to_speed_calc",
      sourcePath: "/solutions/real-estate-lead-management",
      targetPath: "/tools/lead-response-time-calculator",
      recommendedAnchor: "calculate inquiry response decay",
      reason: "Connects lead ingestion operational explanation directly to the interactive response time calculator utility.",
      priority: "high",
    },
    {
      id: "rec_followup_to_whatsapp",
      sourcePath: "/solutions/real-estate-lead-follow-up",
      targetPath: "/solutions/real-estate-whatsapp-crm",
      recommendedAnchor: "official WhatsApp Cloud API dispatch",
      reason: "Directs buyers exploring multi-touch follow-up to the official WhatsApp messaging architecture.",
      priority: "high",
    },
    {
      id: "rec_pipeline_to_inventory",
      sourcePath: "/solutions/real-estate-sales-pipeline",
      targetPath: "/solutions/property-inventory-management",
      recommendedAnchor: "48-hour temporary unit locks",
      reason: "Connects token advance stage velocity with multi-tower unit inventory reservations.",
      priority: "high",
    },
    {
      id: "rec_brokers_to_comm_calc",
      sourcePath: "/industry/real-estate-brokers",
      targetPath: "/tools/real-estate-commission-calculator",
      recommendedAnchor: "brokerage commission split calculator",
      reason: "High commercial relevance for channel partners calculating slab splits and TDS deductions.",
      priority: "high",
    },
    {
      id: "rec_excel_to_lead_mgmt",
      sourcePath: "/compare/real-estate-crm-vs-excel",
      targetPath: "/solutions/real-estate-lead-management",
      recommendedAnchor: "sub-15 second webhook portal ingestion",
      reason: "Contrasts spreadsheet manual entry with automated portal ingress.",
      priority: "medium",
    },
    {
      id: "rec_site_visit_to_whatsapp",
      sourcePath: "/solutions/site-visit-management",
      targetPath: "/solutions/real-estate-whatsapp-crm",
      recommendedAnchor: "WhatsApp GPS location pins",
      reason: "Links Sunday site visit logistics with instant GPS dispatch via Meta Cloud API.",
      priority: "medium",
    },
    {
      id: "rec_developers_to_pipeline",
      sourcePath: "/industry/property-developers",
      targetPath: "/solutions/real-estate-sales-pipeline",
      recommendedAnchor: "builder deal milestone tracking",
      reason: "Channels large developers from corporate persona overview to granular pipeline milestones.",
      priority: "medium",
    },
  ];

  return {
    clusters,
    linkRecommendations,
    stats: {
      totalClusters: clusters.length,
      totalPillars: clusters.filter((c) => c.pillarPage !== "/").length,
      totalSupportingPages: clusters.reduce((acc, c) => acc + c.supportingPages.length, 0),
      crossClusterLinksCount: linkRecommendations.length,
    },
  };
}
