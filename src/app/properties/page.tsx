import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema } from "@/lib/structured-data";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { PageHero } from "@/components/layout/PageHero";
import { SeasonSelection } from "@/components/pages/SeasonSelection";
import { TypeIndex } from "@/components/pages/TypeIndex";
import { Enquiry } from "@/components/sections/Enquiry";
import { PropertyDiscovery } from "@/components/sections/PropertyDiscovery";
import { media } from "@/data/media";
import { getFeaturedProperties, getProperties } from "@/lib/repository";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Properties for Sale & Rent",
  description:
    "Villas, penthouses, apartments and estates for sale and rent across Mumbai, Goa, Bengaluru, Pune and Alibaug — each chosen for its architecture and light.",
  path: "/properties",
  image: { src: media.livingArches, alt: "Living room with tall arched windows" },
});

export default async function PropertiesPage() {
  const [all, featured] = await Promise.all([getProperties(), getFeaturedProperties()]);
  const sale = all.filter((p) => !p.priceSuffix).map((p) => p.price);
  const cities = new Set(all.map((p) => p.city));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Properties", path: "/properties" }]),
          itemListSchema(
            "Properties",
            all.map((p) => ({ name: p.name, path: `/properties/${p.slug}` })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Properties"
        title="The"
        accent="collection."
        intro="Every residence we represent, chosen for its architecture, its light and the life it makes possible."
        image={{ src: media.livingArches, alt: "Living room with tall arched windows" }}
        annotation="Autumn 2026 · Updated weekly"
        stats={[
          { label: "Residences", value: String(all.length) },
          { label: "Cities", value: String(cities.size) },
          { label: "From", value: formatINR(Math.min(...sale)) },
        ]}
      />
      <TypeIndex properties={all} index="01" />
      <SeasonSelection properties={featured} index="02" />
      <PropertyDiscovery properties={all} index="03" />
      <AdvisorBand
        title="Looking for something unlisted?"
        body="Many of our residences are offered privately. Tell an advisor what you're looking for."
        message="Hello Atelier Estates, I'm looking for a residence that may not be listed. Could an advisor help?"
      />
      <Enquiry index="04" />
    </>
  );
}
