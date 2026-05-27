"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Calendar, Eye, BookOpen, ArrowRight, Users } from "lucide-react";
import { parseShortcodes } from "@/lib/shortcodes";
import "@/app/(public)/blog/blog-content.css";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatYear(iso: string | Date) {
  return new Date(iso).getFullYear();
}

export interface AuthorData {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  linkedin: string;
  longBio: string;
  createdAt: string;
  _count: { blogs: number };
}

export interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  publishedAt: string | null;
  views: number;
}

interface Props {
  author: AuthorData;
  posts: PostData[];
  totalViews: number;
}

function PostCard({ post, featured }: { post: PostData; featured?: boolean }) {
  return (
    <Link
      href={`/${post.slug}`}
      className={`group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-red-200 hover:shadow-lg transition-all duration-300 flex ${
        featured ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`bg-gray-100 overflow-hidden flex-shrink-0 ${
          featured ? "sm:w-2/5 aspect-video sm:aspect-auto" : "aspect-video"
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      <div className={`flex flex-col p-5 flex-1 ${featured ? "sm:p-7" : ""}`}>
        {post.category && (
          <span className="inline-block self-start bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3">
            {post.category}
          </span>
        )}
        <h3
          className={`text-gray-900 font-bold leading-snug mb-2 group-hover:text-red-600 transition-colors line-clamp-2 ${
            featured ? "text-xl" : "text-base"
          }`}
        >
          {post.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
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
          <span className="flex items-center gap-1 text-red-600 font-semibold group-hover:gap-1.5 transition-all">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AuthorPageClient({ author, posts, totalViews }: Props) {
  const parsedBio = useMemo(
    () => (author.longBio ? parseShortcodes(author.longBio) : ""),
    [author.longBio]
  );

  const featuredPost = posts[0];
  const restPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-black pt-28 pb-0 relative overflow-hidden">
        {/* dot grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* red glow blob */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-red-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/35 mb-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/55">Author</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-red-600/40 blur-xl scale-110" />
              {author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-white/15 shadow-2xl"
                />
              ) : (
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-5xl font-black ring-4 ring-white/15 shadow-2xl">
                  {author.name[0].toUpperCase()}
                </div>
              )}
              {/* online dot */}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full ring-2 ring-black" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-red-600/15 border border-red-500/25 text-red-400 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  <Users className="w-3 h-3" /> Author
                </span>
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full transition-colors"
                  >
                    <LinkedinIcon className="w-3 h-3" /> LinkedIn
                  </a>
                )}
              </div>

              <h1 className="text-white text-4xl sm:text-5xl font-black mb-3 leading-tight tracking-tight">
                {author.name}
              </h1>

              {author.bio && (
                <p className="text-white/55 text-lg leading-relaxed mb-5 max-w-2xl">{author.bio}</p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Articles", value: author._count.blogs.toString() },
                  { label: "Total views", value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString() },
                  { label: "Writing since", value: formatYear(author.createdAt).toString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center min-w-[80px]">
                    <div className="text-white text-xl font-black leading-none">{value}</div>
                    <div className="text-white/35 text-[11px] font-medium mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <div className="w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 40" className="w-full block" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,20 C360,40 1080,0 1440,20 L1440,40 L0,40 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-14">

        {/* Long Bio with shortcodes */}
        {parsedBio && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-7 bg-red-600 rounded-full" />
              <h2 className="text-gray-900 text-2xl font-black">About {author.name}</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div
                className="prose-author"
                dangerouslySetInnerHTML={{ __html: parsedBio }}
              />

              {author.linkedin && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
                  <p className="text-gray-400 text-sm">Want to connect or collaborate?</p>
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <LinkedinIcon className="w-4 h-4" /> Connect on LinkedIn
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-red-600 rounded-full" />
              <h2 className="text-gray-900 text-2xl font-black">
                Articles
                <span className="ml-2 text-base font-normal text-gray-400">({posts.length})</span>
              </h2>
            </div>
            <Link href="/blog" className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors flex items-center gap-1">
              All articles <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center bg-white border border-gray-200 rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-300" />
              </div>
              <div>
                <p className="text-gray-700 font-semibold">No articles published yet</p>
                <p className="text-gray-400 text-sm mt-1">Check back soon for new content.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Featured first post */}
              {featuredPost && <PostCard post={featuredPost} featured />}

              {/* Rest in 2-col grid */}
              {restPosts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {restPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
