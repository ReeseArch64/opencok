import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import {
  decodeAvatarProfile,
  type ChatAvatarProfileStore,
} from "@opencok/contracts/chat-avatar-profile";
import { verifyChatAvatarProfile } from "@opencok/identity/chat-avatar-profile";
import { SignedChatController } from "./signed-chat.controller.ts";

type Update = ReturnType<typeof decodeAvatarProfile>;

type AvatarProfileControllerOptions = {
  profiles: ChatAvatarProfileStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
};

export class ChatAvatarProfileController extends SignedChatController<Update> {
  protected readonly operation = "avatar.profile";
  private readonly profiles: ChatAvatarProfileStore;

  public constructor(options: AvatarProfileControllerOptions) {
    super(
      options.signingSecret,
      options,
      Boolean(options.profiles),
      "Invalid chat avatar profile configuration",
    );
    this.profiles = options.profiles;
  }

  protected verify(body: string, request: IncomingMessage, now: number): boolean {
    return verifyChatAvatarProfile(
      body,
      request.headers["x-opencok-timestamp"],
      request.headers["x-opencok-signature"],
      this.signingSecret,
      now,
    );
  }

  protected decode(body: string): Update {
    return decodeAvatarProfile(body);
  }

  protected async apply(update: Readonly<Update>): Promise<unknown> {
    const result = await this.profiles.publish(update);
    if (!["applied", "unchanged", "superseded"].includes(result)) throw new Error();
    return result;
  }

  protected response(update: Update, result: unknown): object {
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
