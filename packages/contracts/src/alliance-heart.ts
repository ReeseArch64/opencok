import type { Row } from "./rows";

export interface AllianceHeartState
{
    recipient?: Row;
    worlds: readonly Row[];
    points: readonly Row[];
    members: readonly Row[];
    pending: readonly Row[];
}

export interface AllianceHeartWrite
{
    points?: readonly { id: number; uid: string; until: bigint; effect: string; }[];
    pending?: { uid: string; duration: number; effect: string; };
    delivered?: readonly number[];
}
