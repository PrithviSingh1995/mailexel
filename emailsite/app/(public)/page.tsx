import HeroSection from "@/components/sections/HeroSection";
import LogoCloud from "@/components/sections/LogoCloud";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import DownloadCTA from "@/components/sections/DownloadCTA";
import TestimonialsScroll from "@/components/sections/TestimonialsScroll";
import TestimonialsGrid from "@/components/sections/TestimonialsGrid";
import EtherealCTA from "@/components/sections/EtherealCTA";
import FAQSection from "@/components/sections/FAQSection";
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

async function getReviewData() {
  try {
    const reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    const homeReviews = reviews.filter(r => r.showOnHome);
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : undefined;
    return { homeReviews, allPublished: reviews, avgRating, reviewCount: reviews.length };
  } catch {
    return { homeReviews: [], allPublished: [], avgRating: undefined, reviewCount: 0 };
  }
}

export default async function Home() {
  const [content, { homeReviews, avgRating, reviewCount }] = await Promise.all([
    getHomeContent(),
    getReviewData(),
  ]);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <HeroSection content={content.hero} />
      <LogoCloud />
      <FeaturesSection content={content.features} />
      <HowItWorksSection content={content.howItWorks} />
      <DownloadCTA content={content.downloadCta} />
      <TestimonialsScroll reviews={homeReviews.length >= 3 ? homeReviews : undefined} />
      <TestimonialsGrid avgRating={avgRating} reviewCount={reviewCount} />
      <EtherealCTA content={content.etherealCta} />
      <FAQSection content={content.faq} />
    </main>
  );
}
