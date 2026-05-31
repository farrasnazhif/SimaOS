"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

const sizeMap = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className={cn("relative w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl", sizeMap[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        {description && <p className="mt-2 text-sm text-zinc-500">{description}</p>}
        {children}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
