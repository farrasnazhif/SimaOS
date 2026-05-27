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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "./sidebar-context";
import SimaOSLogo from "./logo";

const navSections = [
  {
    title: "MAIN MENU",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/batches/new",
        label: "Inventory",
        icon: Factory,
      },
      {
        href: "/traceability",
        label: "Traceability",
        icon: GitBranch,
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        href: "/quality-control",
        label: "Quality Control",
        icon: ShieldCheck,
      },
      {
        href: "/maintenance",
        label: "Maintenance",
        icon: Wrench,
      },
    ],
  },
];
export default function Sidebar() {
  const pathname = usePathname();
  const { open, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-emerald-100 bg-white transition-all duration-300",
        open ? "w-64" : "w-20",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-5",
          !open && "justify-center",
        )}
      >
        {open && (
          <div className="px-3">
            <SimaOSLogo />
          </div>
        )}
        <button
          onClick={toggle}
          className="rounded-lg p-1.5  hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          {open ? (
            <PanelLeftClose className="size-5" />
          ) : (
            <PanelLeftOpen className="size-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4">
        <div className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {open ? (
                <div className="px-3 pb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider ">
                    {section.title}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center pb-5">
                  <div className="h-[3px] w-8 rounded-full bg-zinc-300" />
                </div>
              )}

              <div className="space-y-2">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      title={!open ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                        open ? "" : "justify-center px-3 py-3",
                        isActive
                          ? "bg-[#0E8752] font-semibold text-white"
                          : "font-medium text-zinc-500 hover:bg-emerald-100/80 hover:text-emerald-700",
                      )}
                    >
                      <Icon className="size-[18px] shrink-0" />

                      {open && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-emerald-100 p-3">
        <div className="space-y-0">
          <Link
            href="#"
            title={!open ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700",
              !open && "justify-center",
            )}
          >
            <Settings className="size-4 shrink-0" />
            {open && <span>Settings</span>}
          </Link>
          <Link
            href="#"
            title={!open ? "Support" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700",
              !open && "justify-center",
            )}
          >
            <HelpCircle className="size-4 shrink-0" />
            {open && <span>Support</span>}
          </Link>
          {/* <Button
            variant="destructive"
            onClick={() => logoutMutation.mutate()}
            title={!open ? "Log Out" : undefined}
            leftIcon={LogOut}
            className="w-full"
          >
            {open && <span>Log Out</span>}
          </Button> */}
        </div>
      </div>
    </aside>
  );
}
