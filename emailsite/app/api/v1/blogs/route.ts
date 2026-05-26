import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkApiKey } from "@/lib/server/api-key-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/blogs
 * Query params:
 *   status   = published | draft | all  (default: all)
 *   page     = number (default: 1)
 *   limit    = number 1–100 (default: 20)
 *   search   = string
 *   category = string
 *   tag      = string
 */
export async function GET(req: Request) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";

  const where: Record<string, unknown> = {};
  if (status !== "all") where.status = status;
  if (category) where.category = { contains: category, mode: "insensitive" };
  if (tag) where.tags = { has: tag.toLowerCase() };
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { excerpt: { contains: search, mode: "insensitive" } },
  ];

  try {
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        select: {
          id: true, title: true, slug: true, excerpt: true, status: true,
          category: true, tags: true, featuredImage: true,
          metaTitle: true, metaDescription: true,
          views: true, publishedAt: true, createdAt: true, updatedAt: true,
          author: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blog.count({ where }),
    ]);
    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * POST /api/v1/blogs
 * Body (all fields except title, excerpt, content are optional):
 * {
 *   title: string,           // required
 *   excerpt: string,         // required
 *   content: string,         // required (HTML or markdown)
 *   status: "draft" | "published",  // default: "draft"
 *   category: string,        // default: "General"
 *   tags: string[],          // or comma-separated string
 *   featuredImage: string,   // URL
 *   metaTitle: string,       // SEO title (falls back to title)
 *   metaDescription: string, // SEO description (falls back to excerpt)
 * }
 */
export async function POST(req: Request) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { title, excerpt, content, status = "draft", category = "General",
      tags, featuredImage = "", metaTitle, metaDescription } = body;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim())
      return NextResponse.json({ success: false, message: "title, excerpt, and content are required" }, { status: 400 });

    const tagList: string[] = Array.isArray(tags)
      ? tags
      : tags ? String(tags).split(",").map((t: string) => t.trim()).filter(Boolean) : [];

    // Auto-generate slug from title
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let slug = base, i = 1;
    for (;;) {
      const ex = await prisma.blog.findFirst({ where: { slug } });
      if (!ex) break;
      slug = `${base}-${i++}`;
    }

    // Find the admin/first user to assign as author
    const author = await prisma.user.findFirst({ where: { role: "admin" } })
      ?? await prisma.user.findFirst();
    if (!author)
      return NextResponse.json({ success: false, message: "No users found in database. Create an admin account first." }, { status: 500 });

    const blog = await prisma.blog.create({
      data: {
        title: title.trim(), slug, excerpt: excerpt.trim(), content: content.trim(),
        category, tags: tagList, status, featuredImage,
        metaTitle: (metaTitle || title).trim(),
        metaDescription: (metaDescription || excerpt).trim(),
        publishedAt: status === "published" ? new Date() : null,
        authorId: author.id,
      },
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
