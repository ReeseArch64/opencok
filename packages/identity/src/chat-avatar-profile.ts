import { chatAvatarProfilePath } from "@opencok/contracts/chat-avatar-profile";
import { SignedRequestDomain } from "@opencok/enums/signed-request-domain";
import { SignedChatRequest } from "./signed-chat-request.ts";

export class ChatAvatarProfileSignature extends SignedChatRequest {
  protected readonly domain = SignedRequestDomain.ChatAvatarProfile;
  protected readonly path = chatAvatarProfilePath;

  public constructor(secret: string) {
    super(secret);
  }
}

export function signChatAvatarProfile(body: string, timestamp: string, secret: string): string {
  return new ChatAvatarProfileSignature(secret).sign(body, timestamp);
}

export function verifyChatAvatarProfile(
  body: string,
  timestamp: unknown,
  signature: unknown,
  secret: string,
  now: number,
): boolean {
  return new ChatAvatarProfileSignature(secret).verify(body, timestamp, signature, now);
}
