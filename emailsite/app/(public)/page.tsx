import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "MailExel — Email Viewer, Converter, Migration & Backup Software",
  description: "Convert, migrate, backup and view PST, MBOX, EML, MSG, OST and 50+ email formats. 100% offline. No Outlook needed. Trusted by 500,000+ users.",
  alternates: { canonical: "https://www.mailexel.com/" },
  openGraph: {
    title: "MailExel — The Complete Email Suite for Windows",
    description: "Convert, migrate, backup and view emails from 50+ formats. Free download. No Outlook required.",
    url: "https://www.mailexel.com/",
    type: "website",
    images: [{ url: "https://www.mailexel.com/logo.svg" }],
  },
};

async function getHomeContent(): Promise<HomePageContent> {
  try {
    const record = await prisma.pageContent.findUnique({ where: { slug: "home" } });
    if (!record) return defaultHomeContent;
    return { ...defaultHomeContent, ...(record.content as Partial<HomePageContent>) };
  } catch {
    return defaultHomeContent;
  }
}

async function getRatingData() {
  try {
    const votes = await prisma.ratingVote.findMany();
    const count = votes.length;
    const avg = count > 0
      ? Math.round((votes.reduce((s, v) => s + v.rating, 0) / count) * 10) / 10
      : 4.8;
    return { avg, count };
  } catch {
    return { avg: 4.8, count: 0 };
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
  const [content, { homeReviews, avgRating, reviewCount }, ratingData] = await Promise.all([
    getHomeContent(),
    getReviewData(),
    getRatingData(),
  ]);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "MailExel",
        url: "https://www.mailexel.com/",
        description: "Convert, migrate, backup and view PST, MBOX, EML, MSG, OST and 50+ email formats. 100% offline. No Outlook required.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Windows 7, Windows 8, Windows 10, Windows 11",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(ratingData.avg),
          reviewCount: String(ratingData.count || 1842),
          bestRating: "5",
          worstRating: "1",
        },
        featureList: [
          "PST to MBOX converter",
          "Email migration to Office 365 and Gmail",
          "AES-256 encrypted email backup",
          "Email viewer without Outlook",
          "Supports 50+ email formats",
          "Batch processing 10,000+ emails per minute",
        ],
      },
      {
        "@type": "Organization",
        name: "MailExel",
        url: "https://www.mailexel.com/",
        logo: "https://www.mailexel.com/logo.svg",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What email formats does MailExel support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "MailExel supports 50+ email formats including PST, OST, MBOX, EML, MSG, EMLX, MBX, DBX, TBB, NSF and more. Export targets include PDF, HTML, RTF, TXT and CSV, plus direct delivery to Gmail, Office 365, Exchange, Yahoo, Zoho, IMAP and POP3.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need Outlook installed to open PST or OST files?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. MailExel opens PST, OST and all supported formats independently — no Outlook, no Exchange, no email client required. It works on any Windows 7–11 machine.",
            },
          },
          {
            "@type": "Question",
            name: "Is MailExel free to download?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. MailExel is free to download. The free trial converts the first 25 emails per folder so you can verify accuracy before purchasing a full license.",
            },
          },
          {
            "@type": "Question",
            name: "Does MailExel work without an internet connection?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. MailExel works 100% offline. No internet connection, cloud service, or subscription is required. All processing happens locally on your Windows PC.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <HeroSection content={content.hero} initialAvg={ratingData.avg} initialCount={ratingData.count} />
      <LogoCloud />
      <FeaturesSection content={content.features} />
      <HowItWorksSection content={content.howItWorks} />
      <DownloadCTA content={content.downloadCta} />
      <TestimonialsScroll reviews={homeReviews.length >= 3 ? homeReviews : undefined} />
      <TestimonialsGrid avgRating={avgRating} reviewCount={reviewCount} ratingAvg={ratingData.avg} ratingCount={ratingData.count} />
      <EtherealCTA content={content.etherealCta} />
      <FAQSection content={content.faq} />
    </main>
  );
}
