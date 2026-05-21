"use client";
import { useState } from "react";
import { Upload, Settings2, Download, CheckCircle2, ArrowRight, Play } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Add your email files",
    desc: "Drag & drop PST, MBOX, EML, MSG, OST or any supported format. Or connect directly to Gmail, Outlook, Exchange, or IMAP.",
    details: ["Supports 150+ email formats", "Drag & drop or browse", "Direct server connection", "No size limits"],
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    preview: {
      label: "Loading files...",
      files: [
        { name: "inbox.pst", size: "2.4 GB", type: "PST", color: "bg-blue-500", pct: 100 },
        { name: "archive.mbox", size: "890 MB", type: "MBOX", color: "bg-violet-500", pct: 100 },
        { name: "backup.ost", size: "1.2 GB", type: "OST", color: "bg-cyan-500", pct: 100 },
      ],
    },
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configure your options",
    desc: "Choose target format, apply filters (date range, folder, sender), configure encryption, and set up scheduling — all from an intuitive interface.",
    details: ["Date/sender/subject filters", "Folder selection", "Output format settings", "Encryption options"],
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    preview: {
      label: "Configuration",
      filters: [
        { label: "From", value: "Jan 2020 – Present" },
        { label: "Format", value: "MBOX → EML" },
        { label: "Folders", value: "Inbox, Sent, Archive" },
        { label: "Encrypt", value: "AES-256 ✓" },
      ],
    },
  },
  {
    number: "03",
    icon: Download,
    title: "Get your results instantly",
    desc: "Watch real-time progress as emails are processed. Download your converted files, restore migrated emails, or schedule recurring tasks.",
    details: ["Real-time progress bar", "Detailed conversion report", "Email verification check", "Download or auto-save"],
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    preview: {
      label: "Complete!",
      stats: [
        { label: "Emails processed", value: "24,891", color: "text-emerald-600" },
        { label: "Attachments saved", value: "3,402", color: "text-blue-600" },
        { label: "Time taken", value: "4m 23s", color: "text-violet-600" },
        { label: "Success rate", value: "100%", color: "text-emerald-600" },
      ],
    },
  },
];

function StepPreview({ step, index }: { step: typeof steps[0]; index: number }) {
  if (index === 0) {
    return (
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 mb-3">{step.preview.label}</div>
        {step.preview.files?.map((f, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className={`w-8 h-8 ${f.color} rounded-lg flex items-center justify-center text-[10px] font-bold text-white`}>{f.type}</div>
            <div className="flex-1">
              <div className="text-xs font-medium text-slate-700">{f.name}</div>
              <div className="text-[10px] text-slate-400">{f.size}</div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        ))}
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-500 mb-3">{step.preview.label}</div>
        {step.preview.filters?.map((f, i) => (
          <div key={i} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">{f.label}</span>
            <span className="font-semibold text-slate-800">{f.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <div className="text-xs font-semibold text-emerald-600">{step.preview.label}</div>
      </div>
      {step.preview.stats?.map((s, i) => (
        <div key={i} className="flex justify-between items-center p-2.5 bg-white rounded-xl border border-slate-100 text-xs">
          <span className="text-slate-500">{s.label}</span>
          <span className={`font-bold ${s.color}`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="section-padding bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Get started in{" "}
            <span className="gradient-text">3 simple steps</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No technical expertise required. Our intuitive interface guides you through the entire process.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: step list */}
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = activeStep === i;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(i)}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? "border-transparent bg-gradient-to-br from-white to-slate-50 shadow-xl"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg ${isActive ? "scale-110" : ""} transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-black text-slate-400 tracking-widest">STEP {step.number}</span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full uppercase tracking-wide">
                            Active
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-1.5">{step.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed mb-3">{step.desc}</p>
                      {isActive && (
                        <ul className="grid grid-cols-2 gap-1.5">
                          {step.details.map((d) => (
                            <li key={d} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <ArrowRight className={`w-4 h-4 text-slate-300 flex-shrink-0 mt-1 transition-colors ${isActive ? "text-blue-500" : ""}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: preview panel */}
          <div className="lg:sticky lg:top-24">
            <div className="glass rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-white/80">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100/80 border-b border-slate-200/60">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 mx-3 h-5 bg-white/60 rounded text-[10px] flex items-center px-2 text-slate-400">
                  MailExel — {steps[activeStep].title}
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex border-b border-slate-100">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 transition-all duration-500 ${
                      i <= activeStep ? `bg-gradient-to-r ${s.color}` : "bg-slate-100"
                    }`}
                  />
                ))}
              </div>

              {/* Preview content */}
              <div className="bg-white/50 min-h-[260px]">
                <StepPreview step={steps[activeStep]} index={activeStep} />
              </div>

              {/* Navigation */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                  disabled={activeStep === 0}
                  className="text-xs font-medium text-slate-400 disabled:opacity-30 hover:text-slate-600 transition-colors"
                >
                  ← Previous
                </button>
                <div className="flex gap-1.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === activeStep ? "bg-blue-600 w-6" : "bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveStep(Math.min(2, activeStep + 1))}
                  disabled={activeStep === 2}
                  className="text-xs font-medium text-blue-600 disabled:opacity-30 hover:text-blue-700 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Video CTA */}
            <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500">
              <button className="flex items-center gap-2 hover:text-blue-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Play className="w-3.5 h-3.5 text-blue-600 group-hover:text-white transition-colors ml-0.5" />
                </div>
                Watch full tutorial (4 min)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
