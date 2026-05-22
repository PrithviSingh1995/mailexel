"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialImg { imgSrc: string; alt: string; }

const imagePositions = [
  { top: "5%", left: "15%", className: "hidden lg:block w-24 h-24" },
  { top: "15%", left: "35%", className: "hidden md:block w-20 h-20" },
  { top: "5%", left: "55%", className: "hidden md:block w-16 h-16" },
  { top: "10%", right: "15%", className: "hidden lg:block w-28 h-28" },
  { top: "25%", right: "5%", className: "hidden md:block w-20 h-20" },
  { top: "45%", right: "10%", className: "hidden lg:block w-24 h-24" },
  { top: "50%", left: "5%", className: "hidden md:block w-28 h-28" },
  { bottom: "5%", left: "20%", className: "hidden lg:block w-20 h-20" },
  { bottom: "15%", left: "45%", className: "hidden md:block w-16 h-16" },
  { bottom: "10%", right: "30%", className: "hidden md:block w-24 h-24" },
  { bottom: "2%", right: "15%", className: "hidden lg:block w-20 h-20" },
  { top: "10%", left: "5%", className: "block md:hidden w-16 h-16" },
  { top: "5%", right: "10%", className: "block md:hidden w-20 h-20" },
  { bottom: "5%", left: "10%", className: "block md:hidden w-20 h-20" },
  { bottom: "10%", right: "5%", className: "block md:hidden w-16 h-16" },
];

const floatingAnimation = () => ({
  y: [0, -(Math.random() * 15 + 5), 0],
  transition: { duration: Math.random() * 4 + 5, repeat: Infinity, repeatType: "mirror" as const },
});

const testimonials: TestimonialImg[] = [
  { imgSrc: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300", alt: "IT Director" },
  { imgSrc: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300", alt: "Forensic Analyst" },
  { imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300", alt: "IT Consultant" },
  { imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300", alt: "CTO" },
  { imgSrc: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300", alt: "Systems Admin" },
  { imgSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300", alt: "Legal Discovery" },
  { imgSrc: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=300", alt: "IT Manager" },
  { imgSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300", alt: "Systems Engineer" },
  { imgSrc: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=300", alt: "Data Analyst" },
  { imgSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300", alt: "Network Engineer" },
  { imgSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300", alt: "Compliance Officer" },
  { imgSrc: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300", alt: "Support Lead" },
];

export default function TestimonialsGrid({
  avgRating,
  reviewCount,
  ratingAvg,
  ratingCount,
}: {
  avgRating?: number;
  reviewCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
}) {
  const displayAvg = ratingAvg ?? avgRating;
  const ratingDisplay = displayAvg != null ? `${displayAvg.toFixed(1)}★` : "4.8★";
  const displayCount = ratingCount ?? reviewCount;
  const countDisplay = displayCount != null && displayCount > 0 ? `${displayCount.toLocaleString()}+` : "500K+";
  return (
    <section className={cn("relative w-full bg-gray-50 py-32 sm:py-40 px-4 overflow-hidden")}>
      {/* Floating avatars */}
      {testimonials.slice(0, imagePositions.length).map((t, index) => (
        <motion.div
          key={index}
          className={cn("absolute rounded-xl shadow-lg overflow-hidden ring-2 ring-white", imagePositions[index].className)}
          style={{ top: imagePositions[index].top, left: (imagePositions[index] as { left?: string }).left, right: (imagePositions[index] as { right?: string }).right, bottom: (imagePositions[index] as { bottom?: string }).bottom }}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.05 }}
          whileHover={{ scale: 1.1, zIndex: 20 }}
        >
          <motion.img src={t.imgSrc} alt={t.alt} className="w-full h-full object-cover" animate={floatingAnimation()} />
        </motion.div>
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="mb-4 inline-block rounded-full bg-red-50 border border-red-200 px-4 py-1 text-sm font-semibold text-red-600">
          Trusted Worldwide
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black mb-5">
          Trusted by leaders
          <br />
          <span className="text-gray-400">
            from every industry
          </span>
        </h2>
        <p className="max-w-xl text-lg text-gray-500 mb-8 leading-relaxed">
          From Fortune 500 IT teams to independent forensic consultants — professionals rely on MailExel for their most critical email operations.
        </p>
        <a
          href="#download"
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-red-900/20 hover:bg-red-700 transition-colors"
        >
          Download Free Trial
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>

        <div className="mt-10 grid grid-cols-3 gap-8">
          {[{ val: countDisplay, label: "Customers" }, { val: ratingDisplay, label: "Avg Rating" }, { val: "50+", label: "Formats" }].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-black">{s.val}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
