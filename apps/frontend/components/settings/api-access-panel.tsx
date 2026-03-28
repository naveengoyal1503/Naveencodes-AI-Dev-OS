"use client";

import { useEffect, useState, useTransition } from "react";

import { buildApiUrl, buildJsonHeaders, getApiBaseUrl } from "../../lib/api";
import { getStoredAccessToken } from "../../lib/session";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextInput } from "../ui/form-field";

interface ApiKeyState {
  provider: string;
  configured: boolean;
  keyHint: string | null;
  updatedAt: string | null;
}

export function ApiAccessPanel() {
  const [apiKey, setApiKey] = useState("");
  const [state, setState] = useState<ApiKeyState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadState = async () => {
    const token = getStoredAccessToken();

    if (!token) {
      setState(null);
      return;
    }

    const response = await fetch(buildApiUrl("/api/auth/api-key"), {
      headers: buildJsonHeaders(true)
    });

    if (!response.ok) {
      const failure = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(failure?.message ?? `Request failed with ${response.status}`);
    }

    setState((await response.json()) as ApiKeyState);
  };

  useEffect(() => {
    loadState().catch((issue) => {
      setError(issue instanceof Error ? issue.message : "Unable to load key state");
    });
  }, []);

  const saveKey = () => {
    startTransition(async () => {
      try {
        setError(null);
        setMessage(null);

        const token = getStoredAccessToken();
        if (!token) {
          throw new Error("Login first to configure your AI provider key.");
        }

        const response = await fetch(buildApiUrl("/api/auth/api-key"), {
          method: "PUT",
          headers: buildJsonHeaders(true),
          body: JSON.stringify({
            provider: "openai",
            apiKey
          })
        });

        if (!response.ok) {
          const failure = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(failure?.message ?? `Request failed with ${response.status}`);
        }

        setApiKey("");
        setMessage("API key saved securely in the backend database.");
        await loadState();
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to save API key");
      }
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
      <SurfaceCard
        title="BYOK provider access"
        description="Store your OpenAI key on the backend so chat and analyze routes can execute securely from server.naveencodes.com."
      >
        <div className="space-y-4">
          <FieldShell label="OpenAI API key" hint="Stored encrypted on the backend. Never shipped to the browser bundle.">
            <TextInput
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-..."
            />
          </FieldShell>
          <AppButton onClick={saveKey} disabled={isPending || apiKey.trim().length < 20}>
            Save provider key
          </AppButton>
          {message ? <p className="text-sm text-emerald-600 dark:text-emerald-300">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        </div>
      </SurfaceCard>

      <SurfaceCard title="Connection posture" description="Current frontend/backend split-domain configuration.">
        <div className="space-y-3">
          <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Frontend origin</p>
            <p className="mt-2 text-sm font-semibold">https://ai.naveencodes.com</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Backend API</p>
            <p className="mt-2 break-all text-sm font-semibold">{getApiBaseUrl()}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Key status</p>
            <p className="mt-2 text-sm font-semibold">
              {state?.configured ? `Configured ${state.keyHint ?? ""}` : "Not configured"}
            </p>
            {state?.updatedAt ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Updated {state.updatedAt}</p>
            ) : null}
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}
