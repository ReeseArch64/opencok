import type { InferSchemaType } from "mongoose";
import type { troopTrainingConfigurationSchema } from "../schemas/global/troop-training-configuration";

export type TroopTrainingConfiguration = InferSchemaType<typeof troopTrainingConfigurationSchema>;
