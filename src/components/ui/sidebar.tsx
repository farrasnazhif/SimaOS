"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Factory,
  ShieldCheck,
  BotMessageSquare,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useLogoutMutation } from "@/features/auth/queries/auth-queries";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/batches/new", label: "New Batch", icon: Factory },
  { href: "/dashboard", label: "Quality Control", icon: ShieldCheck },
  { href: "/dashboard", label: "Copilot", icon: BotMessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logoutMutation = useLogoutMutation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-emerald-100 bg-white">
      {/* Logo */}
      <div className="px-6 py-6">
        <h1 className="text-xl font-bold text-emerald-700">SimaOS</h1>
        <p className="text-xs text-zinc-500">Precision Manufacturing</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-l-4 border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "text-zinc-600 hover:bg-emerald-50/50 hover:text-emerald-700",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-emerald-100 p-4 space-y-1">
        <Link
          href="#"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-zinc-700"
        >
          <HelpCircle className="size-4" />
          Support
        </Link>
        <button
          onClick={() => logoutMutation.mutate()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-zinc-500 hover:text-red-600"
        >
          <LogOut className="size-4" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
