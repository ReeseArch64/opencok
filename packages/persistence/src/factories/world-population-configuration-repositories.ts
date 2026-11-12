import { createWorldPopulationConfigurationCache } from "../cache/world-population-configuration";
import { FindByPublicIdWorldPopulationConfigurationRepository } from "../repositories/world-population-configuration/find-by-public-id";
import { ListWorldPopulationConfigurationRepository } from "../repositories/world-population-configuration/list";
import { CreateWorldPopulationConfigurationRepository } from "../repositories/world-population-configuration/create";
import type { WorldPopulationConfigurationRepositories } from "../interfaces/world-population-configuration-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { Connection } from "mongoose";
import { worldPopulationConfigurationModel } from "../models/kingdom/world-population-configuration";
import { MongoEntityStore } from "../class/mongo-entity-store";
import type { WorldPopulationConfiguration } from "../types/world-population-configuration";
import type { CreateWorldPopulationConfiguration } from "../types/world-population-configuration-input";

export function createWorldPopulationConfigurationRepositories(
    connection: Connection,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldPopulationConfigurationRepositories
{
    const model = worldPopulationConfigurationModel(connection, kingdomId);
    const raw = new MongoEntityStore<
        WorldPopulationConfiguration,
        CreateWorldPopulationConfiguration,
        never
    >(model);
    const store = options.cache
        ? new CachedEntityStore(
            raw,
            createWorldPopulationConfigurationCache(connection, kingdomId, options.cache),
        )
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldPopulationConfigurationRepository(store),
        list: new ListWorldPopulationConfigurationRepository(store),
        create: new CreateWorldPopulationConfigurationRepository(store),
    };
}
