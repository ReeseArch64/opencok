import type { AllianceRecord } from "./records";
import type { AllianceRecordReaders } from "./readers";

export interface AllianceHelpFailure
{
    allianceFailure(): never;
}

export interface AllianceHelpRuntime<TCatalog> extends AllianceRecordReaders, AllianceHelpFailure
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    cityBuildingParameter(row: AllianceRecord, rules: TCatalog, index: number): number;
    randomUUID(): string;
}

export interface AllianceHelpPersistenceRuntime extends Pick<AllianceRecordReaders, "text" | "long">
{
    check(row: AllianceRecord): void;
}
