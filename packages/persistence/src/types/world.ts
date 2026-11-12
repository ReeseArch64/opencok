import type { z } from "zod";
import type { worldCreateValidator, worldUpdateValidator } from "../validators/world";
export type CreateWorld = z.input<typeof worldCreateValidator>;
export type UpdateWorld = z.input<typeof worldUpdateValidator>;
