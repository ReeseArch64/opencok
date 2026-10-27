export enum MapleTool {
  ListServices = "list_services",
  SearchLogs = "search_logs",
  SearchTraces = "search_traces",
}

export enum McpMethod {
  Initialize = "initialize",
  Ping = "ping",
  ListTools = "tools/list",
  CallTool = "tools/call",
}

export interface CommandRunner {
  run(command: string[]): Promise<string>;
}

export interface MapleQuery {
  name: MapleTool;
  arguments: Record<string, string | number | boolean>;
}

export interface McpResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
}

export const mcpLimits = {
  timeoutMs: 15_000,
  outputBytes: 1_048_576,
  inputBytes: 65_536,
  defaultLimit: 20,
  maximumLimit: 100,
};
