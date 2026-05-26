import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Calendar, Eye, BookOpen, ArrowRight } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  );
}

export const revalidate = 3600;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true },
  });
  if (!author) return { title: "Author Not Found" };
  return {
    title: `${author.name} — MailExel Blog`,
    description: author.bio || `Articles and guides by ${author.name} on MailExel.`,
    alternates: { canonical: `https://www.mailexel.com/author/${id}` },
  };
}

function formatDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;

  const author = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, avatar: true, bio: true,
      linkedin: true, longBio: true,
      _count: { select: { blogs: true } },
    },
  });
  if (!author) notFound();

  const posts = await prisma.blog.findMany({
    where: { authorId: id, status: "published" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      featuredImage: true, category: true, tags: true,
      publishedAt: true, views: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff18 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/60">Author</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            {author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatar}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/10 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-white text-4xl font-black flex-shrink-0 ring-4 ring-white/10">
                {author.name[0].toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Author</p>
              <h1 className="text-white text-3xl sm:text-4xl font-black mb-2 leading-tight">{author.name}</h1>
              {author.bio && (
                <p className="text-white/55 text-base leading-relaxed mb-3 max-w-xl">{author.bio}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {author._count.blogs} article{author._count.blogs !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  {totalViews.toLocaleString()} total views
                </span>
                {author.linkedin && (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  >
                    <LinkedinIcon className="w-4 h-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Long Bio */}
        {author.longBio && (
          <section className="mb-12">
            <h2 className="text-gray-900 text-xl font-bold mb-4">About {author.name}</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{author.longBio}</p>
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4" /> Connect on LinkedIn
                </a>
              )}
            </div>
          </section>
        )}

        {/* Posts */}
        <section>
          <h2 className="text-gray-900 text-xl font-bold mb-6">
            Articles by {author.name}
            <span className="ml-2 text-base font-normal text-gray-400">({posts.length})</span>
          </h2>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm">No published articles yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-5 bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {post.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {post.category && (
                      <span className="inline-block bg-red-50 text-red-600 border border-red-100 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2">
                        {post.category}
                      </span>
                    )}
                    <h3 className="text-gray-900 font-bold text-base leading-snug mb-1 group-hover:text-red-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 text-xs">
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
                      <span className="flex items-center gap-1 text-red-600 font-semibold ml-auto group-hover:gap-1.5 transition-all">
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
