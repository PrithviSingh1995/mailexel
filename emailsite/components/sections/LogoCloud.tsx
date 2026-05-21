import { InfiniteSlider } from "@/components/ui/infinite-slider";

const clients = [
  { name: "Microsoft Outlook", abbr: "Outlook" },
  { name: "Gmail", abbr: "Gmail" },
  { name: "Office 365", abbr: "Office 365" },
  { name: "Yahoo Mail", abbr: "Yahoo" },
  { name: "Thunderbird", abbr: "Thunderbird" },
  { name: "Lotus Notes", abbr: "Lotus Notes" },
  { name: "Zoho Mail", abbr: "Zoho" },
  { name: "Exchange Server", abbr: "Exchange" },
  { name: "IMAP Server", abbr: "IMAP" },
  { name: "Yandex Mail", abbr: "Yandex" },
  { name: "Opera Mail", abbr: "Opera" },
  { name: "Windows Live", abbr: "Windows Live" },
];

export default function LogoCloud() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
          Convert &amp; migrate emails from all major clients &amp; platforms
        </p>

        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <InfiniteSlider gap={40} speed={35} speedOnHover={12}>
            {clients.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-white transition-colors shrink-0"
              >
                <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center">
                  <span className="text-[8px] font-black text-white leading-none">{c.abbr.slice(0, 2).toUpperCase()}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{c.abbr}</span>
              </div>
            ))}
          </InfiniteSlider>
        </div>

        <p className="mt-5 text-xs text-gray-400">
          + POP3, EWS, Kerio Connect, hMailServer, Courier, Dovecot, and more
        </p>
      </div>
    </section>
  );
}
