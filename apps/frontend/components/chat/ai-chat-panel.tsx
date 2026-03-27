"use client";

import { useState, useTransition } from "react";
import { Bot, SendHorizonal, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { AppButton } from "../ui/button";
import { TextInput } from "../ui/form-field";

const endpoint = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const suggestions = [
  "fix UI issues",
  "improve SEO",
  "optimize performance",
  "test checkout",
  "analyze competitor",
  "review architecture"
];

interface ChatResponse {
  workflow: { workflow: string; title: string };
  response: {
    title: string;
    summary: string;
    actions: string[];
    affectedArea: string;
  };
}

export function AIChatPanel() {
  const [open, setOpen] = useState(false);
  const [command, setCommand] = useState("improve SEO");
  const [result, setResult] = useState<ChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const runCommand = (nextCommand?: string) => {
    const payload = nextCommand ?? command;

    startTransition(async () => {
      try {
        setError(null);
        const response = await fetch(`${endpoint}/api/chat/command`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ command: payload })
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

    setResult((await response.json()) as ChatResponse);
        setOpen(true);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to run AI command");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full border border-emerald-300/30 bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-slate-950/30"
      >
        <Bot className="size-4 text-emerald-300" />
        AI Command
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 22 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-40 w-[min(26rem,calc(100vw-2rem))] rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 text-white shadow-2xl shadow-slate-950/40 backdrop-blur"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-300">AI chat panel</p>
                <h3 className="mt-2 text-xl font-semibold">Trigger workflows from plain English</h3>
              </div>
              <Sparkles className="size-5 text-emerald-300" />
            </div>

            <div className="mt-4 space-y-3">
              <TextInput
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              <div className="flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCommand(item);
                      runCommand(item);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <AppButton onClick={() => runCommand()} disabled={isPending} className="w-full justify-center">
                <SendHorizonal className="mr-2 size-4" />
                Run workflow
              </AppButton>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            </div>

            {result ? (
              <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">{result.workflow.workflow}</p>
                <p className="mt-2 text-lg font-semibold">{result.response.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{result.response.summary}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Affected area: {result.response.affectedArea}
                </p>
                <div className="mt-3 space-y-2">
                  {result.response.actions.map((action) => (
                    <div key={action} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200">
                      {action}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                  Advanced engines: SEO, performance, UI, competitor, and senior-dev intelligence are available.
                </p>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
