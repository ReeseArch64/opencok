import type { z } from "zod";
import type { characterCreateValidator, characterUpdateValidator } from "../validators/character";
export type CreateCharacter = z.input<typeof characterCreateValidator>;
export type UpdateCharacter = z.input<typeof characterUpdateValidator>;
