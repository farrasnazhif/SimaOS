"use client";

import Sidebar from "@/components/ui/sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar-context";
import { Search, Bell, Workflow, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/30">
      <Sidebar />

      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-100 bg-white/90 px-6 backdrop-blur-sm transition-all duration-300",
          open ? "ml-64" : "ml-16",
        )}
      >
        <div className="flex items-center gap-6">
          <h2 className="text-base font-bold text-zinc-800">
            SimaOS Manufacturing
          </h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search Lots, Batches, or Materials..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-emerald-600 transition-colors">
            <Bell className="size-5" />
          </button>
          <button className="text-zinc-400 hover:text-emerald-600 transition-colors">
            <Workflow className="size-5" />
          </button>
          <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-800 leading-none">
                Operator
              </p>
              <p className="text-[10px] uppercase tracking-tight text-zinc-400">
                Senior Operator
              </p>
            </div>
            <UserCircle className="size-8 text-zinc-300" />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "p-6 transition-all duration-300",
          open ? "ml-64" : "ml-16",
        )}
      >
        {children}
      </main>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppShellInner>{children}</AppShellInner>
    </SidebarProvider>
  );
}
