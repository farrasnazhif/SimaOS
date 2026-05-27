"use client";

import Sidebar from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30">
      <Sidebar />

      {/* Top bar */}
      <header className="sticky top-0 z-30 ml-64 flex h-14 items-center justify-between border-b border-emerald-100 bg-white/80 px-6 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-semibold text-zinc-800">SimaOS Manufacturing</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search lots, batches..."
              className="w-72 rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="ml-64 p-6">{children}</main>
    </div>
  );
}
