"use client";

import { useEffect, useState, useTransition } from "react";
import { Globe2, Plus } from "lucide-react";

import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextInput } from "../ui/form-field";
import { Modal } from "../ui/modal";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ProjectItem {
  id: string;
  name: string;
  status: string;
  targetUrl: string;
  environment: string;
  seoScore: number;
  performanceScore: number;
}

export function ProjectManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadProjects = () => {
    fetch(`${endpoint}/api/projects`)
      .then((response) => response.json())
      .then((payload: { items: ProjectItem[] }) => setProjects(payload.items))
      .catch(() => setError("Unable to load projects"));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createProject = () => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            targetUrl,
            environment
          })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        setOpen(false);
        setName("");
        setTargetUrl("");
        setEnvironment("production");
        loadProjects();
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to create project");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage multiple monitored sites, statuses, and quality baselines.
          </p>
        </div>
        <AppButton onClick={() => setOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add new project
        </AppButton>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <SurfaceCard key={project.id} className="overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                <Globe2 className="size-3.5" />
                {project.environment}
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
                {project.status}
              </span>
            </div>
            <h3 className="mt-4 text-xl font-semibold">{project.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.targetUrl}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">SEO</p>
                <p className="mt-2 text-2xl font-semibold">{project.seoScore}</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Performance</p>
                <p className="mt-2 text-2xl font-semibold">{project.performanceScore}</p>
              </div>
            </div>
          </SurfaceCard>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}

      <Modal open={open} title="Add monitored project" onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <FieldShell label="Project name">
            <TextInput value={name} onChange={(event) => setName(event.target.value)} />
          </FieldShell>
          <FieldShell label="Target URL">
            <TextInput value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />
          </FieldShell>
          <FieldShell label="Environment">
            <select
              value={environment}
              onChange={(event) => setEnvironment(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="preview">Preview</option>
            </select>
          </FieldShell>
          <AppButton onClick={createProject} disabled={isPending} className="w-full justify-center">
            Save project
          </AppButton>
        </div>
      </Modal>
    </>
  );
}
