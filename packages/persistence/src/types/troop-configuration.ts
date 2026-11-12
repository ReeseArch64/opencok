import type { InferSchemaType } from "mongoose";
import type { troopConfigurationSchema } from "../schemas/global/troop-configuration";

export type TroopConfiguration = InferSchemaType<typeof troopConfigurationSchema>;
