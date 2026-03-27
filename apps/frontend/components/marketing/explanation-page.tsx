"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  ChartColumn,
  Check,
  Code2,
  Gauge,
  GitBranch,
  MessageSquareText,
  PenTool,
  Play,
  Rocket,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Wand2,
  Workflow,
  Zap
} from "lucide-react";

const heroPromptExamples = ["Build a blog site", "Fix performance", "Test checkout", "Convert Figma to code"];

const particles = [
  { left: "8%", top: "18%", size: 8, delay: "0s" },
  { left: "17%", top: "74%", size: 12, delay: "1.5s" },
  { left: "24%", top: "40%", size: 6, delay: "2.2s" },
  { left: "37%", top: "12%", size: 10, delay: "0.8s" },
  { left: "48%", top: "82%", size: 7, delay: "2.8s" },
  { left: "58%", top: "28%", size: 9, delay: "1.2s" },
  { left: "71%", top: "70%", size: 12, delay: "3s" },
  { left: "84%", top: "16%", size: 7, delay: "1.9s" },
  { left: "92%", top: "46%", size: 9, delay: "2.6s" }
];

const clarityItems = [
  {
    title: "AI builds apps from ideas",
    copy: "Describe the product, flow, or page and the system scaffolds routes, UI, and implementation direction.",
    icon: Code2
  },
  {
    title: "AI tests in a real browser",
    copy: "Run Chrome-backed QA flows, inspect the DOM, capture issues, and validate user journeys before release.",
    icon: SearchCheck
  },
  {
    title: "AI fixes errors automatically",
    copy: "Get bounded fix plans, retest loops, and engineering guidance instead of disconnected screenshots and vague suggestions.",
    icon: Wand2
  },
  {
    title: "AI deploys instantly",
    copy: "Push changes, generate preview links, and promote a release without stitching five different tools together.",
    icon: Rocket
  }
];

const steps = [
  { id: "01", title: "Enter idea or design", copy: "Start from a prompt, Figma handoff, or production bug report." },
  { id: "02", title: "AI builds the project", copy: "Generate structure, pages, commands, and implementation-ready outputs." },
  { id: "03", title: "AI tests in browser", copy: "Validate DOM, network, console, UX, SEO, and checkout flows in one pass." },
  { id: "04", title: "AI fixes the issues", copy: "Prioritize failures, produce fixes, and loop through retesting automatically." },
  { id: "05", title: "Deploy instantly", copy: "Ship to preview or production with the release context attached." }
];

const features = [
  { title: "AI Project Generator", copy: "Turn a raw idea into routes, structure, and implementation guidance.", icon: Sparkles },
  { title: "Figma to Code", copy: "Translate design context into production-minded UI without handoff loss.", icon: PenTool },
  { title: "Real-time Testing", copy: "Inspect browser state, network, DOM, and user journeys live.", icon: SearchCheck },
  { title: "Auto Fix Engine", copy: "Generate safe repair plans and validate them before shipping.", icon: Wand2 },
  { title: "SEO + Performance", copy: "Track technical SEO, bundle pressure, and conversion-critical latency.", icon: Gauge },
  { title: "Ecommerce Testing", copy: "Stress checkout, cart, funnels, and transactional pages.", icon: ShoppingCart },
  { title: "GitHub Auto Push", copy: "Turn AI work into versioned commits and predictable delivery paths.", icon: GitBranch },
  { title: "Deployment System", copy: "Generate previews and production-ready release workflows.", icon: Rocket },
  { title: "AI Chat Assistant", copy: "Drive the whole platform with plain-English commands.", icon: MessageSquareText }
];

const comparisonRows = [
  { label: "Project setup", old: "Manual scaffolding across tools", next: "AI creates the starting system in minutes" },
  { label: "QA coverage", old: "Partial checks and screenshots", next: "Browser, console, network, SEO, UI, and reports" },
  { label: "Fix workflow", old: "Someone triages by hand", next: "AI proposes fixes, prioritizes, and retests" },
  { label: "Deploy path", old: "Separate CI/CD, hosting, and notes", next: "Unified delivery context with release actions" }
];

const useCases = [
  {
    title: "Developers",
    copy: "Ship faster by collapsing project generation, QA, debugging, and deployment into one workspace."
  },
  {
    title: "Agencies",
    copy: "Run multiple client properties with cleaner reporting, fewer tool subscriptions, and faster turnaround."
  },
  {
    title: "SaaS founders",
    copy: "Prototype, validate, fix, and launch without needing separate specialists for every stage."
  },
  {
    title: "Ecommerce owners",
    copy: "Protect conversion paths, checkout quality, SEO visibility, and release confidence."
  }
];

