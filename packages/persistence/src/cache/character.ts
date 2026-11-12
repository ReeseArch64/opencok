import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { Character } from "../models/kingdom/character";
import { postgresCacheCodec } from "./codecs";

export function createCharacterCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.Character}`,
        postgresCacheCodec(() => new Character()),
        options,
    );
}
