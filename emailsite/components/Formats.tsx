"use client";
import { useState } from "react";
import { ArrowLeftRight, CheckCircle2 } from "lucide-react";

const categories = [
  {
    label: "All Formats",
    id: "all",
    formats: [
      "PST", "OST", "MBOX", "EML", "MSG", "EMLX", "MBX", "DBX", "TBB",
      "NSF", "GRP", "PMM", "OFT", "VCF", "ICS", "MHT", "HTML", "PDF",
      "RTF", "TXT", "CSV", "XPS", "TIFF", "DOC", "DOCX", "ZIP", "RAR",
      "7Z", "TAR", "EDB", "STM", "HSH", "TNEF", "BKF", "OAB",
    ],
  },
  {
    label: "MS Outlook",
    id: "outlook",
    formats: ["PST", "OST", "MSG", "OFT", "EDB", "STM", "PAB", "NK2"],
  },
  {
    label: "Open Source",
    id: "open",
    formats: ["MBOX", "EML", "EMLX", "MBX", "TBB", "DBX", "MHT"],
  },
  {
    label: "Cloud/IMAP",
    id: "cloud",
    formats: ["Gmail", "Office 365", "Exchange", "Yahoo", "Zoho", "IMAP", "POP3"],
  },
  {
    label: "Document",
    id: "doc",
    formats: ["PDF", "HTML", "RTF", "TXT", "CSV", "XPS", "TIFF", "DOC", "DOCX", "MHT"],
  },
];

const popularConversions = [
  { from: "PST", to: "MBOX", desc: "Outlook to Thunderbird" },
  { from: "MBOX", to: "PST", desc: "Thunderbird to Outlook" },
  { from: "PST", to: "PDF", desc: "Email to document" },
  { from: "OST", to: "PST", desc: "Offline to portable" },
  { from: "EML", to: "MSG", desc: "RFC to Outlook" },
  { from: "PST", to: "EML", desc: "Outlook to universal" },
  { from: "MSG", to: "PDF", desc: "Message to PDF" },
  { from: "MBOX", to: "EML", desc: "Split mailbox" },
];

const formatColors: Record<string, string> = {
  PST: "from-blue-500 to-blue-600",
  OST: "from-blue-400 to-cyan-500",
  MBOX: "from-violet-500 to-violet-600",
  EML: "from-cyan-500 to-cyan-600",
  MSG: "from-orange-500 to-orange-600",
  PDF: "from-red-500 to-red-600",
  HTML: "from-amber-500 to-amber-600",
  NSF: "from-yellow-600 to-amber-600",
  default: "from-slate-400 to-slate-500",
};

function getColor(fmt: string) {
  return formatColors[fmt] || formatColors.default;
}

export default function Formats() {
  const [activeCategory, setActiveCategory] = useState("all");

  const active = categories.find((c) => c.id === activeCategory)!;

  return (
    <section id="formats" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Supported Formats
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            <span className="gradient-text">150+ email formats</span> supported
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Every major email client, server, and cloud platform — plus document export formats. If it stores email, we support it.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
              <span className={`ml-1.5 text-xs ${activeCategory === cat.id ? "text-blue-100" : "text-slate-400"}`}>
                ({cat.formats.length})
              </span>
            </button>
          ))}
        </div>

        {/* Format grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 min-h-[120px]">
          {active.formats.map((fmt) => (
            <div
              key={fmt}
              className={`format-badge inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm cursor-default`}
            >
              <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${getColor(fmt)} flex items-center justify-center`}>
                <span className="text-[8px] font-black text-white leading-none">{fmt.slice(0, 2)}</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">{fmt}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          ))}
        </div>

        {/* Popular conversions */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">Most popular conversions</h3>
            <p className="text-slate-400 text-sm">Click any conversion to get started instantly</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularConversions.map((conv, i) => (
              <button
                key={i}
                className="group p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold text-white rounded-lg bg-gradient-to-r ${getColor(conv.from)}`}>
                    {conv.from}
                  </span>
                  <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold text-white rounded-lg bg-gradient-to-r ${getColor(conv.to)}`}>
                    {conv.to}
                  </span>
                </div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{conv.desc}</div>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
            >
              View all 150+ conversions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
