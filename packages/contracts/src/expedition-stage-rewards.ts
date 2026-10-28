import type { Row } from "./rows";

export interface ExpeditionAwardMail
{
    id: string;
    sender: string;
    title: string;
    contents: string;
    reward: string | null;
}

export interface ExpeditionAwardPayload
{
    mails: readonly ExpeditionAwardMail[];
    claims: readonly number[];
}

export interface ExpeditionAwardReader
{
    load(id: string): Promise<Row | undefined>;
}

export interface ExpeditionAwardStore
{
    candidates(): Promise<readonly Row[]>;
    page(closure: Row): Promise<readonly Row[]>;
    plan(
        closure: Row,
        member: Row,
        create: () => ExpeditionAwardPayload,
        history: string,
        now: bigint,
    ): Promise<void>;
    finished(closure: Row, history: string): Promise<void>;
    pending(now: bigint): Promise<readonly Row[]>;
    defer(id: string, now: bigint): Promise<void>;
}

export interface ExpeditionAwardStandings
{
    read(
        closure: Row,
        owners: readonly string[],
    ): Promise<{ result: Row; members: readonly Row[]; top: Row | undefined; } | undefined>;
}

export interface ExpeditionHistorySource
{
    owned(owner: string, now: bigint): Promise<readonly Row[]>;
    servers(ids: readonly number[]): Promise<readonly Row[]>;
}
