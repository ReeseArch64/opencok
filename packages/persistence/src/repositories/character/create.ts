import type { Character } from "../../models/kingdom/character";
import type { CreateCharacter } from "../../types/character";
import { CreateRepository } from "../../class/create-repository";

export class CreateCharacterRepository extends CreateRepository<Character, CreateCharacter>
{}
