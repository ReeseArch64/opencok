import type { HydratedDocument } from "mongoose";
import type { WorldResourceSpawnJob } from "../types/world-resource-spawn-job";
import type {
    CreateWorldResourceSpawnJob,
    UpdateWorldResourceSpawnJob,
} from "../types/world-resource-spawn-job-input";
import type { MutableRepositories } from "./repository";

export interface WorldResourceSpawnJobRepositories extends
    MutableRepositories<
        HydratedDocument<WorldResourceSpawnJob>,
        CreateWorldResourceSpawnJob,
        UpdateWorldResourceSpawnJob
    >
{}
