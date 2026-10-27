import type { IncomingMessage } from "node:http";
import type { AsyncHttpHandler, Log } from "@opencok/contracts/chat";
import { decodeChatMailbox, type ChatMailboxStore } from "@opencok/contracts/chat-mailbox";
import { ChatMailboxSignature } from "@opencok/identity/chat-mailbox";
import { SignedChatController } from "./signed-chat.controller.ts";

type Update = ReturnType<typeof decodeChatMailbox>;

type Result = Awaited<ReturnType<ChatMailboxStore["apply"]>>;

type MailboxControllerOptions = {
  mailboxes: ChatMailboxStore;
  signingSecret: string;
  now?: () => number;
  timeoutMs?: number;
  log?: Log;
};

export class ChatMailboxController extends SignedChatController<Update, Result> {
  protected readonly operation = "mailbox.apply";
  private readonly mailboxes: ChatMailboxStore;
  private readonly signature: ChatMailboxSignature;

  public constructor(options: MailboxControllerOptions) {
    super(
      options.signingSecret,
      options,
      Boolean(options.mailboxes),
      "Invalid chat mailbox configuration",
    );
    this.mailboxes = options.mailboxes;
    this.signature = new ChatMailboxSignature(options.signingSecret);
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
    return decodeChatMailbox(body);
  }

  protected async apply(update: Readonly<Update>): Promise<Result> {
    const result = await this.mailboxes.apply(update);
    if (!["applied", "unchanged"].includes(result)) throw new Error();
    return result;
  }

  protected response(update: Update, result: Result): object {
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
