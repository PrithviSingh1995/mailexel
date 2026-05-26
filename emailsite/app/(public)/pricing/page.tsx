import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — MailExel Free Email Software",
  description: "MailExel is free to download and use. No subscription, no credit card, no cloud. One-time license available for unlimited use.",
  alternates: { canonical: "https://www.mailexel.com/pricing" },
};

const features = [
  "PST, MBOX, EML, MSG, OST and 50+ format support",
  "Email viewer — no Outlook required",
  "Convert up to 25 emails per folder",
  "Full attachment and metadata preview",
  "Works 100% offline on Windows 7–11",
  "Virus-free, no ads, no spyware",
];

const proFeatures = [
  "Unlimited email conversion (no per-folder cap)",
  "Batch conversion of multiple files at once",
  "Email migration to Office 365, Gmail, Exchange",
  "AES-256 encrypted scheduled backup",
  "IMAP to IMAP server migration",
  "Delta sync & incremental backup",
  "Priority email support",
  "All future updates included",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            Simple Pricing
          </div>
          <h1 className="text-white text-4xl sm:text-5xl font-black mb-4 leading-tight">
            Start free. Upgrade when ready.
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            No subscription. No cloud. No credit card for the free download.
            One-time license for unlimited use.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="mb-6">
              <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">Free Trial</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-gray-900 text-5xl font-black">$0</span>
              </div>
              <p className="text-gray-500 text-sm">Free to download, always</p>
            </div>
            <Link
              href="/#download"
              className="block w-full text-center bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-colors mb-6"
            >
              Free Download
            </Link>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="bg-black rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="mb-6">
              <p className="text-white/50 text-sm font-semibold uppercase tracking-wide mb-1">Pro License</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-white text-5xl font-black">$49</span>
                <span className="text-white/40 text-sm mb-2">one-time</span>
              </div>
              <p className="text-white/40 text-sm">Lifetime license, all updates included</p>
            </div>
            <Link
              href="/#download"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors mb-6"
            >
              Get Pro License
            </Link>
            <ul className="space-y-3">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-white/70 text-sm">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
            <span>✓ No subscription</span>
            <span>✓ No credit card for free download</span>
            <span>✓ Works 100% offline</span>
            <span>✓ Trusted by 500,000+ users</span>
          </div>
        </div>
      </section>
    </div>
  );
}
