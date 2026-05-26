"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, BlogPost } from "@/lib/api";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Globe,
  FileEdit,
  Eye,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

export default function BlogsPageClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchBlogs = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await api.getAdminBlogs({ page, limit: 15, status: statusFilter, search });
        setBlogs(res.data);
        setPagination(res.pagination);
      } finally {
        setLoading(false);
      }
    },
    [search, statusFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchBlogs(1), 300);
    return () => clearTimeout(timer);
  }, [fetchBlogs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    setDeletingId(id);
    try {
      await api.deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await api.togglePublish(id);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: res.data.status as "draft" | "published" } : b
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Blog Posts</h1>
          <p className="text-gray-400 text-sm mt-1">{pagination.total} total posts</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 text-sm focus:outline-none focus:border-red-400 transition-colors"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-gray-400 text-sm">No posts found</p>
            <Link
              href="/admin/blogs/new"
              className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Create one
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                      Title
                    </th>
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                      Category
                    </th>
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                      Author
                    </th>
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                      Views
                    </th>
                    <th className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wide px-4 py-3">
                      Date
                    </th>
                    <th className="text-right text-gray-500 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-gray-900 text-sm font-medium truncate max-w-xs">{blog.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate max-w-xs">{blog.slug}</p>
                      </td>
                      <td className="px-4 py-4">
                        {blog.status === "published" ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full border border-green-100">
                            <Globe className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
                            <FileEdit className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-500 text-sm">{blog.category || "—"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-500 text-sm">{blog.author?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <Eye className="w-3.5 h-3.5" />
                          {blog.views.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-400 text-xs">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleTogglePublish(blog._id)}
                            disabled={togglingId === blog._id}
                            title={blog.status === "published" ? "Unpublish" : "Publish"}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {blog.status === "published" ? (
                              <ToggleRight className="w-4 h-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            href={`/admin/blogs/${blog._id}/edit`}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog._id)}
                            disabled={deletingId === blog._id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {blogs.map((blog) => (
                <div key={blog._id} className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-gray-900 text-sm font-medium leading-snug">{blog.title}</p>
                    {blog.status === "published" ? (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full border border-green-100">
                        <Globe className="w-3 h-3" /> Live
                      </span>
                    ) : (
                      <span className="flex-shrink-0 inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mb-3">{blog.slug}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublish(blog._id)}
                      className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                    >
                      {blog.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/admin/blogs/${blog._id}/edit`}
                      className="flex-1 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors text-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 py-1.5 text-xs border border-red-200 rounded-lg text-red-400 hover:text-red-600 hover:border-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                <span className="text-gray-400 text-xs">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchBlogs(pagination.page - 1)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchBlogs(pagination.page + 1)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed border border-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
