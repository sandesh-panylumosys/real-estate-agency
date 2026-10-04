import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, propertySchema } from "@/lib/structured-data";
import { formatINR } from "@/lib/utils";
import { PropertyDetail } from "@/components/property/PropertyDetail";
import { getFloorPlan, getLocationGuide, getProperties, getPropertyBySlug } from "@/lib/repository";

export async function generateStaticParams() {
  const all = await getProperties();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};
  const price = `${formatINR(property.price)}${property.priceSuffix ? ` ${property.priceSuffix}` : ""}`;
  const kind = [property.bedrooms ? `${property.bedrooms}-bedroom` : null, property.type === "Commercial" ? "commercial space" : property.type.toLowerCase()].filter(Boolean).join(" ");
  const facts = `${kind} of ${property.areaSqft.toLocaleString("en-IN")} sq ft`;
  return pageMetadata({
    title: `${property.name}, ${property.neighborhood}, ${property.city}`,
    description: `${property.tagline} ${/^[aeiou]/i.test(kind) ? "An" : "A"} ${facts} in ${property.neighborhood}, ${property.city} — ${price}.`,
    path: `/properties/${property.slug}`,
    image: property.hero,
  });
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const [plan, guide, all] = await Promise.all([
    property.floorPlanId ? getFloorPlan(property.floorPlanId) : Promise.resolve(null),
    property.locationId ? getLocationGuide(property.locationId) : Promise.resolve(null),
    getProperties(),
  ]);
  const related = all.filter((p) => p.slug !== property.slug && (p.city === property.city || p.type === property.type)).slice(0, 2);

  return (
    <>
      <JsonLd
        data={[
          propertySchema(property),
          breadcrumbSchema([
            { name: "Properties", path: "/properties" },
            { name: property.name, path: `/properties/${property.slug}` },
          ]),
        ]}
      />
      <PropertyDetail property={property} plan={plan} guide={guide} related={related} />
    </>
  );
}
