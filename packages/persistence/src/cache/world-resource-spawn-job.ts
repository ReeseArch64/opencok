import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import type { Connection } from "mongoose";
import { worldResourceSpawnJobModel } from "../models/kingdom/world-resource-spawn-job";
import { mongoCacheCodec } from "./codecs";

export function createWorldResourceSpawnJobCache(
    connection: Connection,
    kingdomId: number,
    options: RepositoryCacheOptions,
)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldResourceSpawnJob}`,
        mongoCacheCodec(worldResourceSpawnJobModel(connection, kingdomId)),
        options,
    );
}
