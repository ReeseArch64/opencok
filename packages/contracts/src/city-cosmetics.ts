import type { Row } from "./rows";

export interface CosmeticTargetState
{
    uid: string;
    realm: number | null;
    point: number;
    states: readonly Row[];
    avatars: readonly Row[];
}

export interface CosmeticTargetWrite
{
    uid: string;
    states: readonly Row[];
    deleted: readonly number[];
    avatars?: readonly Row[];
}

export interface CosmeticStatusChange
{
    uid: string;
    id: number;
    previous?: number;
}