const commandExamples = ["Build a blog site", "Fix performance", "Test checkout", "Generate QA report", "Deploy preview"];

const trustStats = [
  { label: "Projects built", value: "1.2K+" },
  { label: "Tests run", value: "48K+" },
  { label: "Errors fixed", value: "9.4K+" }
];

const testimonials = [
  {
    quote: "It feels like having a frontend lead, QA engineer, and DevOps operator inside one control room.",
    name: "Anika Sharma",
    role: "Product Lead, SaaS Studio"
  },
  {
    quote: "The browser-backed testing workflow is what finally made AI output practical for our delivery team.",
    name: "Marcus Li",
    role: "Founder, LaunchOps"
  },
  {
    quote: "We replaced fragmented checklists with one workflow that actually moves a release forward.",
    name: "Reva Mehta",
    role: "Agency Director, Pixel Current"
  }
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    note: "Explore the workflow",
    features: ["1 workspace", "Starter prompts", "Basic reports", "Community support"]
  },
  {
    name: "Pro",
    price: "$79",
    note: "Best for builders and small teams",
    features: ["Unlimited projects", "Browser QA flows", "Auto-fix guidance", "Deploy previews", "Priority support"],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "For agencies and high-volume teams",
    features: ["Multi-client ops", "Custom workflows", "Role controls", "White-glove onboarding"]
  }
];

const howToUse = [
  "Open the live workspace and choose a project or create a new one.",
  "Describe what you want to build, fix, test, or deploy.",
  "Review the generated output, QA insights, and suggested actions.",
  "Run a preview, validate, and push toward production."
];

