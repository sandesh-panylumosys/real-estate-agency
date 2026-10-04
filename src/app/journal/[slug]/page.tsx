import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { ArticleView } from "@/components/pages/ArticleView";
import { getArticleBySlug, getArticles } from "@/lib/repository";

export async function generateStaticParams() {
  const all = await getArticles();
  return all.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/journal/${article.slug}`,
    image: article.image,
    type: "article",
    publishedTime: article.isoDate,
    authors: [article.author.name],
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const all = await getArticles();
  const others = all.filter((a) => a.slug !== article.slug);
  // Same topic first, then the most recent.
  const related = [...others.filter((a) => a.category === article.category), ...others.filter((a) => a.category !== article.category)].slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          articleSchema(article),
          breadcrumbSchema([
            { name: "Journal", path: "/journal" },
            { name: article.title, path: `/journal/${article.slug}` },
          ]),
        ]}
      />
      <ArticleView article={article} related={related} />
    </>
  );
}
