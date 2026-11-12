import type { HydratedDocument } from "mongoose";
import type { WorldPopulationConfiguration } from "../types/world-population-configuration";
import type { CreateWorldPopulationConfiguration } from "../types/world-population-configuration-input";
import type { PublishRepositories } from "./repository";

export interface WorldPopulationConfigurationRepositories extends
    PublishRepositories<
        HydratedDocument<WorldPopulationConfiguration>,
        CreateWorldPopulationConfiguration
    >
{}
