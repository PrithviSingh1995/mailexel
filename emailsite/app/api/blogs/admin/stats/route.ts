import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    await connectDB();
    const [total, published, drafts, totalViewsAgg] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ status: "published" }),
      Blog.countDocuments({ status: "draft" }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
    ]);
    const topBlogs = await Blog.find({ status: "published" })
      .select("title slug views publishedAt")
      .sort({ views: -1 })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: { total, published, drafts, totalViews: totalViewsAgg[0]?.total || 0, topBlogs },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
