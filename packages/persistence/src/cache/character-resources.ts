import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import { CharacterResources } from "../models/kingdom/character-resources";
import { postgresCacheCodec } from "./codecs";

export function createCharacterResourcesCache(kingdomId: number, options: RepositoryCacheOptions)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.CharacterResources}`,
        postgresCacheCodec(() => new CharacterResources()),
        options,
    );
}
