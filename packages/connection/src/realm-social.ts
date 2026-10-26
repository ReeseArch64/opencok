import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { createHash } from "node:crypto";
import { randomUUID } from "node:crypto";
import { encode, decode, str, sfs } from "@opencok/messages/sfs";
import { isRecord } from "@opencok/contracts/chat";
import { realmSocialPath, type RealmSocialExecutor } from "@opencok/contracts/realm-social";
import { signRealmSocial } from "@opencok/identity/realm-social";
import { fetchChatJson } from "./chat-http.ts";
export function createRealmSocialExecutor(options: {
  url: string;
  signingSecret: string;
  realm: number;
  timeoutMs: number;
  authority?: { instance: string; epoch: bigint };
}): RealmSocialExecutor {
  const url = new URL(realmSocialPath, options.url);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    !options.signingSecret ||
    !Number.isInteger(options.realm) ||
    options.realm < 1
  )
    throw new TypeError("Invalid social configuration");
  return async (owner, command, params) => {
    const operationId = params.operationId
      ? str(params, "operationId")
      : params.sendLocalTime
        ? createHash("sha256")
            .update(`${command}:${str(params, "sendLocalTime")}`)
            .digest("hex")
        : randomUUID();
    const body = JSON.stringify({
      owner,
      command,
      realm: options.realm,
      operationId,
      params: encode({
        ...params,
        ...(options.authority
          ? {
              _realmToken: sfs.string(options.authority.instance),
              _realmEpoch: sfs.string(String(options.authority.epoch)),
            }
          : {}),
      }).toString("base64"),
    });
    if (Buffer.byteLength(body) > 24_576) throw new TypeError("Social request too large");
    const timestamp = String(Date.now());
    const response = await fetchChatJson(
      url.toString(),
      {
        method: "POST",
        body,
        headers: {
          "content-type": "application/json",
          "x-opencok-timestamp": timestamp,
          "x-opencok-signature": signRealmSocial(body, timestamp, options.signingSecret),
        },
      },
      options.timeoutMs,
      fetch,
      1_048_576,
    );
    if (
      isRecord(response) &&
      response.code === 0 &&
      isRecord(response.data) &&
      typeof response.data.error === "string"
    )
      throw new GameError(
        response.data.error === "provider_unavailable" ? errors.unsupported : errors.invalid,
        "social_rule",
      );
    if (!isRecord(response) || response.code !== 1 || typeof response.data !== "string")
      throw new Error("Social service unavailable");
    return decode(Buffer.from(response.data, "base64"));
  };
}
