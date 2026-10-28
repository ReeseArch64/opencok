import type { AllianceRecord } from "./records";
import type { AllianceRecordReaders } from "./readers";
import type { AllianceScienceLedger } from "./science";

export interface AllianceSciencePolicyRuntime extends Pick<AllianceRecordReaders, "num">
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    allianceFailure(): never;
}

export interface AllianceScienceRuntime<TLedger extends AllianceScienceLedger>
    extends AllianceRecordReaders, AllianceSciencePolicyRuntime
{
    randomInt(maximum: number): number;
    rankingCalendar(now: number): { nextMonday: bigint; };
    activityEconomy(ledger: TLedger): {
        gold(delta: bigint): void;
        resource(
            asset: "wood" | "stone" | "iron" | "food" | "silver" | "woodbind",
            delta: bigint,
        ): void;
    };
}

export interface AllianceSciencePersistenceRuntime extends Pick<AllianceRecordReaders, "text">
{
    check(row: AllianceRecord, field?: string): void;
}
