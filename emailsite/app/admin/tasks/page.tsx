"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Plus, Trash2, CheckCircle2, Clock, Send, XCircle, User } from "lucide-react";

type Author = { id: string; name: string; avatar: string };
type BlogTask = {
  id: string; title: string; status: string;
  createdAt: string; updatedAt: string;
  assignedAuthor: Author | null;
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; cls: string }> = {
  pending:    { label: "Pending",    icon: Clock,        cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  processing: { label: "Processing", icon: Send,         cls: "bg-blue-50 text-blue-700 border-blue-200" },
  done:       { label: "Done",       icon: CheckCircle2, cls: "bg-green-50 text-green-700 border-green-200" },
  failed:     { label: "Failed",     icon: XCircle,      cls: "bg-red-50 text-red-700 border-red-200" },
};

function getToken() { return localStorage.getItem("admin_token") ?? ""; }

export default function TasksPage() {
  const [tasks, setTasks] = useState<BlogTask[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then(r => r.json()),
      fetch("/api/users", { headers: { Authorization: `Bearer ${getToken()}` } }).then(r => r.json()),
    ]).then(([taskRes, userRes]) => {
      if (taskRes.success) setTasks(taskRes.data);
      if (userRes.success) setAuthors(userRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          title: input.trim(),
          ...(selectedAuthor ? { assignedAuthorId: selectedAuthor } : {}),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setTasks(prev => [data.data, ...prev]);
      setInput("");
      setSelectedAuthor("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setAdding(false);
    }
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) setTasks(prev => prev.map(t => t.id === id ? data.data : t));
  };

  const updateAuthor = async (id: string, assignedAuthorId: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ assignedAuthorId: assignedAuthorId || null }),
    });
    const data = await res.json();
    if (data.success) setTasks(prev => prev.map(t => t.id === id ? data.data : t));
  };

  const pending = tasks.filter(t => t.status === "pending").length;
  const done = tasks.filter(t => t.status === "done").length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Task Queue</h1>
          <p className="text-gray-500 text-sm mt-0.5">Add blog titles to queue for AI publishing.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg font-semibold">
            {pending} pending
          </span>
          <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg font-semibold">
            {done} done
          </span>
        </div>
      </div>

      {/* Add task */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
        {error && (
          <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter blog title to queue…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={addTask}
            disabled={adding || !input.trim()}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Author assignment */}
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <select
            value={selectedAuthor}
            onChange={e => setSelectedAuthor(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="">Assign to author (optional)</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <ClipboardList className="w-4 h-4 text-red-500" />
          <h2 className="text-gray-900 font-semibold text-sm">All Tasks</h2>
          <span className="ml-auto text-xs text-gray-400">{tasks.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-7 h-7 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <ClipboardList className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No tasks yet. Add a blog title above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {tasks.map(task => {
              const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              return (
                <div key={task.id} className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${
                    task.status === "done" ? "text-green-500" :
                    task.status === "processing" ? "text-blue-500" :
                    task.status === "failed" ? "text-red-500" : "text-yellow-500"
                  }`} />

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">{task.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Added {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  {/* Author selector */}
                  <select
                    value={task.assignedAuthor?.id ?? ""}
                    onChange={e => updateAuthor(task.id, e.target.value)}
                    className="text-xs px-2 py-1.5 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-400 bg-white max-w-[130px]"
                    title="Assigned author"
                  >
                    <option value="">No author</option>
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>

                  {/* Status selector */}
                  <select
                    value={task.status}
                    onChange={e => updateStatus(task.id, e.target.value)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none ${cfg.cls}`}
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
    </div>
  );
}
