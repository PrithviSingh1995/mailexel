"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";
import { Download, ArrowRight, Shield, CheckCircle2, Star } from "lucide-react";

type AnimatedGroupProps = {
  children: ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const defaultItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
};

function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  return (
    <motion.div initial="hidden" animate="visible" variants={variants?.container || defaultContainerVariants} className={cn(className)}>
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={variants?.item || defaultItemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

const badges = [
  { label: "PST" },
  { label: "MBOX" },
  { label: "EML" },
  { label: "OST" },
  { label: "MSG" },
  { label: "NSF" },
];

export default function HeroSection() {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gradientRef.current) return;
    gsap.fromTo(gradientRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.8, ease: "power3.out" });
  }, []);

  return (
    <div className="overflow-hidden bg-black relative min-h-screen flex flex-col justify-center pt-16">
      {/* Background */}
      <div ref={gradientRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 dot-grid" />
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-white/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full text-sm font-medium text-white mb-6"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-white text-white" />)}
              </div>
              <span className="text-white/70">4.8/5 · 1,842 Reviews</span>
              <span className="px-2 py-0.5 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-wider">#1 Tool</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6"
            >
              The Complete{" "}
              <span className="relative">
                <span className="relative z-10 text-white">Email Suite</span>
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/40" />
              </span>
              <br />
              <span className="text-white/40 text-4xl sm:text-5xl lg:text-6xl font-bold">for Windows</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl text-white/60 leading-relaxed mb-8 max-w-lg"
            >
              Convert, migrate, backup and view emails from <strong className="text-white">PST, MBOX, EML, MSG, OST</strong> and 50+ formats. 100% offline. No Outlook needed.
            </motion.p>

            <AnimatedGroup className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#download" className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl transition-all shadow-2xl shadow-red-900/40">
                <Download className="w-5 h-5" />
                Free Download
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white/5 border border-white/15 hover:bg-white/10 text-white font-semibold text-base rounded-xl transition-all">
                See How It Works
              </a>
            </AnimatedGroup>

            <div className="flex flex-wrap gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-white/60" /> Virus &amp; Ad Free</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-white/60" /> No Credit Card Required</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-white/60" /> Windows 7–11</span>
            </div>
          </div>

          {/* Right: app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-3xl scale-110" />

            <div className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 pulse-mono">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="flex-1 mx-3 h-5 bg-white/10 rounded text-[10px] flex items-center px-2 text-white/30">
                  MailExel — Email Converter & Migration Tool v9.2
                </div>
              </div>
              <Image
                src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                alt="MailExel Email Management Software Interface"
                width={2700}
                height={1440}
                className="w-full aspect-[15/8] object-cover"
                unoptimized
                priority
              />
            </div>

            {/* Format badges */}
            <div className="absolute -top-4 -right-4 flex flex-wrap gap-1.5 justify-end max-w-[200px]">
              {badges.map((b) => (
                <span key={b.label} className="bg-white text-black text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                  {b.label}
                </span>
              ))}
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-black text-black">10M+</div>
                <div className="text-xs text-gray-500">Emails Processed</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10"
        >
          {[
            { val: "500K+", label: "Customers Worldwide" },
            { val: "50+", label: "File Formats Supported" },
            { val: "100%", label: "Data Accuracy" },
            { val: "4.8★", label: "User Rating" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{s.val}</div>
              <div className="text-xs text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
