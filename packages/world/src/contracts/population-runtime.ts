import type { Row } from "./rows";
import type { WorldPopulationNumericRuntime } from "./population-numeric";

export interface WorldMonsterPopulationRuntime extends WorldPopulationNumericRuntime
{
    worldFootprint(point: number, size: number, four: boolean): readonly number[];
    worldMonsterAreaRanges(area: number, side: number, size: number): number[][];
    chooseWorldMonsterCells(
        points: readonly Row[],
        four: boolean,
        size: number,
        random: (maximum: number) => number,
    ): Row[];
    spawnWorldMonsterCells(points: readonly Row[], id: string, now: bigint, seconds: number): Row[];
    worldMonsterConfiguration(id: string): { id: string; four: boolean; boss: boolean; };
    monsterFootprint(id: string): string | undefined;
    serverFeature(
        key: string,
        context: { kingdomId: number; version: string; now: number; },
    ): boolean;
}
