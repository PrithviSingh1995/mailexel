"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, StatsData } from "@/lib/api";
import type { GlobalContent, NavLink, FooterMenuItem } from "@/lib/types/page-content";
import { defaultGlobalContent } from "@/lib/types/page-content";
import {
  FileText,
  Globe,
  FileEdit,
  Eye,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Save,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Layout,
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
} from "lucide-react";

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, accent }: {
  label: string; value: number | string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-5 border ${accent ? "bg-red-600 border-red-600" : "bg-white border-gray-200"}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm ${accent ? "text-red-100" : "text-gray-500"}`}>{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent ? "bg-red-500" : "bg-gray-100"}`}>
          <Icon className={`w-4 h-4 ${accent ? "text-white" : "text-gray-500"}`} />
        </div>
      </div>
      <div className={`text-3xl font-bold ${accent ? "text-white" : "text-gray-900"}`}>
        {Number(value).toLocaleString()}
      </div>
    </div>
  );
}

// ─── Task panel ───────────────────────────────────────────────────────────────

type BlogTask = { id: string; title: string; status: string; createdAt: string };

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending:    { label: "Pending",    icon: Clock,         className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  processing: { label: "Processing", icon: Send,          className: "bg-blue-50 text-blue-700 border-blue-200" },
  done:       { label: "Done",       icon: CheckCircle2,  className: "bg-green-50 text-green-700 border-green-200" },
  failed:     { label: "Failed",     icon: XCircle,       className: "bg-red-50 text-red-700 border-red-200" },
};

function TaskPanel() {
  const [tasks, setTasks] = useState<BlogTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/tasks")
      .then(r => r.json())
      .then(r => { if (r.success) setTasks(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    setAdding(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: input.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks(prev => [data.data, ...prev]);
        setInput("");
      }
    } finally {
      setAdding(false);
    }
  };

  const deleteTask = async (id: string) => {
    const token = localStorage.getItem("auth_token");
    await fetch(`/api/tasks/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem("auth_token");
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) setTasks(prev => prev.map(t => t.id === id ? data.data : t));
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <ClipboardList className="w-4 h-4 text-red-500" />
        <h2 className="text-gray-900 font-semibold text-sm">Blog Task Queue</h2>
        <span className="ml-auto text-xs text-gray-400">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Add task input */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter blog title to queue…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={addTask}
            disabled={adding || !input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="px-6 py-10 text-center text-gray-400 text-sm">
          No tasks yet. Add a blog title above to get started.
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {tasks.map(task => {
            const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
            const Icon = cfg.icon;
            return (
              <div key={task.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">{task.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <select
                  value={task.status}
                  onChange={e => updateStatus(task.id, e.target.value)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${cfg.className}`}
                >
                  {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Global settings helpers ──────────────────────────────────────────────────

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

// ─── Nav editor tab ───────────────────────────────────────────────────────────

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

// ─── Footer editor tab ────────────────────────────────────────────────────────

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

// ─── Global settings panel ────────────────────────────────────────────────────

const GLOBAL_TABS = [
  { id: "nav", label: "Header / Navigation" },
  { id: "footer", label: "Footer" },
] as const;

type GlobalTabId = typeof GLOBAL_TABS[number]["id"];

function GlobalSettingsPanel() {
  const [content, setContent] = useState<GlobalContent>(defaultGlobalContent);
  const [activeTab, setActiveTab] = useState<GlobalTabId>("nav");
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
      <div className="flex items-center justify-center h-32">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-red-500" />
          <h2 className="text-gray-900 font-semibold text-sm">Header & Footer</h2>
          <span className="text-xs text-gray-400">— applies to all pages</span>
        </div>
        <button onClick={save} disabled={status === "saving"}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 disabled:opacity-60 transition-all">
          <Save className="w-3.5 h-3.5" />
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : status === "error" ? "Error" : "Save"}
        </button>
      </div>

      {status === "error" && (
        <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{errorMsg}</div>
      )}

      <div className="flex border-b border-gray-100">
        {GLOBAL_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold transition-colors ${
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
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Your site at a glance</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6 text-sm">
          Failed to load stats: {error}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Posts" value={stats?.total ?? 0} icon={FileText} />
          <StatCard label="Published" value={stats?.published ?? 0} icon={Globe} accent />
          <StatCard label="Drafts" value={stats?.drafts ?? 0} icon={FileEdit} />
          <StatCard label="Total Views" value={stats?.totalViews ?? 0} icon={Eye} />
        </div>
      )}

      {/* Top posts */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <h2 className="text-gray-900 font-semibold text-sm">Top Posts by Views</h2>
          </div>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-xs transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.topBlogs && stats.topBlogs.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {stats.topBlogs.map((blog, i) => (
              <div key={blog._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                <span className="text-gray-300 text-sm font-mono w-5 flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 text-sm font-medium truncate">{blog.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{blog.slug}</p>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-sm flex-shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No published posts yet.</p>
            <Link
              href="/admin/blogs/new"
              className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm mt-2 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create your first post
            </Link>
          </div>
        )}
      </div>

      {/* Blog task queue */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <TaskPanel />
      </div>

      {/* Header & Footer editor */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <GlobalSettingsPanel />
      </div>
    </div>
  );
}
