import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
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

    const newStatus = existing.status === "published" ? "draft" : "published";
    const blog = await prisma.blog.update({
      where: { id },
      data: { status: newStatus, publishedAt: newStatus === "published" && !existing.publishedAt ? new Date() : existing.publishedAt },
    });
    return NextResponse.json({
      success: true,
      message: `Blog ${newStatus === "published" ? "published" : "unpublished"} successfully`,
      data: { status: blog.status, publishedAt: blog.publishedAt },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
