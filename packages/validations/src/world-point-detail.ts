import { z } from "zod";
import type { WorldPointOwnerDto, WorldCityFieldsDto } from "@opencok/dtos/world-point-detail";
import { field } from "./dto.ts";

export const worldPointOwnerSchema = z.strictObject({
  uid: field.string.optional(),
  pic: field.string.optional(),
  afn: field.string.optional(),
  registerTime: field.long.optional(),
  power: field.long.optional(),
  killArmy: field.long.optional(),
  rank: field.int.optional(),
  vl: field.int.optional(),
}) satisfies z.ZodType<WorldPointOwnerDto>;

export const worldCityFieldsSchema = z.strictObject({
  slowDown: field.bool,
  targetTooStrong: field.bool,
  targetPower: field.long,
  lastBeDuelTime: field.long,
}) satisfies z.ZodType<WorldCityFieldsDto>;
