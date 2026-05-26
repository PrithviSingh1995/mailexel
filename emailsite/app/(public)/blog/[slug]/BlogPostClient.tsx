"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Calendar, Eye, Clock, Share2, Check,
  BookOpen, ChevronRight, List, X, ArrowRight, Linkedin,
} from "lucide-react";
import "@/app/(public)/blog/blog-content.css";
import { parseShortcodes } from "@/lib/shortcodes";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: { id?: string; name: string; bio?: string; avatar?: string; linkedin?: string };
  category: string;
  tags: string[];
  publishedAt: string;
  views: number;
  metaTitle: string;
  metaDescription: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function estimateReadTime(content: string) {
  return Math.max(1, Math.ceil(content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function processHTML(html: string): string {
  let out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
    if (/id\s*=/.test(attrs)) return m;
    const id = slugify(inner.replace(/<[^>]*>/g, "").trim().slice(0, 80));
    return `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  out = out.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/gi, (m, attrs, inner) => {
    if (/id\s*=/.test(attrs)) return m;
    const id = slugify(inner.replace(/<[^>]*>/g, "").trim().slice(0, 80));
    return `<h3${attrs} id="${id}">${inner}</h3>`;
  });
  if (out.includes('class="blog-section-card"')) return out;
  const parts = out.split(/(?=<h2[\s>])/i).filter(Boolean);
  const card = (body: string, isPreamble = false) =>
    `<div class="blog-section-card${isPreamble ? " blog-preamble-card" : ""}">${body}</div>`;
  if (parts.length <= 1) return card(out);
  const [preamble, ...sections] = parts;
  return (preamble.trim() ? card(preamble, true) : "") + sections.map((s) => card(s)).join("");
}

interface Props {
  post: BlogPost;
  related: BlogPost[];
}

export default function BlogPostClient({ post, related }: Props) {
  const [copied, setCopied] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const processedHTML = useMemo(() => processHTML(parseShortcodes(post.content)), [post.content]);

  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [];
    const re = /<h([23])[^>]+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(processedHTML)) !== null) {
      items.push({ level: parseInt(m[1]), id: m[2], text: m[3].replace(/<[^>]*>/g, "").trim() });
    }
    return items;
  }, [processedHTML]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setTocOpen(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="bg-black pt-28 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-10">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60 truncate max-w-[240px]">{post.title}</span>
          </nav>

          {post.category && (
            <Link
              href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="inline-flex items-center gap-1.5 bg-red-600/15 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5 hover:bg-red-600/25 transition-colors"
            >
              {post.category}
            </Link>
          )}

          <h1 className="text-white text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-tight mb-5 tracking-tight">
            {post.title}
          </h1>
          <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-3xl">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-white/40 text-sm border-t border-white/10 pt-5">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                {post.author?.name?.[0] ?? "X"}
              </span>
              <span className="text-white/60">{post.author?.name ?? "MailExel Team"}</span>
            </span>
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />{formatDate(post.publishedAt)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />{estimateReadTime(post.content)} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />{post.views.toLocaleString()} views
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 ml-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-colors text-xs"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Copied!</> : <><Share2 className="w-3.5 h-3.5" /> Share</>}
            </button>
          </div>
        </div>

        {post.featuredImage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-t-2xl overflow-hidden aspect-video bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover opacity-90" />
            </div>
          </div>
        )}
      </section>

      {/* ── ARTICLE BODY ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          <article ref={articleRef}>
            <div dangerouslySetInnerHTML={{ __html: processedHTML }} />
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Summarise with AI</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { name: "ChatGPT",    label: "GPT", bg: "#10a37f", url: (u: string) => `https://chatgpt.com/?q=${encodeURIComponent("Summarize this article: " + u)}` },
                  { name: "Claude",     label: "Cl",  bg: "#d97757", url: (u: string) => `https://claude.ai/new?q=${encodeURIComponent("Summarize this article: " + u)}` },
                  { name: "Perplexity", label: "Px",  bg: "#20b2aa", url: (u: string) => `https://www.perplexity.ai/?q=${encodeURIComponent("Summarize this article: " + u)}` },
                  { name: "Gemini",     label: "Ge",  bg: "#4285f4", url: (u: string) => `https://gemini.google.com/app?q=${encodeURIComponent("Summarize this article: " + u)}` },
                  { name: "Copilot",    label: "Co",  bg: "#0078d4", url: (u: string) => `https://copilot.microsoft.com/?q=${encodeURIComponent("Summarize this article: " + u)}` },
                  { name: "Notebook",   label: "NB",  bg: "#7c3aed", url: (_: string) => `https://notebooklm.google.com/` },
                ].map(({ name, label, bg, url }) => (
                  <a key={name} href={url(typeof window !== "undefined" ? window.location.href : "")}
                    target="_blank" rel="noopener noreferrer" title={`Summarise with ${name}`}
                    className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group"
                  >
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-black" style={{ background: bg }}>{label}</span>
                    <span className="text-gray-500 text-[10px] font-medium group-hover:text-gray-800 transition-colors leading-none text-center">{name}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-black rounded-2xl p-6 text-center">
              <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-900/30">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-bold text-sm mb-2">Try MailExel Free</h3>
              <p className="text-white/45 text-xs leading-relaxed mb-4">Convert, migrate, backup and view emails — all in one offline tool.</p>
              <a href="/#download" className="block w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">Free Download</a>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-gray-900 font-bold text-sm mb-3">Share this article</h3>
              <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors">
                {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /> Link copied!</> : <><Share2 className="w-3.5 h-3.5" /> Copy link</>}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ── AUTHOR CARD ─────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl flex items-start gap-5 bg-gray-50 border border-gray-200 rounded-2xl p-6">
            {post.author?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.author.avatar} alt={post.author.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-black flex-shrink-0 shadow-sm">
                {(post.author?.name ?? "M")[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Written by</p>
              <h3 className="text-gray-900 font-bold text-lg leading-tight mb-1">{post.author?.name ?? "MailExel Team"}</h3>
              {post.author?.bio ? (
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{post.author.bio}</p>
              ) : (
                <p className="text-gray-400 text-sm leading-relaxed mb-3">Expert in email management, migration, and data recovery solutions.</p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                {post.author?.id && (
                  <Link
                    href={`/author/${post.author.id}`}
                    className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 text-xs font-semibold transition-colors"
                  >
                    View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {post.author?.linkedin && (
                  <a
                    href={post.author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-400 hover:text-blue-600 text-xs font-semibold transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ───────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-gray-900 text-2xl font-bold mb-7">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link key={rel._id} href={`/blog/${rel.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {rel.featuredImage
                      ? <img src={rel.featuredImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-6 h-6 text-gray-300" /></div>}
                  </div>
                  <div className="p-4">
                    <p className="text-gray-900 font-semibold text-sm leading-snug group-hover:text-red-600 transition-colors line-clamp-2">{rel.title}</p>
                    {rel.publishedAt && <p className="text-gray-400 text-xs mt-2">{formatDate(rel.publishedAt)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FLOATING TOC ────────────────────────────────────────────────────── */}
      {tocItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          <div className={`mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom ${tocOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 translate-y-4 pointer-events-none"}`}>
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-white/60" />
                <span className="text-white text-xs font-bold uppercase tracking-wider">Table of Contents</span>
              </div>
              <button onClick={() => setTocOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="max-h-72 overflow-y-auto py-2">
              {tocItems.map((item, i) => (
                <button key={item.id} onClick={() => scrollTo(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 hover:text-red-600 transition-colors group ${item.level === 3 ? "pl-8" : ""}`}
                >
                  <span className="w-5 h-5 rounded-full bg-gray-100 group-hover:bg-red-100 text-gray-500 group-hover:text-red-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 transition-colors">{i + 1}</span>
                  <span className="text-gray-600 group-hover:text-red-600 text-xs leading-snug transition-colors line-clamp-2">{item.text}</span>
                </button>
              ))}
            </nav>
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <p className="text-gray-400 text-[10px]">{tocItems.length} sections · click to jump</p>
            </div>
          </div>
          <button onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-sm shadow-xl transition-all"
          >
            {tocOpen ? <X className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {tocOpen ? "Close" : "Contents"}
            {!tocOpen && (
              <span className="bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{tocItems.length}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
