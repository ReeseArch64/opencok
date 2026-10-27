import { expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { WebSocket } from "ws";
import { createChatApp } from "../src/app";
import { createRoomAuthorizer } from "@opencok/identity/chat-rooms";
import { createJoinHandler } from "@opencok/controllers/chat-join";
import { parseChatEnvironment } from "@opencok/env/chat";
import type { ChatRepository, CommandContext, Session } from "@opencok/contracts/chat";

test("chat configuration requires credentials and validates kingdom mapping", () => {
  expect(() => parseChatEnvironment({})).toThrow();
  expect(() =>
    parseChatEnvironment({
      DATABASE_URL: "mysql://invalid/db",
      CHAT_SECRET: "synthetic",
      CHAT_WEBSOCKET_URL: "ws://localhost/chat/ws",
    }),
  ).toThrow();
});

test("room joins are atomic and require current alliance membership", async () => {
  const authorize = createRoomAuthorizer(async () => ({
    serverId: 1,
    originalServerId: 1,
    allianceId: "a",
    membershipAllianceId: "b",
    language: "en",
  }));
  expect(await authorize("player", "alliance_1_a")).toBeNull();
  const context: CommandContext = {
    uid: "player",
    connection: { joinedRooms: new Set() },
    params: {
      rooms: [
        { group: "country", id: "country_1" },
        { group: "country", id: "country_2" },
      ],
    },
    sendFrame() {},
    peers: new Set(),
  };
  await expect(createJoinHandler(authorize)(context)).rejects.toThrow();
  expect(context.connection.joinedRooms.size).toBe(0);
});

test("signed sessions bind opaque tokens to identities and gate real HTTP/WebSocket readiness", async () => {
  const sessions = new Map<string, Session>();
  let available = true;
  let sessionStorageAvailable = true;
  const repository: ChatRepository = {
    profiles: { publish: async () => "applied", find: async () => null },
    nicknames: { refresh: async () => "unchanged" },
    sessions: {
      async create(session) {
        sessions.set(session.tokenHash.toString("hex"), session);
      },
      async getById(hash) {
        if (!sessionStorageAvailable) throw new Error("synthetic session outage");
        return sessions.get(hash.toString("hex")) ?? null;
      },
    },
    messages: {
      async create() {
        throw new Error("unused");
      },
      async getAll() {
        return [];
      },
      async getAllByRange() {
        return [];
      },
    },
    async getPlayerStateById() {
      return null;
    },
    async health() {
      if (!available) throw new Error("offline");
    },
    async deleteExpired() {
      return { messages: 0, sessions: 0 };
    },
  };
  const app = createChatApp({
    repository,
    signingSecret: "synthetic",
    websocketUrl: "ws://localhost/chat/ws",
  });
  let socket: WebSocket | undefined;
  try {
    app.server.listen(0, "127.0.0.1");
    await once(app.server, "listening");
    const address = app.server.address();
    if (!address || typeof address === "string") throw new Error("Missing port");
    const base = `http://127.0.0.1:${address.port}`;
    expect((await fetch(`${base}/_health`)).status).toBe(503);
    await app.runMaintenance();
    expect((await fetch(`${base}/_health`)).status).toBe(200);
    const form = new URLSearchParams({
      appid: "synthetic",
      ttl: "86400",
      uid: "player",
      userinfo: "{}",
    });
    form.set(
      "sign",
      createHash("md5")
        .update([...form].map(([k, v]) => `${k}${v}`).join("") + "synthetic")
        .digest("hex"),
    );
    const response = await fetch(`${base}/external/session`, { method: "POST", body: form });
    expect(response.status).toBe(200);
    const { data } = (await response.json()) as { data: { session: string } };
    expect(data.session).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(sessions.has(data.session)).toBe(false);
    socket = new WebSocket(base.replace("http", "ws") + "/chat/ws", {
      headers: { session: data.session, uid: "player" },
    });
    const [login] = await once(socket, "message");
    expect(JSON.parse(login.toString()).cmd).toBe("login.success");
    socket.send(JSON.stringify({ cmd: "unknown", params: {} }));
    const [reply] = await once(socket, "message");
    expect(JSON.parse(reply.toString()).error.code).toBe("unsupported_command");
    const rejected = new WebSocket(base.replace("http", "ws") + "/chat/ws", {
      headers: { session: data.session, uid: "other" },
    });
    const rejection = new Promise<number>((resolve) => {
      rejected.on("error", () => {});
      rejected.on("unexpected-response", (_request, response) => {
        response.resume();
        rejected.terminate();
        resolve(response.statusCode!);
      });
    });
    expect(await rejection).toBe(401);
    sessionStorageAvailable = false;
    socket.send(JSON.stringify({ cmd: "user.init", params: {} }));
    const [unavailable] = await once(socket, "message");
    expect(JSON.parse(unavailable.toString()).error.code).toBe("unavailable");
    sessionStorageAvailable = true;
    socket.send(JSON.stringify({ cmd: "user.init", params: {} }));
    const [recovered] = await once(socket, "message");
    expect(JSON.parse(recovered.toString()).result.status).toBe("ok");
    sessions.clear();
    socket.send(JSON.stringify({ cmd: "user.init", params: {} }));
    const [expired] = await once(socket, "message");
    expect(JSON.parse(expired.toString()).error.code).toBe("unauthorized");
    const [closeCode] = await once(socket, "close");
    expect(closeCode).toBe(1008);
    available = false;
    await app.runMaintenance();
    expect((await fetch(`${base}/api/v1global_config`)).status).toBe(503);
  } finally {
    socket?.terminate();
    await app.close();
  }
});
