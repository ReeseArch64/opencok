import { z } from "zod";
import type {
  ReconnectBalancesDto,
  ReconnectArmyDto,
  ReconnectArmiesDto,
  ReconnectGeneralsDto,
  ReconnectMineDto,
} from "@opencok/dtos/reconnect";
import { field } from "./dto.ts";
import { generalInfoSchema } from "./profile.ts";

export const reconnectBalancesSchema = z.strictObject({
  gold: field.long,
  dmmGold: field.long,
  dmmPaidGold: field.long,
  dmmPaidSpecialGold: field.long,
  freeGold: field.long,
  paidGold: field.long,
  paidSpecialGold: field.long,
}) satisfies z.ZodType<ReconnectBalancesDto>;

export const reconnectArmySchema = z.strictObject({
  id: field.string.refine((value) => value.length > 0 && value.length <= 20),
  free: field.int,
  march: field.int,
  level: field.int,
  train: field.int.optional(),
  finish: field.long.optional(),
}) satisfies z.ZodType<ReconnectArmyDto>;

export const reconnectArmiesSchema = z.strictObject({
  army: z.array(reconnectArmySchema).max(32767),
}) satisfies z.ZodType<ReconnectArmiesDto>;

export const reconnectGeneralsSchema = z.strictObject({
  userGenerals: z.array(generalInfoSchema.extend({ abilityIndex: field.int })).max(32767),
}) satisfies z.ZodType<ReconnectGeneralsDto>;

export const reconnectMineSchema = z.strictObject({
  mine: z.strictObject({
    itemId: field.int,
    level: field.int,
    exp: field.int,
    miner: field.int,
    call: field.int,
    xml_exp: field.int,
    xml_miner: field.int,
    mineTime: field.long,
  }),
}) satisfies z.ZodType<ReconnectMineDto>;
