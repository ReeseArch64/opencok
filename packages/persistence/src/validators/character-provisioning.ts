import { z } from "zod";
import { internalIdValidator, publicIdValidator } from "./repository";

export const reserveCharacterValidator = z.strictObject({
    accountId: internalIdValidator,
    kingdomId: internalIdValidator,
});
export const completeCharacterProvisioningValidator = z.strictObject({
    provisioningPublicId: publicIdValidator,
    characterPublicId: publicIdValidator,
});
