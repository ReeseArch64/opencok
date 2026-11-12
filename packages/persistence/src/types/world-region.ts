import type { InferSchemaType } from "mongoose";
import type { worldRegionSchema } from "../schemas/kingdom/world-region";

export type WorldRegion = InferSchemaType<typeof worldRegionSchema>;
