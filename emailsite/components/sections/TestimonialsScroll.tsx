"use client";

import React from "react";
import { motion } from "framer-motion";

interface ReviewRow {
  content: string;
  authorImage: string;
  authorName: string;
  authorRole: string;
  tag: string;
  tagDark: boolean;
}

const FALLBACK: ReviewRow[] = [
  { content: "We migrated 2 million emails from Exchange to Office 365 with absolute zero data loss. The migration report gave our compliance team exactly what they needed.", authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Sarah Mitchell", authorRole: "IT Director · Accenture", tag: "Migration", tagDark: true },
  { content: "The PST viewer is exceptional for digital forensics. I can open corrupted PST files, search thousands of emails, and export court-ready evidence formats — no Outlook needed.", authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150", authorName: "James Donovan", authorRole: "Forensic Analyst · FBI Cyber", tag: "Viewer", tagDark: false },
  { content: "Converted 50GB of Thunderbird MBOX to Outlook PST with all attachments and folder structures perfectly preserved. Saved our team 3 weeks of manual work.", authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Priya Ramaswamy", authorRole: "IT Consultant · Deloitte", tag: "Conversion", tagDark: true },
  { content: "GDPR compliance requires secure email archiving. The AES-256 encrypted backup with instant search-and-restore is exactly what our legal team needed.", authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Thomas Weber", authorRole: "CTO · LegalEdge GmbH", tag: "Backup", tagDark: false },
  { content: "Managing archives for 30,000 faculty is complex. MailExel handles NSF to PST to MBOX conversions with a consistent, rock-solid interface every time.", authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Amanda Chen", authorRole: "Sysadmin · Stanford University", tag: "Migration", tagDark: true },
  { content: "E-discovery requires viewing emails without altering metadata. The viewer is forensically sound — no writes to source files. Date range filtering saved us hundreds of hours.", authorImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Robert Okafor", authorRole: "Legal Discovery · Baker McKenzie", tag: "Viewer", tagDark: false },
  { content: "Batch conversion of 80,000 MSG files to EML in under 30 minutes. The interface is clean and the processing speed is absolutely unmatched by anything else we tried.", authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Marcus Lee", authorRole: "Systems Engineer · Oracle", tag: "Conversion", tagDark: true },
  { content: "Switched our entire 200-person org from on-premise Exchange to Gmail using the migration wizard. Zero downtime, zero complaints from users — perfect execution.", authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Yuki Tanaka", authorRole: "IT Manager · SoftBank", tag: "Migration", tagDark: true },
  { content: "The scheduled incremental backup has been running silently for 18 months. Never missed a beat. When I needed to restore 200 emails it took exactly 3 minutes.", authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150", authorName: "Ben Carvalho", authorRole: "IT Director · LATAM Airlines", tag: "Backup", tagDark: false },
];

const TestimonialsColumn = ({ reviews, duration = 15, className }: { reviews: ReviewRow[]; duration?: number; className?: string }) => (
  <div className={className}>
    <motion.ul
      animate={{ translateY: "-50%" }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      className="flex flex-col gap-5 pb-5 list-none m-0 p-0"
    >
      {[...Array(2)].fill(0).map((_, dupIdx) => (
        <React.Fragment key={dupIdx}>
          {reviews.map(({ content, authorImage, authorName, authorRole, tag, tagDark }, i) => (
            <motion.li
              key={`${dupIdx}-${i}`}
              aria-hidden={dupIdx === 1 ? "true" : "false"}
              whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.10)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="p-6 rounded-3xl border border-gray-200 shadow-sm max-w-xs w-full bg-white cursor-default select-none"
            >
              <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3 ${tagDark ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>{tag}</span>
              <blockquote className="m-0 p-0">
                <p className="text-gray-600 leading-relaxed text-sm m-0">&ldquo;{content}&rdquo;</p>
                <footer className="flex items-center gap-3 mt-5">
                  {authorImage ? (
                    <img width={40} height={40} src={authorImage} alt={authorName} className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm ring-2 ring-gray-100">
                      {authorName.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <cite className="font-semibold not-italic text-sm text-black">{authorName}</cite>
                    <span className="text-xs text-gray-400 mt-0.5">{authorRole}</span>
                  </div>
                </footer>
              </blockquote>
            </motion.li>
          ))}
        </React.Fragment>
      ))}
    </motion.ul>
  </div>
);

export default function TestimonialsScroll({ reviews }: { reviews?: ReviewRow[] }) {
  const data = reviews && reviews.length >= 3 ? reviews : FALLBACK;
  const third = Math.ceil(data.length / 3);
  const col1 = data.slice(0, third);
  const col2 = data.slice(third, third * 2);
  const col3 = data.slice(third * 2);

  return (
    <section className="bg-white py-24 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-16">
          <div className="border border-gray-200 py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-gray-500 bg-gray-50">
            Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mt-5 text-center text-black">
            Loved by 500,000+ users
          </h2>
          <p className="text-center mt-4 text-gray-500 text-lg leading-relaxed max-w-sm">
            IT professionals, forensic analysts, and legal teams trust MailExel every day.
          </p>
        </div>

        <div
          className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[740px] overflow-hidden"
          role="region"
          aria-label="Customer testimonials"
        >
          <TestimonialsColumn reviews={col1} duration={15} />
          <TestimonialsColumn reviews={col2} className="hidden md:block" duration={20} />
          <TestimonialsColumn reviews={col3} className="hidden lg:block" duration={17} />
        </div>
      </motion.div>
    </section>
  );
}
