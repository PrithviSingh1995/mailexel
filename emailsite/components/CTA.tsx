"use client";
import { Download, ArrowRight, Shield, Zap, CheckCircle2 } from "lucide-react";

const platforms = ["Windows 10", "Windows 11"];
const bullets = [
  "Free trial — no credit card",
  "Zero data loss guarantee",
  "Offline — 100% private",
];

export default function CTA() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 p-10 md:p-16 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-xs font-semibold text-blue-200 uppercase tracking-wider mb-6">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-300" />
              </span>
              Start your free trial today
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Ready to manage your
              <br />
              <span className="gradient-text-2">email like a pro?</span>
            </h2>

            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Join 500,000+ IT professionals using MailExel to view, convert, migrate, and backup emails with confidence.
            </p>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center gap-5 mb-10">
              {bullets.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {b}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <a
                href="#"
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-bold text-base rounded-2xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <Download className="w-5 h-5" />
                <span>Download Free Trial</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold text-base rounded-2xl hover:bg-white/20 transition-all"
              >
                View Pricing
              </a>
            </div>

            {/* Platform */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Available for:
              {platforms.map((p, i) => (
                <span key={p}>
                  <span className="text-slate-400 font-medium">{p}</span>
                  {i < platforms.length - 1 && <span className="mx-1">·</span>}
                </span>
              ))}
              <span className="text-slate-500">· macOS (beta)</span>
              <span className="mx-1">·</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                Virus-free &amp; verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
