"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Save, ExternalLink, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { HomePageContent, FeatureCard, FaqItem, FooterMenuItem } from "@/lib/types/page-content";
import { defaultHomeContent } from "@/lib/types/page-content";

// ─── Tiny form helpers ────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 resize-y" />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500" />
      }
    </div>
  );
}

function StringList({ label, items, onChange }: {
  label: string; items: string[]; onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        <button type="button" onClick={() => onChange([...items, ""])}
          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n); }}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatList({ label, items, valKey, labelKey, onChange }: {
  label: string;
  items: Record<string, string>[];
  valKey: string;
  labelKey: string;
  onChange: (v: Record<string, string>[]) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-gray-600">{label}</label>
        <button type="button" onClick={() => onChange([...items, { [valKey]: "", [labelKey]: "" }])}
          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" placeholder="Value" value={item[valKey]} onChange={e => { const n = [...items]; n[i] = { ...n[i], [valKey]: e.target.value }; onChange(n); }}
              className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input type="text" placeholder="Label" value={item[labelKey]} onChange={e => { const n = [...items]; n[i] = { ...n[i], [labelKey]: e.target.value }; onChange(n); }}
              className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section editors ─────────────────────────────────────────────────────────

function HeroTab({ data, update }: { data: HomePageContent["hero"]; update: (v: HomePageContent["hero"]) => void }) {
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Badge text" value={data.badge} onChange={s("badge")} />
        <Field label="Rating label (e.g. #1 Tool)" value={data.ratingLabel} onChange={s("ratingLabel")} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Title line 1" value={data.titleLine1} onChange={s("titleLine1")} />
        <Field label="Title line 2" value={data.titleLine2} onChange={s("titleLine2")} />
        <Field label="Title subtitle" value={data.titleSub} onChange={s("titleSub")} />
      </div>
      <Field label="Description" value={data.description} onChange={s("description")} multiline rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary CTA text" value={data.primaryCtaText} onChange={s("primaryCtaText")} />
        <Field label="Primary CTA link" value={data.primaryCtaHref} onChange={s("primaryCtaHref")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secondary CTA text" value={data.secondaryCtaText} onChange={s("secondaryCtaText")} />
        <Field label="Secondary CTA link" value={data.secondaryCtaHref} onChange={s("secondaryCtaHref")} />
      </div>
      <StringList label="Trust items" items={data.trustItems} onChange={v => update({ ...data, trustItems: v })} />
      <StatList label="Stats bar (val / label)" items={data.stats as Record<string, string>[]} valKey="val" labelKey="label" onChange={v => update({ ...data, stats: v as typeof data.stats })} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Floating stat value" value={data.floatingStatVal} onChange={s("floatingStatVal")} />
        <Field label="Floating stat label" value={data.floatingStatLabel} onChange={s("floatingStatLabel")} />
      </div>
      <StringList label="Format badges" items={data.formatBadges} onChange={v => update({ ...data, formatBadges: v })} />
      <Field label="App window title" value={data.appWindowTitle} onChange={s("appWindowTitle")} />
    </div>
  );
}

function FeaturesTab({ data, update }: { data: HomePageContent["features"]; update: (v: HomePageContent["features"]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });

  const updateFeature = (i: number, patch: Partial<FeatureCard>) => {
    const features = [...data.features];
    features[i] = { ...features[i], ...patch };
    update({ ...data, features });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Section label" value={data.label} onChange={s("label")} />
        <Field label="Title part 1" value={data.title1} onChange={s("title1")} />
        <Field label="Title part 2 (gray)" value={data.title2} onChange={s("title2")} />
      </div>
      <Field label="Description" value={data.description} onChange={s("description")} multiline rows={2} />

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-2">Feature cards</label>
        <div className="space-y-2">
          {data.features.map((feat, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpanded(expanded === i ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                {feat.title || `Feature ${i + 1}`}
                {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expanded === i && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Title" value={feat.title} onChange={v => updateFeature(i, { title: v })} />
                    <Field label="Badge" value={feat.badge} onChange={v => updateFeature(i, { badge: v })} />
                  </div>
                  <Field label="Description" value={feat.desc} onChange={v => updateFeature(i, { desc: v })} multiline rows={3} />
                  <StringList label="Bullet points" items={feat.items} onChange={v => updateFeature(i, { items: v })} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <StatList label="Stats strip (stat / label)" items={data.stats as Record<string, string>[]} valKey="stat" labelKey="label" onChange={v => update({ ...data, stats: v as typeof data.stats })} />
      <Field label="Bottom text" value={data.bottomText} onChange={s("bottomText")} multiline rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Bottom CTA text" value={data.bottomCtaText} onChange={s("bottomCtaText")} />
        <Field label="Bottom CTA link" value={data.bottomCtaHref} onChange={s("bottomCtaHref")} />
      </div>
    </div>
  );
}

function HowItWorksTab({ data, update }: { data: HomePageContent["howItWorks"]; update: (v: HomePageContent["howItWorks"]) => void }) {
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Section label" value={data.label} onChange={s("label")} />
        <Field label="Title part 1" value={data.title1} onChange={s("title1")} />
        <Field label="Title part 2 (gray)" value={data.title2} onChange={s("title2")} />
      </div>
      <Field label="Description" value={data.description} onChange={s("description")} multiline rows={2} />
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-2">Steps</label>
        <div className="space-y-3">
          {data.steps.map((step, i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-red-500 uppercase tracking-widest">Step {String(i + 1).padStart(2, "0")}</div>
              <Field label="Title" value={step.title} onChange={v => {
                const steps = [...data.steps]; steps[i] = { ...steps[i], title: v }; update({ ...data, steps });
              }} />
              <Field label="Description" value={step.desc} onChange={v => {
                const steps = [...data.steps]; steps[i] = { ...steps[i], desc: v }; update({ ...data, steps });
              }} multiline rows={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DownloadCtaTab({ data, update }: { data: HomePageContent["downloadCta"]; update: (v: HomePageContent["downloadCta"]) => void }) {
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });
  return (
    <div className="space-y-5">
      <Field label="Badge text" value={data.badge} onChange={s("badge")} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title part 1" value={data.title1} onChange={s("title1")} />
        <Field label="Title part 2 (dim)" value={data.title2} onChange={s("title2")} />
      </div>
      <Field label="Description" value={data.description} onChange={s("description")} multiline rows={2} />
      <StringList label="Feature checkmarks" items={data.features} onChange={v => update({ ...data, features: v })} />
      <Field label="Version / file info text" value={data.versionText} onChange={s("versionText")} />
    </div>
  );
}

function EtherealCtaTab({ data, update }: { data: HomePageContent["etherealCta"]; update: (v: HomePageContent["etherealCta"]) => void }) {
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });
  return (
    <div className="space-y-5">
      <Field label="Badge text" value={data.badge} onChange={s("badge")} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Title part 1" value={data.title1} onChange={s("title1")} />
        <Field label="Title part 2 (dim)" value={data.title2} onChange={s("title2")} />
      </div>
      <Field label="Description" value={data.description} onChange={s("description")} multiline rows={3} />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary CTA text" value={data.primaryCtaText} onChange={s("primaryCtaText")} />
        <Field label="Primary CTA link" value={data.primaryCtaHref} onChange={s("primaryCtaHref")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secondary CTA text" value={data.secondaryCtaText} onChange={s("secondaryCtaText")} />
        <Field label="Secondary CTA link" value={data.secondaryCtaHref} onChange={s("secondaryCtaHref")} />
      </div>
      <StatList label="Stats (val / label)" items={data.stats as Record<string, string>[]} valKey="val" labelKey="label" onChange={v => update({ ...data, stats: v as typeof data.stats })} />
      <Field label="Trust text (below buttons)" value={data.trustText} onChange={s("trustText")} />
    </div>
  );
}

function FaqTab({ data, update }: { data: HomePageContent["faq"]; update: (v: HomePageContent["faq"]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });

  const updateItem = (i: number, patch: Partial<FaqItem>) => {
    const items = [...data.items];
    items[i] = { ...items[i], ...patch };
    update({ ...data, items });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <Field label="Section label" value={data.label} onChange={s("label")} />
        <Field label="Title part 1" value={data.title1} onChange={s("title1")} />
        <Field label="Title part 2 (gray)" value={data.title2} onChange={s("title2")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA box title" value={data.ctaTitle} onChange={s("ctaTitle")} />
        <Field label="CTA box description" value={data.ctaDesc} onChange={s("ctaDesc")} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">FAQ items</label>
          <button type="button" onClick={() => update({ ...data, items: [...data.items, { title: "", subtitle: "", content: "" }] })}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add item
          </button>
        </div>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center">
                <button type="button" onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 text-left">
                  {item.title || `FAQ ${i + 1}`}
                  {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => update({ ...data, items: data.items.filter((_, j) => j !== i) })}
                  className="px-3 py-3 bg-gray-50 text-gray-400 hover:text-red-500 transition-colors border-l border-gray-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {expanded === i && (
                <div className="p-4 space-y-3">
                  <Field label="Question" value={item.title} onChange={v => updateItem(i, { title: v })} />
                  <Field label="Subtitle (shown below question)" value={item.subtitle} onChange={v => updateItem(i, { subtitle: v })} />
                  <Field label="Answer" value={item.content} onChange={v => updateItem(i, { content: v })} multiline rows={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterTab({ data, update }: { data: HomePageContent["footer"]; update: (v: HomePageContent["footer"]) => void }) {
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });

  const updateMenuItem = (mi: number, patch: Partial<FooterMenuItem>) => {
    const menuItems = [...data.menuItems];
    menuItems[mi] = { ...menuItems[mi], ...patch };
    update({ ...data, menuItems });
  };

  return (
    <div className="space-y-5">
      <Field label="Brand description" value={data.brandDescription} onChange={s("brandDescription")} multiline rows={2} />
      <Field label="Brand subtext" value={data.brandSubtext} onChange={s("brandSubtext")} multiline rows={2} />

      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-2">Footer menu columns</label>
        <div className="space-y-2">
          {data.menuItems.map((menu, mi) => (
            <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
              <button type="button" onClick={() => setExpandedMenu(expandedMenu === mi ? null : mi)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                {menu.title}
                {expandedMenu === mi ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedMenu === mi && (
                <div className="p-4 space-y-3">
                  <Field label="Column title" value={menu.title} onChange={v => updateMenuItem(mi, { title: v })} />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-600">Links</label>
                      <button type="button" onClick={() => updateMenuItem(mi, { links: [...menu.links, { text: "", url: "#" }] })}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {menu.links.map((link, li) => (
                        <div key={li} className="flex gap-2 items-center">
                          <input type="text" placeholder="Link text" value={link.text} onChange={e => {
                            const links = [...menu.links]; links[li] = { ...links[li], text: e.target.value }; updateMenuItem(mi, { links });
                          }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                          <input type="text" placeholder="URL" value={link.url} onChange={e => {
                            const links = [...menu.links]; links[li] = { ...links[li], url: e.target.value }; updateMenuItem(mi, { links });
                          }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                          <button type="button" onClick={() => updateMenuItem(mi, { links: menu.links.filter((_, j) => j !== li) })}
                            className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-600">Bottom links</label>
          <button type="button" onClick={() => update({ ...data, bottomLinks: [...data.bottomLinks, { text: "", url: "#" }] })}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {data.bottomLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" placeholder="Link text" value={link.text} onChange={e => {
                const bottomLinks = [...data.bottomLinks]; bottomLinks[i] = { ...bottomLinks[i], text: e.target.value }; update({ ...data, bottomLinks });
              }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <input type="text" placeholder="URL" value={link.url} onChange={e => {
                const bottomLinks = [...data.bottomLinks]; bottomLinks[i] = { ...bottomLinks[i], url: e.target.value }; update({ ...data, bottomLinks });
              }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              <button type="button" onClick={() => update({ ...data, bottomLinks: data.bottomLinks.filter((_, j) => j !== i) })}
                className="text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main editor ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "howItWorks", label: "How It Works" },
  { id: "downloadCta", label: "Download CTA" },
  { id: "etherealCta", label: "Ethereal CTA" },
  { id: "faq", label: "FAQ" },
  { id: "footer", label: "Footer" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function HomePageEditor() {
  const [content, setContent] = useState<HomePageContent>(defaultHomeContent);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/pages/home")
      .then(r => r.json())
      .then(r => {
        if (r.success) setContent({ ...defaultHomeContent, ...r.data });
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/pages/home", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setErrorMsg((e as Error).message);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [content]);

  const update = (section: TabId) => (val: HomePageContent[typeof section]) =>
    setContent(prev => ({ ...prev, [section]: val }));

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
          <p className="text-gray-500 text-sm mt-0.5">Changes go live within 60 seconds after saving.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </Link>
          <button onClick={save} disabled={status === "saving"}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-60 transition-all shadow-sm">
            <Save className="w-4 h-4" />
            {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : status === "error" ? "Error" : "Save All"}
          </button>
        </div>
      </div>

      {status === "error" && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{errorMsg}</div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "hero" && <HeroTab data={content.hero} update={update("hero")} />}
          {activeTab === "features" && <FeaturesTab data={content.features} update={update("features")} />}
          {activeTab === "howItWorks" && <HowItWorksTab data={content.howItWorks} update={update("howItWorks")} />}
          {activeTab === "downloadCta" && <DownloadCtaTab data={content.downloadCta} update={update("downloadCta")} />}
          {activeTab === "etherealCta" && <EtherealCtaTab data={content.etherealCta} update={update("etherealCta")} />}
          {activeTab === "faq" && <FaqTab data={content.faq} update={update("faq")} />}
          {activeTab === "footer" && <FooterTab data={content.footer} update={update("footer")} />}
        </div>
      </div>
    </div>
  );
}
