import { createWorldObjectCellCache } from "../cache/world-object-cell";
import { FindByPublicIdWorldObjectCellRepository } from "../repositories/world-object-cell/find-by-public-id";
import { ListWorldObjectCellRepository } from "../repositories/world-object-cell/list";
import type { WorldObjectCellRepositories } from "../interfaces/world-object-cell-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { WorldObjectCell } from "../models/kingdom/world-object-cell";
import { PostgresEntityStore } from "../class/postgres-entity-store";

export function createWorldObjectCellRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldObjectCellRepositories
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
    const readOnly = {
        parse(): never
        {
            throw new Error("Células são mantidas por triggers SQL");
        },
    };
    const raw = new PostgresEntityStore<WorldObjectCell, never, never>(
        manager,
        WorldObjectCell,
        readOnly,
        readOnly,
        () => {},
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldObjectCellCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldObjectCellRepository(store),
        list: new ListWorldObjectCellRepository(store),
    };
}
