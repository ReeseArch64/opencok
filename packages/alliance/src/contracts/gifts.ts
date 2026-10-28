import type { AllianceRecord } from "./records";
import type { AllianceGiftCatalog } from "./gift-catalog";
import type { Fields } from "@opencok/messages/sfs";

export interface AllianceGiftLedger
{
    add(itemId: string, count: number, value?: number): unknown;
}

export interface AllianceGiftState
{
    gifts: readonly AllianceRecord[];
    sharedGifts: readonly AllianceRecord[];
}

export interface AllianceGiftWrite
{
    gifts?: readonly AllianceRecord[];
    sharedGifts?: readonly AllianceRecord[];
    publishedGift?: AllianceRecord;
    deletedGifts?: readonly string[];
}

export interface AllianceGiftContext<TLedger extends AllianceGiftLedger>
{
    readonly owner: string;
    readonly allianceId: string;
    readonly now: bigint;
    readonly rules: AllianceGiftCatalog;
    readonly state: AllianceGiftState;
    readonly write: AllianceGiftWrite;
    readonly ledger: TLedger;
    alliance(): AllianceRecord;
    member(): AllianceRecord;
    list(): AllianceRecord[];
    setMember(member: AllianceRecord): void;
    setAlliance(alliance: AllianceRecord): void;
}

export type AllianceGiftFactory<TLedger extends AllianceGiftLedger> = (
    context: AllianceGiftContext<TLedger>,
) => {
    command(command: string, params: Fields): Fields;
    publish(event: string, type: number): Fields;
};
