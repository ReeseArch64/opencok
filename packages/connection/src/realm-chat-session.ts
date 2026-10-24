import { createHash } from "node:crypto";
import { isChatSessionTicket, isRecord, type ChatSessionIssuer } from "@opencok/contracts/chat";

export type ChatSessionFetch = (url: string, options: RequestInit) => Promise<Response>;

export function createRealmChatSessionIssuer(options: {
  url: string;
  signingSecret: string;
  timeoutMs: number;
  fetch?: ChatSessionFetch;
  now?: () => number;
}): ChatSessionIssuer {
  let url: URL;
  try {
    url = new URL(options.url);
  } catch {
    throw new Error("Invalid chat session configuration");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname !== "/external/session" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.hostname === "cok.chat" ||
    url.hostname.endsWith(".cok.chat") ||
    typeof options.signingSecret !== "string" ||
    !options.signingSecret ||
    !Number.isInteger(options.timeoutMs) ||
    options.timeoutMs < 100 ||
    options.timeoutMs > 30000
  )
    throw new Error("Invalid chat session configuration");
  const endpoint = url.toString();
  const signingSecret = options.signingSecret;
  const timeoutMs = options.timeoutMs;
  const request = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  return async (input) => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancel: (() => Promise<void>) | undefined;
    const controller = new AbortController();
    try {
      if (
        !input ||
        typeof input.uid !== "string" ||
        !input.uid.trim() ||
        input.uid.length > 40 ||
        !input.uid.isWellFormed() ||
        input.uid.includes("\0") ||
        !isRecord(input.userinfo) ||
        Object.values(input.userinfo).some(
          (value) => typeof value !== "string" || !value.isWellFormed(),
        )
      )
        throw new Error();
      const form = new URLSearchParams({
        appid: "100001",
        ttl: "86400",
        uid: input.uid,
        userinfo: JSON.stringify(input.userinfo),
      });
      const base = ["appid", "ttl", "uid", "userinfo"].map((key) => key + form.get(key)).join("");
      form.set(
        "sign",
        createHash("md5")
          .update(base + signingSecret)
          .digest("hex"),
      );
      const body = form.toString();
      if (Buffer.byteLength(body) > 16384) throw new Error();
      const exchange = async () => {
        const response = await request(endpoint, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body,
          redirect: "error",
          signal: controller.signal,
        });
        if (controller.signal.aborted) {
          void response.body?.cancel().catch(() => {});
          throw new Error();
        }
        if (
          !response.ok ||
          response.redirected ||
          !/^application\/json(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "") ||
          !response.body
        ) {
          void response.body?.cancel().catch(() => {});
          throw new Error();
        }
        const reader = response.body.getReader();
        cancel = () => reader.cancel();
        const length = response.headers.get("content-length");
        if (length !== null && (!/^\d+$/.test(length) || Number(length) > 16384)) throw new Error();
        const chunks: Uint8Array[] = [];
        let size = 0;
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) break;
          size += chunk.value.byteLength;
          if (size > 16384) throw new Error();
          chunks.push(chunk.value);
        }
        const value: unknown = JSON.parse(
          new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks)),
        );
        if (!isRecord(value) || value.code !== 1 || !isChatSessionTicket(value.data, now()))
          throw new Error();
        return { session: value.data.session, expire: value.data.expire };
      };
      return await Promise.race([
        exchange(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error());
          }, timeoutMs);
        }),
      ]);
    } catch {
      throw new Error("Chat session unavailable");
    } finally {
      clearTimeout(timer);
      controller.abort();
      void cancel?.().catch(() => {});
    }
  };
}
