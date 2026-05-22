import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const blog = await Blog.findOne({ slug, status: "published" }).populate("author", "name avatar bio");
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });

    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).exec();
    return NextResponse.json({ success: true, data: blog });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
