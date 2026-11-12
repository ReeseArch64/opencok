import type { HydratedDocument } from "mongoose";
import type { WorldPopulationConfiguration } from "../../types/world-population-configuration";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdWorldPopulationConfigurationRepository
    extends FindByPublicIdRepository<HydratedDocument<WorldPopulationConfiguration>>
{}
