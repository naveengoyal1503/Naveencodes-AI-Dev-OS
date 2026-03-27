export interface AuditReport {
  id: string;
  projectId: string;
  type: string;
  createdAt: string;
  summary: Record<string, unknown>;
  errors: string[];
  recommendations: string[];
}

export interface QaAuditReportPayload {
  url: string;
  status: string;
  criticalErrors: number;
  warnings: number;
  apiIssues: number;
  uiIssues: number;
  seoScore: number;
  performanceScore: number;
  fixesGenerated: number;
}

export function createJsonReport(input: Omit<AuditReport, "createdAt">): AuditReport {
  return {
    ...input,
    createdAt: new Date().toISOString()
  };
}

export function stringifyReport(report: AuditReport): string {
  return JSON.stringify(report, null, 2);
}

export function createQaAuditReport(input: {
  id: string;
  projectId: string;
  audit: QaAuditReportPayload;
  recommendations?: string[];
}): AuditReport {
  const summary: Record<string, unknown> = {
    url: input.audit.url,
    status: input.audit.status,
    criticalErrors: input.audit.criticalErrors,
    warnings: input.audit.warnings,
    apiIssues: input.audit.apiIssues,
    uiIssues: input.audit.uiIssues,
    seoScore: input.audit.seoScore,
    performanceScore: input.audit.performanceScore,
    fixesGenerated: input.audit.fixesGenerated
  };

  return createJsonReport({
    id: input.id,
    projectId: input.projectId,
    type: "qa-audit",
    summary,
    errors: input.audit.criticalErrors > 0 ? [`${input.audit.criticalErrors} critical browser issues remain.`] : [],
    recommendations:
      input.recommendations ?? [
        "Apply the generated fix plan.",
        "Restart the project and rerun the QA suite.",
        "Keep monitor mode enabled for regressions."
      ]
  });
}
