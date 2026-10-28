import type { AllianceRecordReaders } from "./readers";
import type { AllianceRecord } from "./records";

export interface AlliancePersistenceRuntime extends Pick<AllianceRecordReaders, "text">
{
    check(row: AllianceRecord, field?: string): void;
}
