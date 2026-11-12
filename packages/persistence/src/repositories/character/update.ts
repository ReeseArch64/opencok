import type { Character } from "../../models/kingdom/character";
import type { UpdateCharacter } from "../../types/character";
import { UpdateRepository } from "../../class/update-repository";

export class UpdateCharacterRepository extends UpdateRepository<Character, UpdateCharacter>
{}
