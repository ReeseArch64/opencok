import type { World } from "../../models/kingdom/world";
import type { CreateWorld } from "../../types/world";
import { CreateRepository } from "../../class/create-repository";

export class CreateWorldRepository extends CreateRepository<World, CreateWorld>
{}
