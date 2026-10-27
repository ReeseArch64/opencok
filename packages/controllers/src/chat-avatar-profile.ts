import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import {
  decodeAvatarProfile,
  type ChatAvatarProfileStore,
} from "@opencok/contracts/chat-avatar-profile";
import { ChatAvatarProfileSignature } from "@opencok/identity/chat-avatar-profile";
import { SignedChatController } from "./signed-chat.controller.ts";

type Update = ReturnType<typeof decodeAvatarProfile>;

type Result = Awaited<ReturnType<ChatAvatarProfileStore["publish"]>>;

type AvatarProfileControllerOptions = {
  profiles: ChatAvatarProfileStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
};

export class ChatAvatarProfileController extends SignedChatController<Update, Result> {
  protected readonly operation = "avatar.profile";
  private readonly profiles: ChatAvatarProfileStore;
  private readonly signature: ChatAvatarProfileSignature;

  public constructor(options: AvatarProfileControllerOptions) {
    super(
      options.signingSecret,
      options,
      Boolean(options.profiles),
      "Invalid chat avatar profile configuration",
    );
    this.profiles = options.profiles;
    this.signature = new ChatAvatarProfileSignature(options.signingSecret);
  }

  protected verify(body: string, request: IncomingMessage, now: number): boolean {
    return this.signature.verify(
      body,
      request.headers["x-opencok-timestamp"],
      request.headers["x-opencok-signature"],
      now,
    );
  }

  protected decode(body: string): Update {
    return decodeAvatarProfile(body);
  }

  protected async apply(update: Readonly<Update>): Promise<Result> {
    const result = await this.profiles.publish(update);
    if (!["applied", "unchanged", "superseded"].includes(result)) throw new Error();
    return result;
  }

  protected response(update: Update, result: Result): object {
    return {
      owner: update.owner,
      kingdomId: update.kingdomId,
      sequence: update.sequence,
      result,
    };
  }
}

export function createChatAvatarProfileHandler(
  options: AvatarProfileControllerOptions,
): AsyncHttpHandler {
  return new ChatAvatarProfileController(options).handle;
}
