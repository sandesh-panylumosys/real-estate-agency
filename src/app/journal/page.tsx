import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { PageHero } from "@/components/layout/PageHero";
import { JournalIndex } from "@/components/pages/JournalIndex";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { getArticles } from "@/lib/repository";

export const metadata: Metadata = pageMetadata({
  title: "Journal — Real Estate Insights & Guides",
  description:
    "Market insights, architecture, neighbourhood guides, interior design and buying advice from the advisors at Atelier Estates.",
  path: "/journal",
  image: { src: media.readingCorner, alt: "Reading corner with a yellow armchair" },
});

export default async function JournalPage() {
  const articles = await getArticles();
  const topics = new Set(articles.map((a) => a.category));
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Journal", path: "/journal" }]),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            url: absoluteUrl("/journal"),
            name: `${site.name} Journal`,
            publisher: { "@id": absoluteUrl("/#organization") },
            blogPost: articles.map((a) => ({
              "@type": "BlogPosting",
              headline: a.title,
              url: absoluteUrl(`/journal/${a.slug}`),
              datePublished: a.isoDate,
              author: { "@type": "Person", name: a.author.name },
            })),
          },
        ]}
      />
      <PageHero
        eyebrow="Journal"
        title="Notes on"
        accent="living well."
        intro="Architecture, neighbourhoods, materials and the market — written by the people who advise our clients every day."
        image={{ src: media.readingCorner, alt: "Reading corner with a yellow armchair" }}
        annotation="Published monthly"
        stats={[
          { label: "Stories", value: String(articles.length).padStart(2, "0") },
          { label: "Topics", value: String(topics.size).padStart(2, "0") },
        ]}
      />
      <JournalIndex articles={articles} index="01" />
      <AdvisorBand
        title="Have a question for our advisors?"
        body="Ask about anything you've read — we usually reply within the hour."
        message="Hello Atelier Estates, I have a question after reading your Journal."
      />
    </>
  );
}
