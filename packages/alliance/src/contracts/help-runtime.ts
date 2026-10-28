import type { AllianceRecord } from "./records";

export interface AllianceHelpReaders
{
    text(row: AllianceRecord, key: string): string;
    num(row: AllianceRecord, key: string): number;
    long(row: AllianceRecord, key: string): bigint;
}

export interface AllianceHelpFailure
{
    allianceFailure(): never;
}

export interface AllianceHelpRuntime<TCatalog> extends AllianceHelpReaders, AllianceHelpFailure
{
    cityInteger(value: unknown, minimum?: number, maximum?: number): number;
    cityBuildingParameter(row: AllianceRecord, rules: TCatalog, index: number): number;
    randomUUID(): string;
}

export interface AllianceHelpPersistenceRuntime extends Pick<AllianceHelpReaders, "text" | "long">
{
    check(row: AllianceRecord): void;
}
