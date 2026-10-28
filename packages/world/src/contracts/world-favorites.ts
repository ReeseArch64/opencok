import type { Row } from "./rows.ts";

export interface WorldFavoriteKey
{
    point: number;
    server: number;
}

export interface WorldFavoriteAdd extends WorldFavoriteKey
{
    type: number;
    cityType: number;
    resType: number;
    name: string;
    now: number;
}

export interface WorldFavoriteList
{
    profile: Row | undefined;
    rows: Row[];
    serverTypes: ReadonlyMap<number, number>;
}

export interface WorldFavoriteStore
{
    list(owner: string, now: number): Promise<WorldFavoriteList>;
    add(owner: string, query: WorldFavoriteAdd): Promise<{ profile: Row | undefined; }>;
    remove(
        owner: string,
        keys: readonly WorldFavoriteKey[],
        now: number,
    ): Promise<{ profile: Row | undefined; success: boolean; }>;
}
