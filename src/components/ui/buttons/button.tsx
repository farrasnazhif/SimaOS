import { LoaderCircle, LucideProps } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "gradient-green";

type ButtonSize = "sm" | "base" | "lg";

type LucideIconType = React.ComponentType<LucideProps>;

type ButtonProps = {
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIconType;
  rightIcon?: LucideIconType;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled: buttonDisabled,
      isLoading,
      variant = "primary",
      size = "base",
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
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
          // base
          "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium",
          "transition-colors duration-300 ease-in-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "active:scale-[0.98]",

          // sizes
          [
            size === "lg" && "px-6 py-3 text-base",
            size === "base" && "px-5 py-2.5 text-sm",
            size === "sm" && "px-4 py-2 text-xs",
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
          ],

          isLoading && "cursor-wait opacity-80",

          className,
        )}
        {...rest}
      >
        {/* Loading */}
        {isLoading && (
          <LoaderCircle
            className={cn(
              "animate-spin",
              variant === "primary" ? "text-black" : "text-white",
              size === "lg" && "h-5 w-5",
              size === "base" && "h-4 w-4",
              size === "sm" && "h-3.5 w-3.5",
            )}
          />
        )}

        {/* Left icon */}
        {LeftIcon && !isLoading && (
          <LeftIcon
            className={cn(
              "shrink-0",
              size === "lg" && "h-5 w-5",
              size === "base" && "h-4 w-4",
              size === "sm" && "h-3.5 w-3.5",
              leftIconClassName,
            )}
          />
        )}

        <span>{children}</span>

        {/* Right icon */}
        {RightIcon && !isLoading && (
          <RightIcon
            className={cn(
              "shrink-0",
              size === "lg" && "h-5 w-5",
              size === "base" && "h-4 w-4",
              size === "sm" && "h-3.5 w-3.5",
              rightIconClassName,
            )}
          />
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
