import type { ServerResponse } from "node:http";
import type { AsyncHttpHandler, Log, SessionStore } from "@opencok/contracts/chat";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";

const sessionSeconds = 86_400;
const maxFormBytes = 16_384;
const storageTimeoutMs = 3_000;
const requiredFields = ["appid", "ttl", "uid", "userinfo", "sign"];

async function saveWithinTimeout(save: () => Promise<void>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      save(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("chat storage timeout")), storageTimeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function reply(response: ServerResponse, status: number, correlationId: string, body: unknown) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "x-request-id": correlationId,
  });
  response.end(JSON.stringify(body));
}

export function verifyForm(form: URLSearchParams, secret: string) {
  if (requiredFields.some((key) => form.getAll(key).length !== 1)) return "bad_request";
  if ([...form.keys()].some((key) => !requiredFields.includes(key))) return "bad_request";

  const uid = form.get("uid");
  const appid = form.get("appid");
  if (!uid || uid.length > 40 || !appid || form.get("ttl") !== String(sessionSeconds)) {
    return "bad_request";
  }
  try {
    const info: unknown = JSON.parse(form.get("userinfo") ?? "");
    if (!info || typeof info !== "object" || Array.isArray(info)) return "bad_request";
  } catch {
    return "bad_request";
  }

  const sign = form.get("sign");
  if (!sign || !/^[0-9a-f]{32}$/i.test(sign)) return "unauthorized";
  const fields = ["appid", "ttl", "uid", "userinfo"];
  const base = fields.map((key) => `${key}${form.get(key)}`).join("");
  const expected = createHash("md5")
    .update(base + secret)
    .digest();
  return timingSafeEqual(expected, Buffer.from(sign, "hex")) ? null : "unauthorized";
}

export function createSessionHandler({
  sessionStore,
  signingSecret,
  now = Date.now,
  log = () => {},
}: {
  sessionStore: SessionStore;
  signingSecret: string;
  now?: () => number;
  log?: Log;
}): AsyncHttpHandler {
  return async (request, response) => {
    const correlationId = randomUUID();
    const fail = (status: number, category: string) => {
      log({ correlationId, operation: "session.create", category });
      reply(response, status, correlationId, { code: 0, data: {} });
    };

    if (!sessionStore || typeof sessionStore.create !== "function" || !signingSecret) {
      fail(503, "not_configured");
      return;
    }
    const contentType = request.headers["content-type"];
    if (
      typeof contentType !== "string" ||
      !contentType.startsWith("application/x-www-form-urlencoded")
    ) {
      fail(415, "bad_request");
      return;
    }

    try {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > maxFormBytes) {
          fail(413, "bad_request");
          return;
        }
        chunks.push(chunk);
      }
      const form = new URLSearchParams(Buffer.concat(chunks).toString("utf8"));
      const formError = verifyForm(form, signingSecret);
      if (formError) {
        fail(formError === "unauthorized" ? 403 : 400, formError);
        return;
      }

      const session = randomBytes(32).toString("base64url");
      const createdAt = new Date(now());
      const expire = Math.floor(createdAt.getTime() / 1000) + sessionSeconds;
      await saveWithinTimeout(() =>
        sessionStore.create({
          tokenHash: createHash("sha256").update(session).digest(),
          uid: form.get("uid")!,
          createdAt,
          expiresAt: new Date(expire * 1000),
        }),
      );
      reply(response, 200, correlationId, { code: 1, data: { session, expire } });
    } catch {
      fail(503, "storage_unavailable");
    }
  };
}
