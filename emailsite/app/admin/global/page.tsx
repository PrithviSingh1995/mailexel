"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Save, ExternalLink, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import type { GlobalContent, NavLink, FooterMenuItem } from "@/lib/types/page-content";
import { defaultGlobalContent } from "@/lib/types/page-content";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Field({ label, value, onChange, multiline = false, rows = 2 }: {
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

// ─── Nav editor ───────────────────────────────────────────────────────────────

function NavTab({ data, update }: { data: GlobalContent["nav"]; update: (v: GlobalContent["nav"]) => void }) {
  const [expandedLink, setExpandedLink] = useState<number | null>(null);
  const s = (k: keyof typeof data) => (v: string) => update({ ...data, [k]: v });

  const updateLink = (i: number, patch: Partial<NavLink>) => {
    const links = [...data.links];
    links[i] = { ...links[i], ...patch };
    update({ ...data, links });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA button text" value={data.ctaText} onChange={s("ctaText")} />
        <Field label="CTA button link" value={data.ctaHref} onChange={s("ctaHref")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sign in text" value={data.signInText} onChange={s("signInText")} />
        <Field label="Sign in link" value={data.signInHref} onChange={s("signInHref")} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">Navigation links</label>
          <button type="button" onClick={() => update({ ...data, links: [...data.links, { label: "", href: "#" }] })}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add link
          </button>
        </div>
        <div className="space-y-2">
          {data.links.map((link, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center">
                <button type="button" onClick={() => setExpandedLink(expandedLink === i ? null : i)}
                  className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100 text-left">
                  {link.label || `Link ${i + 1}`}
                  {expandedLink === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => update({ ...data, links: data.links.filter((_, j) => j !== i) })}
                  className="px-3 py-3 bg-gray-50 text-gray-400 hover:text-red-500 transition-colors border-l border-gray-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {expandedLink === i && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Label" value={link.label} onChange={v => updateLink(i, { label: v })} />
                    <Field label="Link (href)" value={link.href} onChange={v => updateLink(i, { href: v })} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-600">Dropdown items (optional)</label>
                      <button type="button" onClick={() => updateLink(i, { dropdown: [...(link.dropdown ?? []), ""] })}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(link.dropdown ?? []).map((item, di) => (
                        <div key={di} className="flex gap-2 items-center">
                          <input type="text" value={item} onChange={e => {
                            const dropdown = [...(link.dropdown ?? [])]; dropdown[di] = e.target.value;
                            updateLink(i, { dropdown });
                          }} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                          <button type="button" onClick={() => updateLink(i, { dropdown: (link.dropdown ?? []).filter((_, j) => j !== di) })}
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
    </div>
  );
}

// ─── Footer editor ────────────────────────────────────────────────────────────

function FooterTab({ data, update }: { data: GlobalContent["footer"]; update: (v: GlobalContent["footer"]) => void }) {
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
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-600">Footer menu columns</label>
          <button type="button" onClick={() => update({ ...data, menuItems: [...data.menuItems, { title: "", links: [] }] })}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add column
          </button>
        </div>
        <div className="space-y-2">
          {data.menuItems.map((menu, mi) => (
            <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center">
                <button type="button" onClick={() => setExpandedMenu(expandedMenu === mi ? null : mi)}
                  className="flex-1 flex items-center justify-between px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                  {menu.title || `Column ${mi + 1}`}
                  {expandedMenu === mi ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => update({ ...data, menuItems: data.menuItems.filter((_, j) => j !== mi) })}
                  className="px-3 py-3 bg-gray-50 text-gray-400 hover:text-red-500 transition-colors border-l border-gray-200">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
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
          <label className="text-xs font-semibold text-gray-600">Bottom links (legal)</label>
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

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "nav", label: "Header / Navigation" },
  { id: "footer", label: "Footer" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function GlobalSettingsEditor() {
  const [content, setContent] = useState<GlobalContent>(defaultGlobalContent);
  const [activeTab, setActiveTab] = useState<TabId>("nav");
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/pages/global")
      .then(r => r.json())
      .then(r => {
        if (r.success) setContent({ ...defaultGlobalContent, ...r.data });
        setStatus("idle");
      })
      .catch(() => setStatus("idle"));
  }, []);

  const save = useCallback(async () => {
    setStatus("saving");
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/pages/global", {
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

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-gray-500 text-sm mt-0.5">Header and footer apply to all pages. Changes go live within 60 seconds.</p>
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

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3.5 text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "text-red-600 border-b-2 border-red-600 bg-red-50/50"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "nav" && <NavTab data={content.nav} update={v => setContent(prev => ({ ...prev, nav: v }))} />}
          {activeTab === "footer" && <FooterTab data={content.footer} update={v => setContent(prev => ({ ...prev, footer: v }))} />}
        </div>
      </div>
    </div>
  );
}
