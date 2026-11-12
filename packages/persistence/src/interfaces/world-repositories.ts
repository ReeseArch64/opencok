import type { World } from "../models/kingdom/world";
import type { CreateWorld, UpdateWorld } from "../types/world";
import type { MutableRepositories } from "./repository";

export interface WorldRepositories extends MutableRepositories<World, CreateWorld, UpdateWorld>
{}
