import type { PropsWithChildren } from "react";

interface SurfaceCardProps extends PropsWithChildren {
  title?: string;
  description?: string;
  className?: string;
}

export function SurfaceCard({ title, description, className = "", children }: SurfaceCardProps) {
  return (
    <section
      className={`rounded-[1.5rem] border border-black/5 bg-white/90 p-5 shadow-lg shadow-slate-300/10 dark:border-white/10 dark:bg-slate-900/75 ${className}`.trim()}
    >
      {(title || description) && (
        <header className="mb-4">
          {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}
          {description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
