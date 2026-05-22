"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, FileQuestion, Shield, Zap, Globe, LucideIcon } from "lucide-react";
import { defaultHomeContent, type FaqContent } from "@/lib/types/page-content";

const iconPool: LucideIcon[] = [FileQuestion, Shield, Zap, Shield, Globe, HelpCircle, Mail];

export default function FAQSection({ content }: { content?: Partial<FaqContent> }) {
  const c: FaqContent = { ...defaultHomeContent.faq, ...content };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
            {c.label}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-black mb-4">
            {c.title1}{" "}
            <span className="text-gray-400">{c.title2}</span>
          </h2>
          <p className="text-lg text-gray-500">
            Can&apos;t find what you need?{" "}
            <a href="#" className="text-red-600 hover:underline font-semibold">Chat with our team</a>.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full" defaultValue="0">
          {c.items.map((item, idx) => {
            const Icon = iconPool[idx % iconPool.length];
            return (
              <AccordionItem value={String(idx)} key={idx} className="py-1 border-gray-200">
                <AccordionTrigger className="flex flex-1 items-center justify-between py-3 text-left text-[15px] font-semibold leading-6 hover:no-underline">
                  <span className="flex items-center gap-3.5">
                    <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full border border-red-100 bg-red-50">
                      <Icon size={16} className="text-red-500" />
                    </span>
                    <span className="flex flex-col space-y-0.5">
                      <span className="text-black">{item.title}</span>
                      {item.subtitle && <span className="text-sm font-normal text-gray-400">{item.subtitle}</span>}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="ms-3 pb-3 ps-[3.25rem] text-gray-500 leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="mt-12 text-center p-8 bg-black rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-2">{c.ctaTitle}</h3>
          <p className="text-white/60 text-sm mb-5">{c.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#" className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors">Email Support</a>
            <a href="#" className="px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold text-sm rounded-xl hover:bg-white/15 transition-colors">Live Chat</a>
          </div>
        </div>
      </div>
    </section>
  );
}
