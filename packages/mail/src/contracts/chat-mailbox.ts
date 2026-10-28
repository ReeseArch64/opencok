export interface ChatMailboxUpdate
{
    owner: string;
    kingdomId: number;
    operationId: string;
    effectIndex: number;
    action: "read" | "delete";
    others: string;
    types: readonly number[];
    requestedAt: number;
}

export type ChatMailboxPublisher = (
    update: ChatMailboxUpdate,
    signal: AbortSignal,
) => Promise<void>;
