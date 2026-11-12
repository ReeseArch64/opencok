import type { HydratedDocument } from "mongoose";
import type { WorldResourceSpawnJob } from "../../types/world-resource-spawn-job";
import type { CreateWorldResourceSpawnJob } from "../../types/world-resource-spawn-job-input";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldResourceSpawnJobRepository
    extends CreateRepository<HydratedDocument<WorldResourceSpawnJob>, CreateWorldResourceSpawnJob>
{}
