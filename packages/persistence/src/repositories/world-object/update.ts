import type { WorldObject } from "../../models/kingdom/world-object";
import type { UpdateWorldObject } from "../../types/world-object";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateWorldObjectRepository extends UpdateRepository<WorldObject, UpdateWorldObject>
{}
