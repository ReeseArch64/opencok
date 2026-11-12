import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import type { Connection } from "mongoose";
import { worldPopulationConfigurationModel } from "../models/kingdom/world-population-configuration";
import { mongoCacheCodec } from "./codecs";

export function createWorldPopulationConfigurationCache(
    connection: Connection,
    kingdomId: number,
    options: RepositoryCacheOptions,
)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldPopulationConfiguration}`,
        mongoCacheCodec(worldPopulationConfigurationModel(connection, kingdomId)),
        options,
    );
}
