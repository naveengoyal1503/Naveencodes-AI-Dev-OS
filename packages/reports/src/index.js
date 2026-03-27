export function createJsonReport(input) {
    return {
        ...input,
        createdAt: new Date().toISOString()
    };
}
export function stringifyReport(report) {
    return JSON.stringify(report, null, 2);
}
