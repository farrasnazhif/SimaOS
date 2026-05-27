"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DropdownContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownContext = React.createContext<DropdownContextType | null>(null);

function useDropdownContext() {
  const context = React.useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used inside <Dropdown />");
  }

  return context;
}

type DropdownProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Dropdown({ children, defaultOpen = false }: DropdownProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
      }}
    >
      <div ref={containerRef} className="relative">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

type DropdownTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function DropdownTrigger({ children, className }: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext();

  return (
    <button type="button" onClick={() => setOpen(!open)} className={className}>
      {children}
    </button>
  );
}

type DropdownContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function DropdownContent({ children, className }: DropdownContentProps) {
  const { open } = useDropdownContext();

  return (
    <div
      className={cn(
        "absolute right-0 top-full z-50 mt-2 w-56 p-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl transition-all duration-200",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

type DropdownItemProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function DropdownItem({
  children,
  className,
  onClick,
}: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-2 h-px bg-zinc-100" />;
}
