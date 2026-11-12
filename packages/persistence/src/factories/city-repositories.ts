import { createCityCache } from "../cache/city";
import { FindByPublicIdCityRepository } from "../repositories/city/find-by-public-id";
import { ListCityRepository } from "../repositories/city/list";
import { CreateCityRepository } from "../repositories/city/create";
import type { CityRepositories } from "../interfaces/city-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import { kingdomDatabase } from "./kingdom-database";
import type { EntityManager } from "typeorm";
import { City } from "../models/kingdom/city";
import { PostgresEntityStore } from "../class/postgres-entity-store";
import { cityCreateValidator } from "../validators/city";
import type { CreateCity } from "../types/city";

export function createCityRepositories(
    manager: EntityManager,
    kingdomId: number,
    options: RepositoryOptions = {},
): CityRepositories
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
    const raw = new PostgresEntityStore<City, CreateCity, never>(
        manager,
        City,
        cityCreateValidator,
        {
            parse: () => {
                throw new Error("City não permite alterações de vínculo");
            },
        },
        entity => {
            cityCreateValidator.strip().parse(entity);
        },
    );
    const store = options.cache
        ? new CachedEntityStore(raw, createCityCache(kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdCityRepository(store),
        list: new ListCityRepository(store),
        create: new CreateCityRepository(store),
    };
}
