"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  options: SelectOption[];
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
    value?: string;
    onChange?: (value: string) => void;
  };

export default function Select({
  label,
  placeholder = "Select an option",
  required,
  error,
  helperText,
  options,
  className,
  disabled,
  value,
  onChange,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>(value || "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === selected);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (value !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(value);
    }
  }, [value]);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    setSelected(optionValue);
    onChange?.(optionValue);
    setOpen(false);
  };

  return (
    <div className="w-full space-y-2" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-zinc-900">
          {label}
          {required && <span className="ml-1 text-red-400">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={cn(
            "flex h-12 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-colors",
            "hover:bg-zinc-50",
            "focus:border-emerald-500",
            open && "border-emerald-500",
            error && "border-red-400",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <span className={cn("truncate", !selectedOption && "text-zinc-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown
            className={cn(
              "size-4 text-zinc-400 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-xl">
            <div className="max-h-64 overflow-y-auto py-2">
              {options.map((option) => {
                const isActive = selected === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 text-left text-sm transition",
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    <span>{option.label}</span>

                    {isActive && <Check className="size-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>
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
