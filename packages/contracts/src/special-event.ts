import type { Row } from "./rows";

export interface SpecialEventWindow
{
    start: bigint;
    end: bigint;
}

export interface SpecialEventReservation extends SpecialEventWindow
{
    eventId: string;
    ownerUid: string;
    kingdomId: number;
    exchangeId: string;
    reservedAt: bigint;
}

export interface SpecialEventStock
{
    reserve(value: SpecialEventReservation, limit: number): Promise<Row>;
    find(eventId: string): Promise<Row | undefined>;
    confirm(eventId: string, at: bigint): Promise<Row>;
    cancel(eventId: string): Promise<void>;
    counts(
        period: SpecialEventWindow,
        products: readonly string[],
    ): Promise<ReadonlyMap<string, number>>;
    pending(kingdom: number, now: bigint): Promise<readonly Row[]>;
    delivered(eventId: string, owner: string, kingdom: number, now: bigint): Promise<void>;
    defer(eventId: string, now: bigint): Promise<void>;
}

export interface SpecialEventPaymentGateway
{
    accepted(input: {
        eventId: string;
        owner: string;
        kingdomId: number;
        exchangeId: string;
    }): Promise<{ at: bigint; } | null>;
}

export interface SpecialEventBuyer
{
    purchaseTime(input: {
        owner: string;
        kingdomId: number;
        exchangeId: string;
    }): Promise<bigint | null>;
}
