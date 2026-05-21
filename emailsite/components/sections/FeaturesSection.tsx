"use client";

import { motion } from "framer-motion";
import { Eye, ArrowLeftRight, RefreshCw, HardDrive, CheckCircle2, ArrowRight } from "lucide-react";

const mainFeatures = [
  {
    icon: ArrowLeftRight,
    title: "Email Converter",
    badge: "Core Tool",
    desc: "Convert emails between PST, MBOX, EML, MSG, OST and 50+ formats with full metadata, folder structure and attachment integrity preserved.",
    items: [
      "PST → MBOX / EML / MSG / PDF",
      "Batch convert unlimited files",
      "Preserve folder hierarchy",
      "100% metadata accuracy",
    ],
  },
  {
    icon: RefreshCw,
    title: "Email Migration",
    badge: "Cloud Ready",
    desc: "Migrate entire mailboxes to Office 365, Gmail, Yahoo, Zoho, Thunderbird or Exchange Server — directly, with zero downtime.",
    items: [
      "Office 365 ↔ Gmail ↔ Exchange",
      "IMAP to IMAP migration",
      "Selective folder migration",
      "Delta sync & scheduling",
    ],
  },
  {
    icon: HardDrive,
    title: "Email Backup",
    badge: "Secure",
    desc: "Schedule AES-256 encrypted incremental backups of your entire mailbox. Restore any individual email or full folder in seconds.",
    items: [
      "Automated scheduled backup",
      "AES-256 encryption",
      "Incremental — saves bandwidth",
      "One-click restore",
    ],
  },
  {
    icon: Eye,
    title: "Email Viewer",
    badge: "Free",
    desc: "Open and preview PST, OST, MBOX, EML, MSG and 50+ formats instantly — no Outlook installation or email client required.",
    items: [
      "No Outlook required",
      "Full attachment preview",
      "Advanced search & filtering",
      "Export before converting",
    ],
  },
];

const highlights = [
  { stat: "50+", label: "Supported Formats" },
  { stat: "10K+", label: "Emails per Minute" },
  { stat: "100%", label: "Data Accuracy" },
  { stat: "500K+", label: "Users Worldwide" },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative w-full bg-white py-24 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 dot-grid-light opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-5">
            All-in-One Email Suite
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-5 tracking-tight">
            Four tools.{" "}
            <span className="text-gray-400">
              One software.
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Convert, migrate, backup and view emails — everything you need in a single offline Windows application built for IT professionals and everyday users.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {mainFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-7 rounded-3xl bg-white border-2 border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-5 right-5 px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-wider rounded-full">
                  {feat.badge}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center mb-5 shadow-lg shadow-red-900/20 group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-2">{feat.title}</h3>
                <p className="text-sm text-gray-500 mb-5 leading-relaxed">{feat.desc}</p>
                <ul className="space-y-2">
                  {feat.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Stats strip */}
        <div className="bg-black rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {highlights.map((h) => (
              <div key={h.label} className="text-center">
                <div className="text-4xl font-black text-white mb-1">{h.stat}</div>
                <div className="text-sm text-white/50">{h.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center border-t border-white/10 pt-8">
            <p className="text-white/60 text-sm mb-5 max-w-lg mx-auto">
              Works entirely offline on Windows 7, 8, 10 &amp; 11. No cloud. No subscription. Just install and run.
            </p>
            <a href="#download" className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-black text-sm font-bold rounded-xl transition-all">
              Download Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
