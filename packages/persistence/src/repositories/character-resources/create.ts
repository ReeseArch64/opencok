import type { CharacterResources } from "../../models/kingdom/character-resources";
import type { CreateCharacterResources } from "../../types/character-resources";
import { CreateRepository } from "../../class/create-repository";

export class CreateCharacterResourcesRepository
    extends CreateRepository<CharacterResources, CreateCharacterResources>
{}
