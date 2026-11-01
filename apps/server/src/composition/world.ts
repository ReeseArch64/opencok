import type { Rules } from "@opencok/rules/game";
import type { Row } from "@opencok/world/contracts/rows";
import type {
    WorldMapStore,
    WorldQueryStores,
    WorldPointProjections,
} from "@opencok/world/contracts/runtime";
import { WorldService } from "@opencok/world/services/world";
import { WorldQueryService } from "@opencok/world/services/queries";
import { compactPoint } from "@opencok/world/mappings/world-map";
import { favoriteServer } from "@opencok/world/rules/world-favorites";
import { createWorldUtilityStore } from "@opencok/world/repositories/world-utility";
import { worldMapMonsterFields } from "@opencok/rules/world-map-point";
import { createRealmCosmeticPolicy } from "./skins";
import { javaDecimal } from "@opencok/rules/java-integer";
import { reconnectMarchBase } from "@opencok/mappings/reconnect-marches";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { checkGameProfile } from "@opencok/services/game-profile";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { fenceRealmTransaction, type RealmAuthority } from "@opencok/repositories/realm-authority";

const { cityCosmeticProjection } = createRealmCosmeticPolicy();

export function createRealmCompactPoint(rules?: Rules)
{
    const projections: WorldPointProjections = {
        cosmetics: (rows, now) => cityCosmeticProjection(rows, rules, now),
        monster: (row) => worldMapMonsterFields(row, rules),
    };

    return (
        row: Row,
        cosmetics: readonly Row[] = [],
        now = BigInt(Date.now()),
        alliances: ReadonlyMap<string, Row> = new Map(),
    ) => compactPoint(row, cosmetics, projections, now, alliances);
}

export function createRealmWorldService(
    store: WorldMapStore,
    size: number,
    kingdomId: number,
    live?: {
        rules: Rules;
        now?: () => number;
        subscribe(owner: string, x: number, y: number): Promise<void>;
        marches(ids: readonly number[]): Promise<readonly Row[]>;
    },
): WorldService
{
    return new WorldService(
        store,
        size,
        kingdomId,
        {
            cosmetics: (rows, now) => cityCosmeticProjection(rows, live?.rules, now),
            monster: (row) => worldMapMonsterFields(row, live?.rules),
        },
        live && {
            now: () => live.now?.() ?? Date.now(),
            subscribe: (owner, x, y) => live.subscribe(owner, x, y),
            marches: (ids) => live.marches(ids),
            projectMarch: (row) =>
                reconnectMarchBase(
                    row,
                    row.armyInfo ? decodeWorldMarchArmy(row.armyInfo as Buffer) : null,
                    live.rules,
                    {
                        serverId: kingdomId,
                        miracle: false,
                        miracleState: undefined,
                        resourceBattle: false,
                        siege: false,
                    },
                ),
        },
    );
}

export function createRealmWorldFavoritePolicy(rules: Rules)
{
    return {
        server: (server: number | undefined, local: number) =>
            favoriteServer(server, local, rules, javaDecimal),
    };
}

export function createRealmWorldQueryService(
    config: { kingdomId: number; mapSize?: number; },
    rules: Rules,
    now = Date.now,
    stores: WorldQueryStores = {},
): WorldQueryService
{
    return new WorldQueryService(stores, {
        kingdomId: config.kingdomId,
        now,
        checkProfile: checkGameProfile,
        mapSize: () => config.mapSize ?? Number(rules.items.get("worldmap_map")?.k1 ?? 1201),
        favoriteServer: createRealmWorldFavoritePolicy(rules).server,
    });
}

export function createRealmWorldUtilityStore(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size: number,
)
{
    return createWorldUtilityStore(db, (tx) => fenceRealmTransaction(tx, authority), size);
}
