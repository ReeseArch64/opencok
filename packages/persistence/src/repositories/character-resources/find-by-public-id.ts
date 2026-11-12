import type { CharacterResources } from "../../models/kingdom/character-resources";
import { FindByPublicIdRepository } from "../../class/find-by-public-id-repository";

export class FindByPublicIdCharacterResourcesRepository
    extends FindByPublicIdRepository<CharacterResources>
{}
