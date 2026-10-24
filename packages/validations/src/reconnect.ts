import { z } from "zod";
import type {
  ReconnectBalancesResponse,
  ReconnectArmyResponse,
  ReconnectArmiesResponse,
  ReconnectGeneralsResponse,
  ReconnectMineResponse,
} from "@opencok/contracts/responses/reconnect";
import { field } from "./response.ts";
import { generalInfoSchema } from "./profile.ts";

export const reconnectBalancesSchema = z.strictObject({
  gold: field.long,
  dmmGold: field.long,
  dmmPaidGold: field.long,
  dmmPaidSpecialGold: field.long,
  freeGold: field.long,
  paidGold: field.long,
  paidSpecialGold: field.long,
}) satisfies z.ZodType<ReconnectBalancesResponse>;

export const reconnectArmySchema = z.strictObject({
  id: field.string.refine((value) => value.length > 0 && value.length <= 20),
  free: field.int,
  march: field.int,
  level: field.int,
  train: field.int.optional(),
  finish: field.long.optional(),
}) satisfies z.ZodType<ReconnectArmyResponse>;

export const reconnectArmiesSchema = z.strictObject({
  army: z.array(reconnectArmySchema).max(32767),
}) satisfies z.ZodType<ReconnectArmiesResponse>;

export const reconnectGeneralsSchema = z.strictObject({
  userGenerals: z.array(generalInfoSchema.extend({ abilityIndex: field.int })).max(32767),
}) satisfies z.ZodType<ReconnectGeneralsResponse>;

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
}) satisfies z.ZodType<ReconnectMineResponse>;

import { queueSchema } from "./city.ts";
import { rewardPreviewArraySchema } from "./rewards.ts";
import type {
  ReconnectQueuesResponse,
  ReconnectResourceResponse,
  ReconnectResourcesResponse,
  ReconnectTaskResponse,
  ReconnectTasksResponse,
} from "@opencok/contracts/responses/reconnect";

export const reconnectQueuesSchema = z.strictObject({
  queue: z.array(queueSchema).max(32767),
}) satisfies z.ZodType<ReconnectQueuesResponse>;

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
}) satisfies z.ZodType<ReconnectResourceResponse>;

export const reconnectResourcesSchema = z.strictObject({
  resource: reconnectResourceSchema,
}) satisfies z.ZodType<ReconnectResourcesResponse>;

export const reconnectTaskSchema = z.strictObject({
  id: field.string,
  num: field.int,
  state: field.int,
  type: field.int,
  currPhase: field.int.optional(),
  maxPhase: field.int.optional(),
  reward: rewardPreviewArraySchema.optional(),
}) satisfies z.ZodType<ReconnectTaskResponse>;

export const reconnectTasksSchema = z.strictObject({
  task: z.array(reconnectTaskSchema).max(32767),
  ckfTask: z.array(reconnectTaskSchema).max(32767),
  taskCompleteNum: field.int,
}) satisfies z.ZodType<ReconnectTasksResponse>;
