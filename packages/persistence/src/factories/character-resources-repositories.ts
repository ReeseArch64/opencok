import { createCharacterResourcesCache } from "../cache/character-resources";
import { FindByPublicIdCharacterResourcesRepository } from "../repositories/character-resources/find-by-public-id";
import { ListCharacterResourcesRepository } from "../repositories/character-resources/list";
import { CreateCharacterResourcesRepository } from "../repositories/character-resources/create";
import { UpdateCharacterResourcesRepository } from "../repositories/character-resources/update";
import { SoftDeleteCharacterResourcesRepository } from "../repositories/character-resources/soft-delete";
import type { CharacterResourcesRepositories } from "../interfaces/character-resources-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { CharacterResources } from "../models/kingdom/character-resources";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import {
    characterResourcesCreateValidator,
    characterResourcesUpdateValidator,
} from "../validators/character-resources";
import type {
    CreateCharacterResources,
    UpdateCharacterResources,
} from "../types/character-resources";

export function createCharacterResourcesRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): CharacterResourcesRepositories
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
        CharacterResources,
        CreateCharacterResources,
        UpdateCharacterResources
    >(
        manager,
        CharacterResources,
        characterResourcesCreateValidator,
        characterResourcesUpdateValidator,
        entity => {
            characterResourcesCreateValidator.strip().parse(entity);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createCharacterResourcesCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdCharacterResourcesRepository(store),
        list: new ListCharacterResourcesRepository(store),
        create: new CreateCharacterResourcesRepository(store),
        update: new UpdateCharacterResourcesRepository(store),
        softDelete: new SoftDeleteCharacterResourcesRepository(store),
    };
}
