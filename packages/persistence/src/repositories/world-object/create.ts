import type { WorldObject } from "../../models/kingdom/world-object";
import type { CreateWorldObject } from "../../types/world-object";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldObjectRepository extends CreateRepository<WorldObject, CreateWorldObject>
{}
