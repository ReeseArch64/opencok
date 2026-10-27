import { MapleTool, mcpLimits } from "./mcp-contracts";
import type { MapleQuery } from "./mcp-contracts";

const commonProperties = {
  since: {
    type: "string",
    pattern: "^[1-9][0-9]*(ms|s|m|h|d|w)$",
    description: "Lookback duration, for example 15m or 6h.",
  },
  service: { type: "string", minLength: 1, maxLength: 256, description: "Service name substring." },
  env: { type: "string", minLength: 1, maxLength: 256 },
  limit: {
    type: "integer",
    minimum: 1,
    maximum: mcpLimits.maximumLimit,
    default: mcpLimits.defaultLimit,
  },
};

const severities = ["trace", "debug", "info", "warn", "error", "fatal"];

const toolProperties = {
  [MapleTool.ListServices]: commonProperties,
  [MapleTool.SearchLogs]: {
    ...commonProperties,
    severity: { type: "string", enum: severities },
    search: { type: "string", minLength: 1, maxLength: 256 },
  },
  [MapleTool.SearchTraces]: {
    ...commonProperties,
    errors: { type: "boolean" },
    span_name: {
      type: "string",
      minLength: 1,
      maxLength: 256,
      description: "Case-insensitive span name substring.",
    },
  },
};

export class MapleValidation {
  public static record(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  public static container(value: string): string {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/.test(value)) {
      throw new Error("Invalid container name");
    }

    return value;
  }

  public static tools() {
    return Object.values(MapleTool).map((name) => ({
      name,
      description: {
        [MapleTool.ListServices]: "List services in local Maple telemetry.",
        [MapleTool.SearchLogs]: "Search local Maple logs using bounded read-only filters.",
        [MapleTool.SearchTraces]: "Search local Maple traces using bounded read-only filters.",
      }[name],
      inputSchema: {
        type: "object",
        properties: toolProperties[name],
        additionalProperties: false,
      },
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    }));
  }

  public static query(value: unknown): MapleQuery {
    if (
      !this.record(value) ||
      Object.keys(value).some((key) => key !== "name" && key !== "arguments" && key !== "_meta") ||
      (value._meta !== undefined && !this.record(value._meta)) ||
      !Object.values(MapleTool).includes(value.name as MapleTool)
    ) {
      throw new Error("Invalid tool call");
    }

    const name = value.name as MapleTool;
    const args = value.arguments === undefined ? {} : value.arguments;

    if (
      !this.record(args) ||
      Object.keys(args).some((key) => !Object.hasOwn(toolProperties[name], key))
    ) {
      throw new Error("Invalid tool arguments");
    }

    const validated: MapleQuery["arguments"] = { limit: mcpLimits.defaultLimit };

    for (const [key, entry] of Object.entries(args)) {
      if (key === "limit") {
        if (
          typeof entry !== "number" ||
          !Number.isInteger(entry) ||
          entry < 1 ||
          entry > mcpLimits.maximumLimit
        ) {
          throw new Error("Invalid limit");
        }
      } else if (key === "errors") {
        if (typeof entry !== "boolean") {
          throw new Error("Invalid errors filter");
        }
      } else {
        if (
          typeof entry !== "string" ||
          entry.length === 0 ||
          entry.length > 256 ||
          entry.trim() !== entry ||
          entry.startsWith("-") ||
          /[;|&`$<>\\"']/.test(entry) ||
          Array.from(entry).some(
            (character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
          )
        ) {
          throw new Error("Invalid text filter");
        }

        if (key === "since" && !/^[1-9][0-9]*(ms|s|m|h|d|w)$/.test(entry)) {
          throw new Error("Invalid duration");
        }

        if (key === "severity" && !severities.includes(entry)) {
          throw new Error("Invalid severity");
        }
      }

      validated[key] = entry;
    }

    return { name, arguments: validated };
  }
}
