import { createWorldObjectCache } from "../cache/world-object";
import { FindByPublicIdWorldObjectRepository } from "../repositories/world-object/find-by-public-id";
import { ListWorldObjectRepository } from "../repositories/world-object/list";
import { CreateWorldObjectRepository } from "../repositories/world-object/create";
import { UpdateWorldObjectRepository } from "../repositories/world-object/update";
import { SoftDeleteWorldObjectRepository } from "../repositories/world-object/soft-delete";
import type { WorldObjectRepositories } from "../interfaces/world-object-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { WorldObject } from "../models/kingdom/world-object";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import { worldObjectCreateValidator, worldObjectUpdateValidator } from "../validators/world-object";
import type { CreateWorldObject, UpdateWorldObject } from "../types/world-object";
import { validateWorldObjectBounds } from "../validators/sql-entities";

export function createWorldObjectRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldObjectRepositories
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
    const raw = new PostgresEntityStore<WorldObject, CreateWorldObject, UpdateWorldObject>(
        manager,
        WorldObject,
        worldObjectCreateValidator,
        worldObjectUpdateValidator,
        entity => {
            const value = worldObjectCreateValidator.strip().parse(entity);
            validateWorldObjectBounds(value);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldObjectCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldObjectRepository(store),
        list: new ListWorldObjectRepository(store),
        create: new CreateWorldObjectRepository(store),
        update: new UpdateWorldObjectRepository(store),
        softDelete: new SoftDeleteWorldObjectRepository(store),
    };
}
