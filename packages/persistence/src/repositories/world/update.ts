import type { World } from "../../models/kingdom/world";
import type { UpdateWorld } from "../../types/world";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateWorldRepository extends UpdateRepository<World, UpdateWorld>
{}
