import type { HydratedDocument } from "mongoose";
import type { WorldRegion } from "../../types/world-region";
import type { CreateWorldRegion } from "../../types/world-region-input";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldRegionRepository
    extends CreateRepository<HydratedDocument<WorldRegion>, CreateWorldRegion>
{}
