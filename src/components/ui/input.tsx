"use client";

import * as React from "react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type LucideIconType = React.ComponentType<LucideProps>;

type InputProps = {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIconType;
  rightIcon?: LucideIconType;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  required,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-900">
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative flex h-12 w-full items-center rounded-md border bg-white transition-colors",
          "border-zinc-200 focus-within:border-emerald-500",
          error && "border-red-400",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        {LeftIcon && (
          <LeftIcon className="absolute left-4 size-4 text-zinc-400" />
        )}

        <input
          {...props}
          disabled={disabled}
          required={required}
          className={cn(
            "h-full w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400",
            LeftIcon ? "pl-11" : "pl-4",
            RightIcon ? "pr-11" : "pr-4",
          )}
        />

        {RightIcon && (
          <RightIcon className="absolute right-4 size-4 text-zinc-400" />
        )}
      </div>

      {(error || helperText) && (
        <p className={cn("text-xs", error ? "text-red-500" : "text-zinc-500")}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
