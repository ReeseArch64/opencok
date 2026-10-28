import type { Row } from "./rows";

export interface WorldMonsterReader
{
    nearestBoss(origin: number): Promise<number>;
    claimed(points: readonly number[]): Promise<boolean>;
    barbarians(points: readonly number[]): Promise<readonly Row[]>;
    nearby(origin: number, radius: number): Promise<readonly Row[]>;
    area(area: number, side: number): Promise<readonly Row[]>;
}

export interface WorldBarbarianActorWrite
{
    points: readonly number[];
    configId: string;
    currentHP: number;
    army: ReadonlyMap<string, number>;
    awards: ReadonlyMap<string, number>;
}
