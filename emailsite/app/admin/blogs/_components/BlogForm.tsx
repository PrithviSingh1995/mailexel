"use client";

import { useState, useRef, useEffect, ChangeEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api, BlogPost, ImageItem, User } from "@/lib/api";
import { SHORTCODES } from "@/lib/shortcodes";
import {
  Save,
  Globe,
  Image as ImageIcon,
  Upload,
  X,
  Tag,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Search,
  Check,
  Copy,
  LayoutGrid,
  Code2,
  UserCircle,
} from "lucide-react";

interface BlogFormProps {
  blog?: BlogPost;
  mode: "create" | "edit";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Image Picker Modal ─────────────────────────────────────────────────────────
function ImagePickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await api.getImages();
      setImages(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useState(() => { fetchImages(); });

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      await Promise.all(files.map((f) => api.uploadImage(f)));
      await fetchImages();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleCopy = (url: string, filename: string) => {
    navigator.clipboard.writeText(url);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const filtered = images.filter((img) =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <h2 className="text-gray-900 font-semibold text-sm">Image Library</h2>
            <span className="text-gray-400 text-xs">· click to insert</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Upload className="w-3 h-3" />
              )}
              Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-red-300 transition-colors"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
              <ImageIcon className="w-8 h-8 text-gray-300" />
              <p className="text-sm">{search ? "No images match" : "No images yet — upload some above"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((img) => (
                <div key={img.filename} className="group relative">
                  {/* Clickable thumbnail */}
                  <div
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-red-400 transition-all"
                    onClick={() => onSelect(img.url)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 rounded-lg transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-md transition-opacity">
                        Insert
                      </span>
                    </div>
                  </div>

                  {/* Copy URL button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(img.url, img.filename); }}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 hover:bg-white rounded-md flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy URL"
                  >
                    {copiedFile === img.filename ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </button>

                  <p className="text-gray-400 text-xs truncate mt-1" title={img.filename}>
                    {img.filename.length > 14 ? img.filename.slice(0, 14) + "…" : img.filename}
                  </p>
                  <p className="text-gray-300 text-xs">{formatBytes(img.size)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main BlogForm ──────────────────────────────────────────────────────────────
export default function BlogForm({ blog, mode }: BlogFormProps) {
  const router = useRouter();
  const featuredFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPosRef = useRef(0);

  const [form, setForm] = useState({
    title: blog?.title ?? "",
    excerpt: blog?.excerpt ?? "",
    content: blog?.content ?? "",
    category: blog?.category ?? "",
    tags: blog?.tags?.join(", ") ?? "",
    featuredImage: blog?.featuredImage ?? "",
    metaTitle: blog?.metaTitle ?? "",
    metaDescription: blog?.metaDescription ?? "",
    authorId: blog?.author?._id ?? "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [shortcodesOpen, setShortcodesOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const shortcodesBtnRef = useRef<HTMLButtonElement>(null);
  const shortcodesMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getUsers()
      .then((r) => setUsers(r.data))
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    if (!shortcodesOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        shortcodesBtnRef.current?.contains(e.target as Node) ||
        shortcodesMenuRef.current?.contains(e.target as Node)
      ) return;
      setShortcodesOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [shortcodesOpen]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const set =
    (field: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const saveCursor = () => {
    if (textareaRef.current) cursorPosRef.current = textareaRef.current.selectionStart;
  };

  const insertAtCursor = (text: string) => {
    const pos = cursorPosRef.current;
    setForm((prev) => ({
      ...prev,
      content: prev.content.slice(0, pos) + text + prev.content.slice(pos),
    }));
    // Restore focus + move cursor after inserted text
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = pos + text.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
        cursorPosRef.current = newPos;
      }
    }, 10);
  };

  const handleImagePickerSelect = (url: string) => {
    insertAtCursor(`<img src="${url}" alt="" style="max-width:100%;" />\n`);
    setPickerOpen(false);
  };

  const handleContentImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingContent(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success) {
        insertAtCursor(`<img src="${res.url}" alt="" style="max-width:100%;" />\n`);
        showToast("success", "Image uploaded and inserted!");
      }
    } catch {
      showToast("error", "Image upload failed");
    } finally {
      setUploadingContent(false);
      if (contentFileRef.current) contentFileRef.current.value = "";
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const buildPayload = (status: "draft" | "published") => ({
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    category: form.category,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    featuredImage: form.featuredImage,
    metaTitle: form.metaTitle || form.title,
    metaDescription: form.metaDescription || form.excerpt,
    status,
    ...(form.authorId ? { authorId: form.authorId } : {}),
  });

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      showToast("error", "Title, excerpt, and content are required");
      return;
    }
    const setter = status === "published" ? setPublishing : setSaving;
    setter(true);
    try {
      if (mode === "create") {
        await api.createBlog(buildPayload(status));
        showToast("success", `Post ${status === "published" ? "published" : "saved as draft"}!`);
        setTimeout(() => router.push("/admin/blogs"), 1200);
      } else {
        await api.updateBlog(blog!._id, buildPayload(status));
        showToast("success", "Changes saved!");
      }
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Save failed");
    } finally {
      setter(false);
    }
  };

  const handleFeaturedUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success) {
        setForm((prev) => ({ ...prev, featuredImage: res.url }));
        showToast("success", "Featured image uploaded!");
      }
    } catch {
      showToast("error", "Image upload failed");
    } finally {
      setUploadingFeatured(false);
      if (featuredFileRef.current) featuredFileRef.current.value = "";
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* Image picker modal */}
      {pickerOpen && (
        <ImagePickerModal
          onSelect={handleImagePickerSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/blogs")}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-gray-900 text-xl font-bold">
              {mode === "create" ? "New Post" : "Edit Post"}
            </h1>
            {blog && <p className="text-gray-400 text-xs mt-0.5">{blog.slug}</p>}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving || publishing}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving || publishing}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {publishing ? (
              <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
              Title *
            </label>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="Enter post title..."
              className="w-full bg-transparent text-gray-900 text-xl font-bold placeholder-gray-300 focus:outline-none"
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
              Excerpt *{" "}
              <span className="normal-case text-gray-400 font-normal">(max 300 chars)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={set("excerpt")}
              placeholder="A short summary of the post..."
              rows={3}
              maxLength={300}
              className="w-full bg-transparent text-gray-700 text-sm placeholder-gray-300 focus:outline-none resize-none leading-relaxed"
            />
            <div className="text-right text-gray-300 text-xs mt-1">{form.excerpt.length}/300</div>
          </div>

          {/* Content */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Image toolbar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
              <span className="text-gray-400 text-xs font-medium mr-1">Insert image:</span>

              {/* Upload new */}
              <button
                onClick={() => { saveCursor(); contentFileRef.current?.click(); }}
                disabled={uploadingContent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 text-xs font-medium transition-colors disabled:opacity-50"
              >
                {uploadingContent ? (
                  <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3 h-3" />
                )}
                Upload
              </button>
              <input
                ref={contentFileRef}
                type="file"
                accept="image/*"
                onChange={handleContentImageUpload}
                className="hidden"
              />

              {/* Browse library */}
              <button
                onClick={() => { saveCursor(); setPickerOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 text-xs font-medium transition-colors"
              >
                <LayoutGrid className="w-3 h-3" />
                Browse Library
              </button>

              {/* Shortcodes dropdown */}
              <div className="relative">
                <button
                  ref={shortcodesBtnRef}
                  onClick={() => { saveCursor(); setShortcodesOpen((v) => !v); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 text-xs font-medium transition-colors"
                >
                  <Code2 className="w-3 h-3" />
                  Shortcodes
                  <ChevronDown className={`w-3 h-3 transition-transform ${shortcodesOpen ? "rotate-180" : ""}`} />
                </button>

                {shortcodesOpen && (
                  <div
                    ref={shortcodesMenuRef}
                    className="absolute top-full left-0 mt-1.5 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
                    style={{ maxHeight: 360, overflowY: "auto" }}
                  >
                    {Array.from(new Set(SHORTCODES.map((s) => s.category))).map((cat) => (
                      <div key={cat}>
                        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                          {cat}
                        </div>
                        {SHORTCODES.filter((s) => s.category === cat).map((sc) => (
                          <button
                            key={sc.label}
                            onClick={() => {
                              insertAtCursor(sc.template + "\n");
                              setShortcodesOpen(false);
                            }}
                            className="w-full flex items-start gap-2.5 px-3 py-2 hover:bg-red-50 hover:text-red-700 text-left transition-colors group"
                          >
                            <span className="w-5 h-5 mt-0.5 rounded bg-gray-100 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0">
                              <Code2 className="w-2.5 h-2.5 text-gray-400 group-hover:text-red-500" />
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-gray-700 group-hover:text-red-700 text-xs font-semibold leading-tight">{sc.label}</span>
                              <span className="block text-gray-400 text-[10px] leading-tight mt-0.5">{sc.description}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="ml-auto text-gray-300 text-xs">{form.content.length} chars</span>
            </div>

            {/* Textarea */}
            <div className="p-5">
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={set("content")}
                onClick={saveCursor}
                onKeyUp={saveCursor}
                placeholder="Write your blog post content here... HTML tags are supported."
                rows={24}
                className="w-full bg-transparent text-gray-700 text-sm font-mono placeholder-gray-300 focus:outline-none resize-y leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Featured Image */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
              Featured Image
            </label>
            {form.featuredImage ? (
              <div className="relative mb-3 rounded-lg overflow-hidden bg-gray-100 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    onClick={() => handleCopyUrl(form.featuredImage)}
                    className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-gray-600 hover:text-gray-900"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setForm((p) => ({ ...p, featuredImage: "" }))}
                    className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-gray-600 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-300 mb-3">
                <ImageIcon className="w-6 h-6" />
                <span className="text-xs">No image selected</span>
              </div>
            )}
            <div className="space-y-2">
              <input
                value={form.featuredImage}
                onChange={set("featuredImage")}
                placeholder="Paste URL..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-xs placeholder-gray-400 focus:outline-none focus:border-red-300 transition-colors"
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => featuredFileRef.current?.click()}
                  disabled={uploadingFeatured}
                  className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 text-gray-500 hover:text-gray-700 text-xs transition-colors disabled:opacity-50"
                >
                  {uploadingFeatured ? (
                    <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  Upload
                </button>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  <LayoutGrid className="w-3 h-3" />
                  Library
                </button>
              </div>
              <input
                ref={featuredFileRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={set("category")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm appearance-none focus:outline-none focus:border-red-300 transition-colors"
                >
                  <option value="">Select or type below</option>
                  <option value="Email Conversion">Email Conversion</option>
                  <option value="Email Migration">Email Migration</option>
                  <option value="Email Backup">Email Backup</option>
                  <option value="Email Viewer">Email Viewer</option>
                  <option value="How To Guide">How To Guide</option>
                  <option value="General">General</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <input
                value={form.category}
                onChange={set("category")}
                placeholder="Or type custom category"
                className="w-full mt-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-red-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </span>
              </label>
              <input
                value={form.tags}
                onChange={set("tags")}
                placeholder="ost, pst, outlook, conversion"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-red-300 transition-colors"
              />
              <p className="text-gray-400 text-xs mt-1">Comma separated</p>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <label className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">
              <UserCircle className="w-3.5 h-3.5" /> Author
            </label>
            {usersLoading ? (
              <div className="flex items-center gap-2 py-2 text-gray-400 text-sm">
                <div className="w-3.5 h-3.5 border-2 border-gray-200 border-t-red-400 rounded-full animate-spin" />
                Loading authors…
              </div>
            ) : users.length === 0 ? (
              <p className="text-gray-400 text-sm py-1">
                {blog?.author?.name ? `Current: ${blog.author.name}` : "No authors available"}
              </p>
            ) : (
              <div className="relative">
                <select
                  value={form.authorId}
                  onChange={set("authorId")}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm appearance-none focus:outline-none focus:border-red-300 transition-colors"
                >
                  <option value="">— Select author —</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wide">SEO</h3>
            <div>
              <label className="block text-gray-500 text-xs mb-1.5">Meta Title</label>
              <input
                value={form.metaTitle}
                onChange={set("metaTitle")}
                placeholder="Defaults to post title"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-red-300 transition-colors"
              />
              <div className="text-right text-gray-300 text-xs mt-0.5">{form.metaTitle.length}/60</div>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-1.5">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={set("metaDescription")}
                placeholder="Defaults to excerpt"
                rows={3}
                maxLength={160}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm placeholder-gray-400 focus:outline-none focus:border-red-300 resize-none transition-colors"
              />
              <div className="text-right text-gray-300 text-xs mt-0.5">{form.metaDescription.length}/160</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
