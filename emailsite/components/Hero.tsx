"use client";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Download,
  Shield,
  Zap,
  Star,
  CheckCircle2,
  Mail,
  RefreshCw,
  HardDrive,
  Eye,
  ArrowLeftRight,
  Play,
} from "lucide-react";

const floatingEmails = [
  { icon: "📧", label: "PST", top: "15%", left: "5%", delay: "0s", color: "from-blue-500 to-blue-600" },
  { icon: "📨", label: "MBOX", top: "60%", left: "2%", delay: "1s", color: "from-violet-500 to-violet-600" },
  { icon: "📩", label: "EML", top: "80%", left: "12%", delay: "0.5s", color: "from-cyan-500 to-cyan-600" },
  { icon: "📬", label: "MSG", top: "20%", right: "5%", delay: "1.5s", color: "from-emerald-500 to-emerald-600" },
  { icon: "📮", label: "OST", top: "65%", right: "3%", delay: "0.8s", color: "from-orange-500 to-orange-600" },
];

const stats = [
  { value: "10M+", label: "Emails Processed" },
  { value: "150+", label: "Formats Supported" },
  { value: "99.9%", label: "Data Accuracy" },
  { value: "4.9★", label: "User Rating" },
];

const tabs = [
  { id: "view", label: "View", icon: Eye, color: "blue" },
  { id: "convert", label: "Convert", icon: ArrowLeftRight, color: "violet" },
  { id: "migrate", label: "Migrate", icon: RefreshCw, color: "cyan" },
  { id: "backup", label: "Backup", icon: HardDrive, color: "emerald" },
];

const tabContent: Record<string, { title: string; desc: string; items: string[] }> = {
  view: {
    title: "Open any email format instantly",
    desc: "Read PST, MBOX, EML, MSG, OST and 50+ formats without Outlook or any mail client installed.",
    items: ["No installation required for target app", "Full attachment preview", "Search within emails", "Print & export to PDF"],
  },
  convert: {
    title: "Convert between 150+ formats",
    desc: "Batch-convert thousands of emails with a single click. Keep folders, attachments, and metadata intact.",
    items: ["PST ↔ MBOX ↔ EML ↔ MSG", "Batch processing 10,000+ files", "Preserve folder hierarchy", "Zero data loss guarantee"],
  },
  migrate: {
    title: "Migrate email accounts seamlessly",
    desc: "Move emails between servers, clients, and cloud platforms with zero downtime or data loss.",
    items: ["Office 365 / Gmail / Exchange", "IMAP to IMAP migration", "Selective folder migration", "Real-time progress tracking"],
  },
  backup: {
    title: "Enterprise-grade email backup",
    desc: "Automate incremental backups of your entire mailbox. Restore any email in seconds.",
    items: ["Scheduled auto-backup", "Incremental & full backup", "AES-256 encryption", "One-click restore"],
  },
};

export default function Hero() {
  const [activeTab, setActiveTab] = useState("view");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => (c < 10 ? c + 1 : c));
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const content = tabContent[activeTab];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 dot-grid opacity-40" />

      {/* Gradient orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

      {/* Floating format badges */}
      {floatingEmails.map((item, i) => (
        <div
          key={i}
          className="absolute hidden lg:flex flex-col items-center gap-1 float"
          style={{
            top: item.top,
            left: item.left,
            right: (item as { right?: string }).right,
            animationDelay: item.delay,
          }}
        >
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}>
            {item.icon}
          </div>
          <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full shadow">
            {item.label}
          </span>
        </div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Trusted by 500,000+ IT professionals worldwide
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
          The Ultimate{" "}
          <span className="gradient-text">Email Management</span>
          <br />
          Software Suite
        </h1>

        <p className="text-center text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          View, convert, migrate, and backup emails across{" "}
          <strong className="text-slate-700">150+ formats</strong> — PST, MBOX,
          EML, MSG, OST, and more. No data loss. No technical expertise needed.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#pricing"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <Download className="w-5 h-5" />
            <span>Download Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-slate-700 font-semibold text-base rounded-2xl shadow-lg border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Play className="w-3.5 h-3.5 text-blue-600 group-hover:text-white transition-colors ml-0.5" />
            </div>
            Watch Demo
          </a>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Interactive tab product showcase */}
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl shadow-2xl shadow-slate-300/30 overflow-hidden border border-white/80">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-100/80 border-b border-slate-200/60">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-6 bg-white/60 rounded-lg flex items-center px-3 gap-2">
                <Mail className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">mailmigrate.pro — Email Suite</span>
              </div>
              <Shield className="w-4 h-4 text-green-500" />
            </div>

            {/* Tab bar */}
            <div className="flex bg-slate-50/80 border-b border-slate-200/60">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content area */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 bg-white/50 min-h-[280px]">
              {/* Left: text */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{content.title}</h3>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{content.desc}</p>
                <ul className="space-y-2.5">
                  {content.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                  Try {tabs.find((t) => t.id === activeTab)?.label} Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: animated preview */}
              <div className="md:w-56 flex flex-col gap-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Processing</div>
                {["inbox.pst", "archive.mbox", "emails.eml", "backup.ost"].map((file, i) => (
                  <div
                    key={file}
                    className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      i === 0 ? "bg-blue-500" : i === 1 ? "bg-violet-500" : i === 2 ? "bg-cyan-500" : "bg-emerald-500"
                    }`}>
                      {file.split(".")[1].toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">{file}</div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-violet-500 h-1 rounded-full transition-all duration-1000"
                          style={{ width: `${[100, 78, 45, 20][i]}%` }}
                        />
                      </div>
                    </div>
                    <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  </div>
                ))}
                <div className="mt-2 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-emerald-700 font-medium">3 files completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-8 text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-green-500" />
              <span>100% Secure & Private</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>No data sent to servers</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Free trial — no credit card</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
