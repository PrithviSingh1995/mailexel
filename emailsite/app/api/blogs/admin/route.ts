import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/server/auth";
import { connectDB } from "@/lib/db";
import Blog from "@/lib/models/Blog";

export async function POST(request: Request) {
  const { user, error } = await getAuthUser(request);
  if (error) return error;
  try {
    await connectDB();
    const { title, excerpt, content, category, tags, status, metaTitle, metaDescription, featuredImage } =
      await request.json();
    if (!title || !excerpt || !content)
      return NextResponse.json({ success: false, message: "Title, excerpt, and content are required" }, { status: 400 });

    const blog = await Blog.create({
      title, excerpt, content, category,
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(",").map((t) => t.trim()) : []),
      status: status || "draft", metaTitle, metaDescription, featuredImage,
      author: user!._id,
    });
    await blog.populate("author", "name avatar");
    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 500 });
  }
}
