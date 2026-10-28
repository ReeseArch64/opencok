import type { AllianceRecordReaders } from "./readers";

export interface AllianceContextRuntime<TLedger> extends AllianceRecordReaders
{
    allianceFailure(code?: string): never;
    readonly errors: { locked: string; };
    cityInteger(value: unknown, min?: number, max?: number): number;
    effect(id: number): Promise<number>;
    activityEconomy(ledger: TLedger): { gold(delta: bigint): void; };
}
