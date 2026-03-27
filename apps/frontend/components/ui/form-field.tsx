import type { PropsWithChildren, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

interface FieldShellProps extends PropsWithChildren {
  label: string;
  hint?: string;
}

export function FieldShell({ label, hint, children }: FieldShellProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 ${props.className ?? ""}`.trim()}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-32 w-full rounded-3xl border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100 ${props.className ?? ""}`.trim()}
    />
  );
}
