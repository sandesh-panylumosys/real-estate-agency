import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, developmentSchema } from "@/lib/structured-data";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { PageHero } from "@/components/layout/PageHero";
import { DevelopmentLedger } from "@/components/pages/DevelopmentLedger";
import { ProcessSteps } from "@/components/pages/ProcessSteps";
import { ArchitectureModel } from "@/components/sections/ArchitectureModel";
import { Developments } from "@/components/sections/Developments";
import { Enquiry } from "@/components/sections/Enquiry";
import { media } from "@/data/media";
import { getDevelopments } from "@/lib/repository";

export const metadata: Metadata = pageMetadata({
  title: "New Residential Developments",
  description:
    "Upcoming luxury residences in Mumbai, Bengaluru and Pune — early access, construction progress and completion dates, before public release.",
  path: "/developments",
  image: { src: media.apartmentBlock, alt: "Residential tower rising against a blue sky" },
});

export default async function DevelopmentsPage() {
  const developments = await getDevelopments();
  const earliest = [...developments].sort((a, b) => b.progress - a.progress)[0];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Developments", path: "/developments" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Upcoming developments",
            itemListElement: developments.map((d, i) => ({ "@type": "ListItem", position: i + 1, item: developmentSchema(d) })),
          },
        ]}
      />
      <PageHero
        eyebrow="Developments"
        title="The next chapter"
        accent="of the city."
        intro="Residences still being drawn and built — offered to our clients first, with honest timelines and full transparency on progress."
        image={{ src: media.apartmentBlock, alt: "Residential tower rising against a blue sky" }}
        annotation="Masterplan · 2026–2029"
        stats={[
          { label: "Developments", value: String(developments.length).padStart(2, "0") },
          { label: "Next handover", value: earliest.completion },
        ]}
      />
      <Developments developments={developments} index="01" />
      <DevelopmentLedger developments={developments} index="02" />
      <ProcessSteps
        index="03"
        label="Early access"
        title="From drawing"
        accent="to handover."
        steps={[
          { title: "Preview", body: "Private briefings with the architect, plans and specifications before public launch." },
          { title: "Reserve", body: "Choose your residence and floor; we review the agreement and RERA filings with you." },
          { title: "Follow", body: "Quarterly site visits and progress reports, photographed and measured." },
          { title: "Handover", body: "Snagging, finishes and interiors coordinated so the keys arrive with nothing left to do." },
        ]}
      />
      <ArchitectureModel index="04" />
      <AdvisorBand
        title="Early access, personally."
        body="Ask an advisor for brochures, plans and pricing before public release."
        message="Hello Atelier Estates, I'd like early access to your upcoming developments."
      />
      <Enquiry index="05" />
    </>
  );
}
