import type { AllianceRecord } from "./records";
import type { AllianceRecordReaders } from "./readers";

export interface AlliancePublicationRuntime extends AllianceRecordReaders
{
    scienceEffects(sciences: readonly AllianceRecord[]): ReadonlyMap<number, number>;
}
