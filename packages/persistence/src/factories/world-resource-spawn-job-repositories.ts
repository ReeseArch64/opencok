import { createWorldResourceSpawnJobCache } from "../cache/world-resource-spawn-job";
import { FindByPublicIdWorldResourceSpawnJobRepository } from "../repositories/world-resource-spawn-job/find-by-public-id";
import { ListWorldResourceSpawnJobRepository } from "../repositories/world-resource-spawn-job/list";
import { CreateWorldResourceSpawnJobRepository } from "../repositories/world-resource-spawn-job/create";
import { UpdateWorldResourceSpawnJobRepository } from "../repositories/world-resource-spawn-job/update";
import { SoftDeleteWorldResourceSpawnJobRepository } from "../repositories/world-resource-spawn-job/soft-delete";
import type { WorldResourceSpawnJobRepositories } from "../interfaces/world-resource-spawn-job-repositories";
import type { RepositoryOptions } from "../types/repository-options";
import { CachedEntityStore } from "../class/cached-entity-store";
import type { Connection } from "mongoose";
import { worldResourceSpawnJobModel } from "../models/kingdom/world-resource-spawn-job";
import { MongoEntityStore } from "../class/mongo-entity-store";
import type { WorldResourceSpawnJob } from "../types/world-resource-spawn-job";
import type {
    CreateWorldResourceSpawnJob,
    UpdateWorldResourceSpawnJob,
} from "../types/world-resource-spawn-job-input";

export function createWorldResourceSpawnJobRepositories(
    connection: Connection,
    kingdomId: number,
    options: RepositoryOptions = {},
): WorldResourceSpawnJobRepositories
{
    const model = worldResourceSpawnJobModel(connection, kingdomId);
    const raw = new MongoEntityStore<
        WorldResourceSpawnJob,
        CreateWorldResourceSpawnJob,
        UpdateWorldResourceSpawnJob
    >(model);
    const store = options.cache
        ? new CachedEntityStore(
            raw,
            createWorldResourceSpawnJobCache(connection, kingdomId, options.cache),
        )
        : raw;
    return {
        findByPublicId: new FindByPublicIdWorldResourceSpawnJobRepository(store),
        list: new ListWorldResourceSpawnJobRepository(store),
        create: new CreateWorldResourceSpawnJobRepository(store),
        update: new UpdateWorldResourceSpawnJobRepository(store),
        softDelete: new SoftDeleteWorldResourceSpawnJobRepository(store),
    };
}
