import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const authorSelect = { id: true, name: true, avatar: true, bio: true };
const previewSelect = { id: true, title: true, slug: true, excerpt: true, featuredImage: true, category: true, tags: true, status: true, publishedAt: true, views: true, metaTitle: true, metaDescription: true, createdAt: true, updatedAt: true, author: { select: authorSelect } };

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";

    const where: Record<string, unknown> = { status: "published" };
    if (category) where.category = { contains: category, mode: "insensitive" };
    if (tag) where.tags = { has: tag.toLowerCase() };
    if (search) where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
      { tags: { has: search.toLowerCase() } },
    ];

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, select: previewSelect, orderBy: { publishedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.blog.count({ where }),
    ]);

    const data = blogs.map((b) => ({ ...b, _id: b.id, author: { ...b.author, _id: b.author.id } }));
    return NextResponse.json({ success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
