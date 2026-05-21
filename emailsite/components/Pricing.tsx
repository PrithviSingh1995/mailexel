"use client";
import { useState } from "react";
import { CheckCircle2, Zap, Crown, Building2, ArrowRight, X } from "lucide-react";

const plans = [
  {
    name: "Free Trial",
    icon: Zap,
    iconColor: "from-slate-400 to-slate-500",
    price: { monthly: 0, annual: 0 },
    desc: "Try all features with limited exports",
    badge: null,
    features: [
      { text: "View 25 emails per file", included: true },
      { text: "Convert up to 25 emails", included: true },
      { text: "Supports all 150+ formats", included: true },
      { text: "Preview attachments", included: true },
      { text: "Batch processing", included: false },
      { text: "Scheduled backups", included: false },
      { text: "Priority support", included: false },
      { text: "Migration wizard", included: false },
    ],
    cta: "Download Free",
    ctaStyle: "border-2 border-slate-200 text-slate-700 hover:border-slate-300 bg-white",
  },
  {
    name: "Professional",
    icon: Crown,
    iconColor: "from-blue-500 to-violet-600",
    price: { monthly: 49, annual: 39 },
    desc: "Full access for individuals & small teams",
    badge: "Most Popular",
    features: [
      { text: "Unlimited email processing", included: true },
      { text: "All 150+ format conversions", included: true },
      { text: "Batch processing (unlimited)", included: true },
      { text: "Advanced search & filters", included: true },
      { text: "Migration wizard", included: true },
      { text: "AES-256 encrypted backups", included: true },
      { text: "Email support (24h response)", included: true },
      { text: "White-label export", included: false },
    ],
    cta: "Start Free Trial",
    ctaStyle: "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50",
  },
  {
    name: "Enterprise",
    icon: Building2,
    iconColor: "from-emerald-500 to-emerald-600",
    price: { monthly: 149, annual: 119 },
    desc: "Advanced tools for large organizations",
    badge: "Best Value",
    features: [
      { text: "Everything in Professional", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Priority phone & chat support", included: true },
      { text: "Scheduled & automated tasks", included: true },
      { text: "White-label & custom branding", included: true },
      { text: "API access & integrations", included: true },
      { text: "Audit logs & compliance reports", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Contact Sales",
    ctaStyle: "border-2 border-emerald-200 text-emerald-700 hover:border-emerald-300 bg-emerald-50",
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">
            Simple Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Choose your{" "}
            <span className="gradient-text">perfect plan</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
            One-time license or subscription — you choose. No hidden fees. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !annual ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                annual ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = annual ? plan.price.annual : plan.price.monthly;
            const isPopular = plan.badge === "Most Popular";

            return (
              <div
                key={plan.name}
                className={`relative rounded-3xl p-7 flex flex-col ${
                  isPopular
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500/30 shadow-2xl shadow-blue-500/10 scale-105"
                    : "bg-white border border-slate-200 shadow-lg hover:shadow-xl"
                } transition-all duration-300`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    isPopular ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg" : "bg-emerald-500 text-white"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                {/* Icon & name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.iconColor} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-base ${isPopular ? "text-white" : "text-slate-900"}`}>{plan.name}</div>
                    <div className={`text-xs ${isPopular ? "text-slate-400" : "text-slate-500"}`}>{plan.desc}</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className={`text-5xl font-black ${isPopular ? "text-white" : "text-slate-900"}`}>
                      {price === 0 ? "Free" : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm mb-2 ${isPopular ? "text-slate-400" : "text-slate-500"}`}>/mo</span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <div className="text-xs text-emerald-400 mt-0.5 font-medium">
                      Billed annually · Save ${(plan.price.monthly - price) * 12}/yr
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        f.included
                          ? isPopular ? "text-slate-200" : "text-slate-700"
                          : isPopular ? "text-slate-600" : "text-slate-400"
                      }`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 ${plan.ctaStyle}`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Money-back guarantee */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-sm text-emerald-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>
              <strong>30-day money-back guarantee.</strong> Not satisfied? Full refund, no questions asked.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
