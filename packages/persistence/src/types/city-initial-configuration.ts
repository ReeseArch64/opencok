import type { InferSchemaType } from "mongoose";
import type { cityInitialConfigurationSchema } from "../schemas/global/city-initial-configuration";

export type CityInitialConfiguration = InferSchemaType<typeof cityInitialConfigurationSchema>;
