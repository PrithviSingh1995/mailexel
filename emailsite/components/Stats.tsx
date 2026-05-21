"use client";
import { useEffect, useRef, useState } from "react";
import { Users, Mail, Globe, Award, Shield, Zap } from "lucide-react";

const stats = [
  { icon: Users, value: 500000, suffix: "+", label: "Happy Customers", color: "from-blue-500 to-blue-600", desc: "IT pros, lawyers, forensics" },
  { icon: Mail, value: 10, suffix: "M+", label: "Emails Processed", color: "from-violet-500 to-violet-600", desc: "Every day worldwide" },
  { icon: Globe, value: 150, suffix: "+", label: "Formats Supported", color: "from-cyan-500 to-cyan-600", desc: "More added regularly" },
  { icon: Award, value: 99.9, suffix: "%", label: "Data Accuracy", color: "from-emerald-500 to-emerald-600", desc: "Mathematically verified" },
];

const brands = [
  "Microsoft", "Google", "Amazon", "IBM", "Dell", "HP", "Cisco", "Oracle",
  "SAP", "Adobe", "Salesforce", "ServiceNow",
];

const trustSignals = [
  { icon: Shield, title: "ISO 27001 Certified", desc: "Enterprise security standard" },
  { icon: Award, title: "PC Magazine Editor's Choice", desc: "Top email tool 2024" },
  { icon: Zap, title: "SOC 2 Type II Compliant", desc: "Audit-ready security controls" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);

  const isDecimal = target % 1 !== 0;

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-black text-white">
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
      {suffix}
    </div>
  );
}

export default function Stats() {
  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center group">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                <div className="text-base font-semibold text-slate-200 mt-1">{stat.label}</div>
                <div className="text-sm text-slate-500 mt-0.5">{stat.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-16" />

        {/* Trusted by */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
            Trusted by teams at leading companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {brands.map((brand) => (
              <div
                key={brand}
                className="text-slate-500 font-bold text-lg hover:text-slate-300 transition-colors duration-200 cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-16 mb-16" />

        {/* Trust signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustSignals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div
                key={signal.title}
                className="flex items-center gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{signal.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{signal.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
