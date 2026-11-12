import type { z } from "zod";
import type {
    worldObjectCreateValidator,
    worldObjectUpdateValidator,
} from "../validators/world-object";

export type CreateWorldObject = z.input<typeof worldObjectCreateValidator>;
export type UpdateWorldObject = z.input<typeof worldObjectUpdateValidator>;
