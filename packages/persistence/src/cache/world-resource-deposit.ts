import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { WorldResourceDeposit } from "../models/kingdom/world-resource-deposit";
import { postgresCacheCodec } from "./codecs";

export function createWorldResourceDepositCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldResourceDeposit}`,
        postgresCacheCodec(() => new WorldResourceDeposit()),
        options,
    );
}
