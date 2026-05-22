"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import SiteNavbar from "@/components/sections/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import {
  Search,
  Calendar,
  Eye,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const API_BASE = "";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: { name: string };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
}

interface Pagination {
  total: number;
  page: number;
  totalPages: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 ${
        featured ? "lg:flex-row" : ""
      }`}
    >
      {/* Image */}
      <div
        className={`bg-gray-100 overflow-hidden flex-shrink-0 ${
          featured ? "lg:w-2/5 aspect-video lg:aspect-auto" : "aspect-video"
        }`}
      >
        {post.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-col p-6 flex-1 ${featured ? "lg:p-8" : ""}`}>
        {/* Category + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.category && (
            <span className="bg-red-50 text-red-600 border border-red-100 text-xs font-semibold px-2.5 py-1 rounded-full">
              {post.category}
            </span>
          )}
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className={`text-gray-900 font-bold leading-snug mb-3 group-hover:text-red-600 transition-colors ${
            featured ? "text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-gray-400 text-xs">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.views.toLocaleString()}
            </span>
          </div>
          <span className="flex items-center gap-1 text-red-600 text-xs font-semibold group-hover:gap-2 transition-all">
            Read more <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPageClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, totalPages: 1 });
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [draftSearch, setDraftSearch] = useState("");

  const fetchPosts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      const res = await fetch(`${API_BASE}/api/blogs?${params}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
        setPagination(data.pagination);
      }
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/blogs/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.data.filter(Boolean));
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(draftSearch);
  };

  const featuredPost = posts[0];
  const restPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-black pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            MailExel Blog
          </div>
          <h1 className="text-white text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Email Tools, Tips &{" "}
            <span className="text-red-500">How-To Guides</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
            Step-by-step guides for email conversion, migration, backup, and recovery.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={draftSearch}
                onChange={(e) => setDraftSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-red-500/40 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Main content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Category filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === ""
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Active filters indicator */}
        {(search || activeCategory) && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
            <Tag className="w-4 h-4" />
            Showing results for
            {search && <span className="font-semibold text-gray-900">"{search}"</span>}
            {activeCategory && (
              <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeCategory}
              </span>
            )}
            <button
              onClick={() => { setSearch(""); setDraftSearch(""); setActiveCategory(""); }}
              className="text-red-500 hover:text-red-600 font-medium ml-1"
            >
              Clear
            </button>
            <span className="text-gray-300 ml-auto">{pagination.total} results</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-300" />
            </div>
            <div>
              <p className="text-gray-900 font-semibold text-lg">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">
                {search || activeCategory
                  ? "Try a different search or category"
                  : "No published blog posts yet"}
              </p>
            </div>
            {(search || activeCategory) && (
              <button
                onClick={() => { setSearch(""); setDraftSearch(""); setActiveCategory(""); }}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && !search && !activeCategory && pagination.page === 1 && (
              <div className="mb-8">
                <BlogCard post={featuredPost} featured />
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(search || activeCategory || pagination.page > 1 ? posts : restPosts).map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchPosts(pagination.page - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - pagination.page) <= 2)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => fetchPosts(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          p === pagination.page
                            ? "bg-red-600 text-white"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                </div>

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchPosts(pagination.page + 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <FooterSection />
    </div>
  );
}
