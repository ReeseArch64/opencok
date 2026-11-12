import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import type { Connection } from "mongoose";
import { worldRegionModel } from "../models/kingdom/world-region";
import { mongoCacheCodec } from "./codecs";

export function createWorldRegionCache(
    connection: Connection,
    kingdomId: number,
    options: RepositoryCacheOptions,
)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldRegion}`,
        mongoCacheCodec(worldRegionModel(connection, kingdomId)),
        options,
    );
}
