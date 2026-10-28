import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { num, type Row } from "../contracts/rows";
import type {
    WorldMonsterRefreshStore,
    WorldMonsterSupplyClock,
} from "../contracts/world-monster-refresh";

export const blank = (): WorldMonsterSupplyClock => ({
    version: 1,
    stage: "idle",
    area: 0,
    nextAt: 0n,
    initial: false,
    quota: {},
    remaining: {},
    pool: [],
    attempts: 0,
});

export const blackRanges = [[575, 625, 575, 625]];

export function clear(row: Row, field: boolean)
{
    return field
        ? {
            ...row,
            pointType: 0,
            pointItem: null,
            monsterInfo: null,
            monsterCurrHP: 0,
            startTime: 0n,
            flushTime: 0n,
            flushFlag: 0,
        }
        : { ...row, pointType: 0, startTime: 0n, flushTime: 0n };
}

export async function footprint(
    store: WorldMonsterRefreshStore,
    row: Row,
    size: number,
    runtime: WorldMonsterPopulationRuntime,
)
{
    const { worldFootprint } = runtime;
    let ids: readonly number[] = [];

    try
    {
        ids = worldFootprint(num(row, "id"), size, true);
    }
    catch
    {
        return [row];
    }

    return store.points(ids);
}
