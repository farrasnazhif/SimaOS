"use client";

import * as React from "react";
import Sidebar from "@/components/ui/sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar-context";
import { Search, UserCircle, User, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownItem,
  DropdownTrigger,
} from "./dropdown";
import { useLogoutMutation } from "@/features/auth/queries/auth-queries";
import FloatingCopilot from "@/features/copilot/components/floating-copilot";
import SearchModal from "./search-modal";

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const { open } = useSidebar();
  const logoutMutation = useLogoutMutation();
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#EFF5F3]">
      <Sidebar />

      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-100 bg-white/90 px-6 backdrop-blur-sm transition-all duration-300",
          open ? "ml-64" : "ml-16",
        )}
      >
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="relative flex w-85 items-center rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm text-zinc-400 transition hover:border-emerald-400 hover:bg-white"
          >
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
            <span>Search Lots, Batches, or Materials...</span>
            <kbd className="ml-auto rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              ⌘ K
            </kbd>
          </button>
        </div>

        <Dropdown>
          <DropdownTrigger className="flex items-center gap-3 border-l border-zinc-200 pl-4">
            {/* <div className="text-right">
              <p className="text-sm font-semibold text-zinc-800">
                {profile?.email}
              </p>

              <p className="text-xs text-zinc-500">Account</p>
            </div> */}

            <UserCircle className="size-7 " />

            <ChevronDown className="size-4 " />
          </DropdownTrigger>

          <DropdownContent>
            <div className="p-2">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {profile?.email}
              </p>

              <p className="text-xs text-zinc-500">SimaOS Account Role</p>
            </div>

            <DropdownDivider />

            <DropdownItem>
              <User className="size-4" />
              Profile
            </DropdownItem>

            <DropdownItem
              className="text-red-600 hover:bg-red-50"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="size-4" />
              Log Out
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </header>

      <main
        className={cn(
          "p-6 transition-all duration-300 ",
          open ? "ml-64" : "ml-20",
        )}
      >
        {children}
      </main>

      <FloatingCopilot />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
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
