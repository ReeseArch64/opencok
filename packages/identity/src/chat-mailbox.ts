import { chatMailboxPath } from "@opencok/contracts/chat-mailbox";
import { SignedRequestDomain } from "@opencok/enums/signed-request-domain";
import { SignedChatRequest } from "./signed-chat-request.ts";

export class ChatMailboxSignature extends SignedChatRequest {
  protected readonly domain = SignedRequestDomain.ChatMailbox;
  protected readonly path = chatMailboxPath;

  public constructor(secret: string) {
    super(secret);
  }
}

export function signChatMailbox(body: string, timestamp: string, secret: string): string {
  return new ChatMailboxSignature(secret).sign(body, timestamp);
}

export function verifyChatMailbox(
  body: string,
  timestamp: unknown,
  signature: unknown,
  secret: string,
  now: number,
): boolean {
  return new ChatMailboxSignature(secret).verify(body, timestamp, signature, now);
}
