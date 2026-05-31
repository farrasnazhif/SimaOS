import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

export default function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[24px] border border-[#0E8752]/20 bg-white p-8", className)}>
      {children}
    </div>
  );
}
