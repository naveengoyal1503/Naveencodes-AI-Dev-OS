import { buildLiveMonitorMode, createQaAudit } from "@naveencodes/ai";

import { ReportDownloads } from "../../components/ops/report-downloads";
import { QAControlCenter } from "../../components/qa/qa-control-center";
import { AppShell } from "../../components/shell/app-shell";

export default function ReportsPage() {
  const starterAudit = createQaAudit({
    url: "http://localhost:3000",
    loadTestUsers: 24
  });
  const starterMonitor = buildLiveMonitorMode("http://localhost:3000");

  return (
    <AppShell>
      <div className="space-y-4">
        <QAControlCenter starterAudit={starterAudit} starterMonitor={starterMonitor} />
        <ReportDownloads />
      </div>
    </AppShell>
  );
}
