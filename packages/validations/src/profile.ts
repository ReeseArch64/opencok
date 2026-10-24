import { z } from "zod";
import type {
  PublicStatisticsDto,
  PublicMedalDto,
  GeneralInfoDto,
  PublicGeneralsDto,
  PublicEquipmentDto,
  PublicProfileBaseDto,
} from "@opencok/dtos/profile";
import { field, dtoRecord } from "./dto.ts";
import { playerStatisticsSchema } from "./power.ts";

export const publicStatisticsSchema = z.union([
  z.strictObject({}),
  playerStatisticsSchema.extend({ power: field.long }),
]) satisfies z.ZodType<PublicStatisticsDto>;

export const publicMedalSchema = z.strictObject({
  id: field.string,
  level: field.int,
}) satisfies z.ZodType<PublicMedalDto>;

export const generalInfoSchema = z.strictObject({
  uuid: field.string,
  generalId: field.string,
  level: field.int,
  status: field.int,
  att: field.int,
  defence: field.int,
  ability: z
    .array(dtoRecord(z.string(), z.union([field.null, field.string, field.int])))
    .max(32767),
  skill: z
    .array(
      z.strictObject({
        uuid: field.string,
        ownerId: field.string,
        skillId: field.string,
        startTime: field.long,
        endTime: field.long,
        actTime: field.long,
        stat: field.int,
        param1: field.int,
        param2: field.int,
      }),
    )
    .max(32767),
}) satisfies z.ZodType<GeneralInfoDto>;

export const publicGeneralsSchema = z.strictObject({
  skillPoint: field.int,
  userGenerals: z.array(generalInfoSchema).max(32767),
}) satisfies z.ZodType<PublicGeneralsDto>;

export const publicEquipmentSchema = z.strictObject({
  uuid: field.string,
  itemId: field.string,
  extraProperty: field.string,
  refineProperty: field.string,
  lockProperty: field.string.optional(),
  suit_effect: field.string.optional(),
  suit_value: field.string.optional(),
  suit_value_type: field.string.optional(),
  suit_value_sign: field.string.optional(),
  Buff: field.string.optional(),
  buff: field.string.optional(),
  buff_str: field.string.optional(),
  buff_Str: field.string.optional(),
  buffStr: field.string.optional(),
  BuffStr: field.string.optional(),
  on: field.int,
  reforgeCount: field.int,
  strength_level: field.int.optional(),
}) satisfies z.ZodType<PublicEquipmentDto>;

export const publicProfileBaseSchema = z
  .strictObject({
    uid: field.string,
    name: field.string,
    pic: field.string,
    medal: field.string,
    serverName: field.string,
    lastUpdateTime: field.string,
    officer: field.string.optional(),
    level: field.int,
    exp: field.int,
    picVer: field.int,
    picfraId: field.int,
    gmFlag: field.int,
    maxExp: field.int,
    vip: field.int,
    vipEndTime: field.int,
    armedLevel: field.int,
    market: field.int,
    score: field.int,
    serverId: field.int,
    flowerVal: field.int,
    showEquip: field.bool,
    showMedal: field.bool,
    showMarchSoldier: field.bool,
    achieveNum: field.float,
  })
  .extend({
    ...playerStatisticsSchema.partial().shape,
    power: field.long.optional(),
    medalList: z.array(publicMedalSchema).max(32767),
    equip: z.array(publicEquipmentSchema).max(32767),
  }) satisfies z.ZodType<PublicProfileBaseDto>;
