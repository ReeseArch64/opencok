import type { HydratedDocument } from "mongoose";
import type { WorldRegion } from "../../types/world-region";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdWorldRegionRepository
    extends FindByPublicIdRepository<HydratedDocument<WorldRegion>>
{}
