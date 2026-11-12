import type { HydratedDocument } from "mongoose";
import type { ResourceDepositConfiguration } from "../../types/resource-deposit-configuration";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdResourceDepositConfigurationRepository
    extends FindByPublicIdRepository<HydratedDocument<ResourceDepositConfiguration>>
{}
