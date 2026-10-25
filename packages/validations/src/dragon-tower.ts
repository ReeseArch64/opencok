import { z } from "zod";
import type {
  DragonTowerArmyResponse,
  DragonTowerUserResponse,
  DragonTowerLayerResponse,
} from "@opencok/contracts/responses/dragon-tower";
import { field, responseValueSchema } from "./response";
const units = z.array(z.strictObject({ id: field.int, num: field.int, star: field.int })).max(128);
export const towerArmySchema = z.strictObject({
  army: units,
  deadarmy: units,
  armyrevive: units,
  armyrevivenum: field.int,
  armyrevivecd: field.long,
}) satisfies z.ZodType<DragonTowerArmyResponse>;
export const towerUserSchema = z.strictObject({
  ...towerArmySchema.shape,
  currentlayer: field.int,
  weeklymaxlayer: field.int,
  maxlayer: field.int,
  weeklyrevive: field.short,
  resettimes: field.int,
  dailyresettime: field.long,
  weeklyresettime: field.long,
  revivecost: field.int,
  generalid: field.string,
  dragon: field.string,
  score: field.int,
  rankmax: field.int,
  rankweekly: field.int,
  limitlayer: field.int,
  sharetimes: field.short,
}) satisfies z.ZodType<DragonTowerUserResponse>;
export const towerLayerSchema = z.strictObject({
  layer: field.int,
  layerindex: field.int,
  difficulty: field.short,
  monsters: field.string,
  buffs: field.string,
  buybuff: field.int,
  awards: z.array(responseValueSchema).max(1024).optional(),
  awardstate: field.short,
  layerstate: field.short,
  fighttime: field.long,
}) satisfies z.ZodType<DragonTowerLayerResponse>;
