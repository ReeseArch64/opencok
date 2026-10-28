import { randomInt } from "node:crypto";
import { outgoingTrace } from "@opencok/core/operation";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure, worldFootprint } from "@opencok/rules/world-march-runtime";
import { eventTimestamp } from "@opencok/rules/local-events";
import { chooseWeight } from "@opencok/rules/weighted-choice";
import { javaDecimal } from "@opencok/rules/java-integer";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import {
    worldMonsterAreaRanges,
    chooseWorldMonsterCells,
    spawnWorldMonsterCells,
    worldMonsterConfiguration,
} from "@opencok/rules/world-monsters";
import { serverFeature } from "@opencok/rules/power-context";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";
import type {
    WorldPopulationCatalog,
    WorldPopulationRule as Rule,
} from "@opencok/world/contracts/population-catalog";
import type { WorldPopulationNumericRuntime } from "@opencok/world/contracts/population-numeric";
import type { WorldMonsterPopulationRuntime } from "@opencok/world/contracts/population-runtime";
import type { WorldResourceNewPersistenceRuntime } from "@opencok/world/contracts/population-persistence";
import type { Row } from "@opencok/world/contracts/rows";
import * as sharedResourcePolicy from "@opencok/world/rules/world-resource-new";
import * as resourcePolicy from "@opencok/world/rules/world-resource-refresh";
import * as monsterPolicy from "@opencok/world/rules/world-monster-refresh";
import { WorldResourceNewService } from "@opencok/world/services/world-resource-new";
import { WorldResourceRefreshService } from "@opencok/world/services/world-resource-refresh";
import { WorldMonsterRefreshService } from "@opencok/world/services/world-monster-refresh";
import { createWorldResourceNewExecutor } from "@opencok/world/repositories/world-resource-new";
import { createWorldResourceRefreshExecutor } from "@opencok/world/repositories/world-resource-refresh";
import { createWorldMonsterRefreshExecutor } from "@opencok/world/repositories/world-monster-refresh";

const numeric: WorldPopulationNumericRuntime = {
    cityInteger,
    worldMutationFailure,
    eventTimestamp,
    chooseWeight,
    javaDecimal,
    javaHashMapOrder,
};

export function createRealmWorldPopulationCatalog(rules: Rules): WorldPopulationCatalog
{
    return {
        get kingdomId()
        {
            return rules.kingdomId;
        },
        settings: {
            get "on_event2"()
            {
                return rules.items.get("on_event2");
            },
            get "on_event3"()
            {
                return rules.items.get("on_event3");
            },
            get "resources_death"()
            {
                return rules.items.get("resources_death");
            },
            get "resources_life"()
            {
                return rules.items.get("resources_life");
            },
            get "worldmap_city"()
            {
                return rules.items.get("worldmap_city");
            },
            get "17_wk"()
            {
                return rules.items.get("17_wk");
            },
            get "world_wood"()
            {
                return rules.items.get("world_wood");
            },
            get "world_stone"()
            {
                return rules.items.get("world_stone");
            },
            get "world_iron"()
            {
                return rules.items.get("world_iron");
            },
            get "world_food"()
            {
                return rules.items.get("world_food");
            },
            get "world_fineiron"()
            {
                return rules.items.get("world_fineiron");
            },
            get "world_gold"()
            {
                return rules.items.get("world_gold");
            },
            get "function_on2"()
            {
                return rules.items.get("function_on2");
            },
            get "monster_event_config"()
            {
                return rules.items.get("monster_event_config");
            },
            get "world_barbarion"()
            {
                return rules.items.get("world_barbarion");
            },
            get "blackland_resource"()
            {
                return rules.items.get("blackland_resource");
            },
            get "resources_weight"()
            {
                return rules.items.get("resources_weight");
            },
            get "monster"()
            {
                return rules.items.get("monster");
            },
            get "worldmap_explore"()
            {
                return rules.items.get("worldmap_explore");
            },
        },
        get resourceGroups()
        {
            return rules.world.resources;
        },
        get monsterGroups()
        {
            return rules.world.fieldMonsterGroups;
        },
        get barbarianSpawns()
        {
            return rules.world.barbarians;
        },
        get armyLayouts()
        {
            return rules.world.armies;
        },
    };
}

