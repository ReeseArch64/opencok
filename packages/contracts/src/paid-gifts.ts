import type { Row } from "./rows";

export interface DeliveredGiftProof
{
    owner: string;
    kingdomId: number;
    orderId: string;
    platform: string;
    exchangeId: string;
    productId: string;
    priceCents: number;
    occurredAt: bigint;
    rechargeGold?: bigint;
    methodParam?: number;
}

export interface PaidGiftGateway
{
    delivered(input: {
        owner: string;
        kingdomId: number;
        orderId: string;
        platform: string;
    }): Promise<DeliveredGiftProof | null>;
}

export interface RedPacketReader
{
    payment(orderId: string, platform: string): Promise<Row | undefined>;
    packet(uid: string): Promise<{ packet: Row; records: readonly Row[]; } | undefined>;
    received(): Promise<readonly Row[]>;
}

export interface RedPacketWrite
{
    created?: readonly Row[];
    updated?: Row;
    claim?: Row;
}

export interface RedPacketExpiryStore
{
    settle(
        now: bigint,
        refund: (packet: Row) => {
            mail: import("./files").AvatarSystemMail;
            event: import("./mutation").MutationEvent;
        } | null,
    ): Promise<number>;
}
