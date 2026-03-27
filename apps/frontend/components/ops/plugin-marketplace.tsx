"use client";

import { useEffect, useState } from "react";

import { SurfaceCard } from "../ui/card";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface PluginItem {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
}

export function PluginMarketplace() {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);

  useEffect(() => {
    fetch(`${endpoint}/api/plugins`)
      .then((response) => response.json())
      .then((payload: { items: PluginItem[] }) => setPlugins(payload.items));
  }, []);

  return (
    <SurfaceCard title="Plugin system" description="Third-party extensions and modular capabilities for the platform.">
      <div className="grid gap-3 md:grid-cols-3">
        {plugins.map((plugin) => (
          <div key={plugin.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-sm font-semibold">{plugin.name}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{plugin.category} | {plugin.status}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{plugin.description}</p>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
