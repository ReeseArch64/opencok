import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { Kingdom } from "../models/global/kingdom";
import { postgresCacheCodec } from "./codecs";

export function createKingdomCache(options: RepositoryCacheOptions)
{
    const database = "global";
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.Kingdom}`,
        postgresCacheCodec(() => new Kingdom()),
        options,
    );
}
