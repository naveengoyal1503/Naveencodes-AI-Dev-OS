import { buildLiveMonitorMode, createQaAudit } from "@naveencodes/ai";

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
      <QAControlCenter starterAudit={starterAudit} starterMonitor={starterMonitor} />
    </AppShell>
  );
}
