"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Download, ArrowRight, Shield, CheckCircle2, Star, X, Send } from "lucide-react";
import { defaultHomeContent, type HeroContent } from "@/lib/types/page-content";

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const defaultItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  return (
    <motion.div initial="hidden" animate="visible" variants={variants?.container || defaultContainerVariants} className={cn(className)}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={variants?.item || defaultItemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────

function ReviewModal({ initialRating, onClose }: { initialRating: number; onClose: () => void }) {
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ authorName: "", authorRole: "", content: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.content.trim()) return;
    setStatus("submitting");
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, rating }),
    });
    setStatus("done");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <X className="w-5 h-5" />
        </button>

        {status === "done" ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thank you!</h3>
            <p className="text-gray-500 text-sm mb-5">Your review is pending approval and will appear shortly.</p>
            <button onClick={onClose} className="px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
              <p className="text-xs text-gray-400 mt-0.5">Your experience helps others choose MailExel.</p>
            </div>

            {/* Star picker */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Rating</label>
              <div className="flex gap-1 items-center">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} type="button" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(i)}>
                    <Star className={`w-7 h-7 transition-colors ${i <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-400">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered || rating]}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
                <input required type="text" value={form.authorName} onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))}
                  placeholder="John Smith"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role <span className="font-normal text-gray-400">(optional)</span></label>
                <input type="text" value={form.authorRole} onChange={e => setForm(p => ({ ...p, authorRole: e.target.value }))}
                  placeholder="IT Director"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Review *</label>
              <textarea required rows={3} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                placeholder="Tell us about your experience…"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>

            <button type="submit" disabled={status === "submitting" || !form.authorName.trim() || !form.content.trim()}
              className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
              <Send className="w-4 h-4" />
              {status === "submitting" ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Interactive rating ───────────────────────────────────────────────────────

function InteractiveRating({ initialAvg, initialCount }: { initialAvg: number; initialCount: number }) {
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [hovered, setHovered] = useState(0);
  const [voted, setVoted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clickedRating, setClickedRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleStarClick = async (star: number) => {
    if (voted || submitting) return;
    setSubmitting(true);
    setClickedRating(star);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: star }),
      });
      const data = await res.json();
      if (data.success) {
        setAvg(data.data.avg);
        setCount(data.data.count);
      }
    } finally {
      setVoted(true);
      setSubmitting(false);
      setTimeout(() => setShowModal(true), 400);
    }
  };

  const displayAvg = count > 0 ? avg : initialAvg;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="flex items-center gap-3 mb-8"
      >
        {/* Stars */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              disabled={voted || submitting}
              onMouseEnter={() => !voted && setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => handleStarClick(i)}
              className={`transition-transform ${!voted ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
            >
              <Star className={`w-6 h-6 transition-colors duration-150 ${
                voted
                  ? i <= Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"
                  : i <= (hovered || Math.round(displayAvg)) ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"
              }`} />
            </button>
          ))}
        </div>

        {/* Score and count */}
        <div className="flex items-baseline gap-1.5">
          <motion.span
            key={avg}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white font-bold text-lg"
          >
            {displayAvg.toFixed(1)}
          </motion.span>
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/40 text-sm"
          >
            ({count > 0 ? count.toLocaleString() : "0"} {count === 1 ? "rating" : "ratings"})
          </motion.span>
        </div>

        {/* Prompt */}
        <AnimatePresence>
          {!voted && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-white/30 text-xs hidden sm:block"
            >
              ← Rate this tool
            </motion.span>
          )}
          {voted && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowModal(true)}
              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
            >
              Write a review →
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <ReviewModal initialRating={clickedRating} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero section ─────────────────────────────────────────────────────────────

export default function HeroSection({
  content,
  initialAvg = 4.8,
  initialCount = 0,
}: {
  content?: Partial<HeroContent>;
  initialAvg?: number;
  initialCount?: number;
}) {
  const c: HeroContent = { ...defaultHomeContent.hero, ...content };
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;
    gsap.fromTo(gradientRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.8, ease: "power3.out" });
  }, []);

  return (
    <div className="overflow-hidden bg-black relative min-h-screen flex flex-col justify-center pt-16">
      <div ref={gradientRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-white/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-sm font-medium text-white mb-6"
            >
              <span className="text-white/70">{c.badge}</span>
              <span className="px-2 py-0.5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-wider">{c.ratingLabel}</span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6"
            >
              {c.titleLine1}{" "}
              <span className="relative">
                <span className="relative z-10 text-white">{c.titleLine2}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/40" />
              </span>
              <br />
              <span className="text-white/40 text-4xl sm:text-5xl lg:text-6xl font-bold">{c.titleSub}</span>
            </motion.h1>

            {/* Interactive rating — below H1 */}
            <InteractiveRating initialAvg={initialAvg} initialCount={initialCount} />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-lg sm:text-xl text-white/60 leading-relaxed mb-8 max-w-lg"
            >
              {c.description}
            </motion.p>

            <AnimatedGroup className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href={c.primaryCtaHref} className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl transition-all shadow-2xl shadow-red-900/40">
                <Download className="w-5 h-5" />
                {c.primaryCtaText}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href={c.secondaryCtaHref} className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white/5 border border-white/15 hover:bg-white/10 text-white font-semibold text-base rounded-xl transition-all">
                {c.secondaryCtaText}
              </a>
            </AnimatedGroup>

            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              {c.trustItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i === 0
                    ? <Shield className="w-3.5 h-3.5 text-white/60" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />
                  }
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-3xl scale-110" />
            <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 pulse-mono">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="flex-1 mx-3 h-5 bg-white/10 rounded text-[10px] flex items-center px-2 text-white/30">
                  {c.appWindowTitle}
                </div>
              </div>
              <Image
                src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                alt="MailExel Email Management Software Interface"
                width={2700}
                height={1440}
                className="w-full aspect-[15/8] object-cover"
                unoptimized
                priority
              />
            </div>

            <div className="absolute -top-4 -right-4 flex flex-wrap gap-1.5 justify-end max-w-[200px]">
              {c.formatBadges.map((b) => (
                <span key={b} className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                  {b}
                </span>
              ))}
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-black">{c.floatingStatVal}</div>
                <div className="text-xs text-gray-500">{c.floatingStatLabel}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10"
        >
          {c.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{s.val}</div>
              <div className="text-xs text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
