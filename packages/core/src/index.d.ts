export type UserRole = "admin" | "manager" | "member";
export interface AppEnv {
    NODE_ENV: string;
    PORT: number;
    APP_URL: string;
    NEXT_PUBLIC_API_URL: string;
    JWT_SECRET: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    MCP_BROWSER_URL: string;
    MCP_SERVER_COMMAND: string;
    MCP_SERVER_ARGS: string;
    QA_DEFAULT_TARGET_URL: string;
    QA_LOAD_TEST_USERS: number;
    QA_AUTO_FIX_SAFE_MODE: string;
}
export interface NavItem {
    href: string;
    label: string;
    description: string;
}
export declare const dashboardNavigation: NavItem[];
export declare function createId(prefix: string): string;
export declare function getBaseUrl(value: string): string;
