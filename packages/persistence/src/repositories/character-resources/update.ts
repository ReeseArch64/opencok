import type { CharacterResources } from "../../models/kingdom/character-resources";
import type { UpdateCharacterResources } from "../../types/character-resources";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateCharacterResourcesRepository
    extends UpdateRepository<CharacterResources, UpdateCharacterResources>
{}
