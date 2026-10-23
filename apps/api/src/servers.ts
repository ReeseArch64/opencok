import type { Config } from "./config.ts";
export type ServerInfo = Record<string, string>;
const publicFields = ["id", "name", "ip", "port", "zone"];
export class ServerDirectory {
  constructor(private readonly config: Config) {}
  async read(): Promise<Map<string, ServerInfo>> {
    let items: unknown;
    if (this.config.serversFile) {
      const file = Bun.file(this.config.serversFile);
      if (file.size > 1024 * 1024) throw new Error("Oversized server directory");
      items = await file.json();
    } else {
      const id = String(this.config.kingdomId);
      items = [
        {
          id,
          name: `OpenCoK Kingdom ${id}`,
          ip: this.config.gameHost ?? "127.0.0.1",
          port: String(this.config.gamePort ?? 9933),
          zone: `COK${id}`,
          recommend: "true",
          test: "false",
        },
      ];
    }
    if (!Array.isArray(items) || !items.length) throw new Error("Empty server directory");
    const result = new Map<string, ServerInfo>();
    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item))
        throw new Error("Invalid server entry");
      const server = Object.fromEntries(
        Object.entries(item).map(([key, value]) => [key, String(value)]),
      );
      if (
        !/^[1-9]\d*$/.test(server.id ?? "") ||
        !Number.isSafeInteger(Number(server.id)) ||
        Number(server.id) > 2147483647 ||
        result.has(server.id!)
      )
        throw new Error("Invalid realm ID");
      if (server.zone !== `COK${server.id}` || !server.name || !server.ip)
        throw new Error("Incomplete server entry");
      if (this.config.gameHost) server.ip = this.config.gameHost;
      if (this.config.gamePort) {
        if (items.length > 1) throw new Error("Use per-realm ports in a multi-realm directory");
        server.port = String(this.config.gamePort);
      }
      if (!/^[a-zA-Z0-9._:-]+$/.test(server.ip) || ["0.0.0.0", "::"].includes(server.ip))
        throw new Error("Invalid advertised host");
      const port = Number(server.port);
      if (!Number.isInteger(port) || port < 1 || port > 65535)
        throw new Error("Invalid advertised port");
      result.set(server.id!, server);
    }
    return result;
  }
}
export function publicServer(server: ServerInfo): ServerInfo {
  return Object.fromEntries(publicFields.map((key) => [key, server[key]!]));
}
export function listedServers(
  servers: Map<string, ServerInfo>,
  recommended: boolean,
): ServerInfo[] {
  return [...servers.values()]
    .filter((server) => server.test !== "true" && (!recommended || server.recommend === "true"))
    .map(publicServer);
}
