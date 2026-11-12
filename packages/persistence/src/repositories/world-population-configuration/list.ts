import type { HydratedDocument } from "mongoose";
import type { WorldPopulationConfiguration } from "../../types/world-population-configuration";
import { ListRepository } from "../../class/list-repository";

export class ListWorldPopulationConfigurationRepository
    extends ListRepository<HydratedDocument<WorldPopulationConfiguration>>
{}
