import Image from "next/image";
import { Enquiry } from "@/components/sections/Enquiry";
import { Annotation, Dimension, SectionLabel } from "@/components/ui/Architectural";
import { Button, TextLink } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { FloorPlan as FloorPlanData, LocationGuide, Property } from "@/data/types";
import { formatCoord, formatINR } from "@/lib/utils";
import { FloorPlan } from "./FloorPlan";
import { PropertyCard } from "./PropertyCard";

/** Reusable property detail composition — any data source that yields a Property can render it. */
export function PropertyDetail({
  property,
  plan,
  guide,
  related,
}: {
  property: Property;
  plan: FloorPlanData | null;
  guide: LocationGuide | null;
  related: Property[];
}) {
  const price = `${formatINR(property.price)}${property.priceSuffix ? ` ${property.priceSuffix}` : ""}`;
  const facts = [
    { label: "Price", value: price },
    { label: "Type", value: property.type },
    ...(property.bedrooms ? [{ label: "Bedrooms", value: String(property.bedrooms) }] : []),
    ...(property.bathrooms ? [{ label: "Bathrooms", value: String(property.bathrooms) }] : []),
    { label: property.type === "Plot" ? "Land" : "Interior", value: `${property.areaSqft.toLocaleString("en-IN")} sq ft` },
    { label: "Status", value: property.status },
  ];

  return (
    <>
      <section data-nav="dark" aria-labelledby="property-title" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-soft">
        <Image src={property.hero.src} alt={property.hero.alt} fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/40" />
        <div className="px-gutter absolute inset-x-0 bottom-0 pb-14">
          <p className="meta text-stone">
            {property.neighborhood}, {property.city} · {property.type}
          </p>
          <RevealText as="h1" by="words" id="property-title" className="font-display mt-6 text-[clamp(3rem,9vw,9rem)] uppercase">
            {property.name}
          </RevealText>
          <p className="font-serif mt-4 max-w-xl text-2xl italic text-stone">{property.tagline}</p>
        </div>
        <Annotation className="right-[var(--gutter)] top-28 hidden text-stone md:flex">
          {formatCoord(property.coordinates.lat, "lat")} · {formatCoord(property.coordinates.lng, "lng")}
        </Annotation>
      </section>

      <section data-nav="light" className="bg-ivory py-24 text-ink md:py-36">
        <div className="px-gutter grid gap-16 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-start lg:col-span-4">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-ink/15 pt-4">
                <dt className="meta text-[0.6rem] text-muted">{f.label}</dt>
                <dd className="font-display mt-2 text-3xl">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="lg:col-span-7 lg:col-start-6">
            <SectionLabel index="01">The Residence</SectionLabel>
            <RevealText className="font-serif mt-10 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.25]">{property.description}</RevealText>
            {property.architect && <p className="meta mt-8 text-muted">Architecture — {property.architect}</p>}
            <ul className="mt-12 grid gap-px bg-ink/10 sm:grid-cols-2">
              {property.highlights.map((h) => (
                <li key={h} className="flex items-center gap-4 bg-ivory py-4">
                  <span className="h-px w-6 bg-bronze" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap gap-3">
              <Button href="#enquire">Schedule Viewing</Button>
              <Button href="/properties" variant="outline" arrow={false}>
                All Properties
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-ink/10 pt-6">
              <span className="meta text-muted">Ask about this residence</span>
              <a
                href={whatsappHref(`Hello Atelier Estates, I'm interested in ${property.name}, ${property.neighborhood} (${price}). Could you share more details?`)}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="open"
                className="inline-flex min-h-11 items-center gap-2.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase hover:text-bronze"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25a35a]" />
                WhatsApp
                <span className="sr-only">(opens WhatsApp)</span>
              </a>
              <a
                href={telHref()}
                data-cursor="open"
                className="inline-flex min-h-11 items-center gap-2.5 text-[0.8rem] font-semibold tracking-[0.1em] uppercase hover:text-bronze"
              >
                <PhoneIcon className="h-5 w-5" />
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {property.gallery.length > 0 && (
        <section data-nav="light" aria-label="Gallery" className="bg-ivory pb-24 md:pb-36">
          <div className="px-gutter grid gap-6 md:grid-cols-12 md:gap-8">
            {property.gallery.map((img, i) => (
              <RevealImage
                key={img.src}
                image={img}
                sizes="(min-width:768px) 50vw, 100vw"
                variant={(["blueprint", "curtain", "rise", "sides"] as const)[i % 4]}
                cursor="view"
                className={
                  [
                    "aspect-[16/10] md:col-span-8",
                    "aspect-[4/5] md:col-span-4 md:mt-24",
                    "aspect-[4/5] md:col-span-5",
                    "aspect-[16/11] md:col-span-7 md:-mt-16",
                  ][i % 4]
                }
              />
            ))}
          </div>
          <div className="px-gutter mt-8">
            <Dimension label={`${property.areaSqft.toLocaleString("en-IN")} sq ft`} className="text-muted" />
          </div>
        </section>
      )}

      {plan && (
        <section data-nav="dark" aria-labelledby="detail-plan" className="bg-charcoal py-24 text-soft md:py-36">
          <div className="px-gutter">
            <SectionLabel index="02" tone="dark">
              Floor Plan
            </SectionLabel>
            <h2 id="detail-plan" className="font-display mb-16 mt-8 text-[clamp(2.5rem,5vw,5rem)]">
              {plan.title}
            </h2>
            <FloorPlan plan={plan} />
          </div>
        </section>
      )}

      {guide && (
        <section data-nav="light" aria-labelledby="detail-location" className="bg-soft py-24 text-ink md:py-36">
          <div className="px-gutter grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="03">The Neighbourhood</SectionLabel>
              <h2 id="detail-location" className="font-display mt-8 text-[clamp(2.5rem,5vw,5rem)]">
                {guide.neighborhood}
              </h2>
              <p className="mt-6 max-w-md leading-[1.8] text-muted">{guide.summary}</p>
            </div>
            <ul className="divide-y divide-ink/10 border-y border-ink/10 lg:col-span-6 lg:col-start-7">
              {guide.places
                .slice()
                .sort((a, b) => a.minutes - b.minutes)
                .slice(0, 8)
                .map((p) => (
                  <li key={p.id} className="flex items-baseline justify-between gap-6 py-4">
                    <span>{p.name}</span>
                    <span className="meta shrink-0 text-muted">
                      {p.category} · {p.minutes} min
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section data-nav="light" aria-labelledby="related-title" className="bg-ivory py-24 text-ink md:py-36">
          <div className="px-gutter flex items-end justify-between gap-6">
            <h2 id="related-title" className="font-display text-[clamp(2.5rem,5vw,5rem)]">
              You may also <span className="accent text-taupe">consider</span>
            </h2>
            <TextLink href="/properties" className="hidden sm:inline-flex">
              All properties
            </TextLink>
          </div>
          <div className="px-gutter mt-14 grid gap-16 md:grid-cols-12 md:gap-8">
            {related.map((p, i) => (
              <PropertyCard key={p.slug} property={p} size={i === 0 ? "lg" : "md"} className={i === 0 ? "md:col-span-7" : "md:col-span-4 md:col-start-9 md:mt-24"} />
            ))}
          </div>
        </section>
      )}

      <Enquiry />
    </>
  );
}
