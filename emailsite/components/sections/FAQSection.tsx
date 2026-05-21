"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, FileQuestion, Shield, Zap, Globe } from "lucide-react";

const faqs = [
  { id: "1", icon: FileQuestion, title: "What email formats does MailExel support?", sub: "PST, MBOX, EML, MSG, OST, NSF and 50+ more", content: "MailExel supports 50+ email formats including PST, OST, MBOX, EML, MSG, EMLX, MBX, DBX, TBB, NSF and many more. Export targets include PDF, HTML, RTF, TXT and CSV documents, plus direct delivery to cloud platforms like Gmail, Office 365, Exchange, Yahoo, Zoho, IMAP and POP3." },
  { id: "2", icon: Shield, title: "Do I need Outlook installed to open PST or OST files?", sub: "No — completely standalone, no dependencies", content: "No. MailExel opens PST, OST and all supported formats independently — no Outlook, no Exchange, no email client required. This makes it ideal for forensic analysis, migration projects and archival work on any Windows 7–11 machine." },
  { id: "3", icon: Zap, title: "How fast is the conversion and migration?", sub: "10,000+ emails processed per minute", content: "MailExel's multi-threaded engine processes 10,000+ emails per minute depending on your hardware. A typical 10GB PST file with 50,000 emails converts in under 5 minutes. Batch processing handles unlimited files simultaneously with no slowdown." },
  { id: "4", icon: Shield, title: "Is my data secure? Does anything get uploaded to the cloud?", sub: "100% offline — nothing ever leaves your machine", content: "Your data never leaves your machine. MailExel is a fully offline desktop application — no files, emails or metadata are uploaded anywhere. AES-256 encryption is available for all backup files. Works completely without an internet connection after installation." },
  { id: "5", icon: Globe, title: "Can I migrate directly between email servers?", sub: "Office 365, Gmail, Exchange, IMAP and more", content: "Yes. The Migration module supports direct server-to-server migration between Office 365, Gmail, Exchange, IMAP and POP3. Delta sync transfers only emails added since the last sync, saving time and bandwidth. Selective folder migration lets you choose exactly what moves." },
  { id: "6", icon: HelpCircle, title: "Does MailExel work on Windows 10 and 11?", sub: "Supports Windows 7, 8, 10 and 11 (32 & 64-bit)", content: "Yes. MailExel is fully compatible with Windows 7, 8, 10 and 11 on both 32-bit and 64-bit systems. No additional runtime or framework is required. The free trial lets you process up to 25 emails per file with no time limit and no credit card." },
  { id: "7", icon: Mail, title: "What support options are available?", sub: "Email, chat and phone support available", content: "Free users get community forum access. The Professional plan includes email support with 24-hour response times. The Enterprise plan adds priority phone and live chat support plus a dedicated account manager available Monday–Friday." },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            Frequently asked{" "}
            <span className="text-gray-400">questions</span>
          </h2>
          <p className="text-lg text-gray-500">
            Can&apos;t find what you need?{" "}
            <a href="#" className="text-red-600 hover:underline font-semibold">Chat with our team</a>.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="1">
          {faqs.map((item) => (
            <AccordionItem value={item.id} key={item.id} className="py-1 border-gray-200">
              <AccordionTrigger className="flex flex-1 items-center justify-between py-3 text-left text-[15px] font-semibold leading-6 hover:no-underline">
                <span className="flex items-center gap-3.5">
                  <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50">
                    <item.icon size={16} className="text-red-500" />
                  </span>
                  <span className="flex flex-col space-y-0.5">
                    <span className="text-black">{item.title}</span>
                    {item.sub && <span className="text-sm font-normal text-gray-400">{item.sub}</span>}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="ms-3 pb-3 ps-[3.25rem] text-gray-500 leading-relaxed">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-black rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-white/60 text-sm mb-5">Our expert support team is available Monday–Friday, 9am–6pm EST.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors">Email Support</a>
            <a href="#" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/15 transition-colors">Live Chat</a>
          </div>
        </div>
      </div>
    </section>
  );
}
