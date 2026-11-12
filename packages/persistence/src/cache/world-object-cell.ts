import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { WorldObjectCell } from "../models/kingdom/world-object-cell";
import { postgresCacheCodec } from "./codecs";

export function createWorldObjectCellCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldObjectCell}`,
        postgresCacheCodec(() => new WorldObjectCell()),
        options,
    );
}
