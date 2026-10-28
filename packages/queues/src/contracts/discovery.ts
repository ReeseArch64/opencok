import type { DueActivitySnapshot, LegacyActivitySnapshot } from "./deadline";

export type ActivityDueCursor = Pick<DueActivitySnapshot, "dueAt" | "id">;

export interface ActivityDiscoveryBounds
{
    legacy: string | null;
    due: ActivityDueCursor | null;
}

export interface ActivityDiscoveryBacklog
{
    legacy: number;
    due: number;
    legacyLimited: boolean;
    dueLimited: boolean;
    oldestDueAt: bigint | null;
}

export interface ActivityDiscoveryReader
{
    bounds(types: readonly number[], now: bigint): Promise<ActivityDiscoveryBounds>;
    legacy(
        types: readonly number[],
        limit: number,
        after?: string,
        through?: string,
    ): Promise<readonly LegacyActivitySnapshot[]>;
    due(
        types: readonly number[],
        now: bigint,
        limit: number,
        after?: ActivityDueCursor,
        through?: ActivityDueCursor,
    ): Promise<readonly DueActivitySnapshot[]>;
    backlog(types: readonly number[], now: bigint): Promise<ActivityDiscoveryBacklog>;
}
