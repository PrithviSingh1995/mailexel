"use client";

import { useState, useRef } from "react";
import { Download, Shield, CheckCircle2, Monitor } from "lucide-react";

export default function DownloadCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => { setStatus("success"); setEmail(""); fireConfetti(); }, 1500);
  };

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }[] = [];
    const colors = ["#ffffff", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#111111"];
    canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
    for (let i = 0; i < 70; i++) {
      particles.push({ x: canvas.width / 2, y: canvas.height / 2, vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 2.5) * 12, life: 100, color: colors[Math.floor(Math.random() * colors.length)], size: Math.random() * 5 + 2 });
    }
    const animate = () => {
      if (!ctx || particles.length === 0) { ctx?.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.5; p.life -= 2;
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        if (p.life <= 0) { particles.splice(i, 1); i--; }
      }
      requestAnimationFrame(animate);
    };
    animate();
  };

  return (
    <section id="download" className="w-full bg-black overflow-hidden relative">
      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid" />
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/[0.03] rounded-full blur-[100px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="relative z-10 w-full py-20 flex flex-col items-center gap-6 px-4">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shadow-2xl shadow-red-900/40">
          <Download className="w-8 h-8 text-white" />
        </div>

        <div className="text-center max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/15 rounded-full text-xs font-bold text-white/70 uppercase tracking-wider mb-4">
            #1 Email Management Software
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Start Managing Emails{" "}
            <span className="text-white/40">for Free</span>
          </h2>
          <p className="text-lg text-white/50 leading-relaxed">
            Download MailExel free — no credit card required. Full-featured trial. Works on Windows 7, 8, 10 &amp; 11.
          </p>
        </div>

        {/* Features row */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/50">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white/70" />No Credit Card</span>
          <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-white/70" />Virus &amp; Ad Free</span>
          <span className="flex items-center gap-2"><Monitor className="w-4 h-4 text-white/70" />Windows 7–11</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white/70" />24/7 Support</span>
        </div>

        {/* Email form */}
        <div className="w-full max-w-md h-[60px] relative mt-2">
          <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-50" />

          {/* Success state */}
          <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ${status === "success" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`} style={{ backgroundColor: "#16a34a" }}>
            {status === "success" && <>
              <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-green-400" style={{ animation: "cr .8s ease-out forwards", transform: "translate(-50%,-50%)" }} />
            </>}
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="bg-white/20 p-1 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Download link sent!
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`relative w-full h-full transition-all duration-500 ${status === "success" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
            <input
              type="email" required placeholder="Enter your work email" value={email}
              disabled={status === "loading"}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-full pl-6 pr-[160px] rounded-full outline-none bg-white/10 text-white placeholder-white/30 disabled:opacity-70"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)" }}
            />
            <div className="absolute top-[6px] right-[6px] bottom-[6px]">
              <button
                type="submit" disabled={status === "loading"}
                className="h-full px-6 rounded-full font-bold text-white transition-all active:scale-95 hover:bg-red-700 disabled:cursor-wait flex items-center justify-center min-w-[140px] bg-red-600"
              >
                {status === "loading"
                  ? <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  : <><Download className="w-4 h-4 mr-1.5" />Free Download</>
                }
              </button>
            </div>
          </form>
        </div>

        <p className="text-xs text-white/25 text-center">Windows · 5.8 MB · v9.2.1 · Electronic Delivery · English</p>
      </div>
    </section>
  );
}
