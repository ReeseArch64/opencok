import type { z } from "zod";
import type {
    characterResourcesCreateValidator,
    characterResourcesUpdateValidator,
} from "../validators/character-resources";
export type CreateCharacterResources = z.input<typeof characterResourcesCreateValidator>;
export type UpdateCharacterResources = z.input<typeof characterResourcesUpdateValidator>;
