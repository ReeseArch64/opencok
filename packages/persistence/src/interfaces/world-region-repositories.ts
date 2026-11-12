import type { HydratedDocument } from "mongoose";
import type { WorldRegion } from "../types/world-region";
import type { CreateWorldRegion, UpdateWorldRegion } from "../types/world-region-input";
import type { MutableRepositories } from "./repository";

export interface WorldRegionRepositories
    extends MutableRepositories<HydratedDocument<WorldRegion>, CreateWorldRegion, UpdateWorldRegion>
{}
