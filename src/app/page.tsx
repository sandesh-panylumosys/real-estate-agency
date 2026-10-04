import { AgencyStory } from "@/components/sections/AgencyStory";
import { ArchitecturalDetail } from "@/components/sections/ArchitecturalDetail";
import { ArchitectureModel } from "@/components/sections/ArchitectureModel";
import { Developments } from "@/components/sections/Developments";
import { Enquiry } from "@/components/sections/Enquiry";
import { FeaturedProperties } from "@/components/sections/FeaturedProperties";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { InvestmentStory } from "@/components/sections/InvestmentStory";
import { Journal } from "@/components/sections/Journal";
import { LocationExperience } from "@/components/sections/LocationExperience";
import { PlanToReality } from "@/components/sections/PlanToReality";
import { PropertyDiscovery } from "@/components/sections/PropertyDiscovery";
import { Testimonials } from "@/components/sections/Testimonials";
import { Walkthrough } from "@/components/sections/Walkthrough";
import type { Metadata } from "next";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import {
  getArticles,
  getDevelopments,
  getFeaturedProperties,
  getFloorPlan,
  getInvestmentStory,
  getLocationGuide,
  getMaterialDetails,
  getProperties,
  getTestimonials,
  getWalkthrough,
} from "@/lib/repository";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — The Art of Finding Your Place`,
  absoluteTitle: true,
  description: site.description,
  path: "/",
  image: { src: media.villaPool, alt: "Modern villa with a long pool terrace at dusk" },
});

/**
 * The journey: City → Architecture → Property → Interior → Plan → Detail →
 * Building → Location → Discovery → Investment → Developments → Stories →
 * Journal → Next step → Enquiry.
 */
export default async function Home() {
  const [featured, all, walkthrough, plan, details, guide, investment, developments, testimonials, articles] =
    await Promise.all([
      getFeaturedProperties(),
      getProperties(),
      getWalkthrough(),
      getFloorPlan("aria-level-1"),
      getMaterialDetails(),
      getLocationGuide("juhu"),
      getInvestmentStory(),
      getDevelopments(),
      getTestimonials(),
      getArticles(),
    ]);

  return (
    <>
      <Hero />
      <AgencyStory stats={site.stats} />
      <FeaturedProperties properties={featured} />
      <Walkthrough stages={walkthrough} />
      <PlanToReality plan={plan} />
      <ArchitecturalDetail details={details} />
      <ArchitectureModel />
      <LocationExperience guide={guide} />
      <PropertyDiscovery properties={all} />
      <InvestmentStory data={investment} />
      <Developments developments={developments} />
      <Testimonials testimonials={testimonials} />
      <Journal articles={articles.slice(0, 5)} />
      <FinalCTA />
      <Enquiry />
    </>
  );
}
