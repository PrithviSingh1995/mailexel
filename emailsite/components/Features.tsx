"use client";
import { Eye, ArrowLeftRight, RefreshCw, HardDrive, Search, Filter, Layers, Lock, Zap, Globe, Clock, CheckCircle2 } from "lucide-react";

const mainFeatures = [
  {
    icon: Eye,
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
    title: "Email Viewer",
    subtitle: "Open without Outlook",
    desc: "Instantly open and read PST, MBOX, EML, MSG, OST, and 50+ email formats without installing Outlook or any email client.",
    features: ["Preview attachments inline", "Full-text search across mailbox", "Calendar & contact view", "Export to PDF / HTML / Print"],
    badge: "Most Popular",
    badgeColor: "bg-blue-600",
  },
  {
    icon: ArrowLeftRight,
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    title: "Email Converter",
    subtitle: "150+ format pairs",
    desc: "Batch-convert email files between any formats. Convert PST to MBOX, EML to PDF, MSG to HTML, and 150+ combinations — in seconds.",
    features: ["Batch convert 10,000+ emails", "Preserve folder hierarchy", "Maintain metadata & headers", "Filter by date / sender / subject"],
    badge: "Fastest",
    badgeColor: "bg-violet-600",
  },
  {
    icon: RefreshCw,
    color: "from-cyan-500 to-cyan-600",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-100",
    title: "Email Migration",
    subtitle: "Zero-downtime transfer",
    desc: "Migrate entire mailboxes between servers, clients, and cloud platforms. Office 365, Gmail, Exchange, IMAP — all supported.",
    features: ["Office 365 ↔ Gmail ↔ Exchange", "IMAP to IMAP migration", "Delta sync & scheduling", "Migration report & logs"],
    badge: "Enterprise",
    badgeColor: "bg-cyan-600",
  },
  {
    icon: HardDrive,
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
    title: "Email Backup",
    subtitle: "Never lose an email",
    desc: "Create encrypted, compressed backups of your entire mailbox automatically. Restore any email or folder with one click.",
    features: ["Scheduled auto-backup", "Incremental saves bandwidth", "AES-256 encryption", "Instant restore & search"],
    badge: "Secure",
    badgeColor: "bg-emerald-600",
  },
];

const additionalFeatures = [
  { icon: Search, title: "Advanced Search", desc: "Full-text search across thousands of emails instantly with filters." },
  { icon: Filter, title: "Smart Filters", desc: "Filter by date range, sender, subject, attachment type and more." },
  { icon: Layers, title: "Batch Processing", desc: "Process thousands of files simultaneously with multi-threading." },
  { icon: Lock, title: "AES-256 Encryption", desc: "Military-grade encryption keeps your data private and safe." },
  { icon: Zap, title: "Lightning Fast", desc: "Optimized engine processes 10,000+ emails per minute." },
  { icon: Globe, title: "Unicode Support", desc: "Full support for all languages, encodings and character sets." },
  { icon: Clock, title: "Scheduled Tasks", desc: "Automate recurring conversions and backups on a schedule." },
  { icon: CheckCircle2, title: "Zero Data Loss", desc: "Mathematically verified conversion accuracy — every field preserved." },
];

export default function Features() {
  return (
    <section id="features" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Core Features
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Everything you need for{" "}
            <span className="gradient-text">email management</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Four powerful tools in one suite — built for IT professionals, forensic analysts, legal teams, and everyday users.
          </p>
        </div>

        {/* Main feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {mainFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`relative group p-7 rounded-3xl border ${feat.border} bg-gradient-to-br from-white to-slate-50/50 card-hover cursor-pointer`}
              >
                {/* Badge */}
                <div className={`absolute top-5 right-5 px-2.5 py-1 ${feat.badgeColor} text-white text-[10px] font-bold uppercase tracking-wider rounded-full`}>
                  {feat.badge}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
                </div>
                <div className={`text-xs font-semibold ${feat.text} mb-3`}>{feat.subtitle}</div>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{feat.desc}</p>

                <ul className="space-y-2">
                  {feat.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${feat.color} flex items-center justify-center flex-shrink-0`}>
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
              </div>
            );
          })}
        </div>

        {/* Additional features grid */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Packed with powerful features</h3>
            <p className="text-slate-400">Every feature you need, nothing you don&apos;t.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {additionalFeatures.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div className="font-semibold text-white text-sm mb-1">{feat.title}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{feat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
