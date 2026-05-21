"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "IT Director",
    company: "Accenture",
    avatar: "SM",
    avatarColor: "from-blue-500 to-blue-600",
    rating: 5,
    text: "We migrated 2 million emails from Exchange to Office 365 with zero data loss. The batch processing is blazing fast and the migration report gave our compliance team exactly what they needed.",
    tag: "Migration",
    tagColor: "bg-blue-100 text-blue-700",
  },
  {
    name: "James Donovan",
    role: "Digital Forensics Analyst",
    company: "FBI Cyber Division",
    avatar: "JD",
    avatarColor: "from-violet-500 to-violet-600",
    rating: 5,
    text: "The PST viewer is exceptional for forensic analysis. I can open corrupted PST files, search across thousands of emails, and export evidence in court-ready formats. Nothing else comes close.",
    tag: "Email Viewer",
    tagColor: "bg-violet-100 text-violet-700",
  },
  {
    name: "Priya Ramaswamy",
    role: "Senior IT Consultant",
    company: "Deloitte",
    avatar: "PR",
    avatarColor: "from-emerald-500 to-emerald-600",
    rating: 5,
    text: "The MBOX to PST converter saved our client 3 weeks of manual work. Converted 50GB of Thunderbird emails to Outlook format with all attachments and folder structures perfectly preserved.",
    tag: "Conversion",
    tagColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Thomas Weber",
    role: "CTO",
    company: "LegalEdge GmbH",
    avatar: "TW",
    avatarColor: "from-orange-500 to-orange-600",
    rating: 5,
    text: "GDPR compliance requires us to archive emails securely. The automated backup with AES-256 encryption and instant search-and-restore is exactly what we needed. Incredible product.",
    tag: "Backup",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    name: "Amanda Chen",
    role: "Systems Administrator",
    company: "Stanford University",
    avatar: "AC",
    avatarColor: "from-cyan-500 to-cyan-600",
    rating: 5,
    text: "Managing email archives for 30,000 faculty and students is complex. MailExel handles everything from NSF to PST to MBOX conversions with a consistent, reliable interface.",
    tag: "Migration",
    tagColor: "bg-cyan-100 text-cyan-700",
  },
  {
    name: "Robert Okafor",
    role: "Legal Discovery Specialist",
    company: "Baker McKenzie",
    avatar: "RO",
    avatarColor: "from-rose-500 to-rose-600",
    rating: 5,
    text: "E-discovery requires viewing emails without altering metadata. The viewer mode is forensically sound — no writes to source files. The date range filtering saved us hundreds of hours on document review.",
    tag: "Email Viewer",
    tagColor: "bg-rose-100 text-rose-700",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const visible = 3;
  const total = testimonials.length;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  const getVisible = () => {
    const items = [];
    for (let i = 0; i < visible; i++) {
      items.push(testimonials[(current + i) % total]);
    }
    return items;
  };

  return (
    <section className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
              Customer Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Loved by{" "}
              <span className="gradient-text">500,000+ users</span>
            </h2>
            <p className="text-slate-500 mt-2">Real reviews from IT professionals, forensic analysts, and legal teams.</p>
          </div>

          {/* Overall rating */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-lg shrink-0">
            <div className="text-4xl font-black text-slate-900">4.9</div>
            <div>
              <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs text-slate-500">from 12,400+ reviews</div>
              <div className="text-[10px] text-slate-400 mt-0.5">G2 · Capterra · Trustpilot</div>
            </div>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {getVisible().map((t, i) => (
            <div
              key={`${t.name}-${current}-${i}`}
              className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl hover:border-slate-200 transition-all duration-300 card-hover relative overflow-hidden"
            >
              {/* Quote icon */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-slate-100 group-hover:text-blue-50 transition-colors" />

              {/* Tag */}
              <div className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 ${t.tagColor}`}>
                {t.tag}
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-blue-600 w-6" : "bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
