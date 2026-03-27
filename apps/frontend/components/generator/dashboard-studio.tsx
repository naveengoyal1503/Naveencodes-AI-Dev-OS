"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { Code2, Languages, Palette, Sparkles, Wand2 } from "lucide-react";

import type {
  CommandIntent,
  FigmaConversionResult,
  GeneratedProjectBlueprint,
  ResponsiveBlueprint,
  SupportedLocale,
  SupportedProjectType,
  TranslationBundle
} from "@naveencodes/ai";

import { getApiBaseUrl } from "../../lib/api";
import { LanguageSwitcher } from "../i18n/language-switcher";
import { useLocale } from "../i18n/locale-provider";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";
import { FieldShell, TextArea, TextInput } from "../ui/form-field";
import { Modal } from "../ui/modal";

const endpoint = getApiBaseUrl();

interface DashboardStudioProps {
  starterBlueprint: GeneratedProjectBlueprint;
  starterIntent: CommandIntent;
  starterFigma: FigmaConversionResult;
  bundles: TranslationBundle[];
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${endpoint}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function DashboardStudio({
  starterBlueprint,
  starterIntent,
  starterFigma,
  bundles
}: DashboardStudioProps) {
  const { t } = useLocale();
  const [command, setCommand] = useState("build a blog site with premium UI and multilingual support");
  const [techPreference, setTechPreference] = useState("Next.js + Fastify");
  const [designSource, setDesignSource] = useState("https://figma.com/design/demo/naveencodes-ai");
  const [intent, setIntent] = useState<CommandIntent>(starterIntent);
  const [blueprint, setBlueprint] = useState<GeneratedProjectBlueprint>(starterBlueprint);
  const [figmaResult, setFigmaResult] = useState<FigmaConversionResult>(starterFigma);
  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>("en");
  const [designProjectType, setDesignProjectType] = useState<SupportedProjectType>(starterBlueprint.projectType);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const deferredCommand = useDeferredValue(command);

  const runCommand = () => {
    startTransition(async () => {
      try {
        setError(null);
        const interpreted = await postJson<{ intent: CommandIntent }>("/api/ai/interpret", {
          command: deferredCommand
        });
        const generated = await postJson<{ blueprint: GeneratedProjectBlueprint }>("/api/ai/generate-project", {
          idea: deferredCommand,
          techPreference,
          locale: selectedLocale
        });
        setIntent(interpreted.intent);
        setBlueprint(generated.blueprint);
        setDesignProjectType(generated.blueprint.projectType);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to run AI command");
      }
    });
  };

  const runFigmaConversion = () => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await postJson<{ result: FigmaConversionResult }>("/api/ai/figma-to-code", {
          figmaLink: designSource
        });
        setFigmaResult(result.result);
        setModalOpen(true);
      } catch (issue) {
        setError(issue instanceof Error ? issue.message : "Unable to convert Figma source");
      }
    });
  };

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <SurfaceCard
          title={t("dashboardTitle")}
          description="Interpret natural-language requests, generate scalable project architecture, and convert design sources into reusable React + Tailwind building blocks."
          className="overflow-hidden"
        >
          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <FieldShell label="AI command" hint="Examples: build a blog site, create ecommerce store, improve UI">
                <TextArea value={command} onChange={(event) => setCommand(event.target.value)} />
              </FieldShell>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldShell label="Tech preference">
                  <TextInput value={techPreference} onChange={(event) => setTechPreference(event.target.value)} />
                </FieldShell>
                <FieldShell label="Locale">
                  <select
                    value={selectedLocale}
                    onChange={(event) => setSelectedLocale(event.target.value as SupportedLocale)}
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                  </select>
                </FieldShell>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AppButton onClick={runCommand} disabled={isPending}>
                  <Sparkles className="mr-2 size-4" />
                  {t("buildProject")}
                </AppButton>
                <LanguageSwitcher />
              </div>

              {error && <p className="rounded-2xl border border-rose-300/40 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">{error}</p>}
            </div>

            <div className="rounded-[1.75rem] border border-emerald-300/20 bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3 text-emerald-300">
                <Wand2 className="size-4" />
                <p className="text-sm font-semibold uppercase tracking-[0.22em]">Intent analysis</p>
              </div>
              <h3 className="mt-4 text-2xl font-semibold">{intent.projectType.toUpperCase()} generator</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Action: <span className="font-semibold text-white">{intent.action}</span>
              </p>
              <p className="text-sm leading-7 text-slate-300">
                Confidence: <span className="font-semibold text-white">{Math.round(intent.confidence * 100)}%</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {intent.suggestedTechStack.map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Figma to code engine"
          description="Paste a Figma link or design reference to get spacing, typography, color extraction, and a reusable Tailwind component scaffold."
        >
          <div className="space-y-4">
            <FieldShell label="Figma link or design source">
              <TextInput value={designSource} onChange={(event) => setDesignSource(event.target.value)} />
            </FieldShell>
            <div className="grid gap-3 sm:grid-cols-2">
              {figmaResult.extraction.layout.map((item) => (
                <div key={item} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/40">
                  {item}
                </div>
              ))}
            </div>
            <AppButton variant="secondary" onClick={runFigmaConversion} disabled={isPending}>
              <Code2 className="mr-2 size-4" />
              Convert design
            </AppButton>
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <SurfaceCard title={blueprint.appName} description={blueprint.summary}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Routes</h4>
              <div className="mt-3 space-y-3">
                {blueprint.routes.map((route) => (
                  <div key={route.path} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                    <p className="text-sm font-semibold">{route.path}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{route.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{route.purpose}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Components</h4>
              <div className="mt-3 space-y-3">
                {blueprint.components.map((component) => (
                  <div key={component.name} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{component.name}</p>
                      <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                        {component.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{component.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-4">
          <SurfaceCard title="Responsive engine" description="Mobile, tablet, and desktop rules are generated alongside each project template.">
            <div className="grid gap-3">
              {(Object.entries(blueprint.responsive) as [keyof ResponsiveBlueprint, string[]][]).map(([breakpoint, rules]) => (
                <div key={breakpoint} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
                  <p className="text-sm font-semibold capitalize">{breakpoint}</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {rules.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard title="Business intelligence" description="Category suggestions, monetization options, and SEO targets generated from the same command.">
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blueprint.business.categories.map((item) => (
                    <span key={item} className="rounded-full border border-black/5 bg-slate-50 px-3 py-1 dark:border-white/10 dark:bg-slate-950/40">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-semibold">SEO keywords</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blueprint.business.seoKeywords.map((item) => (
                    <span key={item} className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-amber-700 dark:text-amber-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <SurfaceCard title="Smart structure engine" description="Production-ready structure, generated files, and API surface organization.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Folders</h4>
              <div className="mt-3 space-y-2">
                {blueprint.folders.map((folder) => (
                  <div key={folder} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/40">
                    {folder}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Files</h4>
              <div className="mt-3 space-y-2">
                {blueprint.files.map((file) => (
                  <div key={file.path} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/40">
                    <p className="text-sm font-semibold">{file.path}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{file.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Design engine" description="Spacing, typography, color system, and language-ready UI outputs.">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-fuchsia-500" />
                <p className="text-sm font-semibold">Color palette</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {Object.entries(blueprint.designTokens.palette).map(([name, color]) => (
                  <div key={name} className="rounded-2xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                    <div className="h-10 rounded-xl" style={{ backgroundColor: color }} />
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em]">{name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{color}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-emerald-500" />
                  <p className="text-sm font-semibold">Spacing and type scale</p>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Spacing</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blueprint.designTokens.spacing.map((token) => (
                    <span key={token} className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs dark:border-white/10 dark:bg-slate-900">
                      {token}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Typography</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {blueprint.designTokens.typography.map((token) => (
                    <span key={token} className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs dark:border-white/10 dark:bg-slate-900">
                      {token}px
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-black/5 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Languages className="size-4 text-sky-500" />
                  <p className="text-sm font-semibold">Generated locales</p>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{bundles.length} translation bundles are available for generated output.</p>
                <div className="mt-3 space-y-2">
                  {blueprint.translations.map((bundle) => (
                    <div key={bundle.locale} className="rounded-2xl border border-black/5 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
                      <p className="text-sm font-semibold uppercase">{bundle.locale}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{bundle.messages.buildProject}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>
      </div>

      <Modal open={modalOpen} title="Generated React + Tailwind component" onClose={() => setModalOpen(false)}>
        <pre className="overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-100">{figmaResult.generatedReactComponent}</pre>
      </Modal>
    </>
  );
}
