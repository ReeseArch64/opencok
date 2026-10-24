import { randomUUID } from "node:crypto";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import { decodeChatNickname, type ChatNicknameStore } from "@opencok/contracts/chat-nickname";
import { verifyChatNickname } from "@opencok/identity/chat-nickname";

export function createChatNicknameHandler(options: {
  nicknames: ChatNicknameStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
}): AsyncHttpHandler {
  const timeoutMs = options.timeoutMs ?? 3000;
  if (
    !options.signingSecret ||
    !options.nicknames ||
    !Number.isInteger(timeoutMs) ||
    timeoutMs < 100 ||
    timeoutMs > 30000
  )
    throw new Error("Invalid chat nickname configuration");
  const { nicknames, signingSecret, now = Date.now, log = () => {} } = options;
  return async (request, response) => {
    const correlationId = randomUUID();
    const reply = (status: number, data: unknown) => {
      response.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "x-request-id": correlationId,
      });
      response.end(JSON.stringify({ code: status === 200 ? 1 : 0, data }));
    };
    const fail = (status: number, category: string) => {
      log({ correlationId, operation: "nickname.refresh", category });
      reply(status, {});
    };
    if (!/^application\/json(?:\s*;|$)/i.test(String(request.headers["content-type"] ?? ""))) {
      fail(415, "bad_request");
      return;
    }
    const length = request.headers["content-length"];
    if (
      length !== undefined &&
      (typeof length !== "string" || !/^\d+$/.test(length) || Number(length) > 4096)
    ) {
      fail(413, "bad_request");
      return;
    }
    let expired = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of request) {
        if (expired) throw new Error();
        const bytes = Buffer.from(chunk);
        size += bytes.length;
        if (size > 4096) return { status: 413, category: "bad_request" } as const;
        chunks.push(bytes);
      }
      if (expired) throw new Error();
      let body: string;
      try {
        body = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
          Buffer.concat(chunks),
        );
      } catch {
        return { status: 400, category: "bad_request" } as const;
      }
      if (
        !verifyChatNickname(
          body,
          request.headers["x-opencok-timestamp"],
          request.headers["x-opencok-signature"],
          signingSecret,
          now(),
        )
      )
        return { status: 403, category: "unauthorized" } as const;
      let update;
      try {
        update = decodeChatNickname(body);
      } catch {
        return { status: 400, category: "bad_request" } as const;
      }
      const result = await nicknames.refresh(Object.freeze(update));
      if (!["applied", "unchanged"].includes(result)) throw new Error();
      return {
        status: 200,
        data: {
          owner: update.owner,
          kingdomId: update.kingdomId,
          operationId: update.operationId,
          result,
        },
      } as const;
    };
    try {
      const result = await Promise.race([
        run(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            expired = true;
            reject(new Error());
          }, timeoutMs);
        }),
      ]);
      if (result.status === 200) reply(200, result.data);
      else fail(result.status, result.category);
    } catch {
      fail(503, "storage_unavailable");
    } finally {
      expired = true;
      clearTimeout(timer);
    }
  };
}
