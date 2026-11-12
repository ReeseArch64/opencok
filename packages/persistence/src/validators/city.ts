import { z } from "zod";
import { internalIdValidator } from "./repository";

export const cityCreateValidator = z.strictObject({
    characterId: internalIdValidator,
    worldObjectId: internalIdValidator,
});
