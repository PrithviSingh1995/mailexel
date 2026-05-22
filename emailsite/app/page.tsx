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
import prisma from "@/lib/prisma";
import { defaultHomeContent, type HomePageContent } from "@/lib/types/page-content";

export const revalidate = 60;

async function getHomeContent(): Promise<HomePageContent> {
  try {
    const record = await prisma.pageContent.findUnique({ where: { slug: "home" } });
    if (!record) return defaultHomeContent;
    return { ...defaultHomeContent, ...(record.content as Partial<HomePageContent>) };
  } catch {
    return defaultHomeContent;
  }
}

export default async function Home() {
  const content = await getHomeContent();

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <SiteNavbar />
      <HeroSection content={content.hero} />
      <LogoCloud />
      <FeaturesSection content={content.features} />
      <HowItWorksSection content={content.howItWorks} />
      <DownloadCTA content={content.downloadCta} />
      <TestimonialsScroll />
      <TestimonialsGrid />
      <EtherealCTA content={content.etherealCta} />
      <FAQSection content={content.faq} />
      <FooterSection content={content.footer} />
    </main>
  );
}
