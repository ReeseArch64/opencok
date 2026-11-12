import type { ProvisionCharacterRepository } from "../repositories/character/provision";
import type { Character } from "../models/kingdom/character";
import type { CreateCharacter, UpdateCharacter } from "../types/character";
import type { MutableRepositories } from "./repository";

export interface CharacterRepositories
    extends MutableRepositories<Character, CreateCharacter, UpdateCharacter>
{
    provision: ProvisionCharacterRepository;
}
