import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && blog.author.toString() !== String(user!._id))
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });

    blog.status = blog.status === "published" ? "draft" : "published";
    await blog.save();
    return NextResponse.json({
      success: true,
      message: `Blog ${blog.status === "published" ? "published" : "unpublished"} successfully`,
      data: { status: blog.status, publishedAt: blog.publishedAt },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
