import type { z } from "zod";
import type { kingdomCreateValidator, kingdomUpdateValidator } from "../validators/kingdom";

export type CreateKingdom = z.input<typeof kingdomCreateValidator>;
export type UpdateKingdom = z.input<typeof kingdomUpdateValidator>;
