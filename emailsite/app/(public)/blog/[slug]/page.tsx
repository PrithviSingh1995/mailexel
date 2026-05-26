import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BlogPostClient from "./BlogPostClient";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug },
    select: { title: true, metaTitle: true, metaDescription: true, excerpt: true, featuredImage: true, publishedAt: true },
  });
  if (!post) return { title: "Post Not Found" };

  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `https://www.mailexel.com/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.mailexel.com/blog/${slug}`,
      type: "article",
      ...(post.featuredImage && { images: [{ url: post.featuredImage }] }),
      ...(post.publishedAt && { publishedTime: post.publishedAt.toISOString() }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.featuredImage && { images: [post.featuredImage] }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blog.findUnique({
    where: { slug, status: "published" },
    include: { author: { select: { id: true, name: true, bio: true, avatar: true } } },
  });
  if (!post) notFound();

  const related = await prisma.blog.findMany({
    where: { status: "published", category: post.category, NOT: { slug } },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      featuredImage: true, category: true, tags: true,
      publishedAt: true, views: true, metaTitle: true, metaDescription: true,
      author: { select: { name: true } },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: post.featuredImage || "https://www.mailexel.com/logo.svg",
    url: `https://www.mailexel.com/blog/${slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name ?? "MailExel Team",
    },
    publisher: {
      "@type": "Organization",
      name: "MailExel",
      url: "https://www.mailexel.com",
      logo: { "@type": "ImageObject", url: "https://www.mailexel.com/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.mailexel.com/blog/${slug}` },
  };

  const initialPost = {
    _id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    author: {
      name: post.author?.name ?? "MailExel Team",
      bio: post.author?.bio ?? undefined,
      avatar: post.author?.avatar ?? undefined,
    },
    category: post.category,
    tags: post.tags,
    publishedAt: post.publishedAt?.toISOString() ?? "",
    views: post.views,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
  };

  const initialRelated = related.map((r) => ({
    _id: r.id,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: "",
    featuredImage: r.featuredImage,
    author: { name: r.author?.name ?? "MailExel Team" },
    category: r.category,
    tags: r.tags,
    publishedAt: r.publishedAt?.toISOString() ?? "",
    views: r.views,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlogPostClient post={initialPost} related={initialRelated} />
    </>
  );
}
