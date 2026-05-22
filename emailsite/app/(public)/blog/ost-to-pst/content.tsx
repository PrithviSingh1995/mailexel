"use client";

import { useState } from "react";
import {
  Download, CheckCircle2, Shield, Star, Clock, Calendar,
  ChevronDown, ArrowRight, AlertTriangle, Info,
  Award, BookOpen, Zap, Lock, Eye, RefreshCw, HardDrive,
  FileText, User, ExternalLink, X, Check, List,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ── Helper Components ──────────────────────────────────────────────────────────

function WindowMockup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-md not-prose">
      <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
        <span className="ml-2 text-white/40 text-xs font-mono">{title}</span>
      </div>
      <div className="bg-gray-50">{children}</div>
    </div>
  );
}

function StepBadge({ num, title, desc, children }: { num: number; title: string; desc: string; children?: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-red-900/20">
        {num}
      </div>
      <div className="flex-1">
        <p className="font-bold text-black mb-0.5">{title}</p>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
        {children}
      </div>
    </div>
  );
}

function InfoBox({ type, children }: { type: "tip" | "warning" | "note"; children: React.ReactNode }) {
  const styles = {
    tip: { bg: "bg-green-50 border-green-200", icon: <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />, label: "Tip" },
    warning: { bg: "bg-amber-50 border-amber-200", icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />, label: "Warning" },
    note: { bg: "bg-blue-50 border-blue-200", icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />, label: "Note" },
  }[type];
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${styles.bg} my-5 not-prose`}>
      {styles.icon}
      <div className="text-sm text-gray-700 leading-relaxed">
        <strong className="font-bold">{styles.label}:</strong>{" "}{children}
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────────

const tocItems = [
  { id: "introduction", label: "Introduction" },
  { id: "what-is-ost", label: "What is an OST File?" },
  { id: "what-is-pst", label: "What is a PST File?" },
  { id: "ost-vs-pst", label: "OST vs PST Comparison" },
  { id: "reasons", label: "Reasons to Convert" },
  { id: "before-conversion", label: "Before You Convert" },
  { id: "manual-method", label: "Manual Method (Outlook)" },
  { id: "manual-limitations", label: "Limitations of Manual Method" },
  { id: "software-intro", label: "Professional Converter Solution" },
  { id: "software-features", label: "Software Features" },
  { id: "software-steps", label: "How to Convert Using Software" },
  { id: "comparison", label: "Manual vs Software Comparison" },
  { id: "without-outlook", label: "Convert Without Outlook" },
  { id: "import-pst", label: "How to Import PST into Outlook" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "security", label: "Security & Data Integrity" },
  { id: "use-cases", label: "Real-World Use Cases" },
  { id: "expert-tips", label: "Expert Tips" },
  { id: "faq", label: "Frequently Asked Questions" },
  { id: "conclusion", label: "Conclusion" },
];

const ostVsPst = [
  ["Full Name", "Offline Storage Table", "Personal Storage Table"],
  ["Server Connection", "Requires Exchange / Office 365", "No server needed — standalone"],
  ["Portability", "Non-portable (profile-locked)", "Fully portable"],
  ["Backup Use", "Not suitable", "Ideal for backups"],
  ["Open on Another PC", "No (orphaned without server)", "Yes, with any Outlook version"],
  ["Can Be Shared", "No", "Yes"],
  ["Corruption Risk", "Higher (profile-dependent)", "Lower"],
  ["Size Limit", "50 GB (Outlook 2019/365)", "50 GB (Outlook 2019/365)"],
  ["Default Location", "AppData\\Local\\Microsoft\\Outlook", "Documents\\Outlook Files"],
];

const manualVsSoftware = [
  ["Outlook Required", false, true],
  ["Exchange Connection", false, true],
  ["Orphaned OST Support", true, false],
  ["Batch Conversion", true, false],
  ["Preview Before Convert", true, false],
  ["Corrupted File Support", true, false],
  ["Processing Speed", "10,000+ emails/min", "Slow"],
  ["Folder Hierarchy", "100% preserved", "Partial"],
  ["Metadata Accuracy", "100%", "Partial"],
  ["Free Trial", true, "Built-in (free)"],
];

const faqs = [
  { q: "Can I convert OST to PST without Outlook installed?", a: "Yes. MailExel converts OST to PST without requiring Outlook or an active Exchange connection. The software works entirely offline on any Windows 7, 8, 10 or 11 machine." },
  { q: "Can I convert orphaned OST files that lost server connection?", a: "Yes, this is one of MailExel's key strengths. Orphaned OST files (disconnected from Exchange) cannot be exported via Outlook's built-in method, but MailExel reads them directly and converts them to PST without needing any server connection." },
  { q: "How long does it take to convert a large OST file?", a: "MailExel processes 10,000+ emails per minute. A typical 10 GB OST file with 50,000 emails converts in under 5 minutes. Processing time depends on file size, number of attachments, and hardware specifications." },
  { q: "Will all attachments and folder structure be preserved?", a: "Yes. MailExel preserves 100% of the email data including attachments, embedded images, folder hierarchy, metadata (to/from/date/subject), and email properties such as read/unread status and flags." },
  { q: "Is it safe to convert OST files? Will the original be modified?", a: "MailExel reads OST files in read-only mode and never modifies the source file. All processing happens locally on your machine — no data is uploaded to any cloud server. Your original OST file remains completely intact." },
  { q: "Can MailExel convert password-protected or encrypted OST files?", a: "MailExel can convert OST files encrypted with standard Exchange profile encryption. For OST files with additional password protection, you will need to provide the password before conversion." },
  { q: "What should I do if the OST file is corrupted?", a: "MailExel has built-in recovery capability for corrupted OST files. It can read and salvage emails from partially damaged files. For severe corruption, try running Microsoft's ScanOST.exe (available in older Outlook versions) or Inbox Repair Tool (scanpst.exe) before conversion." },
  { q: "Can I select specific folders to convert instead of the entire mailbox?", a: "Yes. MailExel lets you preview the complete folder tree before conversion and select specific folders — such as Inbox, Sent Items, or custom folders — rather than converting the entire mailbox." },
  { q: "Does the converted PST work with all versions of Outlook?", a: "Yes. MailExel creates PST files in Unicode format compatible with Outlook 2007, 2010, 2013, 2016, 2019, and Microsoft 365 on both 32-bit and 64-bit Windows systems." },
  { q: "What is the maximum OST file size that can be converted?", a: "MailExel has no hard limit on OST file size. It has been tested with files exceeding 100 GB. For very large files, ensure you have at least 2x the OST file size in free disk space for the output PST." },
  { q: "Can I convert multiple OST files at once?", a: "Yes. MailExel supports batch conversion, allowing you to add multiple OST files and convert them all in a single operation. This is particularly useful for IT administrators handling employee offboarding or server migrations." },
  { q: "Is there a free version of MailExel?", a: "Yes. MailExel offers a free trial that allows you to preview OST file contents and convert up to 25 emails per folder. There is no time limit and no credit card required. Upgrade to a paid license to remove conversion limits." },
];

const relatedArticles = [
  { title: "How to Convert PST to MBOX", href: "#" },
  { title: "How to Repair Corrupted OST File", href: "#" },
  { title: "How to Import PST into Outlook", href: "#" },
  { title: "How to Migrate Exchange to Office 365", href: "#" },
  { title: "How to Open OST File Without Outlook", href: "#" },
];

// ── Main Component ─────────────────────────────────────────────────────────────

export default function OstToPstContent() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="bg-black pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-white/70">OST to PST</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="px-3 py-1 bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-full">Email Conversion</span>
                <span className="px-3 py-1 bg-white/10 text-white/60 text-[11px] font-bold uppercase tracking-wider rounded-full">Step-by-Step Guide</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
                How to Convert OST to PST File — Complete Guide 2025
              </h1>

              <p className="text-white/60 text-lg leading-relaxed mb-6">
                Recover, migrate and backup your Outlook OST emails to a portable PST file — whether your Exchange server is accessible or not. Covers both manual and professional methods.
              </p>

              {/* Author / Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-7 border-t border-white/10 pt-5">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> MailExel Team</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated May 13, 2025</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 18 min read</span>
                <span className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  <span className="text-white/50 ml-1">4.8/5</span>
                </span>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-7">
                {[
                  { icon: <Shield className="w-3.5 h-3.5 text-green-400" />, text: "Virus & Ad Free" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />, text: "No Outlook Needed" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-white/60" />, text: "Windows 7–11" },
                  { icon: <Award className="w-3.5 h-3.5 text-amber-400" />, text: "Expert Reviewed" },
                ].map((b) => (
                  <span key={b.text} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    {b.icon}{b.text}
                  </span>
                ))}
              </div>

              <a href="#download" className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-red-900/40">
                <Download className="w-5 h-5" />
                Free Download — MailExel
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Hero visual */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
                <div className="bg-gray-900 px-4 py-2.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-white/40 text-xs">MailExel — OST to PST Converter v9.2</span>
                </div>
                <div className="bg-white p-5">
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-black">OST to PST Converter</div>
                      <div className="text-xs text-gray-400">Convert Outlook OST files to PST format</div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[
                      { name: "mailbox_john.ost", size: "4.2 GB", status: "converted" },
                      { name: "archive_2024.ost", size: "2.8 GB", status: "converting" },
                      { name: "backup_old.ost", size: "1.1 GB", status: "queued" },
                    ].map((f) => (
                      <div key={f.name} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="w-8 h-8 bg-gray-800 rounded-md flex items-center justify-center text-[9px] font-black text-white">OST</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-700 truncate">{f.name}</div>
                          <div className="text-[10px] text-gray-400">{f.size}</div>
                        </div>
                        {f.status === "converted" && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                        {f.status === "converting" && (
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                            <div className="w-2/3 h-full bg-red-500 rounded-full" />
                          </div>
                        )}
                        {f.status === "queued" && <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> 1 file converted successfully
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">100% accuracy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK ANSWER BOX ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto bg-red-50 border-l-4 border-red-600 rounded-r-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-600" />
              <span className="text-xs font-black text-red-600 uppercase tracking-wider">Quick Answer</span>
            </div>
            <p className="text-gray-800 text-base leading-relaxed">
              <strong>The easiest way to convert OST to PST</strong> is using <strong>MailExel</strong> — a dedicated converter that processes OST files in minutes, preserves all emails, attachments, and folder hierarchy, and works without Outlook or any Exchange connection. For users with Outlook installed and an active mailbox, the manual export via <em>File &gt; Open &amp; Export &gt; Import/Export</em> also works.
            </p>
          </div>
        </div>
      </section>

      {/* ── MAIN LAYOUT ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ══ MAIN CONTENT ════════════════════════════════════════════════════ */}
          <article className="flex-1 min-w-0">

            {/* ── Section 1: Introduction ────────────────────────────────────── */}
            <section id="introduction" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                An <strong>OST file</strong> (Offline Storage Table) is a local copy of your Microsoft Exchange or Office 365 mailbox that Outlook stores on your Windows PC. It allows you to work offline — reading and composing emails — and syncs when you reconnect to the server.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The problem begins when your connection to the Exchange server is severed. If you leave a company, your Exchange account is deleted, or your organization migrates to a different platform, your OST file becomes <strong>"orphaned"</strong> — you can see all your emails inside, but Outlook refuses to let you export them.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Converting OST to PST solves this problem. A PST file is portable, standalone, and can be opened by Outlook on any Windows machine without any server dependency. Once converted, your emails, calendar entries, contacts, and attachments are fully accessible and protected.
              </p>
              <InfoBox type="note">
                This guide covers both the <strong>manual export method</strong> (requires Outlook + active Exchange connection) and the <strong>professional software method</strong> (works with orphaned, disconnected, or corrupted OST files — no Outlook needed).
              </InfoBox>
            </section>

            {/* ── Section 2: What is OST ─────────────────────────────────────── */}
            <section id="what-is-ost" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                What is an OST File?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                An <strong>OST (Offline Storage Table)</strong> file is an offline cache file automatically created by Microsoft Outlook when you configure it with an Exchange Server, Office 365, or IMAP account with cached Exchange mode enabled.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Outlook mirrors your server mailbox to this local file so you can access emails, calendar, contacts, and tasks without an internet connection. Any changes you make offline are synchronized with the server the next time you connect.
              </p>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-5">
                <h3 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Key Facts About OST Files</h3>
                <ul className="space-y-2">
                  {[
                    ["Default Location", "C:\\Users\\[Username]\\AppData\\Local\\Microsoft\\Outlook\\"],
                    ["File Extension", ".ost"],
                    ["Created By", "Microsoft Outlook (Exchange / Office 365 / IMAP)"],
                    ["Default Size Limit", "50 GB in Outlook 2013 and later"],
                    ["Can Be Moved", "No — profile-locked to the creating PC"],
                    ["Accessible Without Server", "No — becomes orphaned when server connection is lost"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                      <span className="font-semibold text-gray-500 sm:w-48 flex-shrink-0">{k}</span>
                      <span className="text-gray-700 font-mono text-xs sm:text-sm">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <InfoBox type="warning">
                OST files are <strong>encrypted to your Windows profile</strong>. Simply copying an OST file to another machine and opening it in Outlook will not work — Outlook will refuse to open it. This is why a dedicated converter is required.
              </InfoBox>
            </section>

            {/* ── Section 3: What is PST ─────────────────────────────────────── */}
            <section id="what-is-pst" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                What is a PST File?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A <strong>PST (Personal Storage Table)</strong> file is Outlook's portable data file format. Unlike OST, a PST file is completely self-contained — it stores all your emails, calendar entries, contacts, tasks, and notes in a single file that can be moved, copied, and opened on any Windows machine running Outlook.
              </p>

              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-5">
                <h3 className="font-bold text-black mb-3 text-sm uppercase tracking-wider">Key Facts About PST Files</h3>
                <ul className="space-y-2">
                  {[
                    ["File Extension", ".pst"],
                    ["Default Location", "C:\\Users\\[Username]\\Documents\\Outlook Files\\"],
                    ["Server Required", "No — fully standalone"],
                    ["Portable", "Yes — copy to any machine"],
                    ["Password Protection", "Supported"],
                    ["Compatible With", "Outlook 2007 through Microsoft 365"],
                  ].map(([k, v]) => (
                    <li key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
                      <span className="font-semibold text-gray-500 sm:w-48 flex-shrink-0">{k}</span>
                      <span className="text-gray-700">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                PST files are the standard format for email archiving, backup, and portability. They are widely used by IT professionals for mailbox migration, long-term email archiving, and disaster recovery.
              </p>
            </section>

            {/* ── Section 4: OST vs PST Table ───────────────────────────────── */}
            <section id="ost-vs-pst" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                OST vs PST: Key Differences
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Understanding the differences between OST and PST helps you choose the right approach for your workflow.
              </p>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="text-left px-4 py-3 font-bold rounded-tl-2xl">Feature</th>
                      <th className="text-left px-4 py-3 font-bold">OST File</th>
                      <th className="text-left px-4 py-3 font-bold rounded-tr-2xl">PST File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ostVsPst.map(([feature, ost, pst], i) => (
                      <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-semibold text-gray-700">{feature}</td>
                        <td className="px-4 py-3 text-gray-600">{ost}</td>
                        <td className="px-4 py-3 text-gray-600">{pst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Section 5: Reasons ────────────────────────────────────────── */}
            <section id="reasons" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Why Do Users Need to Convert OST to PST?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                There are several common scenarios where converting OST to PST becomes necessary:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <X className="w-5 h-5 text-red-600" />, title: "Exchange Server Disconnection", desc: "Your Exchange profile was deleted, decommissioned, or you left an organization. The OST file is now orphaned and unexportable via Outlook." },
                  { icon: <HardDrive className="w-5 h-5 text-red-600" />, title: "Email Backup", desc: "Create a portable backup of your entire mailbox before a system reinstall, computer change, or as a disaster recovery precaution." },
                  { icon: <RefreshCw className="w-5 h-5 text-red-600" />, title: "Office 365 Migration", desc: "Moving from on-premise Exchange to Office 365 or another email platform and need to preserve historical email data." },
                  { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, title: "OST File Corruption", desc: "Convert a corrupted or damaged OST to a clean PST format while salvaging as much data as possible." },
                  { icon: <User className="w-5 h-5 text-red-600" />, title: "Employee Offboarding", desc: "IT teams preserving departed employee email archives before deprovisioning Exchange accounts and recovering server storage." },
                  { icon: <BookOpen className="w-5 h-5 text-red-600" />, title: "Legal & eDiscovery", desc: "Legal teams requiring portable email evidence in PST format for litigation, compliance, or regulatory audit purposes." },
                ].map((r) => (
                  <div key={r.title} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-red-200 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">{r.icon}</div>
                      <div>
                        <h3 className="font-bold text-black text-sm mb-1">{r.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{r.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 6: Before Conversion ─────────────────────────────── */}
            <section id="before-conversion" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Things to Know Before Converting OST to PST
              </h2>
              <ul className="space-y-3">
                {[
                  { bold: "Backup your OST file first.", text: "Always make a copy of the original OST file before attempting any conversion or repair operation." },
                  { bold: "OST files are profile-specific.", text: "An OST file created in one Windows user profile cannot be directly opened in another profile or PC." },
                  { bold: "Check available disk space.", text: "Ensure you have at least 2× the size of the OST file in free disk space to accommodate the output PST." },
                  { bold: "Manual export requires active Exchange.", text: "Outlook's built-in export only works when your Exchange/Office 365 account is active and accessible." },
                  { bold: "Large OST files take more time.", text: "Files exceeding 20 GB may take several minutes to convert even with fast hardware. Plan accordingly." },
                  { bold: "Corrupted OST may lose some data.", text: "In severely corrupted files, some emails near the corruption point may not be recoverable regardless of the method used." },
                ].map((item) => (
                  <li key={item.bold} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong className="text-black">{item.bold}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── Section 7: Manual Method ──────────────────────────────────── */}
            <section id="manual-method" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Manual Method: Export OST to PST Using Outlook
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Microsoft Outlook has a built-in Import/Export wizard that can export your mailbox to a PST file. This method works only when Outlook is connected to an active Exchange or Office 365 account.
              </p>

              <div className="space-y-0 mb-5">
                <StepBadge num={1} title="Open Microsoft Outlook" desc="Launch Outlook and ensure it is signed in to your Exchange or Office 365 account. Verify that your emails are synced and visible.">
                  <WindowMockup title="Microsoft Outlook">
                    <div className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800">Microsoft Outlook 2019</div>
                        <div className="text-[10px] text-green-600 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connected to Exchange Server</div>
                      </div>
                    </div>
                  </WindowMockup>
                </StepBadge>

                <StepBadge num={2} title='Click File → Open & Export → Import/Export' desc='In the top menu, click "File", then select "Open & Export" from the left panel, and click "Import/Export".' />

                <StepBadge num={3} title='Select "Export to a file"' desc='In the Import and Export Wizard dialog, choose "Export to a file" and click Next.'>
                  <WindowMockup title="Import and Export Wizard">
                    <div className="p-4 space-y-2">
                      {["Import from another program or file", "Import an iCalendar (.ics) or vCalendar file (.vcs)", "Export to a file", "Import RSS Feeds from an OPML file"].map((opt, i) => (
                        <div key={opt} className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs ${i === 2 ? "border-red-300 bg-red-50 font-semibold text-red-800" : "border-gray-100 text-gray-600"}`}>
                          <div className={`w-3 h-3 rounded-full border-2 ${i === 2 ? "border-red-500 bg-red-500" : "border-gray-300"}`} />
                          {opt}
                        </div>
                      ))}
                    </div>
                  </WindowMockup>
                </StepBadge>

                <StepBadge num={4} title='Choose "Outlook Data File (.pst)"' desc='In the "Export to a file" screen, select "Outlook Data File (.pst)" and click Next.' />

                <StepBadge num={5} title="Select folders to export" desc='Choose the mailbox or specific folders you want to export. Check "Include subfolders" to export nested folder structure.'>
                  <WindowMockup title="Export Outlook Data File">
                    <div className="p-4 space-y-1.5">
                      {[
                        { name: "Mailbox — John Smith", indent: 0, selected: true },
                        { name: "Inbox", indent: 1, selected: false },
                        { name: "Sent Items", indent: 1, selected: false },
                        { name: "Drafts", indent: 1, selected: false },
                        { name: "Deleted Items", indent: 1, selected: false },
                      ].map((f) => (
                        <div key={f.name} className={`flex items-center gap-2 p-2 rounded text-xs ${f.selected ? "bg-blue-50 border border-blue-200 font-semibold text-blue-800" : "text-gray-600"}`} style={{ marginLeft: f.indent * 16 }}>
                          <div className={`w-3.5 h-3.5 rounded-sm border ${f.selected ? "bg-blue-500 border-blue-500" : "border-gray-300"} flex items-center justify-center`}>
                            {f.selected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          {f.name}
                        </div>
                      ))}
                    </div>
                  </WindowMockup>
                </StepBadge>

                <StepBadge num={6} title="Choose output location and click Finish" desc="Browse to a destination folder, name the PST file, then click Finish. Outlook will begin exporting your emails." />
              </div>

              <InfoBox type="tip">
                For large mailboxes, use <strong>Replace duplicates with items exported</strong> option to avoid duplicate emails if you run the export multiple times.
              </InfoBox>
            </section>

            {/* ── Section 8: Limitations ────────────────────────────────────── */}
            <section id="manual-limitations" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Limitations of the Manual Outlook Method
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                While the manual Outlook export works in straightforward cases, it has significant limitations that prevent it from handling many real-world scenarios:
              </p>

              <div className="space-y-3">
                {[
                  { title: "Requires active Exchange connection", desc: "If your Exchange/Office 365 account is deleted or inaccessible, Outlook cannot export the OST. The OST becomes read-only and unexportable." },
                  { title: "Cannot convert orphaned OST files", desc: "An orphaned OST — disconnected from its original server — is completely inaccessible via Outlook export, even though you can see all the emails." },
                  { title: "No batch processing", desc: "Outlook exports one mailbox at a time. For IT admins managing dozens of user OST files, this is impractical." },
                  { title: "Slow for large mailboxes", desc: "Outlook's export engine is single-threaded. A 20 GB mailbox can take over an hour to export." },
                  { title: "No preview before export", desc: "You cannot inspect email content before exporting — there is no way to selectively include or exclude emails based on content." },
                  { title: "Fails on corrupted OST files", desc: "If the OST file is damaged or partially corrupted, the manual export either fails completely or creates an incomplete PST." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-black text-sm mb-0.5">{item.title}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 9: Software Intro ─────────────────────────────────── */}
            <section id="software-intro" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Professional Solution: MailExel OST to PST Converter
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>MailExel</strong> is a dedicated OST to PST converter that overcomes every limitation of the manual Outlook method. It reads OST files directly — regardless of whether they are connected to an Exchange server, orphaned, encrypted, or partially corrupted — and converts them to fully portable PST files.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5">
                The software runs completely offline on Windows 7 through 11. No Outlook installation is required, no Exchange connection is needed, and no data is sent to any cloud server during the conversion process.
              </p>

              <div className="bg-black rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-black text-lg">MailExel OST to PST Converter</div>
                    <div className="text-white/50 text-sm">Part of the MailExel Email Suite v9.2.1</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  {[["50+", "Formats"], ["10K+", "Emails/min"], ["100%", "Accuracy"], ["500K+", "Users"]].map(([v, l]) => (
                    <div key={l} className="text-center p-3 bg-white/5 rounded-xl">
                      <div className="text-xl font-black text-red-400">{v}</div>
                      <div className="text-white/40 text-xs">{l}</div>
                    </div>
                  ))}
                </div>
                <a href="#download" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all">
                  <Download className="w-4 h-4" /> Download Free Trial
                </a>
              </div>
            </section>

            {/* ── Section 10: Features ──────────────────────────────────────── */}
            <section id="software-features" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                MailExel Feature Highlights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "Converts Orphaned OST Files", desc: "No Exchange connection or active Outlook profile required." },
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "Batch Conversion", desc: "Add multiple OST files and convert them all in one operation." },
                  { icon: <Eye className="w-4 h-4 text-red-600" />, title: "Preview Before Converting", desc: "Browse emails, attachments, and folders before you convert." },
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "Corrupted OST Support", desc: "Recovers emails from partially damaged or corrupted OST files." },
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "100% Folder Hierarchy", desc: "All nested folders, subfolders, and structure preserved perfectly." },
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "Full Metadata Preservation", desc: "To, From, Date, CC, BCC, attachments, flags all preserved." },
                  { icon: <Lock className="w-4 h-4 text-red-600" />, title: "No Data Uploaded", desc: "100% offline — your emails never leave your machine." },
                  { icon: <CheckCircle2 className="w-4 h-4 text-red-600" />, title: "No Outlook Required", desc: "Works on any Windows machine with zero dependencies." },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-red-100 hover:shadow-sm transition-all">
                    <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                    <div>
                      <p className="font-bold text-black text-sm">{f.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 11: Software Steps ────────────────────────────────── */}
            <section id="software-steps" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                How to Convert OST to PST Using MailExel
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Follow these six steps to convert your OST file to PST using MailExel:
              </p>

              <StepBadge num={1} title="Download and Install MailExel" desc="Download the free trial from the link below and run the installer. Installation takes under a minute and requires no additional dependencies.">
                <div className="mt-3">
                  <a href="#download" className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-all">
                    <Download className="w-3.5 h-3.5" /> Download MailExel Free
                  </a>
                </div>
              </StepBadge>

              <StepBadge num={2} title="Launch and Select OST to PST Converter" desc='Open MailExel. On the main screen, select the "Email Converter" module, then choose "OST to PST" from the format options.'>
                <WindowMockup title="MailExel — Main Dashboard">
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {[
                      { label: "Email Converter", active: true },
                      { label: "Email Migration", active: false },
                      { label: "Email Backup", active: false },
                      { label: "Email Viewer", active: false },
                    ].map((m) => (
                      <div key={m.label} className={`p-3 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-all ${m.active ? "border-red-400 bg-red-50 text-red-700" : "border-gray-200 text-gray-500 bg-white"}`}>
                        {m.label}
                        {m.active && <div className="mt-1 text-[9px] text-red-500">● Selected</div>}
                      </div>
                    ))}
                  </div>
                </WindowMockup>
              </StepBadge>

              <StepBadge num={3} title="Add Your OST File" desc='Click "Add File" or drag and drop the OST file onto the MailExel window. You can add multiple OST files at once for batch conversion.' />

              <StepBadge num={4} title="Preview Emails and Select Folders" desc="MailExel loads the OST file and displays all emails and folders in a tree view. Browse and preview email content, attachments, and metadata before converting.">
                <WindowMockup title="MailExel — Email Preview">
                  <div className="p-4 flex gap-3">
                    <div className="w-36 flex-shrink-0 space-y-1">
                      {["📁 Inbox (3,421)", "📁 Sent Items", "📁 Drafts (12)", "📁 Deleted Items", "📁 Calendar"].map((f, i) => (
                        <div key={f} className={`text-[10px] px-2 py-1.5 rounded text-gray-600 ${i === 0 ? "bg-red-50 text-red-700 font-semibold" : "hover:bg-gray-100"}`}>{f}</div>
                      ))}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[
                        { from: "Sarah Miller", subj: "Q4 Report — Final Version", date: "May 12" },
                        { from: "IT Department", subj: "Password Reset Required", date: "May 10" },
                        { from: "John Davis", subj: "Meeting rescheduled to 3pm", date: "May 9" },
                      ].map((e) => (
                        <div key={e.subj} className="p-2 bg-white rounded border border-gray-100 text-[10px]">
                          <div className="font-semibold text-gray-800">{e.from} <span className="text-gray-400 font-normal float-right">{e.date}</span></div>
                          <div className="text-gray-500 truncate">{e.subj}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </WindowMockup>
              </StepBadge>

              <StepBadge num={5} title="Set Output Destination" desc='Click "Browse" to choose where the converted PST file will be saved. Name your output file and ensure the destination has sufficient free space.' />

              <StepBadge num={6} title="Click Convert and Wait" desc="Click the Convert button. MailExel processes at 10,000+ emails per minute. A progress bar shows real-time status. When complete, a summary report is displayed.">
                <WindowMockup title="MailExel — Conversion Progress">
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 font-semibold">Converting: mailbox_john.ost → mailbox_john.pst</span>
                      <span className="text-red-600 font-bold">78%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: "78%" }} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-500">
                      <div><span className="font-bold text-black">25,321</span> emails converted</div>
                      <div><span className="font-bold text-black">1m 48s</span> elapsed</div>
                      <div><span className="font-bold text-black">~30s</span> remaining</div>
                    </div>
                  </div>
                </WindowMockup>
              </StepBadge>

              <InfoBox type="tip">
                After conversion, use <strong>MailExel's free Email Viewer</strong> to open and verify the PST file contents before importing into Outlook.
              </InfoBox>
            </section>

            {/* ── Section 12: Comparison Table ─────────────────────────────── */}
            <section id="comparison" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Manual Method vs MailExel: Side-by-Side Comparison
              </h2>

              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="text-left px-4 py-3 font-bold rounded-tl-2xl">Feature</th>
                      <th className="text-center px-4 py-3 font-bold text-red-400">MailExel</th>
                      <th className="text-center px-4 py-3 font-bold rounded-tr-2xl">Manual (Outlook)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Outlook Required", true, false],
                      ["Exchange Connection", true, false],
                      ["Orphaned OST Support", true, false],
                      ["Batch Conversion", true, false],
                      ["Preview Before Convert", true, false],
                      ["Corrupted OST Support", true, false],
                      ["Folder Hierarchy Preserved", true, false],
                      ["100% Metadata Accuracy", true, false],
                      ["No Technical Skill Needed", true, false],
                    ].map(([label, soft, manual], i) => (
                      <tr key={String(label)} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-3 font-semibold text-gray-700">{label}</td>
                        <td className="px-4 py-3 text-center">
                          {soft ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {manual ? <Check className="w-4 h-4 text-green-500 mx-auto" /> : <X className="w-4 h-4 text-red-400 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Section 13: Without Outlook ───────────────────────────────── */}
            <section id="without-outlook" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                How to Convert OST to PST Without Outlook
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Many users need to convert OST files on a machine where Outlook is not installed — for example, a new laptop, a forensic workstation, or a clean Windows environment. MailExel is the best solution for this scenario.
              </p>
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-black mb-3">Steps to convert without Outlook:</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">1</span>Download and install MailExel on the machine (no Outlook installation needed).</li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">2</span>Copy the OST file from the original machine (found at <code className="bg-gray-200 px-1 rounded text-xs">AppData\Local\Microsoft\Outlook\</code>).</li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">3</span>Open MailExel and load the OST file using "Add File".</li>
                  <li className="flex items-start gap-2"><span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center mt-0.5">4</span>Select PST as the output format, choose the destination, and click Convert.</li>
                </ol>
              </div>
              <InfoBox type="note">
                MailExel is a standalone Windows application (5.8 MB installer) with no external dependencies. It does not require .NET Framework, Outlook, or Exchange.
              </InfoBox>
            </section>

            {/* ── Section 14: Import PST ────────────────────────────────────── */}
            <section id="import-pst" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                How to Import the Converted PST into Outlook
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Once you have your PST file, follow these steps to open and use it in Outlook:
              </p>
              <div className="space-y-0">
                <StepBadge num={1} title="Open Microsoft Outlook" desc="Launch Outlook on your Windows PC." />
                <StepBadge num={2} title="Go to File → Open & Export → Import/Export" desc="Click the File menu, select Open & Export from the left panel, then click Import/Export." />
                <StepBadge num={3} title='Select "Import from another program or file"' desc='Choose this option in the Import and Export Wizard and click Next.' />
                <StepBadge num={4} title='Choose "Outlook Data File (.pst)"' desc='Select Outlook Data File (.pst) from the file type list and click Next.' />
                <StepBadge num={5} title="Browse to the PST file location" desc='Click Browse, navigate to the PST file you converted, and select your preferred duplicate handling option.' />
                <StepBadge num={6} title="Select import destination and click Finish" desc='Choose "Import items into the same folder" or select a specific destination mailbox folder. Click Finish.' />
              </div>
              <InfoBox type="tip">
                Alternatively, in Outlook you can drag the PST file directly from File Explorer onto the Outlook window to open it as a linked data file without fully importing it.
              </InfoBox>
            </section>

            {/* ── Section 15: Troubleshooting ───────────────────────────────── */}
            <section id="troubleshooting" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Troubleshooting Common OST to PST Conversion Issues
              </h2>
              <div className="space-y-4">
                {[
                  { problem: "OST file not found / cannot locate the file", solution: "Check the default location: C:\\Users\\[Username]\\AppData\\Local\\Microsoft\\Outlook\\. The AppData folder is hidden by default — enable \"Show hidden items\" in File Explorer > View." },
                  { problem: "\"The file is in use\" error when loading OST", solution: "Close Outlook completely (including from the system tray) before loading the OST file in MailExel. OST files are locked when Outlook is running." },
                  { problem: "Conversion progress stops or freezes", solution: "This usually indicates a corrupted section in the OST file. Use MailExel's skip-error mode to continue past the damaged area. You may lose emails in the corrupted region." },
                  { problem: "Converted PST won't open in Outlook", solution: "Ensure you are using a version of Outlook compatible with the PST format (Unicode PST requires Outlook 2003 or later). If the file exceeds 50 GB, Outlook 2010 and earlier may refuse to open it." },
                  { problem: "Attachments missing from converted emails", solution: "Verify that the \"Include attachments\" option was enabled during conversion. If attachments are still missing, the original OST may have had incomplete sync — some attachments may not have downloaded from the server before disconnection." },
                  { problem: "Duplicate emails in the converted PST", solution: "If you run the conversion multiple times, duplicates can accumulate. Use Outlook's built-in Remove Duplicates tool or a third-party PST deduplication utility after conversion." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border-b border-amber-100">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span className="font-bold text-sm text-gray-800">{item.problem}</span>
                    </div>
                    <div className="px-4 py-3 bg-white">
                      <p className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {item.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 16: Security ──────────────────────────────────────── */}
            <section id="security" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Security & Data Integrity
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                Email data is sensitive. Before using any conversion tool, understand how it handles your data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {[
                  { icon: <Lock className="w-5 h-5 text-red-600" />, title: "Read-Only Processing", desc: "MailExel opens OST files in read-only mode. The source file is never modified, written to, or deleted." },
                  { icon: <Shield className="w-5 h-5 text-red-600" />, title: "100% Offline", desc: "All conversion happens locally. No emails, metadata, or file contents are transmitted to any server or cloud service." },
                  { icon: <CheckCircle2 className="w-5 h-5 text-red-600" />, title: "Metadata Preserved", desc: "Every email property is preserved: sender, recipient, date/time, subject, read/unread status, flags, and priority." },
                  { icon: <Award className="w-5 h-5 text-red-600" />, title: "GDPR Compliant", desc: "Because no data leaves your machine, MailExel is fully compliant with GDPR, HIPAA, and other data privacy regulations." },
                ].map((s) => (
                  <div key={s.title} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">{s.icon}</div>
                    <div>
                      <p className="font-bold text-black text-sm">{s.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 17: Use Cases ─────────────────────────────────────── */}
            <section id="use-cases" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Real-World Use Cases
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Enterprise Exchange to Office 365 Migration", scenario: "An IT team at a 500-person company is migrating from on-premise Exchange Server to Office 365. Before decommissioning the Exchange server, they need to export all employee mailboxes as PST files for archiving and compliance purposes. MailExel's batch conversion processes all OST files simultaneously, completing the task in hours instead of days." },
                  { title: "Employee Offboarding & Data Retention", scenario: "HR policy requires preserving the email archive of departing employees for 7 years. The IT admin uses MailExel to convert each departing employee's OST file to PST within minutes of account deprovisioning, before the Exchange mailbox is deleted." },
                  { title: "Laptop Replacement & Email Recovery", scenario: "A sales manager's laptop is replaced after hardware failure. The old hard drive is recovered, and the OST file is extracted from the AppData folder. Because the Exchange account had already been moved to Office 365, the OST is orphaned. MailExel converts it to PST on the new laptop without any Exchange access." },
                  { title: "Legal eDiscovery", scenario: "A law firm needs to produce email evidence from a former employee's mailbox. The employee's Exchange account was deleted 2 months ago, but IT preserved the OST file. MailExel converts it to PST for import into the firm's eDiscovery platform." },
                ].map((uc) => (
                  <div key={uc.title} className="p-5 bg-gray-50 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-black mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full" />
                      {uc.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{uc.scenario}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 18: Expert Tips ───────────────────────────────────── */}
            <section id="expert-tips" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Expert Tips for OST to PST Conversion
              </h2>
              <div className="space-y-3">
                {[
                  { num: "01", tip: "Verify OST integrity first", detail: "Before converting, run Microsoft's ScanPST.exe (Inbox Repair Tool) on the OST file if you suspect corruption. It can fix minor issues that might otherwise interrupt conversion." },
                  { num: "02", tip: "Allocate sufficient disk space", detail: "The converted PST can be up to 2× the size of the OST file due to index structures. Ensure your destination drive has at least 3× the OST file size free." },
                  { num: "03", tip: "Split large PST files", detail: "PST files over 20 GB perform poorly in Outlook. If your OST is large, convert it to multiple smaller PST files by selecting specific folder groups during conversion." },
                  { num: "04", tip: "Password-protect sensitive PSTs", detail: "After conversion, add a password to PST files containing sensitive HR, legal, or financial emails. In Outlook, right-click the PST in the folder pane and choose Data File Properties > Change Password." },
                  { num: "05", tip: "Document the conversion process", detail: "For compliance and audit purposes, save the conversion summary report generated by MailExel. It includes file hash values, email count, date/time, and conversion status." },
                  { num: "06", tip: "Verify the output before archiving", detail: "After conversion, open the PST in MailExel's Email Viewer or Outlook to spot-check a sample of emails and verify that attachments, folder structure, and metadata are intact." },
                ].map((t) => (
                  <div key={t.num} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-red-100 hover:shadow-sm transition-all">
                    <span className="text-2xl font-black text-gray-100 leading-none flex-shrink-0 select-none">{t.num}</span>
                    <div>
                      <p className="font-bold text-black text-sm">{t.tip}</p>
                      <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{t.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Section 19: FAQ ───────────────────────────────────────────── */}
            <section id="faq" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-2">
                {faqs.map((item, i) => (
                  <AccordionItem value={`faq-${i}`} key={i} className="border border-gray-200 rounded-xl px-4 py-1 bg-white">
                    <AccordionTrigger className="text-left text-sm font-semibold text-black hover:no-underline hover:text-red-700 py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-4">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* ── Section 20: Conclusion ────────────────────────────────────── */}
            <section id="conclusion" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-4 pb-3 border-b-2 border-gray-100">
                Conclusion
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Converting OST to PST is essential for anyone dealing with orphaned Outlook data, Exchange server migrations, employee offboarding, or general email backup needs. The manual Outlook method works in ideal conditions, but fails the moment your Exchange connection is gone.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>MailExel</strong> provides a reliable, fast, and completely offline solution that handles every scenario the manual method cannot — orphaned OST, corrupted files, batch conversion, and conversion without Outlook. The free trial lets you verify your OST file and convert up to 25 emails per folder before committing to a purchase.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Download the free trial today, convert your OST file in minutes, and have full, portable access to your email archive in a universal PST format.
              </p>
            </section>

            {/* ── EEAT: Author Bio ──────────────────────────────────────────── */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-black">MailExel Technical Team</span>
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full">Expert Reviewed</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    This guide was written and reviewed by the MailExel technical team — software engineers and email specialists with over 10 years of experience in email conversion, migration, and forensic analysis tools. <strong>Last reviewed: May 13, 2025.</strong>
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Published Jan 15, 2025</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Updated May 13, 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Internal Linking ─────────────────────────────────────────── */}
            <div className="border border-gray-200 rounded-2xl p-6 mb-8 bg-white">
              <h3 className="font-black text-black mb-4 flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-red-600" /> Related Guides
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { title: "How to Convert PST to MBOX", desc: "Migrate Outlook emails to Thunderbird, Apple Mail, or Gmail." },
                  { title: "How to Repair Corrupted PST File", desc: "Fix damaged PST files and recover lost emails." },
                  { title: "How to Open OST File Without Outlook", desc: "View OST contents without any email client installed." },
                  { title: "How to Migrate Exchange to Office 365", desc: "Step-by-step Exchange to O365 migration guide." },
                  { title: "How to Import PST into Gmail", desc: "Convert and upload Outlook PST to your Gmail account." },
                  { title: "How to Backup Outlook Emails", desc: "Schedule automated PST backups with AES-256 encryption." },
                ].map((link) => (
                  <a key={link.title} href="#" className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-red-50 hover:border-red-100 border border-transparent transition-all group">
                    <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                    <div>
                      <p className="text-sm font-semibold text-black group-hover:text-red-700">{link.title}</p>
                      <p className="text-xs text-gray-400">{link.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </article>

          {/* ══ SIDEBAR ═════════════════════════════════════════════════════ */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-5">

              {/* Download CTA Card */}
              <div className="bg-black rounded-2xl p-5 text-white">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center mb-3">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-white text-base mb-1">Download MailExel Free</h3>
                <p className="text-white/50 text-xs mb-4 leading-relaxed">
                  Convert OST to PST in minutes. No credit card. No Outlook needed.
                </p>
                <a href="#download" className="block w-full text-center py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all mb-3">
                  Free Download
                </a>
                <div className="space-y-1.5 text-xs text-white/40">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" /> Windows 7, 8, 10, 11</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-400" /> 5.8 MB · v9.2.1</div>
                  <div className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-green-400" /> Virus &amp; Ad Free</div>
                </div>
              </div>

              {/* Rating Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-black text-sm">User Rating</span>
                  <span className="text-2xl font-black text-black">4.8</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-gray-400">Based on 1,842 verified reviews</p>
              </div>


            </div>
          </aside>

        </div>
      </div>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section id="download" className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs text-white/60 font-bold uppercase tracking-wider mb-5">
            #1 OST to PST Converter
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to Convert Your OST File?
          </h2>
          <p className="text-white/50 text-lg mb-8 max-w-2xl mx-auto">
            Download MailExel free — process your OST file in minutes. No Outlook, no Exchange connection, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href="#" className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl transition-all shadow-xl shadow-red-900/40">
              <Download className="w-5 h-5" />
              Download Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#faq" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/15 text-white font-semibold text-base rounded-xl hover:bg-white/10 transition-all">
              Read the FAQ
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-5 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-400" />Virus &amp; Ad Free</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-white/50" />No Credit Card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-white/50" />Windows 7–11</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-white/50" />100% Offline</span>
            <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-amber-400" />4.8★ Rated</span>
          </div>
        </div>
      </section>

      {/* ── FLOATING TABLE OF CONTENTS ────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
        {/* Panel — slides up when open */}
        <div
          className={`mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl shadow-black/20 border border-gray-200 overflow-hidden transition-all duration-300 origin-bottom ${
            tocOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-red-500" />
              <span className="text-white font-bold text-sm">Table of Contents</span>
            </div>
            <button
              onClick={() => setTocOpen(false)}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Links */}
          <nav className="max-h-[60vh] overflow-y-auto py-2">
            {tocItems.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setTocOpen(false)}
                className="group flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors"
              >
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-gray-100 group-hover:bg-red-600 flex items-center justify-center text-[9px] font-black text-gray-400 group-hover:text-white transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-gray-600 group-hover:text-red-700 font-medium leading-tight">
                  {item.label}
                </span>
                <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-red-400 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            ))}
          </nav>

          {/* Footer note */}
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] text-gray-400 text-center">{tocItems.length} sections · click any to jump</p>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-full font-bold text-sm shadow-xl transition-all duration-200 active:scale-95 ${
            tocOpen
              ? "bg-gray-800 text-white shadow-black/30 hover:bg-black"
              : "bg-black text-white shadow-black/30 hover:bg-gray-800"
          }`}
          aria-label="Toggle table of contents"
        >
          {tocOpen
            ? <X className="w-4 h-4" />
            : <List className="w-4 h-4" />
          }
          {tocOpen ? "Close" : "Contents"}
          {!tocOpen && (
            <span className="flex items-center justify-center w-5 h-5 bg-red-600 rounded-full text-[10px] font-black">
              {tocItems.length}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
