import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import { kingdomDatabase } from "../factories/kingdom-database";
import type { Connection } from "mongoose";
import { worldLayoutModel } from "../models/kingdom/world-layout";
import { mongoCacheCodec } from "./codecs";

export function createWorldLayoutCache(
    connection: Connection,
    kingdomId: number,
    options: RepositoryCacheOptions,
)
{
    const database = kingdomDatabase(kingdomId);
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.WorldLayout}`,
        mongoCacheCodec(worldLayoutModel(connection, kingdomId)),
        options,
    );
}
