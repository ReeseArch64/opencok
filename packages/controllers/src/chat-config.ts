import type { HttpHandler } from "@opencok/contracts/chat";
function validWebsocketUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return (
      ["ws:", "wss:"].includes(url.protocol) &&
      url.hostname.length > 0 &&
      url.hostname !== "cok.chat" &&
      !url.hostname.endsWith(".cok.chat") &&
      url.pathname === "/chat/ws" &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

const messageShow = {
  allianceSystemMessageCount: 0,
  countrySystemMessageCount: 0,
  countryNormalMessageTypes: [0],
  countrySystemMessageTypes: [],
  allianceNormalMessageTypes: [0],
  allianceSystemMessageTypes: [],
  singleNormalMessageTypes: [],
  groupNormalMessageTypes: [],
  show_translate_button_post_arry: [],
  knightTeamMessageTypes: [],
};

const normalMessageTypes = { 0: [0], 1: [0], 12: [0], 13: [0] };

interface ConfigOptions {
  websocketUrl: string;
  isReady?: () => boolean;
}

export function createConfigHandler({
  websocketUrl,
  isReady = () => true,
}: ConfigOptions): HttpHandler {
  if (!validWebsocketUrl(websocketUrl)) throw new TypeError("invalid chat websocket URL");

  return (_request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    let ready = false;
    try {
      ready = isReady() === true;
    } catch {
      ready = false;
    }
    if (!ready) {
      response.writeHead(503);
      response.end('{"code":0,"data":{}}');
      return;
    }
    response.writeHead(200);
    response.end(
      JSON.stringify({
        code: 1,
        data: {
          websocket: { urlArray: [websocketUrl] },
          url: { websocket: [websocketUrl] },
          messageShow,
          normalMessageTypes,
        },
      }),
    );
  };
}

export function createServerListHandler({
  websocketUrl,
  isReady = () => true,
}: ConfigOptions): HttpHandler {
  if (!validWebsocketUrl(websocketUrl)) throw new TypeError("invalid chat websocket URL");
  const url = new URL(websocketUrl);
  const server = {
    ip: url.hostname,
    port: url.port || (url.protocol === "wss:" ? "443" : "80"),
    protocol: url.protocol.slice(0, -1),
  };
  return (_request, response) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    let ready = false;
    try {
      ready = isReady() === true;
    } catch {
      ready = false;
    }
    response.writeHead(ready ? 200 : 503);
    response.end(
      ready
        ? JSON.stringify({ code: 1, data: [server], message: "success" })
        : '{"code":0,"data":[]}',
    );
  };
}