export function createRealmWorldPopulationPolicies()
{
    return {
        worldResourceNewSettings(rules: Rules, now: bigint)
        {
            return sharedResourcePolicy.worldResourceNewSettings(
                createRealmWorldPopulationCatalog(rules),
                now,
                numeric,
            );
        },
        worldResourceNewSlots(rules: Rules, random: (maximum: number) => number)
        {
            return sharedResourcePolicy.worldResourceNewSlots(
                createRealmWorldPopulationCatalog(rules),
                random,
                numeric,
            );
        },
        worldResourceNewFootprint: sharedResourcePolicy.worldResourceNewFootprint,
        parseWorldResourceNewClock(raw: string, areas: number)
        {
            return sharedResourcePolicy.parseWorldResourceNewClock(raw, areas, numeric);
        },
        worldResourceBlackLand: resourcePolicy.worldResourceBlackLand,
        worldResourceDuration(rules: Rules, level: number, dead = false)
        {
            return resourcePolicy.worldResourceDuration(
                createRealmWorldPopulationCatalog(rules),
                level,
                dead,
                numeric,
            );
        },
        worldResourceAreaCount(rules: Rules, size: number)
        {
            return resourcePolicy.worldResourceAreaCount(
                createRealmWorldPopulationCatalog(rules),
                size,
                numeric,
            );
        },
        worldResourceQuota(rules: Rules)
        {
            return resourcePolicy.worldResourceQuota(
                createRealmWorldPopulationCatalog(rules),
                numeric,
            );
        },
        worldResourceChoice(
            rules: Rules,
            group: readonly Rule[],
            point: Row,
            size: number,
            age: bigint,
            effects: ReadonlyMap<number, number>,
            goldBonus: boolean,
            random: (maximum: number) => number,
            blackLand = false,
        )
        {
            return resourcePolicy.worldResourceChoice(
                createRealmWorldPopulationCatalog(rules),
                group,
                point,
                size,
                age,
                effects,
                goldBonus,
                random,
                blackLand,
                numeric,
            );
        },
        worldMonsterAreaCount(size: number, side: number)
        {
            return monsterPolicy.worldMonsterAreaCount(size, side, numeric);
        },
        worldMonsterFree: monsterPolicy.worldMonsterFree,
        worldMonsterBlack: monsterPolicy.worldMonsterBlack,
        worldMonsterQuotas(
            rules: Rules,
            age: bigint,
            black: boolean,
            random: (maximum: number) => number,
        )
        {
            return monsterPolicy.worldMonsterQuotas(
                createRealmWorldPopulationCatalog(rules),
                age,
                black,
                random,
                numeric,
            );
        },
        worldBarbarianQuota(rules: Rules)
        {
            return monsterPolicy.worldBarbarianQuota(
                createRealmWorldPopulationCatalog(rules),
                numeric,
            );
        },
        worldBarbarianBand(rules: Rules, point: Row, size: number)
        {
            return monsterPolicy.worldBarbarianBand(
                createRealmWorldPopulationCatalog(rules),
                point,
                size,
                numeric,
            );
        },
        worldBarbarianChoice(
            rules: Rules,
            point: Row,
            size: number,
            random: (maximum: number) => number,
        )
        {
            return monsterPolicy.worldBarbarianChoice(
                createRealmWorldPopulationCatalog(rules),
                point,
                size,
                random,
                numeric,
            );
        },
        worldBarbarianActor(rules: Rules, id: string)
        {
            return monsterPolicy.worldBarbarianActor(
                createRealmWorldPopulationCatalog(rules),
                id,
                numeric,
            );
        },
    };
}

function persistence(authority: RealmAuthority): WorldResourceNewPersistenceRuntime
{
    return {
        get kingdomId()
        {
            return authority.kingdomId;
        },
        get epoch()
        {
            return authority.epoch;
        },
        fence: (tx) => fenceRealmTransaction(tx, authority),
        assertReady: () => authority.assertReady(),
        traceparent: () => outgoingTrace(new Headers()).get("traceparent"),
        parseClock: (raw, areas) =>
            sharedResourcePolicy.parseWorldResourceNewClock(raw, areas, numeric),
    };
}

export function createRealmWorldResourceNewService(
    rules: Rules,
    size: number,
    random: (maximum: number) => number = randomInt,
)
{
    return new WorldResourceNewService(
        createRealmWorldPopulationCatalog(rules),
        size,
        numeric,
        random,
    );
}

export function createRealmWorldResourceRefreshService(
    rules: Rules,
    size: number,
    random: (maximum: number) => number = randomInt,
)
{
    return new WorldResourceRefreshService(
        createRealmWorldPopulationCatalog(rules),
        size,
        numeric,
        random,
    );
}

export function createRealmWorldMonsterRefreshService(
    rules: Rules,
    size: number,
    random: (maximum: number) => number = randomInt,
)
{
    const runtime: WorldMonsterPopulationRuntime = {
        ...numeric,
        worldFootprint,
        worldMonsterAreaRanges,
        chooseWorldMonsterCells,
        spawnWorldMonsterCells: (points, id, now, seconds) =>
            spawnWorldMonsterCells(rules, points, id, now, seconds),
        worldMonsterConfiguration: (id) => worldMonsterConfiguration(rules, id),
        monsterFootprint: (id) => rules.world.fieldMonsters?.get(id)?.num,
        serverFeature: (key, context) => serverFeature(rules, key, context),
    };

    return new WorldMonsterRefreshService(
        createRealmWorldPopulationCatalog(rules),
        size,
        runtime,
        random,
    );
}

export function createRealmWorldResourceNewExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size: number,
    areas: number,
    captureTime = Date.now,
)
{
    return createWorldResourceNewExecutor(db, persistence(authority), size, areas, captureTime);
}

export function createRealmWorldResourceRefreshExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size = 1201,
    captureTime = Date.now,
)
{
    return createWorldResourceRefreshExecutor(db, persistence(authority), size, captureTime);
}

export function createRealmWorldMonsterRefreshExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size: number,
    captureTime = Date.now,
)
{
    return createWorldMonsterRefreshExecutor(db, persistence(authority), size, captureTime);
}
