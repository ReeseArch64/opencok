import { z } from "zod";
import type {
    WorldMonsterHealthResponse,
    WorldMonsterExplorationResponse,
} from "@opencok/contracts/responses/world-monster-detail";
import { field, responseValueSchema } from "@opencok/messages/validations/response";

export const worldMonsterHealthSchema = z.union([
    z.strictObject({}),
    z.strictObject({ mchp: field.int, mmhp: field.int }),
]) satisfies z.ZodType<WorldMonsterHealthResponse>;

export const worldMonsterExplorationSchema = z.union([
    z.strictObject({}),
    z.strictObject({
        erp: z.array(responseValueSchema).max(32767),
        st: field.long,
        et: field.long,
    }),
]) satisfies z.ZodType<WorldMonsterExplorationResponse>;
