import SiteNavbar from "@/components/sections/SiteNavbar";
import FooterSection from "@/components/sections/FooterSection";
import prisma from "@/lib/prisma";
import { defaultGlobalContent, type GlobalContent } from "@/lib/types/page-content";

export const revalidate = 60;

async function getGlobalContent(): Promise<GlobalContent> {
  try {
    const record = await prisma.pageContent.findUnique({ where: { slug: "global" } });
    if (!record) return defaultGlobalContent;
    return { ...defaultGlobalContent, ...(record.content as Partial<GlobalContent>) };
  } catch {
    return defaultGlobalContent;
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const global = await getGlobalContent();
  return (
    <>
      <SiteNavbar content={global.nav} />
      {children}
      <FooterSection content={global.footer} />
    </>
  );
}
