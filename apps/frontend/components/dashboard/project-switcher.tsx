"use client";

import { useEffect, useState } from "react";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ProjectItem {
  id: string;
  name: string;
  targetUrl: string;
}

export function ProjectSwitcher() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    fetch(`${endpoint}/api/projects`)
      .then((response) => response.json())
      .then((payload: { items: ProjectItem[] }) => {
        if (!mounted) {
          return;
        }

        setProjects(payload.items);
        setActive(payload.items[0]?.id ?? "");
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  if (projects.length === 0) {
    return null;
  }

  return (
    <label className="hidden items-center gap-3 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-100 xl:inline-flex">
      <span className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Site</span>
      <select
        value={active}
        onChange={(event) => setActive(event.target.value)}
        className="bg-transparent text-sm outline-none"
      >
        {projects.map((project) => (
          <option key={project.id} value={project.id} className="text-slate-900">
            {project.name}
          </option>
        ))}
      </select>
    </label>
  );
}
