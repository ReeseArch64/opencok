import type { AllianceRecord } from "./records";
import type { AllianceRecordReaders } from "./readers";
import type { AllianceGiftLedger } from "./gifts";

export interface AllianceGiftRuleRuntime
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    allianceFailure(): never;
}

export interface AllianceGiftRuntime<TLedger extends AllianceGiftLedger>
    extends AllianceRecordReaders, AllianceGiftRuleRuntime
{
    inventoryWeighted(weights: ReadonlyMap<string, number>): string;
    randomUUID(): string;
    activityEconomy(ledger: TLedger): {
        gold(delta: bigint): void;
        resource(asset: "wood" | "stone" | "iron" | "food" | "silver", delta: bigint): void;
    };
}

export interface AllianceGiftPersistenceRuntime extends Pick<AllianceRecordReaders, "text">
{
    check(row: AllianceRecord, field?: string): void;
}
