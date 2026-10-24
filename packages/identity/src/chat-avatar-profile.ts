import { createHmac, timingSafeEqual } from "node:crypto";
import { chatAvatarProfilePath } from "@opencok/contracts/chat-avatar-profile";

export function signChatAvatarProfile(body: string, timestamp: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`opencok-chat-avatar-v1\nPOST\n${chatAvatarProfilePath}\n${timestamp}\n${body}`)
    .digest("hex");
}
export function verifyChatAvatarProfile(
  body: string,
  timestamp: unknown,
  signature: unknown,
  secret: string,
  now: number,
): boolean {
  if (
    !secret ||
    typeof timestamp !== "string" ||
    !/^(0|[1-9][0-9]{0,15})$/.test(timestamp) ||
    !Number.isSafeInteger(Number(timestamp)) ||
    !Number.isSafeInteger(now) ||
    now < 0 ||
    Math.abs(now - Number(timestamp)) > 30000 ||
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  return timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(signChatAvatarProfile(body, timestamp, secret), "hex"),
  );
}
