import type { HydratedDocument } from "mongoose";
import type { WorldResourceSpawnJob } from "../../types/world-resource-spawn-job";
import type { UpdateWorldResourceSpawnJob } from "../../types/world-resource-spawn-job-input";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateWorldResourceSpawnJobRepository
    extends UpdateRepository<HydratedDocument<WorldResourceSpawnJob>, UpdateWorldResourceSpawnJob>
{}
