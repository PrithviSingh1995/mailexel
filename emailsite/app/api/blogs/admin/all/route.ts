import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const authorSelect = { id: true, name: true, avatar: true };
const previewSelect = { id: true, title: true, slug: true, excerpt: true, featuredImage: true, category: true, tags: true, status: true, publishedAt: true, views: true, metaTitle: true, metaDescription: true, createdAt: true, updatedAt: true, author: { select: authorSelect } };

export async function GET(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) where.OR = [{ title: { contains: search, mode: "insensitive" } }, { excerpt: { contains: search, mode: "insensitive" } }];
    if (user!.role === "editor") where.authorId = user!.id;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({ where, select: previewSelect, orderBy: { updatedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.blog.count({ where }),
    ]);

    const data = blogs.map((b) => ({ ...b, _id: b.id, author: { ...b.author, _id: b.author.id } }));
    return NextResponse.json({ success: true, data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
