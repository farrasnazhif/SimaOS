"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Factory,
  GitBranch,
  ShieldCheck,
  Wrench,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useLogoutMutation } from "@/features/auth/queries/auth-queries";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/batches/new", label: "Live Batches", icon: Factory },
  { href: "/dashboard", label: "Traceability", icon: GitBranch },
  { href: "/dashboard", label: "Quality Control", icon: ShieldCheck },
  { href: "/dashboard", label: "Maintenance", icon: Wrench },
  { href: "/dashboard", label: "System Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();
  const { open, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-emerald-100 bg-white transition-all duration-300",
        open ? "w-64" : "w-16",
      )}
    >
      {/* Header */}
      <div className={cn("flex items-center justify-between px-4 py-5", !open && "justify-center")}>
        {open && (
          <div className="px-2">
            <h1 className="text-xl font-bold text-emerald-700">SimaOS</h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
              Precision Manufacturing
            </p>
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          {open ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href) && item.href !== "/dashboard";
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={!open ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                open ? "" : "justify-center",
                isActive
                  ? "bg-emerald-50 font-semibold text-emerald-700"
                  : "font-medium text-zinc-500 hover:bg-emerald-50/50 hover:text-emerald-700",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-emerald-100 p-3">
        {open && (
          <button className="mb-3 w-full px-3 text-left text-[11px] font-bold uppercase tracking-widest text-emerald-600">
            Switch Role: Manager
          </button>
        )}
        <div className="space-y-0.5">
          <Link
            href="#"
            title={!open ? "Support" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700",
              !open && "justify-center",
            )}
          >
            <HelpCircle className="size-4 shrink-0" />
            {open && <span>Support</span>}
          </Link>
          <button
            onClick={() => logoutMutation.mutate()}
            title={!open ? "Log Out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600",
              !open && "justify-center",
            )}
          >
            <LogOut className="size-4 shrink-0" />
            {open && <span>Log Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
