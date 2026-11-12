import { z } from "zod";
import { publicIdValidator } from "./repository";
import { worldWidthInCells, worldHeightInCells } from "../constants/world";
export const worldPopulationResourceRuleValidator = z.strictObject({
    configurationPublicId: publicIdValidator,
    targetActiveDeposits: z.int().min(1).max(worldWidthInCells * worldHeightInCells),
});
