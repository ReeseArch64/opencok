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
    signingSecrets?: Readonly<Record<string, string>>;
    now?: () => number;
    timeoutMs?: number;
    log?: Log;
};

export class ChatMailboxController extends SignedChatController<Update, Result>
{
    protected readonly operation = "mailbox.apply";
    private readonly mailboxes: ChatMailboxStore;
    private readonly signature: ChatMailboxSignature;
    private readonly signatures = new Map<number, ChatMailboxSignature>();

    public constructor(options: MailboxControllerOptions)
    {
        super(
            options.signingSecret,
            options,
            Boolean(options.mailboxes),
            "Invalid chat mailbox configuration",
        );
        this.mailboxes = options.mailboxes;
        this.signature = new ChatMailboxSignature(options.signingSecret);
        const secrets = new Set([options.signingSecret]);
        for (const [kingdom, secret] of Object.entries(options.signingSecrets ?? {}))
        {
            const id = Number(kingdom);
            if (
                !/^[1-9][0-9]{0,9}$/.test(kingdom) || id > 2147483647
                || typeof secret !== "string" || !secret || secrets.has(secret)
            )
            {
                throw new Error("Invalid chat mailbox realm secrets");
            }
            secrets.add(secret);
            this.signatures.set(id, new ChatMailboxSignature(secret));
        }
    }

    protected verify(body: string, request: IncomingMessage, now: number): boolean
    {
        let signature = this.signature;
        if (this.signatures.size)
        {
            try
            {
                const update = decodeChatMailbox(body);
                signature = this.signatures.get(update.kingdomId) ?? this.signature;
            }
            catch
            {
                return false;
            }
        }

        return signature.verify(
            body,
            request.headers["x-opencok-timestamp"],
            request.headers["x-opencok-signature"],
            now,
        );
    }

    protected decode(body: string): Update
    {
        return decodeChatMailbox(body);
    }

    protected async apply(update: Readonly<Update>): Promise<Result>
    {
        const result = await this.mailboxes.apply(update);

        if (!["applied", "unchanged"].includes(result))
        {
            throw new Error();
        }

        return result;
    }

    protected response(update: Update, result: Result): object
    {
        return {
            owner: update.owner,
            kingdomId: update.kingdomId,
            operationId: update.operationId,
            effectIndex: update.effectIndex,
            result,
        };
    }
}

export function createChatMailboxHandler(options: MailboxControllerOptions): AsyncHttpHandler
{
    return new ChatMailboxController(options).handle;
}
