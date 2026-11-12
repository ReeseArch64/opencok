import { RedisEntityCache } from "./redis-entity-cache";
import { PersistenceEntity } from "../enums/persistence-entity";
import type { RepositoryCacheOptions } from "../types/repository-options";
import type { Connection } from "mongoose";
import { resourceDepositConfigurationModel } from "../models/global/resource-deposit-configuration";
import { mongoCacheCodec } from "./codecs";

export function createResourceDepositConfigurationCache(
    connection: Connection,
    options: RepositoryCacheOptions,
)
{
    const database = "global";
    return new RedisEntityCache(
        `${database}:${PersistenceEntity.ResourceDepositConfiguration}`,
        mongoCacheCodec(resourceDepositConfigurationModel(connection)),
        options,
    );
}
