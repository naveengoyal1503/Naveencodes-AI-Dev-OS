export const workflowRegistry = [
    {
        name: "full_site_audit",
        description: "Runs the complete audit stack across SEO, UI, errors, and APIs.",
        module: "foundation.fullSiteAudit"
    },
    {
        name: "seo_full_scan",
        description: "Validates metadata, indexing, structured data, and technical SEO signals.",
        module: "seo.run"
    },
    {
        name: "performance_scan",
        description: "Captures browser performance telemetry and optimization opportunities.",
        module: "performance.run"
    },
    {
        name: "ui_responsive_test",
        description: "Checks responsive layouts and visual regressions across viewports.",
        module: "ui.run"
    },
    {
        name: "ecommerce_flow_test",
        description: "Executes purchase-flow smoke tests for ecommerce targets.",
        module: "commerce.run"
    },
    {
        name: "error_monitor_live",
        description: "Streams browser console and network failures in real time.",
        module: "errors.stream"
    }
];
