import { chatDiscoveryPaths, isRecord, type ChatDiscovery } from "@opencok/contracts/chat";
import { fetchChatJson } from "./chat-http.ts";

function websocket(value: unknown): value is string {
  if (typeof value !== "string") {return false;}

  try {
    const url = new URL(value);

    return (
      ["ws:", "wss:"].includes(url.protocol) &&
      !!url.hostname &&
      url.pathname === "/chat/ws" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      url.hostname !== "cok.chat" &&
      !url.hostname.endsWith(".cok.chat")
    );
  } catch {
    return false;
  }
}

export function createChatDiscovery(options: {
  origin: string;
  timeoutMs: number;
  fetch?: (url: string, options: RequestInit) => Promise<Response>;
}): ChatDiscovery {
  let origin: URL;

  try {
    origin = new URL(options.origin);
  } catch {
    throw new Error("Invalid chat discovery configuration");
  }

  if (
    !["http:", "https:"].includes(origin.protocol) ||
    !origin.hostname ||
    origin.pathname !== "/" ||
    origin.username ||
    origin.password ||
    origin.search ||
    origin.hash ||
    origin.hostname === "cok.chat" ||
    origin.hostname.endsWith(".cok.chat") ||
    !Number.isInteger(options.timeoutMs) ||
    options.timeoutMs < 100 ||
    options.timeoutMs > 30000
  )
    {throw new Error("Invalid chat discovery configuration");}

  const base = origin.origin;
  const timeoutMs = options.timeoutMs;
  const request = options.fetch ?? fetch;

  return async (path) => {
    try {
      if (!(chatDiscoveryPaths as readonly string[]).includes(path)) {throw new Error();}

      const value = await fetchChatJson(
        new URL(path, base).toString(),
        { method: "GET", headers: { accept: "application/json" } },
        timeoutMs,
        request,
      );

      if (!isRecord(value) || value.code !== 1) {throw new Error();}

      const data = value.data;

      if (path === "/api/v1global_config") {
        if (
          !isRecord(data) ||
          !isRecord(data.websocket) ||
          !Array.isArray(data.websocket.urlArray) ||
          data.websocket.urlArray.length < 1 ||
          data.websocket.urlArray.length > 16 ||
          !data.websocket.urlArray.every(websocket) ||
          !isRecord(data.url) ||
          !Array.isArray(data.url.websocket) ||
          JSON.stringify(data.url.websocket) !== JSON.stringify(data.websocket.urlArray) ||
          !isRecord(data.messageShow) ||
          !isRecord(data.normalMessageTypes)
        )
          {throw new Error();}

        return {
          code: 1,
          data: {
            websocket: { urlArray: data.websocket.urlArray },
            url: { websocket: data.url.websocket },
            messageShow: data.messageShow,
            normalMessageTypes: data.normalMessageTypes,
          },
        };
      }

      if (
        !Array.isArray(data) ||
        data.length < 1 ||
        data.length > 16 ||
        data.some(
          (server) =>
            !isRecord(server) ||
            typeof server.ip !== "string" ||
            !server.ip ||
            server.ip.length > 255 ||
            typeof server.port !== "string" ||
            !/^\d{1,5}$/.test(server.port) ||
            Number(server.port) < 1 ||
            Number(server.port) > 65535 ||
            !["ws", "wss"].includes(server.protocol as string),
        ) ||
        typeof value.message !== "string" ||
        value.message.length > 255
      )
        {throw new Error();}

      return {
        code: 1,
        data: data.map(({ ip, port, protocol }) => ({ ip, port, protocol })),
        message: value.message,
      };
    } catch {
      throw new Error("Chat discovery unavailable");
    }
  };
}
