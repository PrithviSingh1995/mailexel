import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const [total, published, drafts, viewsAgg] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: "published" } }),
      prisma.blog.count({ where: { status: "draft" } }),
      prisma.blog.aggregate({ _sum: { views: true } }),
    ]);
    const topBlogs = await prisma.blog.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true, views: true, publishedAt: true },
      orderBy: { views: "desc" },
      take: 5,
    });
    return NextResponse.json({
      success: true,
      data: { total, published, drafts, totalViews: viewsAgg._sum.views || 0, topBlogs: topBlogs.map((b) => ({ ...b, _id: b.id })) },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
