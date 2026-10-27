import { expect, test } from "bun:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  chatMailboxPath,
  encodeChatMailbox,
  decodeChatMailbox,
  type ChatMailboxUpdate,
} from "@opencok/contracts/chat-mailbox";
import { signChatMailbox, verifyChatMailbox } from "@opencok/identity/chat-mailbox";
import { signChatAvatarProfile } from "@opencok/identity/chat-avatar-profile";
import { createChatMailboxHandler } from "@opencok/controllers/chat-mailbox";
import { createChatMailboxPublisher } from "@opencok/connection/chat-mailbox";

const now = 1792756800123,
  secret = "synthetic-mailbox-secret";
const update: ChatMailboxUpdate = {
  owner: "1001",
  kingdomId: 1,
  effectIndex: 0,
  action: "read",
  others: "peer",
  types: [1, 20],
  requestedAt: now,
  operationId: "00000000-0000-4000-8000-000000000001",
};
const url = `http://chat.internal${chatMailboxPath}`;

test("the signed mailbox request carries only the durable operation identity", () => {
  const body = encodeChatMailbox(update),
    timestamp = String(now);
  expect(JSON.parse(body)).toEqual(update);
  expect(decodeChatMailbox(body)).toEqual(update);
  const signature = signChatMailbox(body, timestamp, secret);
  expect(verifyChatMailbox(body, timestamp, signature, secret, now)).toBe(true);
  expect(verifyChatMailbox(body, timestamp, signature, secret, now + 30001)).toBe(false);
  expect(verifyChatMailbox(body, timestamp, signature, "other", now)).toBe(false);
  expect(verifyChatMailbox(body + " ", timestamp, signature, secret, now)).toBe(false);
  expect(
    verifyChatMailbox(body, timestamp, signChatAvatarProfile(body, timestamp, secret), secret, now),
  ).toBe(false);
  for (const value of [
    { ...update, owner: "" },
    { ...update, owner: "a".repeat(41) },
    { ...update, owner: "\ud800" },
    { ...update, owner: "a\0b" },
    { ...update, kingdomId: 0 },
    { ...update, kingdomId: 1.5 },
    { ...update, operationId: update.operationId.toUpperCase().replace("4000", "4A00") },
    { ...update, operationId: "not-an-operation" },
    { ...update, name: "Forged Name" },
  ])
    {expect(() => decodeChatMailbox(JSON.stringify(value))).toThrow();}
});

async function exchange(options: {
  body?: string;
  signature?: string;
  headers?: Record<string, string>;
  run?: (value: ChatMailboxUpdate) => Promise<"applied" | "unchanged">;
  timeoutMs?: number;
}) {
  const body = options.body ?? encodeChatMailbox(update),
    calls: ChatMailboxUpdate[] = [],
    logs: unknown[] = [];
  let status = 0,
    output = "";
  const handler = createChatMailboxHandler({
    signingSecret: secret,
    now: () => now,
    timeoutMs: options.timeoutMs ?? 100,
    mailboxes: {
      list: async () => [],
      apply: async (value) => {
        calls.push(value);
        return options.run ? options.run(value) : "applied";
      },
    },
    log: (event) => logs.push(event),
  });
  await handler(
    {
      headers: {
        "content-type": "application/json",
        "x-opencok-timestamp": String(now),
        "x-opencok-signature": options.signature ?? signChatMailbox(body, String(now), secret),
        ...options.headers,
      },
      async *[Symbol.asyncIterator]() {
        yield Buffer.from(body);
      },
    } as unknown as IncomingMessage,
    {
      writeHead(code: number) {
        status = code;
      },
      end(value: string) {
        output = value;
      },
    } as unknown as ServerResponse,
  );
  return { status, body: JSON.parse(output), calls, logs };
}

