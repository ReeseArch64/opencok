import type { Row } from "./rows.ts";

export type SharedUserLayout = "hash" | "keys";

export interface SharedUserUpdate
{
    owner: string;
    kingdomId: number;
    version: bigint;
    updatedAt: string;
    body: string;
}

export type SharedUserProjector = (
    row: Row,
    kingdomId: number,
    version: bigint,
    now: number,
) => SharedUserUpdate;

export type SharedUserPublisher = (update: SharedUserUpdate, signal: AbortSignal) => Promise<void>;
