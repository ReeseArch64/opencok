import type { HydratedDocument } from "mongoose";
import type { WorldResourceSpawnJob } from "../../types/world-resource-spawn-job";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdWorldResourceSpawnJobRepository
    extends FindByPublicIdRepository<HydratedDocument<WorldResourceSpawnJob>>
{}
