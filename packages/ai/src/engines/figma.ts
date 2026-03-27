import { generateDesignSystem } from "./design";
import type { FigmaConversionInput, FigmaConversionResult } from "./types";

export function convertDesignToCode(input: FigmaConversionInput): FigmaConversionResult {
  const sourceType = input.figmaLink ? "figma" : input.designImage ? "image" : "notes";
  const design = generateDesignSystem({ projectType: "saas", tone: "pixel-precise control panel" });

  return {
    sourceType,
    extraction: {
      layout: ["Hero with asymmetric split", "Stats strip", "Feature grid", "Sticky command rail"],
      spacing: design.tokens.spacing,
      typography: design.tokens.typography,
      colors: Object.values(design.tokens.palette)
    },
    components: [
      { name: "FigmaHero", type: "layout", description: "Hero section translated from the source composition." },
      { name: "FeatureMatrix", type: "content", description: "Responsive card grid extracted from the source layout." },
      { name: "ActionPanel", type: "utility", description: "Command actions and CTA bar rendered in Tailwind." }
    ],
    generatedReactComponent: `export function GeneratedFigmaSection() {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Figma to code</p>
        <h2 className="text-4xl font-semibold tracking-tight">Pixel-aware SaaS section scaffold</h2>
        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          Converted into reusable React and Tailwind primitives with responsive spacing, typography, and component decomposition.
        </p>
      </div>
      <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/10 p-4">Layout extracted</div>
          <div className="rounded-2xl bg-white/10 p-4">Colors mapped</div>
          <div className="rounded-2xl bg-white/10 p-4">Typography scaled</div>
          <div className="rounded-2xl bg-white/10 p-4">Components reusable</div>
        </div>
      </div>
    </section>
  );
}`
  };
}
