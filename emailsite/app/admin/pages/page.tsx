import Link from "next/link";
import { Globe, PenLine } from "lucide-react";

export default function PagesListPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="text-gray-500 text-sm mt-1">Edit content on your public pages.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm">Homepage</div>
              <div className="text-xs text-gray-400">Hero, Features, FAQ, Footer &amp; more</div>
            </div>
          </div>
          <Link
            href="/admin/pages/home"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors"
          >
            <PenLine className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}
