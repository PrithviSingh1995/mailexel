"use client";

import { useRef, useEffect } from "react";
import { ArrowRight, Download, Shield, Star } from "lucide-react";

export default function EtherealCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let beams: { x: number; y: number; len: number; angle: number; opacity: number; width: number }[] = [];
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      beams = Array.from({ length: 14 }, (_, i) => ({
        x: (canvas.width / 14) * i + canvas.width / 28,
        y: -100,
        len: canvas.height * 1.8,
        angle: -8 + (i * 1.2),
        opacity: 0.03 + Math.random() * 0.06,
        width: 1 + Math.random() * 2,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.008;

      beams.forEach((beam, i) => {
        const osc = Math.sin(time + i * 0.4) * 0.015;
        const grad = ctx.createLinearGradient(
          beam.x, beam.y,
          beam.x + Math.sin((beam.angle + osc) * Math.PI / 180) * beam.len,
          beam.y + Math.cos((beam.angle + osc) * Math.PI / 180) * beam.len,
        );
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.3, `rgba(255,255,255,${beam.opacity})`);
        grad.addColorStop(0.7, `rgba(255,255,255,${beam.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(255,255,255,0)`);

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = beam.width;
        ctx.moveTo(beam.x, beam.y);
        ctx.lineTo(
          beam.x + Math.sin((beam.angle + osc) * Math.PI / 180) * beam.len,
          beam.y + Math.cos((beam.angle + osc) * Math.PI / 180) * beam.len,
        );
        ctx.stroke();
      });

      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animFrame); };
  }, []);

  return (
    <section className="relative min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8 inline-flex items-center rounded-full bg-white/5 backdrop-blur border border-white/10 px-4 py-2 text-sm text-white/70">
          <Star className="mr-2 h-4 w-4 text-white/50 fill-white/50" />
          Rated #1 Email Management Tool · 500,000+ Users
        </div>

        <h2 className="mb-6 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
          Your email data.{" "}
          <span className="text-white/40">
            Fully in control.
          </span>
        </h2>

        <p className="mb-10 text-lg sm:text-xl leading-relaxed text-white/60 max-w-2xl mx-auto">
          Convert, migrate, backup and view emails from any format — with zero data loss, complete offline privacy, and enterprise-grade encryption.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a href="#download" className="group relative overflow-hidden rounded-full bg-red-600 text-white font-semibold px-8 py-4 text-base shadow-2xl shadow-red-900/40 hover:bg-red-700 transition-all flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Download Free Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </a>
          <a href="#pricing" className="rounded-full border border-white/20 bg-white/5 text-white font-semibold px-8 py-4 text-base hover:bg-white/10 hover:border-white/30 transition-all">
            View Pricing
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center"><div className="text-3xl font-bold text-white mb-1">500K+</div><div className="text-white/40 text-sm">Users</div></div>
          <div className="text-center"><div className="text-3xl font-bold text-white mb-1">50+</div><div className="text-white/40 text-sm">Formats</div></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="text-3xl font-bold text-white">4.8</div>
              <Star className="w-5 h-5 text-white fill-white mt-0.5" />
            </div>
            <div className="text-white/40 text-sm">Rating</div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/30">
          <Shield className="w-3.5 h-3.5 text-white/50" />
          100% offline · no cloud · AES-256 encrypted · Windows 7–11
        </div>
      </div>
    </section>
  );
}
