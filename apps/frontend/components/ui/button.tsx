"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface AppButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-emerald-400/30 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300",
  secondary:
    "border-sky-400/20 bg-sky-400/10 text-sky-900 hover:bg-sky-400/20 dark:text-sky-100",
  ghost:
    "border-black/10 bg-transparent text-slate-700 hover:bg-black/5 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
};

export function AppButton({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