test("the receiver authenticates before storage and bounds malformed requests", async () => {
  const success = await exchange({});
  expect(success.status).toBe(200);
  expect(success.calls).toEqual([update]);
  expect(success.body).toEqual({
    code: 1,
    data: {
      owner: update.owner,
      kingdomId: update.kingdomId,
      operationId: update.operationId,
      effectIndex: update.effectIndex,
      result: "applied",
    },
  });
  for (const [options, status] of [
    [{ signature: "0".repeat(64) }, 403],
    [{ body: JSON.stringify({ ...update, name: "Injected Name" }) }, 400],
    [{ headers: { "content-type": "text/plain" } }, 415],
    [{ headers: { "content-length": "4097" } }, 413],
    [{ body: " ".repeat(4097) }, 413],
  ] as const) {
    const result = await exchange(options);
    expect(result.status).toBe(status);
    expect(result.calls).toEqual([]);
    expect(result.body).toEqual({ code: 0, data: {} });
    expect(JSON.stringify(result.logs)).not.toContain(secret);
    expect(JSON.stringify(result.logs)).not.toContain("Injected Name");
  }
});

test("receiver storage failures and deadlines never acknowledge success", async () => {
  for (const run of [
    async (): Promise<never> => {
      throw new Error("synthetic-private-storage-detail");
    },
    (): Promise<never> => new Promise(() => {}),
  ]) {
    const result = await exchange({ run });
    expect(result.status).toBe(503);
    expect(result.body).toEqual({ code: 0, data: {} });
    expect(JSON.stringify(result.logs)).not.toContain("synthetic-private-storage-detail");
  }
});

test("publisher accepts only matching authenticated acknowledgments and propagates cancellation", async () => {
  const response = (data: unknown) =>
    new Response(JSON.stringify({ code: 1, data }), {
      headers: { "content-type": "application/json" },
    });
  let calls = 0;
  const publish = createChatMailboxPublisher({
    url,
    signingSecret: secret,
    timeoutMs: 100,
    now: () => now,
    fetch: async (endpoint, request) => {
      calls++;
      expect(endpoint).toBe(url);
      expect(request.redirect).toBe("error");
      const headers = request.headers as Record<string, string>;
      expect(
        verifyChatMailbox(
          String(request.body),
          headers["x-opencok-timestamp"],
          headers["x-opencok-signature"],
          secret,
          now,
        ),
      ).toBe(true);
      expect(decodeChatMailbox(String(request.body))).toEqual(update);
      return response({ ...update, result: "unchanged" });
    },
  });
  await publish(update, new AbortController().signal);
  expect(calls).toBe(1);
  const aborted = new AbortController();
  aborted.abort();
  await expect(publish(update, aborted.signal)).rejects.toThrow("Chat mailbox unavailable");
  expect(calls).toBe(1);
  for (const data of [
    { ...update, result: "unknown" },
    { ...update, result: "applied", owner: "other" },
    { ...update, result: "applied", kingdomId: 2 },
    { ...update, result: "applied", operationId: "other" },
  ]) {
    const invalid = createChatMailboxPublisher({
      url,
      signingSecret: secret,
      timeoutMs: 100,
      now: () => now,
      fetch: async () => response(data),
    });
    await expect(invalid(update, new AbortController().signal)).rejects.toThrow(
      "Chat mailbox unavailable",
    );
  }
  let signal: AbortSignal | undefined;
  const stalled = createChatMailboxPublisher({
    url,
    signingSecret: secret,
    timeoutMs: 100,
    now: () => now,
    fetch: async (_, request) => {
      signal = request.signal!;
      return new Promise(() => {});
    },
  });
  await expect(stalled(update, new AbortController().signal)).rejects.toThrow(
    "Chat mailbox unavailable",
  );
  expect(signal?.aborted).toBe(true);
});

test("publisher rejects legacy hosts, credentials and unexpected paths", () => {
  for (const endpoint of [
    "http://cok.chat/_internal/mailbox",
    "http://a.cok.chat/_internal/mailbox",
    "http://user:password@chat.internal/_internal/mailbox",
    "http://chat.internal/_internal/avatar-profile",
    `${url}?name=forged`,
    `${url}#name`,
    "file:///tmp/mailbox",
  ]) {
    expect(() =>
      createChatMailboxPublisher({ url: endpoint, signingSecret: secret, timeoutMs: 100 }),
    ).toThrow("Invalid chat mailbox configuration");
  }
});
