import { createHmac, timingSafeEqual } from "node:crypto";
import { chatMailboxPath } from "@opencok/contracts/chat-mailbox";

export function signChatMailbox(body: string, timestamp: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`opencok-chat-mailbox-v1\nPOST\n${chatMailboxPath}\n${timestamp}\n${body}`)
    .digest("hex");
}
export function verifyChatMailbox(
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
    Buffer.from(signChatMailbox(body, timestamp, secret), "hex"),
  );
}
