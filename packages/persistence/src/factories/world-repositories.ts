import { createWorldCache } from "../cache/world";
import { FindByPublicIdWorldRepository } from "../repositories/world/find-by-public-id";
import { ListWorldRepository } from "../repositories/world/list";
import { CreateWorldRepository } from "../repositories/world/create";
import { UpdateWorldRepository } from "../repositories/world/update";
import { SoftDeleteWorldRepository } from "../repositories/world/soft-delete";
import type { WorldRepositories } from "../interfaces/world-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { World } from "../models/kingdom/world";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import { worldCreateValidator, worldUpdateValidator } from "../validators/world";
import type { CreateWorld, UpdateWorld } from "../types/world";

export function createWorldRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldRepositories
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
    const raw = new PostgresEntityStore<World, CreateWorld, UpdateWorld>(
        manager,
        World,
        worldCreateValidator,
        worldUpdateValidator,
        entity => {
            worldCreateValidator.strip().parse(entity);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldRepository(store),
        list: new ListWorldRepository(store),
        create: new CreateWorldRepository(store),
        update: new UpdateWorldRepository(store),
        softDelete: new SoftDeleteWorldRepository(store),
    };
}
