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

import { queueSchema } from "./city.ts";
import { rewardPreviewArraySchema } from "./rewards.ts";
import type {
  ReconnectQueuesDto,
  ReconnectResourceDto,
  ReconnectResourcesDto,
  ReconnectTaskDto,
  ReconnectTasksDto,
} from "@opencok/dtos/reconnect";

export const reconnectQueuesSchema = z.strictObject({
  queue: z.array(queueSchema).max(32767),
}) satisfies z.ZodType<ReconnectQueuesDto>;

export const reconnectResourceSchema = z.strictObject({
  wood: field.long,
  stone: field.long,
  iron: field.long,
  food: field.long,
  wood_bind: field.long.optional(),
  stone_bind: field.long.optional(),
  iron_bind: field.long.optional(),
  food_bind: field.long.optional(),
  silver: field.int,
  chip: field.int,
  diamond: field.int,
  dragonFood: field.int,
  dragonGold: field.int,
  sandstone: field.int,
  diamondstone: field.int,
  marble: field.int,
  granite: field.int,
  limestone: field.int,
}) satisfies z.ZodType<ReconnectResourceDto>;

export const reconnectResourcesSchema = z.strictObject({
  resource: reconnectResourceSchema,
}) satisfies z.ZodType<ReconnectResourcesDto>;

export const reconnectTaskSchema = z.strictObject({
  id: field.string,
  num: field.int,
  state: field.int,
  type: field.int,
  currPhase: field.int.optional(),
  maxPhase: field.int.optional(),
  reward: rewardPreviewArraySchema.optional(),
}) satisfies z.ZodType<ReconnectTaskDto>;

export const reconnectTasksSchema = z.strictObject({
  task: z.array(reconnectTaskSchema).max(32767),
  ckfTask: z.array(reconnectTaskSchema).max(32767),
  taskCompleteNum: field.int,
}) satisfies z.ZodType<ReconnectTasksDto>;
