import type { WorldPopulationCatalog } from "../contracts/population-catalog";
import type { WorldMonsterPopulationRuntime } from "../contracts/population-runtime";
import { randomInt } from "node:crypto";
import type { WorldMonsterRefreshStore } from "../contracts/world-monster-refresh";
import { expire } from "./monster-expiry";
import { fields } from "./monster-fields";
import { exploration } from "./monster-exploration";
import { barbarians } from "./monster-barbarian";

export class WorldMonsterRefreshService
{
    public constructor(
        private readonly catalog: WorldPopulationCatalog,
        private readonly size: number,
        private readonly runtime: WorldMonsterPopulationRuntime,
        private readonly random: (maximum: number) => number = randomInt,
    )
    {}

    public async refresh(store: WorldMonsterRefreshStore)
    {
        const { catalog, size, runtime, random } = this;

        await expire(store, catalog, size, random, runtime);

        if (store.opening <= 0n || store.opening > store.now)
        {
            return;
        }

        await exploration(store, catalog, size, random, runtime);
        await barbarians(store, catalog, size, random, runtime);

        if (store.monsterStart > 0n && store.monsterStart <= store.now)
        {
            await fields(store, catalog, size, "field", random, runtime);
            await fields(store, catalog, size, "black", random, runtime);
        }
    }
}
