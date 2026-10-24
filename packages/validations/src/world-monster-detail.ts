import { z } from "zod";
import type {
  WorldMonsterHealthDto,
  WorldMonsterExplorationDto,
} from "@opencok/dtos/world-monster-detail";
import { field, dtoValueSchema } from "./dto.ts";

export const worldMonsterHealthSchema = z.union([
  z.strictObject({}),
  z.strictObject({ mchp: field.int, mmhp: field.int }),
]) satisfies z.ZodType<WorldMonsterHealthDto>;

export const worldMonsterExplorationSchema = z.union([
  z.strictObject({}),
  z.strictObject({ erp: z.array(dtoValueSchema).max(32767), st: field.long, et: field.long }),
]) satisfies z.ZodType<WorldMonsterExplorationDto>;
