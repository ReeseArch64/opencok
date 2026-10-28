import type { AllianceRecordReaders } from "./readers";
import type { AllianceRecord } from "./records";

export interface AlliancePolicyRuntime extends AllianceRecordReaders
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    allianceFailure(code?: string): never;
    readonly errors: { locked: string; full: string; };
}

export interface AllianceGovernanceRuntime extends AlliancePolicyRuntime
{
    unsupportedFailure(): never;
}

export interface AllianceGovernancePersistenceRuntime extends Pick<AllianceRecordReaders, "text">
{
    check(row: AllianceRecord, field?: string): void;
}
