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
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (searchParams.get("status")) filter.status = searchParams.get("status");
    if (searchParams.get("search")) filter.$text = { $search: searchParams.get("search")! };
    if (user!.role === "editor") filter.author = user!._id;

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name avatar")
        .select("-content")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
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
