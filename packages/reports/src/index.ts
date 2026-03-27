import PDFDocument from "pdfkit";

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

export async function createPdfReportBuffer(report: AuditReport): Promise<Buffer> {
  const document = new PDFDocument({
    margin: 48,
    size: "A4"
  });

  const chunks: Buffer[] = [];

  return await new Promise<Buffer>((resolve, reject) => {
    document.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);

    document.fontSize(22).text("NaveenCodes AI Dev OS Report");
    document.moveDown();
    document.fontSize(12).text(`Report ID: ${report.id}`);
    document.text(`Project: ${report.projectId}`);
    document.text(`Type: ${report.type}`);
    document.text(`Created: ${report.createdAt}`);
    document.moveDown();
    document.fontSize(16).text("Summary");
    document.fontSize(11).text(JSON.stringify(report.summary, null, 2));
    document.moveDown();
    document.fontSize(16).text("Errors");
    if (report.errors.length === 0) {
      document.fontSize(11).text("No blocking errors.");
    } else {
      report.errors.forEach((item) => document.fontSize(11).text(`- ${item}`));
    }
    document.moveDown();
    document.fontSize(16).text("Recommendations");
    report.recommendations.forEach((item) => document.fontSize(11).text(`- ${item}`));
    document.end();
  });
}
