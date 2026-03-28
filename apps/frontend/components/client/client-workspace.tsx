"use client";

import { useEffect, useState, useTransition } from "react";

import { buildApiUrl, buildJsonHeaders } from "../../lib/api";
import { clearStoredAccessToken, getStoredAccessToken, persistAccessToken } from "../../lib/session";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextArea, TextInput } from "../ui/form-field";
import { BillingCenter } from "../ops/billing-center";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface HistoryItem {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  status: string;
}

export function ClientWorkspace() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("Workspace Owner");
  const [email, setEmail] = useState("owner@naveencodes.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [token, setToken] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notes, setNotes] = useState("Manage multiple monitored sites, review scan history, and share reports with clients.");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hydrateWorkspace = async (accessToken: string) => {
    const meResponse = await fetch(buildApiUrl("/api/auth/me"), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const historyResponse = await fetch(buildApiUrl("/api/auth/history"), {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!meResponse.ok || !historyResponse.ok) {
      throw new Error("Unable to load client workspace");
    }

    const mePayload = (await meResponse.json()) as { user: AuthUser };
    const historyPayload = (await historyResponse.json()) as { items: HistoryItem[] };

    setUser(mePayload.user);
    setHistory(historyPayload.items);
  };

  useEffect(() => {
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      return;
    }

    setToken(accessToken);

    hydrateWorkspace(accessToken).catch(() => {
      clearStoredAccessToken();
      setToken("");
      setUser(null);
      setHistory([]);
    });
  }, []);

  const submit = () => {
    startTransition(async () => {
      try {
        setError(null);
        if (mode === "register") {
          const registerResponse = await fetch(buildApiUrl("/api/auth/register"), {
            method: "POST",
            headers: buildJsonHeaders(),
            body: JSON.stringify({
              fullName,
              email,
              password,
              role: "admin"
            })
          });

          if (!registerResponse.ok && registerResponse.status !== 409) {
            throw new Error(`Register failed with ${registerResponse.status}`);
          }
        }

        const loginResponse = await fetch(buildApiUrl("/api/auth/login"), {
          method: "POST",
          headers: buildJsonHeaders(),
          body: JSON.stringify({
            email,
            password
          })
        });

        if (!loginResponse.ok) {
          throw new Error(`Login failed with ${loginResponse.status}`);
        }

        const loginPayload = (await loginResponse.json()) as { accessToken: string; user: AuthUser };
        persistAccessToken(loginPayload.accessToken);
        setToken(loginPayload.accessToken);
        setUser(loginPayload.user);
        await hydrateWorkspace(loginPayload.accessToken);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to authenticate");
      }
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
      <SurfaceCard title="Client login system" description="Register or sign in to access project history, site management, and audit outputs.">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "login" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === "register" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}
          >
            Register
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {mode === "register" ? (
            <FieldShell label="Full name">
              <TextInput value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </FieldShell>
          ) : null}
          <FieldShell label="Email">
            <TextInput value={email} onChange={(event) => setEmail(event.target.value)} />
          </FieldShell>
          <FieldShell label="Password">
            <TextInput type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </FieldShell>
          <FieldShell label="Client notes">
            <TextArea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </FieldShell>
          <AppButton onClick={submit} disabled={isPending} className="w-full justify-center">
            {mode === "login" ? "Login to workspace" : "Register and continue"}
          </AppButton>
          {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
          {token ? <p className="text-xs text-slate-500 dark:text-slate-400">JWT issued and stored in the browser for authenticated API requests.</p> : null}
        </div>
      </SurfaceCard>

      <div className="space-y-4">
        <SurfaceCard title={user ? `${user.fullName} workspace` : "Client dashboard"} description="User dashboard, project history, and multi-site status.">
          {user ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Role</p>
                <p className="mt-2 text-xl font-semibold">{user.role}</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Sites managed</p>
                <p className="mt-2 text-xl font-semibold">3</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Latest status</p>
                <p className="mt-2 text-xl font-semibold">Monitoring</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-300">Authenticate to unlock client dashboard data and project history.</p>
          )}
        </SurfaceCard>

        <SurfaceCard title="Project history" description="Audit and workflow history attached to the authenticated client.">
          <div className="space-y-3">
            {history.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No project history available yet.</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    {item.type} | {item.createdAt}
                  </p>
                </div>
              ))
            )}
          </div>
        </SurfaceCard>

        <BillingCenter />
      </div>
    </div>
  );
}
