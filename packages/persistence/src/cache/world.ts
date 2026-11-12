import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { World } from "../models/kingdom/world";
import { postgresCacheCodec } from "./codecs";

export function createWorldCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.World}`,
        postgresCacheCodec(() => new World()),
        options,
    );
}
