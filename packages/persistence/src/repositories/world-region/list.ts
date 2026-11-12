import type { HydratedDocument } from "mongoose";
import type { WorldRegion } from "../../types/world-region";
import { ListRepository } from "../../class/list-repository";

export class ListWorldRegionRepository extends ListRepository<HydratedDocument<WorldRegion>>
{}
