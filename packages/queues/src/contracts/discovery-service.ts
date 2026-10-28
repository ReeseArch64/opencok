import type { ActivityDeadlineDispatcher } from "./deadline";
import type { ActivityDiscoveryReader } from "./discovery";

export interface ActivityDiscoveryOptions
{
    reader: ActivityDiscoveryReader;
    dispatcher: ActivityDeadlineDispatcher;
    validate(): Promise<void>;
    report(): void;
    intervalMs?: number;
    batchSize?: number;
    ownerBudget?: number;
    now?: () => number;
    after?: (run: () => void, delay: number) => () => void;
}

export interface ActivityDiscoveryStatus
{
    ready: boolean;
    types: number;
    lastSweepAt: number | null;
    headRetry: boolean;
    scannedLegacy: number;
    scannedDue: number;
    dispatched: number;
    applied: number;
    obsolete: number;
    notDue: number;
    blocked: number;
    failed: number;
    skippedOwnerBudget: number;
    pendingLegacy: number;
    pendingDue: number;
    legacyLimited: boolean;
    dueLimited: boolean;
    oldestDueAgeMs: number | null;
}
