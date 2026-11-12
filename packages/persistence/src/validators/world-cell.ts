import { z } from "zod";
import { worldWidthInCells, worldHeightInCells } from "../constants/world";
export const worldCellValidator = z.strictObject({
    columnIndex: z.int().min(0).max(worldWidthInCells - 1),
    rowIndex: z.int().min(0).max(worldHeightInCells - 1),
});
