import type { InferSchemaType } from "mongoose";
import type { resourceDepositConfigurationSchema } from "../schemas/global/resource-deposit-configuration";

export type ResourceDepositConfiguration = InferSchemaType<
    typeof resourceDepositConfigurationSchema
>;
