import type { AllianceRecordReaders } from "./readers";

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
