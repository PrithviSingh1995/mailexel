import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

async function uniqueSlug(title: string, excludeId?: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base, i = 1;
  for (;;) {
    const ex = await prisma.blog.findFirst({ where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) } });
    if (!ex) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function POST(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { title, excerpt, content, category, tags, status, metaTitle, metaDescription, featuredImage } = await request.json();
    if (!title || !excerpt || !content)
      return NextResponse.json({ success: false, message: "Title, excerpt, and content are required" }, { status: 400 });

    const slug = await uniqueSlug(title);
    const tagList = Array.isArray(tags) ? tags : (tags ? String(tags).split(",").map((t: string) => t.trim()) : []);
    const now = status === "published" ? new Date() : null;

    const blog = await prisma.blog.create({
      data: { title, slug, excerpt, content, category: category || "General", tags: tagList, status: status || "draft", publishedAt: now, metaTitle: metaTitle || title, metaDescription: metaDescription || excerpt, featuredImage: featuredImage || "", authorId: user!.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    return NextResponse.json({ success: true, data: { ...blog, _id: blog.id, author: { ...blog.author, _id: blog.author.id } } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
