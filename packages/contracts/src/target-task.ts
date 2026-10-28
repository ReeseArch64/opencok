import type { Row } from "./rows";

export interface TargetTaskState
{
    notes?: Row;
    tasks: readonly Row[];
    openedAt: bigint;
}

export interface TargetTaskWrite
{
    notes?: Row;
    tasks?: readonly Row[];
    reset?: boolean;
}

export interface TargetTaskPaymentGateway
{
    accepted(input: {
        owner: string;
        eventId: string;
    }): Promise<{ exchangeId: string; occurredAt: bigint; } | null>;
}
