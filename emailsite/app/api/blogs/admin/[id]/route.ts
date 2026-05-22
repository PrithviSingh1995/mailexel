import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function uniqueSlug(title: string, excludeId: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base, i = 1;
  for (;;) {
    const ex = await prisma.blog.findFirst({ where: { slug, NOT: { id: excludeId } } });
    if (!ex) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({ where: { id }, include: { author: { select: { id: true, name: true, avatar: true } } } });
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && blog.authorId !== user!.id)
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    return NextResponse.json({ success: true, data: { ...blog, _id: blog.id, author: { ...blog.author, _id: blog.author.id } } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { id } = await params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && existing.authorId !== user!.id)
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });

    const body = await request.json();
    const tagList = body.tags !== undefined ? (Array.isArray(body.tags) ? body.tags : String(body.tags).split(",").map((t: string) => t.trim())) : undefined;
    const newSlug = body.title && body.title !== existing.title ? await uniqueSlug(body.title, id) : undefined;
    const publishedAt = body.status === "published" && existing.status !== "published" ? new Date() : existing.publishedAt;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(newSlug && { slug: newSlug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.category !== undefined && { category: body.category }),
        ...(tagList !== undefined && { tags: tagList }),
        ...(body.status !== undefined && { status: body.status, publishedAt }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.featuredImage !== undefined && { featuredImage: body.featuredImage }),
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    return NextResponse.json({ success: true, data: { ...blog, _id: blog.id, author: { ...blog.author, _id: blog.author.id } } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { id } = await params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && existing.authorId !== user!.id)
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
