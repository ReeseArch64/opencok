import { chatNicknamePath } from "@opencok/contracts/chat-nickname";
import { SignedRequestDomain } from "@opencok/enums/signed-request-domain";
import { SignedChatRequest } from "./signed-chat-request.ts";

export class ChatNicknameSignature extends SignedChatRequest {
  protected readonly domain = SignedRequestDomain.ChatNickname;
  protected readonly path = chatNicknamePath;

  public constructor(secret: string) {
    super(secret);
  }
}

export function signChatNickname(body: string, timestamp: string, secret: string): string {
  return new ChatNicknameSignature(secret).sign(body, timestamp);
}

export function verifyChatNickname(
  body: string,
  timestamp: unknown,
  signature: unknown,
  secret: string,
  now: number,
): boolean {
  return new ChatNicknameSignature(secret).verify(body, timestamp, signature, now);
}
