import { z } from "zod";
import { internalIdValidator } from "./repository";
import { worldWidthInCells, worldHeightInCells } from "../constants/world";
export const worldObjectCellPositionValidator = z.strictObject({
    worldId: internalIdValidator,
    cellX: z.int().min(1).max(worldWidthInCells),
    cellY: z.int().min(1).max(worldHeightInCells),
});
