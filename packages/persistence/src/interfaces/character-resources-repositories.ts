import type { CharacterResources } from "../models/kingdom/character-resources";
import type {
    CreateCharacterResources,
    UpdateCharacterResources,
} from "../types/character-resources";
import type { MutableRepositories } from "./repository";

export interface CharacterResourcesRepositories
    extends
        MutableRepositories<CharacterResources, CreateCharacterResources, UpdateCharacterResources>
{
}
