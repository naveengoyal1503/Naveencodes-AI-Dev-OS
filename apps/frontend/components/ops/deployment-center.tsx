"use client";

import { useEffect, useState, useTransition } from "react";
import { ExternalLink, Rocket, Share2 } from "lucide-react";

import { getApiBaseUrl } from "../../lib/api";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextInput } from "../ui/form-field";

const endpoint = getApiBaseUrl();

interface DeploymentOverview {
  repository: string;
  defaultBranch: string;
  frontendPlatform: string;
  backendPlatform: string;
  continuousDeployment: string;
  previews: { domain: string };
  production: { domain: string };
  history: Array<{
    id: string;
    project: string;
    environment: string;
    status: string;
    commit: string;
    url: string;
  }>;
}

export function DeploymentCenter() {
  const [overview, setOverview] = useState<DeploymentOverview | null>(null);
  const [projectName, setProjectName] = useState("NaveenCodes AI Dev OS");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [latestDeploy, setLatestDeploy] = useState<{ previewUrl: string; productionUrl: string; liveUrl: string } | null>(null);

  useEffect(() => {
    fetch(`${endpoint}/api/deployment/overview`)
      .then((response) => response.json())
      .then((payload: DeploymentOverview) => setOverview(payload))
      .catch(() => setError("Unable to load deployment overview"));
  }, []);

  const deploy = (mode: "preview" | "production") => {
    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/deployment/deploy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            projectName,
            branch: "main",
            mode
          })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { previewUrl: string; productionUrl: string; liveUrl: string };
        setLatestDeploy(payload);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to deploy project");
      }
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
      <SurfaceCard title="Deployment center" description="Preview and production deployment orchestration with shareable client URLs.">
        <div className="space-y-4">
          <FieldShell label="Project name">
            <TextInput value={projectName} onChange={(event) => setProjectName(event.target.value)} />
          </FieldShell>
          <div className="flex flex-wrap gap-3">
            <AppButton onClick={() => deploy("preview")} disabled={isPending}>
              <Share2 className="mr-2 size-4" />
              Generate preview
            </AppButton>
            <AppButton variant="secondary" onClick={() => deploy("production")} disabled={isPending}>
              <Rocket className="mr-2 size-4" />
              Deploy production
            </AppButton>
          </div>
          {latestDeploy ? (
            <div className="space-y-3">
              {[
                ["Preview", latestDeploy.previewUrl],
                ["Production", latestDeploy.productionUrl],
                ["Live", latestDeploy.liveUrl]
              ].map(([label, url]) => (
                <div key={label} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="mt-2 break-all text-sm">{url}</p>
                </div>
              ))}
            </div>
          ) : null}
          {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Deployment history" description="Recent preview and production activity with GitHub continuity.">
        <div className="space-y-3">
          {overview?.history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.project}</p>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">
                  {item.environment}
                </span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {item.status} | {item.commit}
              </p>
              <a href={item.url} className="mt-3 inline-flex items-center gap-2 text-sm text-sky-600 dark:text-sky-300">
                Open URL
                <ExternalLink className="size-4" />
              </a>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
