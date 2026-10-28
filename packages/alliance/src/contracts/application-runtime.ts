import type { AllianceRecordReaders } from "./readers";

export interface AllianceApplicationRuntime extends AllianceRecordReaders
{
    allianceFailure(code?: string): never;
    randomUUID(): string;
    readonly errors: { locked: string; };
}
