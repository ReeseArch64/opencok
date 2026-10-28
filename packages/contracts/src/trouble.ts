import type { Row } from "./rows";

export interface TroubleState
{
    history: readonly Row[];
    point: number;
}

export interface TroubleDelivery
{
    march: string;
    sender: string;
    username: string;
    target: string;
    point: number;
    item: string;
    at: bigint;
}

export interface TroubleHistoryWrite
{
    username: string;
    at: bigint;
    status: string;
    item: string;
}
