import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { City } from "../models/kingdom/city";
import { postgresCacheCodec } from "./codecs";

export function createCityCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.City}`,
        postgresCacheCodec(() => new City()),
        options,
    );
}
