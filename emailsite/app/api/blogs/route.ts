import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { status: "published" };
    if (searchParams.get("category")) filter.category = new RegExp(searchParams.get("category")!, "i");
    if (searchParams.get("tag")) filter.tags = searchParams.get("tag")!.toLowerCase();
    if (searchParams.get("search")) filter.$text = { $search: searchParams.get("search")! };

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .populate("author", "name avatar bio")
        .select("-content")
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
