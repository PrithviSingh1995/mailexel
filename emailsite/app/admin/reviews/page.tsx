"use client";

import { useEffect, useState } from "react";
import { Star, Plus, Trash2, Eye, EyeOff, Home, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  rating: number;
  content: string;
  tag: string;
  tagDark: boolean;
  published: boolean;
  showOnHome: boolean;
  createdAt: string;
}

const EMPTY: Omit<Review, "id" | "createdAt"> = {
  authorName: "", authorRole: "", authorImage: "",
  rating: 5, content: "", tag: "", tagDark: false,
  published: false, showOnHome: false,
};

function getToken() { return localStorage.getItem("admin_token") ?? ""; }

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}>
          <Star className={`w-5 h-5 transition-colors ${i <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`} />
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {multiline
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-y" />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
      }
    </div>
  );
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then(r => r.json())
      .then(r => { if (r.success) setReviews(r.data); })
      .finally(() => setLoading(false));
  }, []);

  const submit = async () => {
    if (!form.authorName.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.data, ...prev]);
        setForm({ ...EMPTY });
        setShowForm(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (id: string, field: "published" | "showOnHome", current: boolean) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ [field]: !current }),
    });
    const data = await res.json();
    if (data.success) setReviews(prev => prev.map(r => r.id === id ? data.data : r));
  };

  const del = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const published = reviews.filter(r => r.published).length;
  const onHome = reviews.filter(r => r.showOnHome).length;
  const avg = reviews.filter(r => r.published).length > 0
    ? (reviews.filter(r => r.published).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.published).length).toFixed(1)
    : "—";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage customer reviews. Publish to site, pin to homepage.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/reviews" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </Link>
          <button onClick={() => setShowForm(v => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Review
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: reviews.length },
          { label: "Published", value: published },
          { label: "Avg Rating (published)", value: avg },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-900">New Review</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Author name *" value={form.authorName} onChange={v => setForm(p => ({ ...p, authorName: v }))} />
            <Field label="Author role / company" value={form.authorRole} onChange={v => setForm(p => ({ ...p, authorRole: v }))} />
          </div>
          <Field label="Author photo URL" value={form.authorImage} onChange={v => setForm(p => ({ ...p, authorImage: v }))} />
          <Field label="Review content *" value={form.content} onChange={v => setForm(p => ({ ...p, content: v }))} multiline rows={4} />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tag (e.g. Migration, Viewer)" value={form.tag} onChange={v => setForm(p => ({ ...p, tag: v }))} />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Rating</label>
              <StarPicker value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.tagDark} onChange={e => setForm(p => ({ ...p, tagDark: e.target.checked }))} className="rounded" />
              Dark tag style
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="rounded" />
              Publish immediately
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.showOnHome} onChange={e => setForm(p => ({ ...p, showOnHome: e.target.checked }))} className="rounded" />
              Show on homepage
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={submit} disabled={saving || !form.authorName.trim() || !form.content.trim()}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors">
              {saving ? "Saving…" : "Save Review"}
            </button>
            <button onClick={() => { setShowForm(false); setForm({ ...EMPTY }); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">All Reviews ({reviews.length})</h2>
          <span className="text-xs text-gray-400">{onHome} pinned to homepage</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-400 text-sm">No reviews yet. Click "Add Review" to get started.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map(review => (
              <div key={review.id} className="px-6 py-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {review.authorImage ? (
                      <img src={review.authorImage} alt={review.authorName} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                        {review.authorName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-gray-900">{review.authorName}</span>
                      {review.authorRole && <span className="text-xs text-gray-400">{review.authorRole}</span>}
                      {review.tag && (
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${review.tagDark ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                          {review.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{review.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggle(review.id, "showOnHome", review.showOnHome)}
                      title={review.showOnHome ? "Remove from homepage" : "Pin to homepage"}
                      className={`p-2 rounded-lg border transition-colors text-xs font-semibold flex items-center gap-1 ${review.showOnHome ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-400 border-gray-200 hover:border-blue-200 hover:text-blue-500"}`}
                    >
                      <Home className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggle(review.id, "published", review.published)}
                      title={review.published ? "Unpublish" : "Publish"}
                      className={`p-2 rounded-lg border transition-colors ${review.published ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200 hover:border-green-200 hover:text-green-500"}`}
                    >
                      {review.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => del(review.id)} className="p-2 rounded-lg border border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
