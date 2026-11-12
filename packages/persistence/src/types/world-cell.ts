import type { InferSchemaType } from "mongoose";
import type { worldCellSchema } from "../schemas/kingdom/world-cell";

export type WorldCell = InferSchemaType<typeof worldCellSchema>;
