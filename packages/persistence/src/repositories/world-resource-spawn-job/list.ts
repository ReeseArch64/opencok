import type { HydratedDocument } from "mongoose";
import type { WorldResourceSpawnJob } from "../../types/world-resource-spawn-job";
import { ListRepository } from "../../class/list-repository";

export class ListWorldResourceSpawnJobRepository
    extends ListRepository<HydratedDocument<WorldResourceSpawnJob>>
{}
