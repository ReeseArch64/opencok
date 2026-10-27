import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import { decodeChatNickname, type ChatNicknameStore } from "@opencok/contracts/chat-nickname";
import { ChatNicknameSignature } from "@opencok/identity/chat-nickname";
import { SignedChatController } from "./signed-chat.controller.ts";

type Update = ReturnType<typeof decodeChatNickname>;

type Result = Awaited<ReturnType<ChatNicknameStore["refresh"]>>;

type NicknameControllerOptions = {
  nicknames: ChatNicknameStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
};

export class ChatNicknameController extends SignedChatController<Update, Result> {
  protected readonly operation = "nickname.refresh";
  private readonly nicknames: ChatNicknameStore;
  private readonly signature: ChatNicknameSignature;

  public constructor(options: NicknameControllerOptions) {
    super(
      options.signingSecret,
      options,
      Boolean(options.nicknames),
      "Invalid chat nickname configuration",
    );
    this.nicknames = options.nicknames;
    this.signature = new ChatNicknameSignature(options.signingSecret);
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
    return decodeChatNickname(body);
  }

  protected async apply(update: Readonly<Update>): Promise<Result> {
    const result = await this.nicknames.refresh(update);

    if (!["applied", "unchanged"].includes(result)) {throw new Error();}

    return result;
  }

  protected response(update: Update, result: Result): object {
    return {
      owner: update.owner,
      kingdomId: update.kingdomId,
      operationId: update.operationId,
      result,
    };
  }
}

export function createChatNicknameHandler(options: NicknameControllerOptions): AsyncHttpHandler {
  return new ChatNicknameController(options).handle;
}
