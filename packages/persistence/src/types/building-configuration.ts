import type { InferSchemaType } from "mongoose";
import type { buildingConfigurationSchema } from "../schemas/global/building-configuration";

export type BuildingConfiguration = InferSchemaType<typeof buildingConfigurationSchema>;
