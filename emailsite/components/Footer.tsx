import { Mail, Share2, Link, Video, Code, Shield } from "lucide-react";

const links = {
  Products: ["Email Viewer", "Email Converter", "Email Migration", "Email Backup", "Batch Processor"],
  Formats: ["PST to MBOX", "MBOX to PST", "PST to PDF", "EML to MSG", "OST to PST", "All Conversions"],
  Company: ["About Us", "Blog", "Press Kit", "Careers", "Partners", "Contact"],
  Support: ["Documentation", "Knowledge Base", "Video Tutorials", "Community Forum", "System Status", "Report Bug"],
  Legal: ["Privacy Policy", "Terms of Service", "GDPR Compliance", "Cookie Policy", "Refund Policy"],
};

const socials = [
  { icon: Share2, label: "Twitter / X" },
  { icon: Link, label: "LinkedIn" },
  { icon: Video, label: "YouTube" },
  { icon: Code, label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="pt-14 pb-10 grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-white text-base">MailExel</div>
                <div className="text-[10px] text-slate-500 tracking-widest uppercase">Email Suite</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              The professional email management suite trusted by 500,000+ IT professionals, forensic analysts, and legal teams worldwide.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:border-slate-600 transition-all"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500">
            © {new Date().getFullYear()} MailExel. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span>SOC 2 Type II</span>
            </div>
            <span>·</span>
            <span>ISO 27001</span>
            <span>·</span>
            <span>GDPR Compliant</span>
          </div>
          <div className="text-slate-600">
            Version 9.2.1 · Windows · macOS Beta
          </div>
        </div>
      </div>
    </footer>
  );
}
