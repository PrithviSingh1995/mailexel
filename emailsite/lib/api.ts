const API_BASE = "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: { _id: string; name: string; avatar?: string };
  category: string;
  tags: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  views: number;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string | string[];
  status: "draft" | "published";
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
}

export type BlogPayload = Omit<BlogFormData, "tags"> & { tags?: string[] };

export interface ImageItem {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

export interface StatsData {
  total: number;
  published: number;
  drafts: number;
  totalViews: number;
  topBlogs: { _id: string; title: string; slug: string; views: number; publishedAt: string }[];
}

export const api = {
  login: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: { _id: string; name: string; email: string; role: string } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  getMe: () =>
    request<{ success: boolean; user: { _id: string; name: string; email: string; role: string } }>("/api/auth/me"),

  getAdminBlogs: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== "")) as Record<string, string>
    ).toString();
    return request<{ success: boolean; data: BlogPost[]; pagination: { total: number; page: number; limit: number; totalPages: number } }>(
      `/api/blogs/admin/all${q ? `?${q}` : ""}`
    );
  },

  getAdminBlog: (id: string) =>
    request<{ success: boolean; data: BlogPost }>(`/api/blogs/admin/${id}`),

  createBlog: (data: BlogPayload) =>
    request<{ success: boolean; data: BlogPost }>("/api/blogs/admin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateBlog: (id: string, data: BlogPayload) =>
    request<{ success: boolean; data: BlogPost }>(`/api/blogs/admin/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  togglePublish: (id: string) =>
    request<{ success: boolean; message: string; data: { status: string } }>(`/api/blogs/admin/${id}/publish`, {
      method: "PATCH",
    }),

  deleteBlog: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/blogs/admin/${id}`, { method: "DELETE" }),

  getStats: () => request<{ success: boolean; data: StatsData }>("/api/blogs/admin/stats"),

  getImages: () =>
    request<{ success: boolean; data: ImageItem[] }>("/api/blogs/admin/images"),

  deleteImage: (filename: string) =>
    request<{ success: boolean; message: string }>(`/api/blogs/admin/images/${encodeURIComponent(filename)}`, {
      method: "DELETE",
    }),

  uploadImage: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const token = getToken();
    const form = new FormData();
    form.append("image", file);
    const res = await fetch(`${API_BASE}/api/blogs/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    return res.json();
  },
};
