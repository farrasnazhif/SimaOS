import { cn } from "@/lib/utils";

export default function EmptyState({ message, className }: { message: string; className?: string }) {
  return <p className={cn("text-sm text-zinc-500", className)}>{message}</p>;
}
