export class ChromeDevtoolsMcpConnection {
    config;
    constructor(config) {
        this.config = config;
    }
    get browserUrl() {
        return this.config.browserUrl;
    }
    get startCommand() {
        return {
            command: this.config.command,
            args: this.config.args
        };
    }
    toMcpJsonEntry() {
        return {
            command: this.config.command,
            args: this.config.args
        };
    }
}
export function createChromeDevtoolsConnection(input) {
    return new ChromeDevtoolsMcpConnection({
        browserUrl: input.browserUrl,
        command: input.command ?? "node",
        args: input.args ?? []
    });
}
