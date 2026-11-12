import type { HydratedDocument } from "mongoose";
import type { WorldRegion } from "../../types/world-region";
import type { UpdateWorldRegion } from "../../types/world-region-input";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateWorldRegionRepository
    extends UpdateRepository<HydratedDocument<WorldRegion>, UpdateWorldRegion>
{}
