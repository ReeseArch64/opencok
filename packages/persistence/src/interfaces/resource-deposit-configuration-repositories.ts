import type { HydratedDocument } from "mongoose";
import type { ResourceDepositConfiguration } from "../types/resource-deposit-configuration";
import type { CreateResourceDepositConfiguration } from "../types/resource-deposit-configuration-input";
import type { PublishRepositories } from "./repository";

export interface ResourceDepositConfigurationRepositories extends
    PublishRepositories<
        HydratedDocument<ResourceDepositConfiguration>,
        CreateResourceDepositConfiguration
    >
{}
