"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

export interface MetricAreaDatum {
  label: string;
  primary: number;
  secondary?: number;
}

export function MetricAreaChart({
  data,
  primaryLabel,
  secondaryLabel
}: {
  data: MetricAreaDatum[];
  primaryLabel: string;
  secondaryLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) {
      return;
    }

    const element = containerRef.current;
    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.max(rect.width, 0),
        height: Math.max(rect.height, 0)
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [mounted]);

  if (!mounted) {
    return <div className="h-72 w-full rounded-[1.5rem] border border-black/5 bg-slate-50 dark:border-white/10 dark:bg-slate-950/40" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      ref={containerRef}
      className="h-72 min-w-0 w-full"
    >
      {size.width > 0 && size.height > 0 ? (
        <AreaChart width={size.width} height={size.height} data={data}>
          <defs>
            <linearGradient id="primaryGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="secondaryGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.22)" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.94)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              borderRadius: "18px",
              color: "#e2e8f0"
            }}
            formatter={(value, name) => [value ?? 0, name === "primary" ? primaryLabel : secondaryLabel ?? String(name)]}
          />
          <Area type="monotone" dataKey="primary" stroke="#10b981" strokeWidth={3} fill="url(#primaryGradient)" />
          {secondaryLabel ? (
            <Area type="monotone" dataKey="secondary" stroke="#0ea5e9" strokeWidth={2.4} fill="url(#secondaryGradient)" />
          ) : null}
        </AreaChart>
      ) : null}
    </motion.div>
  );
}
