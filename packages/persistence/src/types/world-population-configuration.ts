import type { InferSchemaType } from "mongoose";
import type { worldPopulationConfigurationSchema } from "../schemas/kingdom/world-population-configuration";
export type WorldPopulationConfiguration = InferSchemaType<
    typeof worldPopulationConfigurationSchema
>;
