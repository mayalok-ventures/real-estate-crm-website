import React from "react";
import HeroStorySection from "@/components/home/HeroStorySection";
import ChaosToConduit from "@/components/home/ChaosToConduit";
import InteractiveLeadJourney from "@/components/home/InteractiveLeadJourney";
import FieldCloserMobile from "@/components/home/FieldCloserMobile";
import PropertyConnection from "@/components/home/PropertyConnection";
import SiteVisitMoments from "@/components/home/SiteVisitMoments";
import ManagerCockpit from "@/components/home/ManagerCockpit";
import AhaBeforeAfter from "@/components/home/AhaBeforeAfter";
import SimplePricingBridge from "@/components/home/SimplePricingBridge";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Scene 1: The First Move (Interactive Inbound Lead Simulation) */}
      <HeroStorySection />

      {/* Scene 2: Chaos to Conduit (Scattered Lead Sources Collapsing into One Pipeline) */}
      <ChaosToConduit />

      {/* Scene 4: The Lead Journey (7-Stage Interactive Real Estate Sales Stepper) */}
      <InteractiveLeadJourney />

      {/* Scene 5: Field Closer OS (Sales Doesn't Happen at a Desk) */}
      <FieldCloserMobile />

      {/* Scene 6: Property Connected (Buyer Criteria Matched Directly to Live Units) */}
      <PropertyConnection />

      {/* Scene 7: Site Visit Moments (Show Flat Logistics & Google Maps Directions) */}
      <SiteVisitMoments />

      {/* Scene 8: Manager Cockpit (Cinematic Zoom-Out to Full Team Telemetry) */}
      <ManagerCockpit />

      {/* Scene 9: The Aha Moment (Before vs. After Operational Shift) */}
      <AhaBeforeAfter />

      {/* Scene 10: Simple Pricing Bridge & Quiet Product Closing */}
      <SimplePricingBridge />
    </main>
  );
}
