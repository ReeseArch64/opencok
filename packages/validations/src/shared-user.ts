import { z } from "zod";
import type { SharedUserInfoDto } from "@opencok/dtos/shared-user";
import { field } from "./dto.ts";

export const sharedUserInfoSchema = z.strictObject({
  uid: field.string.min(1),
  name: field.string.min(1),
  pic: field.string.optional(),
  picVer: field.int,
  picfraId: field.int,
  power: field.long.optional(),
  abbr: field.string.optional(),
  lang: field.string.optional(),
  mainBuildingLevel: field.int.optional(),
  allianceId: field.string.optional(),
  gmFlag: field.int,
  crossFightSrcServerId: field.int,
  vipLevel: field.int,
  svipLevel: field.int,
  vipEndTime: field.long.optional(),
  offLineTime: field.long.optional(),
  rank: field.int,
}) satisfies z.ZodType<SharedUserInfoDto>;
