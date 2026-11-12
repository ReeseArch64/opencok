import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { WorldObject } from "../models/kingdom/world-object";
import { postgresCacheCodec } from "./codecs";

export function createWorldObjectCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldObject}`,
        postgresCacheCodec(() => new WorldObject()),
        options,
    );
}
