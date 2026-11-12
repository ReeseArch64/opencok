import { createResourceDepositConfigurationCache } from "../cache/resource-deposit-configuration";
import { FindByPublicIdResourceDepositConfigurationRepository } from "../repositories/resource-deposit-configuration/find-by-public-id";
import { ListResourceDepositConfigurationRepository } from "../repositories/resource-deposit-configuration/list";
import { CreateResourceDepositConfigurationRepository } from "../repositories/resource-deposit-configuration/create";
import type { ResourceDepositConfigurationRepositories } from "../interfaces/resource-deposit-configuration-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { Connection } from "mongoose";
import { resourceDepositConfigurationModel } from "../models/global/resource-deposit-configuration";
import { MongoEntityStore } from "../class/mongo-entity-store";
import type { ResourceDepositConfiguration } from "../types/resource-deposit-configuration";
import type { CreateResourceDepositConfiguration } from "../types/resource-deposit-configuration-input";

export function createResourceDepositConfigurationRepositories(
    connection: Connection,
    options: RepositoryOptions = {},
): ResourceDepositConfigurationRepositories
{
    const model = resourceDepositConfigurationModel(connection);
    const raw = new MongoEntityStore<
        ResourceDepositConfiguration,
        CreateResourceDepositConfiguration,
        never
    >(model);
    const store = options.cache
        ? new CachedEntityStore(
            raw,
            createResourceDepositConfigurationCache(connection, options.cache),
        )
        : raw;
    return {
        findByPublicId: new FindByPublicIdResourceDepositConfigurationRepository(store),
        list: new ListResourceDepositConfigurationRepository(store),
        create: new CreateResourceDepositConfigurationRepository(store),
    };
}
