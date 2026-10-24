import { z } from "zod";
import type {
  WorldResourceOwnerDto,
  WorldResourceGroupDto,
  WorldNeutralResourceDto,
} from "@opencok/dtos/world-resource-detail";
import { field } from "./dto.ts";

export const worldResourceOwnerSchema = z.strictObject({
  q: field.int,
  tq: field.int,
  collected: field.int,
  spd: field.float,
  sdt: field.long,
  changeCollectSpdTime: field.long,
  occupyEndTime: field.long,
}) satisfies z.ZodType<WorldResourceOwnerDto>;

export const worldResourceGroupSchema = z.union([
  z.strictObject({}),
  z.strictObject({ spd: field.float, tq: field.int, sdt: field.double }),
]) satisfies z.ZodType<WorldResourceGroupDto>;

export const worldNeutralResourceSchema = z.union([
  z.strictObject({}),
  z.strictObject({ occupybegintime: field.long }),
]) satisfies z.ZodType<WorldNeutralResourceDto>;
