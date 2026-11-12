import type { InferSchemaType } from "mongoose";
import type { worldResourceSpawnJobSchema } from "../schemas/kingdom/world-resource-spawn-job";
export type WorldResourceSpawnJob = InferSchemaType<
    typeof worldResourceSpawnJobSchema
>;
