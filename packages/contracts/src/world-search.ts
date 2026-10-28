import type { Row } from "./rows.ts";

export interface WorldSearchQuery
{
    name: string;
    offset: number;
    kingdomId: number;
    now: number;
}

export interface WorldSearchSnapshot
{
    profile: Row | undefined;
    kingdomId: number;
    rows: Row[];
}

export interface WorldSearchStore
{
    search(owner: string, query: WorldSearchQuery): Promise<WorldSearchSnapshot>;
}
