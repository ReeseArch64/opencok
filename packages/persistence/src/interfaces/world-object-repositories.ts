import type { WorldObject } from "../models/kingdom/world-object";
import type { CreateWorldObject, UpdateWorldObject } from "../types/world-object";
import type { MutableRepositories } from "./repository";

export interface WorldObjectRepositories
    extends MutableRepositories<WorldObject, CreateWorldObject, UpdateWorldObject>
{}
