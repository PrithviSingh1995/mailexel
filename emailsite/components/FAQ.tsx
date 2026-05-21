"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "What email formats does MailExel support?",
    a: "MailExel supports 150+ email formats including PST, OST, MBOX, EML, MSG, EMLX, MBX, DBX, TBB, NSF, and many more. It also supports document export formats like PDF, HTML, RTF, TXT, CSV, and cloud platforms like Gmail, Office 365, Yahoo, and Zoho.",
  },
  {
    q: "Can I convert emails without losing data?",
    a: "Absolutely. Our conversion engine uses mathematically verified algorithms to ensure 100% data accuracy. Every email field — headers, body, attachments, metadata, folder structure, and read/unread status — is preserved exactly as-is.",
  },
  {
    q: "Do I need Outlook installed to open PST files?",
    a: "No. MailExel's Email Viewer opens PST, OST, and all other formats completely independently — no Outlook, no Exchange, no email client required. This makes it perfect for forensic analysis, migration, and archiving.",
  },
  {
    q: "How fast is the batch conversion?",
    a: "Our multi-threaded engine can process 10,000+ emails per minute depending on your hardware. A typical 10GB PST file with 50,000 emails converts in under 5 minutes.",
  },
  {
    q: "Is my data secure? Do you upload anything to your servers?",
    a: "Your data never leaves your machine. MailExel is a fully offline desktop application. No files, emails, or metadata are uploaded to our servers. AES-256 encryption is available for backup files.",
  },
  {
    q: "Can I migrate directly between email servers?",
    a: "Yes. The Migration module supports direct server-to-server migration between Office 365, Gmail, Exchange, IMAP, and POP3 servers. You can also do IMAP to IMAP migrations with delta sync support.",
  },
  {
    q: "What operating systems are supported?",
    a: "MailExel runs on Windows 10/11 (32-bit and 64-bit). A macOS version is currently in beta testing. Linux support is available via our Enterprise plan with custom deployment.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! The free trial lets you view and convert up to 25 emails per file with no time limit and no credit card required. Simply download and install — you can upgrade to a paid plan at any time.",
  },
  {
    q: "Do you offer volume licensing or site licenses?",
    a: "Yes. The Enterprise plan includes unlimited team members. We also offer custom volume pricing for 10+ seats. Contact our sales team for a quote tailored to your organization's needs.",
  },
  {
    q: "What kind of support do you offer?",
    a: "Free users get community forum access. Professional plan includes email support with 24-hour response times. Enterprise plan includes priority phone and live chat support plus a dedicated account manager.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="text-lg text-slate-500">
            Everything you need to know. Can&apos;t find the answer?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Chat with support
            </a>
            .
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "border-blue-200 bg-blue-50/50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className={`font-semibold text-base transition-colors ${isOpen ? "text-blue-700" : "text-slate-800"}`}>
                    {faq.q}
                  </span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen ? "bg-blue-600 rotate-0" : "bg-slate-100 rotate-0"
                  }`}>
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-3xl shadow-xl shadow-blue-500/20">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-blue-100 text-sm mb-5">
            Our expert support team is available Monday–Friday, 9am–6pm EST.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="px-6 py-3 bg-white text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow">
              Email Support
            </a>
            <a href="#" className="px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors">
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
