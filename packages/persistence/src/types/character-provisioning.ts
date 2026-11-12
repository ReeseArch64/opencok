import type { z } from "zod";
import type {
    reserveCharacterValidator,
    completeCharacterProvisioningValidator,
} from "../validators/character-provisioning";

export type ReserveCharacter = z.input<typeof reserveCharacterValidator>;
export type CompleteCharacterProvisioning = z.input<typeof completeCharacterProvisioningValidator>;
