"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

const SEARCH_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    keywords: ["home", "overview", "kpi"],
  },
  {
    label: "All Lots",
    href: "/lots",
    keywords: ["inventory", "batches", "list"],
  },
  {
    label: "New Batch Entry",
    href: "/batches/new",
    keywords: ["create", "add", "intake", "upload"],
  },
  {
    label: "Pending QC",
    href: "/lots/status/in_qc",
    keywords: ["awaiting", "quality", "review"],
  },
  {
    label: "Approved Lots",
    href: "/lots/status/approved",
    keywords: ["passed", "accepted"],
  },
  {
    label: "Rejected Lots",
    href: "/lots/status/rejected",
    keywords: ["failed", "declined"],
  },
  {
    label: "Profile",
    href: "/profile",
    keywords: ["account", "settings", "user"],
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchModal({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return SEARCH_ITEMS;
    const q = query.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q)),
    );
  }, [query]);

  function navigate(href: string) {
    onClose();
    router.push(href);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3">
          <Search className="size-5 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, lots, or actions..."
            className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
            onKeyDown={(e) => {
              if (e.key === "Escape") onClose();
              if (e.key === "Enter" && filtered.length > 0)
                navigate(filtered[0].href);
            }}
          />
          <kbd className="hidden rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400 sm:inline">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-zinc-400">
              No results found.
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-zinc-700 transition hover:bg-emerald-50 hover:text-emerald-700"
              >
                <span className="font-medium">{item.label}</span>
                <ArrowRight className="size-3.5 text-zinc-300" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
