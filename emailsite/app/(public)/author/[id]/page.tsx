import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AuthorPageClient from "./AuthorPageClient";

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true },
  });
  if (!author) return { title: "Author Not Found" };
  return {
    title: `${author.name} — MailExel Blog`,
    description: author.bio || `Articles and guides by ${author.name} on MailExel.`,
    alternates: { canonical: `https://www.mailexel.com/author/${id}` },
    openGraph: {
      title: `${author.name} — MailExel Blog`,
      description: author.bio || `Articles and guides by ${author.name} on MailExel.`,
      url: `https://www.mailexel.com/author/${id}`,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;

  const author = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, avatar: true, bio: true,
      linkedin: true, longBio: true, createdAt: true,
      _count: { select: { blogs: true } },
    },
  });
  if (!author) notFound();

  const posts = await prisma.blog.findMany({
    where: { authorId: id, status: "published" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      featuredImage: true, category: true, tags: true,
      publishedAt: true, views: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  const authorData = {
    id: author.id,
    name: author.name,
    avatar: author.avatar,
    bio: author.bio,
    linkedin: author.linkedin,
    longBio: author.longBio,
    createdAt: author.createdAt.toISOString(),
    _count: author._count,
  };

  const postsData = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    featuredImage: p.featuredImage,
    category: p.category,
    tags: p.tags,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    views: p.views,
  }));

  return <AuthorPageClient author={authorData} posts={postsData} totalViews={totalViews} />;
}
