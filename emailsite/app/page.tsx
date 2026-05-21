import SiteNavbar from "@/components/sections/SiteNavbar";
import HeroSection from "@/components/sections/HeroSection";
import LogoCloud from "@/components/sections/LogoCloud";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DownloadCTA from "@/components/sections/DownloadCTA";
import TestimonialsScroll from "@/components/sections/TestimonialsScroll";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import EtherealCTA from "@/components/sections/EtherealCTA";
import FAQSection from "@/components/sections/FAQSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <SiteNavbar />
      {/* 1 — Hero with GSAP animated gradient + app screenshot */}
      <HeroSection />
      {/* 2 — Infinite logo cloud (trusted by) */}
      <LogoCloud />
      {/* 3 — Features with BackgroundPaths animated SVG */}
      <FeaturesSection />
      {/* 4 — How It Works (3 steps) */}
      <HowItWorksSection />
      {/* 5 — Dark Download CTA with spinning rings */}
      <DownloadCTA />
      {/* 6 — 3-column scrolling testimonials */}
      <TestimonialsScroll />
      {/* 7 — Floating photo testimonial grid */}
      <TestimonialsGrid />
      {/* 8 — Ethereal beams CTA (canvas beams, no Three.js) */}
      <EtherealCTA />
      {/* 9 — Radix accordion FAQ */}
      <FAQSection />
      {/* 10 — Footer */}
      <FooterSection />
    </main>
  );
}
