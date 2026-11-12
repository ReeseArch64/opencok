import { ProvisionCharacterRepository } from "../repositories/character/provision";
import { createCharacterCache } from "../cache/character";
import { FindByPublicIdCharacterRepository } from "../repositories/character/find-by-public-id";
import { ListCharacterRepository } from "../repositories/character/list";
import { CreateCharacterRepository } from "../repositories/character/create";
import { UpdateCharacterRepository } from "../repositories/character/update";
import { SoftDeleteCharacterRepository } from "../repositories/character/soft-delete";
import type { CharacterRepositories } from "../interfaces/character-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { Character } from "../models/kingdom/character";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import { characterCreateValidator, characterUpdateValidator } from "../validators/character";
import type { CreateCharacter, UpdateCharacter } from "../types/character";

export function createCharacterRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): CharacterRepositories
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
    const raw = new PostgresEntityStore<Character, CreateCharacter, UpdateCharacter>(
        manager,
        Character,
        characterCreateValidator,
        characterUpdateValidator,
        entity => {
            characterCreateValidator.strip().parse(entity);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createCharacterCache(kingdomId, options.cache))
        : raw;
    return {
        provision: new ProvisionCharacterRepository(manager),
        findByPublicId: new FindByPublicIdCharacterRepository(store),
        list: new ListCharacterRepository(store),
        create: new CreateCharacterRepository(store),
        update: new UpdateCharacterRepository(store),
        softDelete: new SoftDeleteCharacterRepository(store),
    };
}