const faqs = [
  {
    question: "What is MCP?",
    answer:
      "MCP is the model context protocol layer that lets the system use tools like browser automation and connected workflows in a structured way."
  },
  {
    question: "How does the AI actually work here?",
    answer:
      "The platform combines specialized AI flows for generation, testing, debugging, reporting, and deployment instead of relying on one generic chat step."
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No, but technical users get more leverage. Non-technical teams can still use prompts, reports, previews, and guided actions."
  },
  {
    question: "Can this test a real checkout or live page?",
    answer:
      "Yes. The product is designed around real browser QA, production-style validation, and route-specific issue detection."
  }
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay }
  };
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function GlassCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass-panel rounded-[1.75rem] ${className}`.trim()}>{children}</div>;
}

export function ExplanationPage() {
  const [prompt, setPrompt] = useState("Build a blog site");
  const [demoState, setDemoState] = useState<"idle" | "loading" | "done">("idle");
  const [activeExample, setActiveExample] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExample((current) => (current + 1) % heroPromptExamples.length);
    }, 2600);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (demoState !== "loading") {
      return;
    }

    const timer = setTimeout(() => {
      setDemoState("done");
    }, 1800);

    return () => clearTimeout(timer);
  }, [demoState]);

  const generatedPreview = useMemo(
    () => ({
      project: prompt || "Build a blog site",
      routes: ["/", "/blog", "/pricing", "/contact"],
      checks: ["SEO schema ready", "UI audit queued", "Deploy preview prepared"],
      qualityScore: "96"
    }),
    [prompt]
  );

  return (
    <main className="marketing-mesh noise-overlay min-h-screen overflow-hidden px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="hero-orb left-[6%] top-[4%] h-44 w-44 bg-cyan-400/30" />
      <div className="hero-orb right-[8%] top-[11%] h-56 w-56 bg-indigo-400/26 [animation-delay:2s]" />
      <div className="hero-orb bottom-[22%] left-[28%] h-40 w-40 bg-violet-500/20 [animation-delay:4s]" />

      {particles.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          className="hero-particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay
          }}
        />
      ))}

      <div className="relative mx-auto flex max-w-7xl flex-col gap-24 pb-24 pt-6 sm:gap-28 sm:pt-8">
        <motion.header
          {...fadeUp()}
          className="glass-panel glow-ring sticky top-3 z-30 flex flex-col gap-4 rounded-[2rem] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/25">
              <BrainCircuit className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">NaveenCodes AI Dev OS</p>
              <p className="text-sm text-slate-300">Build, test, fix, and deploy from one AI operating system.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
            >
              Open Dashboard
            </Link>
            <Link
              href="/client"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              Start Free
            </Link>
          </div>
        </motion.header>

        <section className="relative">
          <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
            <motion.div {...fadeUp(0.08)} className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                <Sparkles className="size-3.5" />
                Premium AI Workflow Platform
              </div>
              <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
                Build, Test, Fix, and Deploy <span className="hero-shimmer">{"\u2014"} All with AI</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                Your AI Developer, Designer, QA Tester, and DevOps in one platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
                {["Project generation", "Browser QA", "Auto-fix loops", "Deployment control"].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                    {item}
                  </span>
                ))}
              </div>

              <GlassCard className="mt-10 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Live demo</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        value={prompt}
                        onChange={(event) => {
                          setPrompt(event.target.value);
                          setDemoState("idle");
                        }}
                        className="min-w-0 flex-1 rounded-2xl border border-white/12 bg-slate-950/60 px-4 py-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                        placeholder={heroPromptExamples[activeExample]}
                      />
                      <button
                        type="button"
                        onClick={() => setDemoState("loading")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                      >
                        Simulate Build
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      Try: <span className="text-cyan-200">{heroPromptExamples[activeExample]}</span>
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {demoState === "loading" ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        className="w-full rounded-[1.5rem] border border-cyan-400/15 bg-slate-950/80 p-4 sm:max-w-sm"
                      >
                        <p className="text-sm font-semibold text-white">Generating workspace...</p>
                        <div className="mt-4 space-y-3">
                          {["Planning routes", "Running browser QA", "Packaging deployment preview"].map((step, index) => (
                            <div key={step} className="space-y-2">
                              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                                <span>{step}</span>
                                <span>{[36, 68, 92][index]}%</span>
                              </div>
                              <div className="h-2 overflow-hidden rounded-full bg-white/8">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${[36, 68, 92][index]}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.18 }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-4 sm:max-w-sm"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-white">Generated preview</p>
                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">
                            Score {generatedPreview.qualityScore}
                          </span>
                        </div>
                        <p className="mt-3 text-base font-semibold text-cyan-200">{generatedPreview.project}</p>
                        <div className="mt-4 grid gap-2">
                          {generatedPreview.routes.map((route) => (
                            <div key={route} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                              {route}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 space-y-2">
                          {generatedPreview.checks.map((check) => (
                            <div key={check} className="flex items-center gap-2 text-sm text-slate-300">
                              <Check className="size-4 text-emerald-300" />
                              {check}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div {...fadeUp(0.16)} className="relative z-10">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 p-4 shadow-[0_24px_80px_rgba(8,15,38,0.55)] sm:p-6">
                <div className="absolute inset-x-10 top-0 h-32 bg-gradient-to-b from-cyan-400/12 via-blue-500/10 to-transparent blur-2xl" />
                <div className="relative grid gap-4">
                  <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">AI build session</p>
                          <p className="mt-2 text-xl font-semibold text-white">Blog site generated in 02:18</p>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 p-3">
                          <Code2 className="size-5 text-cyan-200" />
                        </div>
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          "App shell + routing",
                          "Hero, pricing, FAQ sections",
                          "SEO metadata + performance budget",
                          "Deploy preview and QA checks"
                        ].map((line) => (
                          <div key={line} className="flex items-center justify-between rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-3">
                            <span className="text-sm text-slate-200">{line}</span>
                            <span className="text-xs uppercase tracking-[0.22em] text-emerald-300">Ready</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Health pulse</p>
                      <div className="mt-4 grid gap-3">
                        {[
                          { label: "Quality score", value: "96%" },
                          { label: "Deploy readiness", value: "Green" },
                          { label: "Critical issues", value: "02" }
                        ].map((item) => (
                          <div key={item.label} className="rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Runtime logs</p>
                      <div className="mt-4 space-y-3 text-sm">
                        {[
                          "QA runner validated checkout DOM",
                          "Performance budget passed on /pricing",
                          "Preview deployment created for client review"
                        ].map((log) => (
                          <div key={log} className="rounded-2xl border border-white/8 bg-slate-950/70 px-4 py-3 text-slate-200">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Analytics preview</p>
                        <ChartColumn className="size-4 text-cyan-200" />
                      </div>
                      <div className="mt-6 flex h-44 items-end gap-3">
                        {[36, 58, 54, 78, 72, 88, 96].map((height, index) => (
                          <motion.div
                            key={height}
                            initial={{ scaleY: 0.2 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.7, delay: index * 0.08 }}
                            className="flex-1 rounded-t-[1.25rem] bg-gradient-to-t from-cyan-400 via-blue-500 to-violet-500 shadow-lg shadow-cyan-500/20"
                            style={{ height: `${height}%`, transformOrigin: "bottom" }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section {...fadeUp()} className="grid gap-4 md:grid-cols-3">
          {trustStats.map((stat) => (
            <GlassCard key={stat.label} className="p-6">
              <p className="text-sm uppercase tracking-[0.26em] text-slate-300">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
            </GlassCard>
          ))}
        </motion.section>

        <motion.section {...fadeUp()} className="space-y-8">
          <SectionHeading
            eyebrow="Product clarity"
            title="What this actually does"
            description="This is not just another chat UI. It is an AI operating system for building, testing, fixing, and shipping digital products without switching contexts."
          />
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {clarityItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="glass-panel group rounded-[1.75rem] p-6 transition hover:-translate-y-1.5 hover:border-cyan-300/25"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-cyan-100">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{item.copy}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="space-y-8">
          <SectionHeading
            eyebrow="How it works"
            title="From idea to release in five guided steps"
            description="The platform behaves like a coordinated product team. You give it intent, it returns execution, validation, and delivery context."
          />
          <div className="grid gap-4 lg:grid-cols-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="relative"
              >
                <GlassCard className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-semibold text-white/95">{step.id}</span>
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-100">
                      Step
                    </span>
                  </div>
                  <h3 className="mt-10 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{step.copy}</p>
                </GlassCard>
                {index < steps.length - 1 ? (
                  <div className="pointer-events-none absolute left-[calc(100%-0.4rem)] top-10 hidden h-px w-12 bg-gradient-to-r from-cyan-300/50 to-transparent lg:block" />
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="space-y-8">
          <SectionHeading
            eyebrow="Feature stack"
            title="Premium capabilities built into one control plane"
            description="Every card is one part of the system. Together they form a tighter workflow than disconnected generators, QA tools, and deployment dashboards."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                >
                  <GlassCard className="group h-full p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/18 via-blue-500/18 to-violet-500/18 text-cyan-100 shadow-lg shadow-cyan-500/10 transition group-hover:shadow-cyan-500/25">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{feature.copy}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <GlassCard className="overflow-hidden p-6 sm:p-8">
            <SectionHeading
              eyebrow="Why it is different"
              title="Traditional tools solve fragments. This system closes the loop."
              description="The value is not a single feature. It is the fact that generation, QA, fixes, and release actions stay connected."
              align="left"
            />
            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60">
              <div className="grid grid-cols-[1.1fr_0.9fr_1fr] border-b border-white/10 bg-white/5 text-xs uppercase tracking-[0.22em] text-slate-400">
                <div className="px-4 py-4">Capability</div>
                <div className="px-4 py-4">Traditional tools</div>
                <div className="px-4 py-4 text-cyan-200">NaveenCodes AI Dev OS</div>
              </div>
              {comparisonRows.map((row) => (
                <div key={row.label} className="grid grid-cols-1 border-b border-white/8 last:border-b-0 sm:grid-cols-[1.1fr_0.9fr_1fr]">
                  <div className="px-4 py-4 text-sm font-semibold text-white">{row.label}</div>
                  <div className="px-4 py-4 text-sm leading-7 text-slate-400">{row.old}</div>
                  <div className="px-4 py-4 text-sm leading-7 text-cyan-100">{row.next}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Use cases"
              title="Designed for teams that need leverage"
              description="Different users come for different outcomes. The platform adapts to all four without changing the operating model."
              align="left"
            />
            <div className="mt-8 grid gap-4">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-lg font-semibold text-white">{useCase.title}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{useCase.copy}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section {...fadeUp()} className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="Interactive demo"
              title="A guided product demo that sells the workflow instantly"
              description="Use video later if you want, but the layout already supports both a recorded walkthrough and an interactive preview state."
              align="left"
            />
            <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-violet-500/10" />
                <div className="relative flex h-full min-h-72 flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
                      <Play className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Video walkthrough</p>
                      <p className="mt-1 text-lg font-semibold text-white">From prompt to deploy in one session</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-40 rounded-[1.5rem] border border-dashed border-white/15 bg-white/5" />
                    <p className="text-sm leading-7 text-slate-300">
                      Drop in a product tour, Loom, or polished launch video here. The surrounding UI already communicates the platform value even before video assets are added.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Interactive preview</p>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                    <p className="text-sm text-slate-400">Current task</p>
                    <p className="mt-2 text-lg font-semibold text-white">Test checkout and prepare release notes</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Console</span>
                      <span className="text-emerald-300">0 critical</span>
                    </div>
                    <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-xs text-cyan-100">
                      checkout.spec.ts passed in 14.2s
                    </div>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">Deploy preview</span>
                      <span className="text-cyan-200">Ready</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-6">
            <GlassCard className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="AI command showcase"
                title="Operate the product with plain-English commands"
                description="These examples show the system positioning immediately. It feels more tangible than generic marketing copy."
                align="left"
              />
              <div className="mt-8 grid gap-3">
                {commandExamples.map((command, index) => (
                  <motion.div
                    key={command}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Bot className="size-4 text-cyan-200" />
                      <span className="text-sm text-slate-200">"{command}"</span>
                    </div>
                    <ArrowRight className="size-4 text-slate-500" />
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 sm:p-8">
              <SectionHeading
                eyebrow="Dashboard preview"
                title="Reports, logs, and release confidence in one view"
                description="A premium landing page needs to show the product depth. This block turns abstract claims into visible instrumentation."
                align="left"
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Analytics</p>
                  <div className="mt-5 flex h-32 items-end gap-3">
                    {[28, 34, 52, 48, 63, 76].map((value) => (
                      <div
                        key={value}
                        className="flex-1 rounded-t-[1rem] bg-gradient-to-t from-blue-500 via-cyan-400 to-violet-500"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Live report</p>
                  <div className="mt-5 space-y-3 text-sm text-slate-200">
                    {["SEO score: 97", "Console regressions: none", "Deployment health: stable"].map((line) => (
                      <div key={line} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="space-y-8">
          <SectionHeading
            eyebrow="Trust signals"
            title="Built to feel credible before real customer logos arrive"
            description="Use these placeholders now, then swap in real logos, customer quotes, and production metrics as they accumulate."
          />
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <GlassCard className="p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">By the numbers</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {trustStats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{stat.label}</p>
                    <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <GlassCard className="h-full p-6">
                    <p className="text-base leading-8 text-slate-200">"{testimonial.quote}"</p>
                    <div className="mt-8">
                      <p className="text-lg font-semibold text-white">{testimonial.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{testimonial.role}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="space-y-8">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple plans with a clear upgrade path"
            description="Lead with clarity. Make the Pro tier feel like the obvious next step, then give larger teams a credible enterprise route."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <GlassCard
                  className={`relative h-full p-6 sm:p-8 ${plan.highlighted ? "border-cyan-300/30 bg-cyan-300/10 shadow-[0_26px_70px_rgba(59,130,246,0.18)]" : ""}`}
                >
                  {plan.highlighted ? (
                    <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-950">
                      Most Popular
                    </span>
                  ) : null}
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{plan.name}</p>
                  <div className="mt-5 flex items-end gap-2">
                    <p className="text-5xl font-semibold text-white">{plan.price}</p>
                    {plan.price !== "Custom" ? <p className="pb-2 text-sm text-slate-400">/month</p> : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{plan.note}</p>
                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-sm text-slate-200">
                        <Check className="size-4 text-emerald-300" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/dashboard"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-2xl px-4 py-4 text-sm font-semibold transition ${plan.highlighted ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 text-slate-950 hover:-translate-y-0.5" : "border border-white/10 bg-white/5 text-white hover:bg-white/10"}`}
                  >
                    {plan.name === "Enterprise" ? "Talk to sales" : "Start now"}
                  </Link>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section {...fadeUp()} className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <GlassCard className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="How to use"
              title="A fast onboarding path for first-time users"
              description="This page should not just inspire. It should show how someone gets value in their first few minutes."
              align="left"
            />
            <div className="mt-8 space-y-4">
              {howToUse.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-violet-500/20 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <SectionHeading
              eyebrow="FAQ"
              title="Answer the purchase-blocking questions upfront"
              description="You can later wire these into a proper accordion. For now the layout already reads cleanly and feels premium."
              align="left"
            />
            <div className="mt-8 space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5"
                >
                  <p className="text-lg font-semibold text-white">{faq.question}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>

        <motion.section {...fadeUp()} className="pb-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/85 px-6 py-10 shadow-[0_24px_90px_rgba(17,24,39,0.5)] sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.18),transparent_26%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">Final CTA</p>
                <h2 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  Start Building with AI Today
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                  Move from idea to validated release with one premium workflow for generation, testing, fixes, and deployment.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  Start Free
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/autonomous"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
                >
                  See Autonomous Mode
                  <Workflow className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
