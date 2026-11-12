import type { InferSchemaType } from "mongoose";
import type { marchConfigurationSchema } from "../schemas/global/march-configuration";

export type MarchConfiguration = InferSchemaType<typeof marchConfigurationSchema>;
