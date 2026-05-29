import { LoaderCircle, LucideProps } from "lucide-react";

import * as React from "react";

import { cn } from "@/lib/utils";

type LucideIconType = React.ComponentType<LucideProps>;

type IconButtonVariant =
  | "primary"
  | "secondary"
  | "gradient-green"
  | "destructive";

type IconButtonSize = "sm" | "base" | "lg";

type IconButtonProps = {
  isLoading?: boolean;

  variant?: IconButtonVariant;

  size?: IconButtonSize;

  icon?: LucideIconType;

  iconClassName?: string;
} & React.ComponentPropsWithRef<"button">;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      size = "base",
      icon: Icon,
      iconClassName,
      ...rest
    },

    ref,
  ) => {
    const disabled = isLoading || buttonDisabled;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "active:scale-[0.98]",

          [
            size === "lg" && "h-12 w-12",
            size === "base" && "h-10 w-10",
            size === "sm" && "h-8 w-8",
          ],

          // variants
          [
            // Primary
            variant === "primary" && [
              "bg-emerald-600 text-white",
              "hover:bg-emerald-700",
              "shadow-sm shadow-emerald-500/20",
            ],

            // Secondary
            variant === "secondary" && [
              "border border-zinc-200 bg-white text-zinc-900",
              "hover:bg-emerald-50 hover:border-emerald-200",
            ],

            // Gradient Green
            variant === "gradient-green" && [
              "bg-gradient-to-b from-emerald-500 to-emerald-700 text-white",
              "hover:from-emerald-600 hover:to-emerald-800",
              "shadow-sm shadow-emerald-500/25",
            ],

            // Destructive
            variant === "destructive" && [
              "bg-red-600 text-white",
              "hover:bg-red-700",
              "shadow-sm shadow-red-500/20",
            ],
          ],

          className,
        )}
        {...rest}
      >
        {isLoading ? (
          <LoaderCircle
            className={cn(
              "animate-spin",
              variant === "primary" ? "text-black" : "text-white",
              size === "lg" && "h-5 w-5",
              size === "base" && "h-4 w-4",
              size === "sm" && "h-3.5 w-3.5",
            )}
          />
        ) : (
          Icon && (
            <Icon
              className={cn(
                "shrink-0",
                size === "lg" && "h-6 w-6",
                size === "base" && "h-5 w-5",
                size === "sm" && "h-4 w-4",
                iconClassName,
              )}
            />
          )
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";

export default IconButton;
