import { z } from "zod";
import { field, responseValueSchema } from "./response.ts";

import type {
  ReconnectMarchArmyResponse,
  ReconnectMarchDragonResponse,
  ReconnectMarchGeneralResponse,
  ReconnectMarchResponse,
  ReconnectMarchesResponse,
} from "@opencok/contracts/responses/reconnect-marches";

export const reconnectMarchArmySchema = z.strictObject({
  armId: field.int,
  total: field.int,
  dead: field.int,
  knight_total: field.int.optional(),
  knight_dead: field.int.optional(),
}) satisfies z.ZodType<ReconnectMarchArmyResponse>;

export const reconnectMarchDragonSchema = z.strictObject({
  uuid: field.string,
  itemId: field.string,
  friendShip: field.int,
  userId: field.string.optional(),
  nickName: field.string.optional(),
}) satisfies z.ZodType<ReconnectMarchDragonResponse>;

export const reconnectMarchGeneralSchema = z.strictObject({
  userId: field.string,
  generalId: field.string,
  level: field.int,
  skillList: z.array(field.string).max(32767).optional(),
}) satisfies z.ZodType<ReconnectMarchGeneralResponse>;

export const reconnectMarchSchema = z.strictObject({
  uuid: field.string,
  o: field.string,
  ouid: field.string,
  mType: field.int,
  tType: field.int,
  sType: field.int,
  color: field.int,
  sp: field.int,
  dp: field.int,
  extraParam: field.int,
  serverId: field.int,
  isDuel: field.int,
  mt: field.int,
  slowDown: field.bool,
  st: field.long,
  et: field.long,
  territoryStartTime: field.long.optional(),
  territoryUpdateTime: field.long.optional(),
  occupyEndTime: field.long.optional(),
  treasureMapTime: field.int.optional(),
  treasureMapFinishTime: field.long.optional(),
  tct: field.long.optional(),
  exploreSt: field.long.optional(),
  exploreTime: field.long.optional(),
  sdt: field.long.optional(),
  changeCollectSpdTime: field.long.optional(),
  territoryStat: field.int.optional(),
  monsterCount: field.int.optional(),
  monsterLevel: field.int.optional(),
  attSkin: field.int.optional(),
  defSkin: field.int.optional(),
  marchSkin: field.int.optional(),
  oType: field.int.optional(),
  crt: field.int.optional(),
  q: field.int.optional(),
  tq: field.int.optional(),
  collected: field.int.optional(),
  spd: field.float.optional(),
  plunderRes: field.string.optional(),
  asn: field.string.optional(),
  tali: field.string.optional(),
  officer: field.string.optional(),
  team: field.string.optional(),
  mt2: z.array(responseValueSchema).max(32767).optional(),
  army: z.array(reconnectMarchArmySchema).max(32767),
  leaderArmy: z.array(reconnectMarchArmySchema).max(32767).optional(),
  petDragon: reconnectMarchDragonSchema.optional(),
  dragonList: z.array(reconnectMarchDragonSchema).max(32767).optional(),
  generalList: z.array(reconnectMarchGeneralSchema).max(32767).optional(),
}) satisfies z.ZodType<ReconnectMarchResponse>;

export const reconnectMarchesSchema = z.strictObject({
  worldMarch: z.array(reconnectMarchSchema).max(32767),
}) satisfies z.ZodType<ReconnectMarchesResponse>;
