import { defaultGlobalContent, type FooterContent } from "@/lib/types/page-content";

export default function FooterSection({ content }: { content?: Partial<FooterContent> }) {
  const c: FooterContent = { ...defaultGlobalContent.footer, ...content };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          <div className="col-span-2 mb-6 lg:mb-0">
            <div className="mb-3">
              <img src="/logo.svg" alt="MailExel" className="h-7 w-auto" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs font-medium">{c.brandDescription}</p>
            <p className="text-xs text-white/30 mt-2 leading-relaxed max-w-xs">{c.brandSubtext}</p>
          </div>

          {c.menuItems.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 font-bold text-white text-sm">{section.title}</h3>
              <ul className="space-y-3 text-sm text-white/40">
                {section.links.map((link) => (
                  <li key={link.text} className="font-medium hover:text-red-400 transition-colors">
                    <a href={link.url}>{link.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm font-medium text-white/25 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} MailExel. All rights reserved. · Windows 7–11 · v9.2.1</p>
          <ul className="flex flex-wrap gap-4">
            {c.bottomLinks.map((link) => (
              <li key={link.text} className="underline hover:text-red-400 transition-colors">
                <a href={link.url}>{link.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
