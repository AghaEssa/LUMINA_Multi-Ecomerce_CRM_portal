import React, { forwardRef, type ButtonHTMLAttributes } from "react";
import { Icon } from "@/components/common/Icons";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md shadow-sky-500/20 active:scale-[0.98]",
  secondary:
    "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 shadow-sm active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 active:scale-[0.98]",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:scale-[0.98]",
  accent:
    "bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow-md active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-xl font-bold gap-1.5",
  md: "px-4.5 py-2.5 text-xs rounded-2xl font-bold gap-2",
  lg: "px-6 py-3.5 text-xs sm:text-sm rounded-2xl font-black gap-2.5 uppercase tracking-wider",
  icon: "h-10 w-10 p-0 rounded-2xl grid place-items-center shrink-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className = "",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-sans transition-all duration-200 select-none disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2";

    const computedClass = `${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={computedClass}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <>
            {leftIcon && <Icon name={leftIcon} className="h-4 w-4 shrink-0" />}
            {children && <span>{children}</span>}
            {rightIcon && <Icon name={rightIcon} className="h-4 w-4 shrink-0" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
