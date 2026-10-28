import type { Row } from "./rows";

export interface RechargeActivityState
{
    claims: readonly Row[];
    openedAt: bigint;
}

export interface RechargeActivityWrite
{
    total?: bigint;
    claims?: readonly string[];
}

export interface RechargeActivityGateway
{
    accepted(input: {
        owner: string;
        eventId: string;
    }): Promise<{ rechargeGold: bigint; occurredAt: bigint; } | null>;
}
