import type { HydratedDocument } from "mongoose";
import type { WorldPopulationConfiguration } from "../../types/world-population-configuration";
import type { CreateWorldPopulationConfiguration } from "../../types/world-population-configuration-input";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldPopulationConfigurationRepository extends CreateRepository<
    HydratedDocument<WorldPopulationConfiguration>,
    CreateWorldPopulationConfiguration
>
{}
