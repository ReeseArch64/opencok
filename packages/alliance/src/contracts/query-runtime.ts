import type { AllianceRecordReaders } from "./readers";

export interface AllianceQueryRuntime extends AllianceRecordReaders
{
    allianceFailure(): never;
    unsupportedFailure(): never;
}
