import { createWorldResourceDepositCache } from "../cache/world-resource-deposit";
import { FindByPublicIdWorldResourceDepositRepository } from "../repositories/world-resource-deposit/find-by-public-id";
import { ListWorldResourceDepositRepository } from "../repositories/world-resource-deposit/list";
import { CreateWorldResourceDepositRepository } from "../repositories/world-resource-deposit/create";
import { UpdateWorldResourceDepositRepository } from "../repositories/world-resource-deposit/update";
import { SoftDeleteWorldResourceDepositRepository } from "../repositories/world-resource-deposit/soft-delete";
import type { WorldResourceDepositRepositories } from "../interfaces/world-resource-deposit-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { WorldResourceDeposit } from "../models/kingdom/world-resource-deposit";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import {
    worldResourceDepositCreateValidator,
    worldResourceDepositUpdateValidator,
} from "../validators/world-resource-deposit";
import type {
    CreateWorldResourceDeposit,
    UpdateWorldResourceDeposit,
} from "../types/world-resource-deposit";
import { validateWorldResourceDepositState } from "../validators/sql-entities";

export function createWorldResourceDepositRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldResourceDepositRepositories
{
    const database = kingdomDatabase(kingdomId);
    if (manager.connection.options.database !== database)
    {
        throw new Error("Repository vinculado ao banco incorreto");
    }
    if (options.cache && manager.queryRunner)
    {
        throw new Error(
            "Cache exige EntityManager fora de QueryRunner; invalide após o commit de transações externas",
        );
    }
    const raw = new PostgresEntityStore<
        WorldResourceDeposit,
        CreateWorldResourceDeposit,
        UpdateWorldResourceDeposit
    >(
        manager,
        WorldResourceDeposit,
        worldResourceDepositCreateValidator,
        worldResourceDepositUpdateValidator,
        entity => {
            const value = worldResourceDepositCreateValidator.strip().parse(entity);
            validateWorldResourceDepositState(value);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldResourceDepositCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldResourceDepositRepository(store),
        list: new ListWorldResourceDepositRepository(store),
        create: new CreateWorldResourceDepositRepository(store),
        update: new UpdateWorldResourceDepositRepository(store),
        softDelete: new SoftDeleteWorldResourceDepositRepository(store),
    };
}
