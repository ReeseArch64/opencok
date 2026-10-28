import type { Row } from "./rows";

export interface PlayerItemGiftState
{
    recipient?: { uid: string; realm: number | null; };
    pending: readonly Row[];
}

export interface PlayerItemGiftWrite
{
    send?: { uid: string; itemId: string; createdAt: bigint; };
    delivered?: readonly number[];
}
