import type { HydratedDocument } from "mongoose";
import type { ResourceDepositConfiguration } from "../../types/resource-deposit-configuration";
import { ListRepository } from "../../class/list-repository";

export class ListResourceDepositConfigurationRepository
    extends ListRepository<HydratedDocument<ResourceDepositConfiguration>>
{}
