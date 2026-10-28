import type { MailIntegrationKind } from "../enums/integration-kind";

export interface MailIntegrationBacklog
{
    pending: number;
    limited: boolean;
    oldestAt: bigint | null;
}

export interface MailIntegrationSource
{
    deliver(): Promise<number>;
    backlog(): Promise<MailIntegrationBacklog>;
}

export interface MailIntegrationStatus
{
    ready: boolean;
    pending: number;
    limited: boolean;
    oldestAgeMs: number | null;
    delivered: number;
}

export interface MailIntegrationWorkerOptions
{
    gift: MailIntegrationSource;
    chat?: MailIntegrationSource;
    validate?(): Promise<void>;
    report(kind: MailIntegrationKind): void;
    intervalMs?: number;
    now?: () => number;
    after?: (run: () => void, delay: number) => () => void;
}
