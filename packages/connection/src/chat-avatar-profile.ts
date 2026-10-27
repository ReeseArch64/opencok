import { chatAvatarProfilePath, encodeAvatarProfile } from "@opencok/contracts/chat-avatar-profile";
import type { AvatarProfilePublisher } from "@opencok/contracts/files";
import { isRecord } from "@opencok/contracts/chat";
import { signChatAvatarProfile } from "@opencok/identity/chat-avatar-profile";
import { fetchChatJson } from "./chat-http.ts";

export function createChatAvatarProfilePublisher(options: {
  url: string;
  signingSecret: string;
  timeoutMs: number;
  fetch?: (url: string, options: RequestInit) => Promise<Response>;
  now?: () => number;
}): AvatarProfilePublisher {
  let url: URL;

  try {
    url = new URL(options.url);
  } catch {
    throw new Error("Invalid chat avatar profile configuration");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname !== chatAvatarProfilePath ||
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
    {throw new Error("Invalid chat avatar profile configuration");}

  const endpoint = url.toString();
  const { signingSecret, timeoutMs, now = Date.now, fetch: request = fetch } = options;

  return async (input, signal) => {
    const update = Object.freeze({ ...input });

    try {
      signal.throwIfAborted();
      const body = encodeAvatarProfile(update);
      const time = now();

      if (!Number.isSafeInteger(time) || time < 0 || Buffer.byteLength(body) > 4096)
        {throw new Error();}

      const timestamp = String(time);
      const value = await fetchChatJson(
        endpoint,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-opencok-timestamp": timestamp,
            "x-opencok-signature": signChatAvatarProfile(body, timestamp, signingSecret),
          },
          body,
          signal,
        },
        timeoutMs,
        request,
      );
      signal.throwIfAborted();

      if (
        !isRecord(value) ||
        value.code !== 1 ||
        !isRecord(value.data) ||
        value.data.owner !== update.owner ||
        value.data.kingdomId !== update.kingdomId ||
        value.data.sequence !== update.sequence ||
        !["applied", "unchanged", "superseded"].includes(String(value.data.result))
      )
        {throw new Error();}
    } catch {
      throw new Error("Chat avatar profile unavailable");
    }
  };
}
