"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface MetricBarDatum {
  label: string;
  value: number;
}

export function MetricBarChart({ data, color = "#f59e0b" }: { data: MetricBarDatum[]; color?: string }) {
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
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
      className="h-72 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
          />
          <Bar dataKey="value" fill={color} radius={[14, 14, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
