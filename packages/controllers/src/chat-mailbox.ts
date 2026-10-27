import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import { decodeChatMailbox, type ChatMailboxStore } from "@opencok/contracts/chat-mailbox";
import { verifyChatMailbox } from "@opencok/identity/chat-mailbox";
import { SignedChatController } from "./signed-chat.controller.ts";

type Update = ReturnType<typeof decodeChatMailbox>;

type MailboxControllerOptions = {
  mailboxes: ChatMailboxStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
};

export class ChatMailboxController extends SignedChatController<Update> {
  protected readonly operation = "mailbox.apply";
  private readonly mailboxes: ChatMailboxStore;

  public constructor(options: MailboxControllerOptions) {
    super(
      options.signingSecret,
      options,
      Boolean(options.mailboxes),
      "Invalid chat mailbox configuration",
    );
    this.mailboxes = options.mailboxes;
  }

  protected verify(body: string, request: IncomingMessage, now: number): boolean {
    return verifyChatMailbox(
      body,
      request.headers["x-opencok-timestamp"],
      request.headers["x-opencok-signature"],
      this.signingSecret,
      now,
    );
  }

  protected decode(body: string): Update {
    return decodeChatMailbox(body);
  }

  protected async apply(update: Readonly<Update>): Promise<unknown> {
    const result = await this.mailboxes.apply(update);
    if (!["applied", "unchanged"].includes(result)) throw new Error();
    return result;
  }

  protected response(update: Update, result: unknown): object {
    return {
      owner: update.owner,
      kingdomId: update.kingdomId,
      operationId: update.operationId,
      effectIndex: update.effectIndex,
      result,
    };
  }
}

export function createChatMailboxHandler(options: MailboxControllerOptions): AsyncHttpHandler {
  return new ChatMailboxController(options).handle;
}
