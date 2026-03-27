"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full rounded-[1.5rem] border border-black/5 bg-slate-50 dark:border-white/10 dark:bg-slate-950/40" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
      </ResponsiveContainer>
    </motion.div>
  );
}
