import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkApiKey } from "@/lib/server/api-key-auth";

export const dynamic = "force-dynamic";

const fullSelect = {
  id: true, title: true, slug: true, excerpt: true, content: true, status: true,
  category: true, tags: true, featuredImage: true,
  metaTitle: true, metaDescription: true,
  views: true, publishedAt: true, createdAt: true, updatedAt: true,
  author: { select: { id: true, name: true } },
};

/**
 * GET /api/v1/blogs/:id
 * Returns the full blog including content and all SEO fields.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({ where: { id }, select: fullSelect });
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * PUT /api/v1/blogs/:id
 * Update any blog fields. All fields are optional — only provided fields are updated.
 * {
 *   title?: string,
 *   excerpt?: string,
 *   content?: string,
 *   status?: "draft" | "published",
 *   category?: string,
 *   tags?: string[] | string,
 *   featuredImage?: string,
 *   metaTitle?: string,
 *   metaDescription?: string,
 *   authorId?: string,
 * }
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    const body = await req.json();
    const { title, excerpt, content, status, category, tags, featuredImage, metaTitle, metaDescription, authorId } = body;

    // Re-slug only if title changed
    let slug: string | undefined;
    if (title && title !== existing.title) {
      const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      let s = base, i = 1;
      for (;;) {
        const ex = await prisma.blog.findFirst({ where: { slug: s, NOT: { id } } });
        if (!ex) { slug = s; break; }
        s = `${base}-${i++}`;
      }
    }

    const tagList = tags !== undefined
      ? (Array.isArray(tags) ? tags : String(tags).split(",").map((t: string) => t.trim()).filter(Boolean))
      : undefined;

    const publishedAt = status === "published" && existing.status !== "published"
      ? new Date()
      : existing.publishedAt;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt: excerpt.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(status !== undefined && { status, publishedAt }),
        ...(category !== undefined && { category }),
        ...(tagList !== undefined && { tags: tagList }),
        ...(featuredImage !== undefined && { featuredImage }),
        ...(metaTitle !== undefined && { metaTitle: metaTitle.trim() }),
        ...(metaDescription !== undefined && { metaDescription: metaDescription.trim() }),
        ...(authorId !== undefined && { authorId }),
      },
      select: fullSelect,
    });
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

/**
 * DELETE /api/v1/blogs/:id
 */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = checkApiKey(req);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
