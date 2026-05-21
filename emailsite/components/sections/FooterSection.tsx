
interface MenuItem {
  title: string;
  links: { text: string; url: string }[];
}

const menuItems: MenuItem[] = [
  { title: "Popular Solutions", links: [
    { text: "PST to MBOX Converter", url: "#" },
    { text: "MBOX to PST Converter", url: "#" },
    { text: "PST to PDF Converter", url: "#" },
    { text: "EML to MSG Converter", url: "#" },
    { text: "OST to PST Converter", url: "#" },
  ]},
  { title: "Technology", links: [
    { text: "Email Converter", url: "#" },
    { text: "Email Migration", url: "#" },
    { text: "Email Backup", url: "#" },
    { text: "Email Viewer", url: "#" },
    { text: "Batch Processor", url: "#" },
  ]},
  { title: "Company", links: [
    { text: "About Us", url: "#" },
    { text: "Blog", url: "#" },
    { text: "Press Kit", url: "#" },
    { text: "Careers", url: "#" },
    { text: "Contact", url: "#" },
  ]},
  { title: "Support", links: [
    { text: "Documentation", url: "#" },
    { text: "Knowledge Base", url: "#" },
    { text: "Video Tutorials", url: "#" },
    { text: "System Requirements", url: "#" },
  ]},
];

const bottomLinks = [
  { text: "Terms and Conditions", url: "#" },
  { text: "Privacy Policy", url: "#" },
  { text: "GDPR Compliance", url: "#" },
  { text: "Refund Policy", url: "#" },
];

export default function FooterSection() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 mb-6 lg:mb-0">
            <div className="mb-3">
              <img src="/logo.svg" alt="MailExel" className="h-7 w-auto" />
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs font-medium">
              The complete email conversion, migration, backup and viewer suite for Windows.
            </p>
            <p className="text-xs text-white/30 mt-2 leading-relaxed max-w-xs">
              Trusted by 500,000+ IT professionals, forensic analysts, and legal teams worldwide.
            </p>
          </div>

          {/* Link columns */}
          {menuItems.map((section) => (
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
            {bottomLinks.map((link) => (
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
