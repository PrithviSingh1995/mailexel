"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Mail,
  Menu,
  X,
  ChevronRight,
  Images,
  Globe,
  Settings,
  ClipboardList,
  Star,
  Users,
} from "lucide-react";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") return null;
  if (!user) return <>{children}</>;

  const navGroups = [
    {
      label: "Content",
      items: [
        { href: "/admin/dashboard",  label: "Dashboard",      icon: LayoutDashboard },
        { href: "/admin/blogs",      label: "All Posts",      icon: FileText },
        { href: "/admin/blogs/new",  label: "New Post",       icon: PlusCircle },
        { href: "/admin/authors",    label: "Authors",        icon: Users },
        { href: "/admin/tasks",      label: "Blog Tasks",     icon: ClipboardList },
        { href: "/admin/reviews",    label: "Reviews",        icon: Star },
      ],
    },
    {
      label: "Site",
      items: [
        { href: "/admin/pages",      label: "Pages",          icon: Globe },
        { href: "/admin/global",     label: "Header & Footer", icon: Settings },
        { href: "/admin/images",     label: "Image Library",  icon: Images },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <img src="/logo-black.svg" alt="MailExel" className="h-6 w-auto" />
          <div className="text-gray-400 text-xs ml-1">Admin</div>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest px-3 mb-1">
                {group.label}
              </p>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/admin/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                      active
                        ? "bg-red-600 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {label}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs font-bold uppercase">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm font-medium truncate">{user.name}</div>
              <div className="text-gray-400 text-xs capitalize">{user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
              <Mail className="w-3 h-3 text-white" />
            </div>
            <span className="text-gray-900 font-semibold text-sm">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
