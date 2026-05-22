"use client";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { defaultGlobalContent, type NavContent } from "@/lib/types/page-content";

export default function SiteNavbar({ content }: { content?: Partial<NavContent> }) {
  const c: NavContent = { ...defaultGlobalContent.nav, ...content };
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <a href="/" className="flex items-center group">
            <img
              src={scrolled ? "/logo-black.svg" : "/logo.svg"}
              alt="MailExel"
              className="h-7 w-auto transition-all"
            />
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {c.links.map((link) => (
              <div key={link.label} className="relative" onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)} onMouseLeave={() => setActiveDropdown(null)}>
                <a href={link.href} className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${scrolled ? "text-gray-600 hover:text-black hover:bg-gray-100" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                  {link.label}
                  {link.dropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`} />}
                </a>
                {link.dropdown && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {link.dropdown.map((item) => (
                      <a key={item} href="#features" className="block px-4 py-2 text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-colors">{item}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={c.signInHref} className={`text-sm font-medium px-3 py-2 transition-colors ${scrolled ? "text-gray-600 hover:text-black" : "text-white/70 hover:text-white"}`}>{c.signInText}</a>
            <a href={c.ctaHref} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-red-600 text-white hover:bg-red-700">
              {c.ctaText}
            </a>
          </div>

          <button className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-black hover:bg-gray-100" : "text-white hover:bg-white/10"}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {c.links.map((link) => (
              <a key={link.label} href={link.href} className="block px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <a href={c.signInHref} className="text-center py-2.5 text-sm font-medium text-gray-600">{c.signInText}</a>
              <a href={c.ctaHref} className="text-center py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl" onClick={() => setMobileOpen(false)}>{c.ctaText}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
