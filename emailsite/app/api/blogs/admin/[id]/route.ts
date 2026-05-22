import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    const { id } = await params;
    await connectDB();
    const blog = await Blog.findById(id).populate("author", "name avatar");
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && blog.author._id.toString() !== String(user!._id))
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    return NextResponse.json({ success: true, data: blog });
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
    await connectDB();
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && blog.author.toString() !== String(user!._id))
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });

    const { title, excerpt, content, category, tags, status, metaTitle, metaDescription, featuredImage } =
      await request.json();
    if (title) blog.title = title;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags !== undefined) blog.tags = Array.isArray(tags) ? tags : String(tags).split(",").map((t) => t.trim());
    if (status) blog.status = status;
    if (metaTitle !== undefined) blog.metaTitle = metaTitle;
    if (metaDescription !== undefined) blog.metaDescription = metaDescription;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;

    await blog.save();
    await blog.populate("author", "name avatar");
    return NextResponse.json({ success: true, data: blog });
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
    await connectDB();
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    if (user!.role === "editor" && blog.author.toString() !== String(user!._id))
      return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    await blog.deleteOne();
    return NextResponse.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
