import { createKingdomCache } from "../cache/kingdom";
import { FindByPublicIdKingdomRepository } from "../repositories/kingdom/find-by-public-id";
import { ListKingdomRepository } from "../repositories/kingdom/list";
import { CreateKingdomRepository } from "../repositories/kingdom/create";
import { UpdateKingdomRepository } from "../repositories/kingdom/update";
import { SoftDeleteKingdomRepository } from "../repositories/kingdom/soft-delete";
import type { KingdomRepositories } from "../interfaces/kingdom-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { EntityManager } from "typeorm";
import { Kingdom } from "../models/global/kingdom";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import { kingdomCreateValidator, kingdomUpdateValidator } from "../validators/kingdom";
import type { CreateKingdom, UpdateKingdom } from "../types/kingdom";

export function createKingdomRepositories(
    manager: EntityManager,
    options: RepositoryOptions = {},
): KingdomRepositories
{
    const database = "global";
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
    const raw = new PostgresEntityStore<Kingdom, CreateKingdom, UpdateKingdom>(
        manager,
        Kingdom,
        kingdomCreateValidator,
        kingdomUpdateValidator,
        entity => {
            kingdomCreateValidator.strip().parse(entity);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createKingdomCache(options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdKingdomRepository(store),
        list: new ListKingdomRepository(store),
        create: new CreateKingdomRepository(store),
        update: new UpdateKingdomRepository(store),
        softDelete: new SoftDeleteKingdomRepository(store),
    };
}
