"use client";

import { useEffect, useState } from "react";
import { Users, Plus, Trash2, Edit2, X, Check, Shield, Pen } from "lucide-react";

type Author = {
  id: string; name: string; email: string; role: string;
  avatar: string; bio: string; linkedin: string; longBio: string; createdAt: string;
  _count: { blogs: number; assignedTasks: number };
};

const EMPTY_FORM = { name: "", email: "", password: "", role: "editor", avatar: "", bio: "", linkedin: "", longBio: "" };

function getToken() { return localStorage.getItem("admin_token") ?? ""; }

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder = "", rows = 4 }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-y"
      />
    </div>
  );
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const f = (key: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [key]: v }));

  useEffect(() => {
    fetch("/api/users", { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(r => r.json())
      .then(r => { if (r.success) setAuthors(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => { setEditId(null); setForm({ ...EMPTY_FORM }); setError(""); setShowForm(true); };
  const openEdit = (a: Author) => {
    setEditId(a.id);
    setForm({ name: a.name, email: a.email, password: "", role: a.role, avatar: a.avatar, bio: a.bio, linkedin: a.linkedin ?? "", longBio: a.longBio ?? "" });
    setError("");
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setError(""); };

  const save = async () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (!editId && !form.password) { setError("Password is required for new users"); return; }
    setSaving(true);
    setError("");
    try {
      const url = editId ? `/api/users/${editId}` : "/api/users";
      const method = editId ? "PUT" : "POST";
      const body = editId
        ? { name: form.name, email: form.email, role: form.role, avatar: form.avatar, bio: form.bio, linkedin: form.linkedin, longBio: form.longBio, ...(form.password ? { password: form.password } : {}) }
        : form;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      if (editId) {
        setAuthors(prev => prev.map(a => a.id === editId ? data.data : a));
      } else {
        setAuthors(prev => [...prev, data.data]);
      }
      closeForm();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this author? This cannot be undone.")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    const data = await res.json();
    if (data.success) setAuthors(prev => prev.filter(a => a.id !== id));
    else alert(data.message);
  };

  const admins = authors.filter(a => a.role === "admin").length;
  const editors = authors.filter(a => a.role === "editor").length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage admin and editor accounts.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Author
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: authors.length, icon: Users, color: "" },
          { label: "Admins", value: admins, icon: Shield, color: "text-red-600" },
          { label: "Editors", value: editors, icon: Pen, color: "text-blue-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icon className={`w-5 h-5 ${color || "text-gray-500"}`} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${color || "text-gray-900"}`}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">{editId ? "Edit Author" : "New Author"}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Full name *" value={form.name} onChange={f("name")} placeholder="John Smith" />
            <Field label="Email *" value={form.email} onChange={f("email")} type="email" placeholder="john@example.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field
              label={editId ? "New password (leave blank to keep)" : "Password *"}
              value={form.password}
              onChange={f("password")}
              type="password"
              placeholder="Min. 8 characters"
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <Field label="Avatar URL" value={form.avatar} onChange={f("avatar")} placeholder="https://..." />
          <Field label="Short Bio" value={form.bio} onChange={f("bio")} placeholder="One-line bio shown in blog post header" />
          <Field label="LinkedIn URL" value={form.linkedin} onChange={f("linkedin")} placeholder="https://linkedin.com/in/username" />
          <TextareaField label="Full Bio (author page)" value={form.longBio} onChange={f("longBio")} placeholder="Detailed bio shown on the public author profile page..." rows={5} />

          <div className="flex gap-3 pt-1">
            <button
              onClick={save}
              disabled={saving || !form.name.trim() || !form.email.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving…" : editId ? "Save Changes" : "Create Author"}
            </button>
            <button
              onClick={closeForm}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Authors list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">All Authors ({authors.length})</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : authors.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">No authors yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {authors.map(author => (
              <div key={author.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                {author.avatar ? (
                  <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">{author.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      author.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {author.role}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{author.email}</div>
                  {author.bio && <div className="text-xs text-gray-400 truncate max-w-xs">{author.bio}</div>}
                </div>

                {/* Stats */}
                <div className="hidden sm:flex flex-col items-end gap-0.5 text-xs text-gray-400 flex-shrink-0">
                  <span>{author._count.blogs} blog{author._count.blogs !== 1 ? "s" : ""}</span>
                  <span>{author._count.assignedTasks} task{author._count.assignedTasks !== 1 ? "s" : ""}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(author)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => del(author.id)}
                    className="p-2 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-200 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
