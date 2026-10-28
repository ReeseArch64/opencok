import type { Row } from "./rows";

export interface ArenaState
{
    world?: Row;
    registration?: Row;
    legacy?: Row;
    armies: readonly Row[];
}

export interface ArenaWrite
{
    registration?: Row;
    armies?: readonly Row[];
}

export interface ArenaApplication
{
    owner: string;
    applicationId: string;
    rankScore: number;
    registeredAt: bigint;
}

export interface ArenaBattleGateway
{
    validated(): boolean;
    enqueue(application: ArenaApplication): Promise<void>;
    enter(input: {
        owner: string;
        applicationId: string;
        worldId: number;
        version: number;
        fightServerId: number;
        armies: readonly { armyId: string; count: number; }[];
    }): Promise<{ uid: string; serverInfo: Readonly<Record<string, string>>; }>;
    acceptResult(input: ArenaResult): Promise<boolean>;
    leave(input: {
        owner: string;
        applicationId: string;
        worldId: number;
        version: number;
    }): Promise<void>;
}

export interface ArenaResult
{
    owner: string;
    applicationId: string;
    worldId: number;
    version: number;
    won: boolean;
    playerScore: number;
    teamTotal: number;
    resultId: string;
}
