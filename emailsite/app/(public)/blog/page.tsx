import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import BlogPageClient from "./BlogPageClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Email Tools, Tips & How-To Guides — MailExel Blog",
  description: "Step-by-step guides for email conversion, migration, backup, and recovery. PST, MBOX, EML, MSG, OST format tutorials.",
  alternates: { canonical: "https://www.mailexel.com/blog" },
  openGraph: {
    title: "MailExel Blog — Email Tools & How-To Guides",
    description: "Step-by-step guides for email conversion, migration, backup, and recovery.",
    url: "https://www.mailexel.com/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  let initialPosts: {
    _id: string; title: string; slug: string; excerpt: string;
    featuredImage: string; category: string; tags: string[];
    publishedAt: string | null; views: number;
    author: { name: string };
  }[] = [];
  let initialTotal = 0;
  let initialCategories: string[] = [];

  try {
    const [posts, total, cats] = await Promise.all([
      prisma.blog.findMany({
        where: { status: "published" },
        select: {
          id: true, title: true, slug: true, excerpt: true,
          featuredImage: true, category: true, tags: true,
          publishedAt: true, views: true,
          author: { select: { name: true } },
        },
        orderBy: { publishedAt: "desc" },
        take: 9,
      }),
      prisma.blog.count({ where: { status: "published" } }),
      prisma.blog.groupBy({ by: ["category"], where: { status: "published" } }),
    ]);

    initialPosts = posts.map((p) => ({
      _id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      featuredImage: p.featuredImage,
      category: p.category,
      tags: p.tags,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      views: p.views,
      author: { name: p.author?.name ?? "MailExel Team" },
    }));
    initialTotal = total;
    initialCategories = cats.map((c) => c.category).filter(Boolean) as string[];
  } catch {
    // DB unavailable — client will fetch on mount
  }

  return (
    <BlogPageClient
      initialPosts={initialPosts}
      initialTotal={initialTotal}
      initialCategories={initialCategories}
    />
  );
}
