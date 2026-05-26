import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.mailexel.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/blog`,               lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/reviews`,            lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/pricing`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/blog/ost-to-pst`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blog.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogPages = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable at build time — static pages still served
  }

  return [...staticPages, ...blogPages];
}
