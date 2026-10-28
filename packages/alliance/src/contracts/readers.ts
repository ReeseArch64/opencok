import type { AllianceRecord } from "./records";

export interface AllianceRecordReaders
{
    text(row: AllianceRecord, key: string): string;
    num(row: AllianceRecord, key: string): number;
    long(row: AllianceRecord, key: string): bigint;
}
