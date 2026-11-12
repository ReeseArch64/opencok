import type { HydratedDocument } from "mongoose";
import type { ResourceDepositConfiguration } from "../../types/resource-deposit-configuration";
import type { CreateResourceDepositConfiguration } from "../../types/resource-deposit-configuration-input";
import { CreateRepository } from "../../class/create-repository";

export class CreateResourceDepositConfigurationRepository extends CreateRepository<
    HydratedDocument<ResourceDepositConfiguration>,
    CreateResourceDepositConfiguration
>
{}
