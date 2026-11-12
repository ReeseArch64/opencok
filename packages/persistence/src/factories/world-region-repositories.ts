import { createWorldRegionCache } from "../cache/world-region";
import { FindByPublicIdWorldRegionRepository } from "../repositories/world-region/find-by-public-id";
import { ListWorldRegionRepository } from "../repositories/world-region/list";
import { CreateWorldRegionRepository } from "../repositories/world-region/create";
import { UpdateWorldRegionRepository } from "../repositories/world-region/update";
import { SoftDeleteWorldRegionRepository } from "../repositories/world-region/soft-delete";
import type { WorldRegionRepositories } from "../interfaces/world-region-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { Connection } from "mongoose";
import { worldRegionModel } from "../models/kingdom/world-region";
import { MongoEntityStore } from "../class/mongo-entity-store";
import type { WorldRegion } from "../types/world-region";
import type { CreateWorldRegion, UpdateWorldRegion } from "../types/world-region-input";

export function createWorldRegionRepositories(
    connection: Connection,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldRegionRepositories
{
    const model = worldRegionModel(connection, kingdomId);
    const raw = new MongoEntityStore<WorldRegion, CreateWorldRegion, UpdateWorldRegion>(model);
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldRegionCache(connection, kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldRegionRepository(store),
        list: new ListWorldRegionRepository(store),
        create: new CreateWorldRegionRepository(store),
        update: new UpdateWorldRegionRepository(store),
        softDelete: new SoftDeleteWorldRegionRepository(store),
    };
}
