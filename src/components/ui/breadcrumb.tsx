"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const hiddenRoutes = ["/dashboard"];

export default function Breadcrumb({ lastLabel }: { lastLabel?: string } = {}) {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);

  // only show when route depth >= 2
  // example: /dashboard/lots
  if (paths.length < 2) return null;

  const currentPath = paths.join("/");

  if (hiddenRoutes.includes(`/${currentPath}`)) {
    return null;
  }

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
      {paths.map((segment, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;

        const isLast = index === paths.length - 1;

        const label = isLast && lastLabel
          ? lastLabel
          : segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-2">
            {index !== 0 && <ChevronRight className="size-4 text-zinc-400" />}

            {isLast ? (
              <span className="font-medium text-zinc-900">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-zinc-500 transition hover:text-zinc-900"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
