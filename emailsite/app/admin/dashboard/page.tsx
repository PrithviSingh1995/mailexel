"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, StatsData } from "@/lib/api";
import {
  FileText,
  Globe,
  FileEdit,
  Eye,
  PlusCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? "bg-red-600 border-red-600" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm ${accent ? "text-red-100" : "text-gray-500"}`}>{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-red-500" : "bg-gray-100"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-gray-500"}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${accent ? "text-white" : "text-gray-900"}`}>
        {Number(value).toLocaleString()}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-sm">
        Failed to load stats: {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Your blog at a glance</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Posts" value={stats?.total ?? 0} icon={FileText} />
        <StatCard label="Published" value={stats?.published ?? 0} icon={Globe} accent />
        <StatCard label="Drafts" value={stats?.drafts ?? 0} icon={FileEdit} />
        <StatCard label="Total Views" value={stats?.totalViews ?? 0} icon={Eye} />
      </div>

      {/* Top posts */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <h2 className="text-gray-900 font-semibold text-sm">Top Posts by Views</h2>
          </div>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-xs transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.topBlogs && stats.topBlogs.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {stats.topBlogs.map((blog, i) => (
              <div key={blog._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <span className="text-gray-300 text-sm font-mono w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">{blog.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{blog.slug}</p>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm flex-shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No published posts yet.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm mt-2 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
