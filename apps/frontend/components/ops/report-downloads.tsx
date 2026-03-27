"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

import { getApiBaseUrl } from "../../lib/api";
import { AppButton } from "../ui/button";
import { SurfaceCard } from "../ui/card";

const endpoint = getApiBaseUrl();

interface ReportItem {
  id: string;
  type: string;
  projectId: string;
  createdAt: string;
}

export function ReportDownloads() {
  const [reports, setReports] = useState<ReportItem[]>([]);

  useEffect(() => {
    fetch(`${endpoint}/api/reports`)
      .then((response) => response.json())
      .then((payload: { items: ReportItem[] }) => setReports(payload.items));
  }, []);

  return (
    <SurfaceCard title="PDF report generator" description="Download client-ready SEO, performance, UI, and QA summaries as PDFs.">
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-slate-950/40">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{report.type}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  {report.projectId} | {report.createdAt}
                </p>
              </div>
              <a href={`${endpoint}/api/reports/${report.id}/pdf`} target="_blank" rel="noreferrer">
                <AppButton variant="secondary">
                  <Download className="mr-2 size-4" />
                  PDF
                </AppButton>
              </a>
            </div>
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
