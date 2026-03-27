export const dashboardNavigation = [
    {
        href: "/dashboard",
        label: "Dashboard",
        description: "Operational overview and health summaries."
    },
    {
        href: "/projects",
        label: "Projects",
        description: "Managed audit targets and execution history."
    },
    {
        href: "/reports",
        label: "Reports",
        description: "Generated audit outputs, live QA, and auto-fix runs."
    },
    {
        href: "/settings",
        label: "Settings",
        description: "Workspace, auth, and MCP configuration."
    }
];
export function createId(prefix) {
    return `${prefix}_${crypto.randomUUID()}`;
}
export function getBaseUrl(value) {
    return value.replace(/\/$/, "");
}
