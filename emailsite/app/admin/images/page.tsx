"use client";

import { useEffect, useState, useRef, ChangeEvent } from "react";
import { api, ImageItem } from "@/lib/api";
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  ImageIcon,
  AlertCircle,
  X,
} from "lucide-react";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImageItem | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await api.getImages();
      setImages(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

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

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    setDeletingFile(filename);
    try {
      await api.deleteImage(filename);
      setImages((prev) => prev.filter((img) => img.filename !== filename));
      if (preview?.filename === filename) setPreview(null);
    } finally {
      setDeletingFile(null);
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Image Library</h1>
          <p className="text-gray-400 text-sm mt-1">{images.length} images uploaded</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by filename..."
          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-100 transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center h-64 gap-4">
          <ImageIcon className="w-10 h-10 text-gray-300" />
          <div className="text-center">
            <p className="text-gray-500 font-medium text-sm">
              {search ? "No images match your search" : "No images yet"}
            </p>
            {!search && (
              <p className="text-gray-400 text-xs mt-1">Upload images to use in your blog posts</p>
            )}
          </div>
          {!search && (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Upload your first image
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((img) => (
            <div
              key={img.filename}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Thumbnail */}
              <div
                className="aspect-square bg-gray-50 cursor-pointer overflow-hidden"
                onClick={() => setPreview(img)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="p-2.5">
                <p className="text-gray-700 text-xs font-medium truncate" title={img.filename}>
                  {img.filename}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {formatBytes(img.size)} · {formatDate(img.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => handleCopy(img.url, img.filename)}
                    title="Copy URL"
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {copiedFile === img.filename ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(img.filename)}
                    disabled={deletingFile === img.filename}
                    title="Delete"
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingFile === img.filename ? (
                      <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview lightbox */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="bg-gray-100 flex items-center justify-center max-h-[60vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.url}
                alt={preview.filename}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Details */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <p className="text-gray-900 font-semibold text-sm truncate">{preview.filename}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {formatBytes(preview.size)} · {formatDate(preview.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setPreview(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* URL bar */}
              <div className="flex gap-2">
                <input
                  readOnly
                  value={preview.url}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 text-xs focus:outline-none font-mono truncate"
                />
                <button
                  onClick={() => handleCopy(preview.url, preview.filename)}
                  className="flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  {copiedFile === preview.filename ? (
                    <><Check className="w-3.5 h-3.5" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy URL</>
                  )}
                </button>
                <button
                  onClick={() => handleDelete(preview.filename)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
