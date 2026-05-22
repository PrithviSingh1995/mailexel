import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await prisma.blog.findFirst({
      where: { slug, status: "published" },
      include: { author: { select: { id: true, name: true, avatar: true, bio: true } } },
    });
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    prisma.blog.update({ where: { id: blog.id }, data: { views: { increment: 1 } } }).catch(() => {});
    return NextResponse.json({ success: true, data: { ...blog, _id: blog.id, author: { ...blog.author, _id: blog.author.id } } });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
