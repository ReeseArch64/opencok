import type { ChatMailboxUpdate } from "@opencok/mail/contracts/chat-mailbox";
import { isRecord } from "./chat.ts";

export type { ChatMailboxUpdate, ChatMailboxPublisher } from "@opencok/mail/contracts/chat-mailbox";

export const chatMailboxPath = "/_internal/mailbox";

export type ChatMailboxResult = "applied" | "unchanged";

export interface ChatMailboxMessage
{
    id: string;
    peer: string;
    sender?: string | null;
    type: number;
    createdAt: bigint;
    body: string;
    read: boolean;
}

export interface ChatMailboxStore
{
    apply(update: ChatMailboxUpdate): Promise<ChatMailboxResult>;
    list(
        owner: string,
        kingdomId: number,
        peer: string,
        type: number,
        limit: number,
    ): Promise<readonly ChatMailboxMessage[]>;
}

const identifier = (value: unknown, empty = false): value is string =>
    typeof value === "string"
    && (empty || value.length > 0)
    && value.length <= 40
    && !value.includes("\0")
    && value.isWellFormed();

export function validChatMailbox(value: unknown): value is ChatMailboxUpdate
{
    return (
        isRecord(value)
        && identifier(value.owner)
        && identifier(value.others, true)
        && Number.isInteger(value.kingdomId)
        && Number(value.kingdomId) > 0
        && Number(value.kingdomId) <= 2147483647
        && typeof value.operationId === "string"
        && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value.operationId)
        && Number.isInteger(value.effectIndex)
        && Number(value.effectIndex) >= 0
        && Number(value.effectIndex) <= 1001
        && ["read", "delete"].includes(String(value.action))
        && Array.isArray(value.types)
        && value.types.length > 0
        && value.types.length <= 4
        && value.types.every((type) => [1, 2, 3, 20].includes(type))
        && new Set(value.types).size === value.types.length
        && Number.isSafeInteger(value.requestedAt)
        && Number(value.requestedAt) >= 0
    );
}

export function encodeChatMailbox(update: ChatMailboxUpdate): string
{
    if (!validChatMailbox(update))
    {
        throw new Error("Invalid chat mailbox operation");
    }

    return JSON.stringify({
        owner: update.owner,
        kingdomId: update.kingdomId,
        operationId: update.operationId,
        effectIndex: update.effectIndex,
        action: update.action,
        others: update.others,
        types: [...update.types],
        requestedAt: update.requestedAt,
    });
}

export function decodeChatMailbox(body: string): ChatMailboxUpdate
{
    const value: unknown = JSON.parse(body);

    if (!validChatMailbox(value) || Object.keys(value).length !== 8)
    {
        throw new Error("Invalid chat mailbox operation");
    }

    return value;
}
