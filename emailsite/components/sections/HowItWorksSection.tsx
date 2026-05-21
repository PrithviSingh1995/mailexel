"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Settings2, CheckCircle2, Send } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FolderOpen,
    title: "Load Your Email Source",
    desc: "Select PST, MBOX, EML, MSG, OST or NSF files via drag & drop, or connect directly to Gmail, Outlook, Office 365, Exchange or any IMAP server.",
    preview: [
      { name: "mailbox.pst", type: "PST", size: "3.8 GB" },
      { name: "backup.mbox", type: "MBX", size: "1.2 GB" },
      { name: "archive.ost", type: "OST", size: "2.1 GB" },
    ],
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configure Your Options",
    desc: "Choose your target format or destination. Apply date range, folder, sender or subject filters. Set encryption, scheduling and naming options.",
    filters: [
      { label: "Target Format", value: "PST → Gmail" },
      { label: "Date Range", value: "Jan 2022 – Present" },
      { label: "Folders", value: "Inbox, Sent, Drafts" },
      { label: "Attachments", value: "Include All ✓" },
    ],
  },
  {
    number: "03",
    icon: Send,
    title: "Convert & Deliver Instantly",
    desc: "MailExel processes at 10,000+ emails per minute. Get a full conversion report, download your files, or auto-deliver to your destination server.",
    stats: [
      { label: "Emails converted", value: "32,491" },
      { label: "Attachments saved", value: "4,182" },
      { label: "Processing time", value: "3m 12s" },
      { label: "Success rate", value: "100%" },
    ],
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black mb-4">
            Up and running in{" "}
            <span className="text-gray-400">3 simple steps</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            No technical expertise required. A clean graphical interface designed for IT professionals and non-technical users alike.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              return (
                <motion.button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-black bg-white shadow-xl shadow-black/5"
                      : "border-gray-200 bg-white/70 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all ${isActive ? "bg-red-600 scale-110" : "bg-gray-100"}`}>
                      <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-gray-600"}`} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-red-400 tracking-widest mb-1">STEP {step.number}</div>
                      <h3 className="font-black text-black text-lg mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Preview panel */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 overflow-hidden border-2 border-gray-100">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-black border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="flex-1 mx-3 h-5 bg-white/10 rounded text-[10px] flex items-center px-2 text-white/50">
                  MailExel Pro — Step {activeStep + 1}/3
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex">
                {steps.map((_, i) => (
                  <div key={i} className={`flex-1 h-0.5 transition-all duration-500 ${i <= activeStep ? "bg-red-500" : "bg-gray-100"}`} />
                ))}
              </div>

              <div className="p-5 min-h-[220px]">
                {activeStep === 0 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Files Loaded</div>
                    {(steps[0].preview as { name: string; type: string; size: string }[]).map((f) => (
                      <div key={f.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-[9px] font-black text-white">{f.type}</div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-gray-700">{f.name}</div>
                          <div className="text-[10px] text-gray-400">{f.size}</div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      </div>
                    ))}
                  </div>
                )}
                {activeStep === 1 && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Configuration</div>
                    {(steps[1].filters as { label: string; value: string }[]).map((f) => (
                      <div key={f.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                        <span className="text-gray-500 font-semibold">{f.label}</span>
                        <span className="font-bold text-black">{f.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeStep === 2 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <div className="text-xs font-bold text-black uppercase tracking-wider">Conversion Complete!</div>
                    </div>
                    {(steps[2].stats as { label: string; value: string }[]).map((s) => (
                      <div key={s.label} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                        <span className="text-gray-500">{s.label}</span>
                        <span className="font-black text-black">{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} className="text-xs text-gray-400 disabled:opacity-30">← Back</button>
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => setActiveStep(i)} className={`h-1.5 rounded-full transition-all ${i === activeStep ? "bg-red-500 w-6" : "bg-gray-300 w-1.5"}`} />
                  ))}
                </div>
                <button onClick={() => setActiveStep(Math.min(2, activeStep + 1))} disabled={activeStep === 2} className="text-xs text-red-600 font-semibold disabled:opacity-30">Next →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
