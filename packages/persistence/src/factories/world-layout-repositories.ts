import { createWorldLayoutCache } from "../cache/world-layout";
import { FindByPublicIdWorldLayoutRepository } from "../repositories/world-layout/find-by-public-id";
import { ListWorldLayoutRepository } from "../repositories/world-layout/list";
import { CreateWorldLayoutRepository } from "../repositories/world-layout/create";
import type { WorldLayoutRepositories } from "../interfaces/world-layout-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { Connection } from "mongoose";
import { worldLayoutModel } from "../models/kingdom/world-layout";
import { MongoEntityStore } from "../class/mongo-entity-store";
import type { WorldLayout } from "../types/world-layout";
import type { CreateWorldLayout } from "../types/world-layout-input";

export function createWorldLayoutRepositories(
    connection: Connection,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldLayoutRepositories
{
    const model = worldLayoutModel(connection, kingdomId);
    const raw = new MongoEntityStore<WorldLayout, CreateWorldLayout, never>(model);
    const store = options.cache
        ? new CachedEntityStore(raw, createWorldLayoutCache(connection, kingdomId, options.cache))
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldLayoutRepository(store),
        list: new ListWorldLayoutRepository(store),
        create: new CreateWorldLayoutRepository(store),
    };
}
