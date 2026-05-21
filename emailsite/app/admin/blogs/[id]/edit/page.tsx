"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { api, BlogPost } from "@/lib/api";
import BlogForm from "../../_components/BlogForm";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAdminBlog(id)
      .then((res) => setBlog(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-6 text-sm max-w-lg">
        {error || "Post not found"}
      </div>
    );
  }

  return <BlogForm blog={blog} mode="edit" />;
}
