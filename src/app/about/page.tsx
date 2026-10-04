import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { PageHero } from "@/components/layout/PageHero";
import { Milestones } from "@/components/pages/Milestones";
import { Principles } from "@/components/pages/Principles";
import { ProcessSteps } from "@/components/pages/ProcessSteps";
import { AgencyStory } from "@/components/sections/AgencyStory";
import { Enquiry } from "@/components/sections/Enquiry";
import { Testimonials } from "@/components/sections/Testimonials";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { getTestimonials } from "@/lib/repository";

export const metadata: Metadata = pageMetadata({
  title: "About Our Real Estate Advisory",
  description:
    "Atelier Estates is a small real estate advisory practice that has represented exceptional residences across India for fifteen years.",
  path: "/about",
  image: { src: media.duskMansion, alt: "Elegant residence lit at dusk" },
});

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "About", path: "/about" }]),
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: absoluteUrl("/about"),
            name: `About ${site.name}`,
            about: { "@id": absoluteUrl("/#organization") },
          },
        ]}
      />
      <PageHero
        eyebrow="About"
        title="The art of finding"
        accent="your place."
        intro="Atelier is a small advisory practice. For fifteen years we have helped people find homes that become part of their story."
        image={{ src: media.duskMansion, alt: "Elegant residence lit at dusk" }}
        annotation="Est. 2011 · Mumbai"
      />
      <AgencyStory stats={site.stats} index="01" />
      <Principles index="02" />
      <Milestones index="03" />
      <ProcessSteps
        index="04"
        label="How we work"
        title="A consultation,"
        accent="not a sales process."
        tone="light"
        steps={[
          { title: "Listen", body: "We begin with how you want to live — not with a list of properties." },
          { title: "Curate", body: "A short, considered selection, including residences offered privately." },
          { title: "Visit", body: "Viewings at the right hour of day, with the architect where possible." },
          { title: "Secure", body: "Negotiation, due diligence and paperwork handled with care until you have the keys." },
        ]}
      />
      <Testimonials testimonials={testimonials} label="05" />
      <AdvisorBand />
      <Enquiry index="06" />
    </>
  );
}
