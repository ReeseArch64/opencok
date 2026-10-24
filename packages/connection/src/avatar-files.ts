import { readFile } from "node:fs/promises";
import { issueAvatarConfirmation, issueAvatarGrant } from "@opencok/identity/avatar";
import type { AvatarFiles } from "@opencok/contracts/files";

interface Options {
  origin: string;
  key: Buffer;
  timeoutMs: number;
  now?: () => number;
  fetch?: (url: string, options: RequestInit) => Promise<Response>;
}
export async function loadAvatarFiles(options: {
  origin: string;
  keyFile: string;
  timeoutMs: number;
}): Promise<AvatarFiles> {
  try {
    const value = await readFile(options.keyFile, "utf8");
    if (!/^[a-f0-9]{64}\n?$/.test(value)) throw new Error();
    return createAvatarFiles({ ...options, key: Buffer.from(value.trim(), "hex") });
  } catch {
    throw new Error("Avatar files unavailable");
  }
}
export function createAvatarFiles(options: Options): AvatarFiles {
  let url: URL;
  try {
    url = new URL(options.origin);
  } catch {
    throw new Error("Invalid avatar files configuration");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname !== "/" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !Buffer.isBuffer(options.key) ||
    options.key.length !== 32 ||
    !Number.isInteger(options.timeoutMs) ||
    options.timeoutMs < 100 ||
    options.timeoutMs > 30000
  )
    throw new Error("Invalid avatar files configuration");
  const origin = url.origin;
  const key = Buffer.from(options.key);
  const timeoutMs = options.timeoutMs;
  const request = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  return {
    issue: (owner, sequence) => issueAvatarGrant(owner, sequence, key, Math.floor(now() / 1000)),
    async find(owner, sequence) {
      const controller = new AbortController();
      let cancel: (() => Promise<void>) | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      try {
        const token = issueAvatarConfirmation(owner, sequence, key, Math.floor(now() / 1000));
        const exchange = async () => {
          const response = await request(`${origin}/_internal/avatars/${owner}/${sequence}`, {
            method: "GET",
            headers: { "X-Avatar-Confirmation": token },
            redirect: "error",
            signal: controller.signal,
          });
          if (
            controller.signal.aborted ||
            response.redirected ||
            ![200, 404].includes(response.status)
          ) {
            void response.body?.cancel().catch(() => {});
            throw new Error();
          }
          if (
            response.status === 200 &&
            !/^text\/plain(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")
          ) {
            void response.body?.cancel().catch(() => {});
            throw new Error();
          }
          const reader = response.body?.getReader();
          cancel = reader ? () => reader.cancel() : undefined;
          const length = response.headers.get("content-length");
          if (length !== null && (!/^\d+$/.test(length) || Number(length) > 128)) throw new Error();
          const chunks: Uint8Array[] = [];
          let size = 0;
          while (reader) {
            const chunk = await reader.read();
            if (chunk.done) break;
            size += chunk.value.length;
            if (size > 128) throw new Error();
            chunks.push(chunk.value);
          }
          const text = new TextDecoder("utf-8", { fatal: true }).decode(Buffer.concat(chunks));
          if (response.status === 404 && text === "") return null;
          const fields = text.split("\n");
          if (
            response.status !== 200 ||
            fields.length !== 5 ||
            fields[0] !== "v1" ||
            fields[1] !== owner ||
            fields[2] !== String(sequence) ||
            !/^[a-f0-9]{64}$/.test(fields[3]!) ||
            fields[4] !== ""
          )
            throw new Error();
          return { owner, sequence: String(sequence), hash: fields[3]! };
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
        throw new Error("Avatar confirmation unavailable");
      } finally {
        clearTimeout(timer);
        controller.abort();
        void cancel?.().catch(() => {});
      }
    },
  };
}
