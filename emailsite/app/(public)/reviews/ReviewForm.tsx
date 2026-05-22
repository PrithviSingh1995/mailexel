"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [form, setForm] = useState({ authorName: "", authorRole: "", content: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim() || !form.content.trim()) return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setStatus("done");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Thank you for your review!</h3>
        <p className="text-gray-500 text-sm">Your review has been submitted and is pending approval. It will appear once our team reviews it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Write a Review</h3>
        <p className="text-sm text-gray-400">Share your experience with MailExel. Reviews are approved before publishing.</p>
      </div>

      {/* Star rating */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2">Your Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(i)}
            >
              <Star className={`w-7 h-7 transition-colors ${i <= (hovered || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-400 self-center">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][hovered || rating]}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
          <input
            type="text"
            required
            value={form.authorName}
            onChange={e => setForm(p => ({ ...p, authorName: e.target.value }))}
            placeholder="John Smith"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Role / Company <span className="font-normal text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={form.authorRole}
            onChange={e => setForm(p => ({ ...p, authorRole: e.target.value }))}
            placeholder="IT Director · Accenture"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Your Review *</label>
        <textarea
          required
          rows={4}
          value={form.content}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          placeholder="Tell us about your experience with MailExel…"
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">{error || "Something went wrong. Please try again."}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting" || !form.authorName.trim() || !form.content.trim()}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        <Send className="w-4 h-4" />
        {status === "submitting" ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
