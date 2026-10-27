import { z } from "zod";
import { field } from "./response";
import { inventoryItemSchema } from "./bootstrap";
import { publicEquipmentSchema } from "./profile";
import { generalInfoSchema } from "@opencok/hero/validations/profile-generals";
import type { ActivityRewardResponse } from "@opencok/contracts/responses/activity-reward";

export const activityRewardSchema = z.strictObject({
  wood: field.long.optional(),
  wood_bind: field.long.optional(),
  stone: field.long.optional(),
  stone_bind: field.long.optional(),
  iron: field.long.optional(),
  iron_bind: field.long.optional(),
  food: field.long.optional(),
  food_bind: field.long.optional(),
  money: field.long.optional(),
  gold: field.long.optional(),
  crystal: field.long.optional(),
  chip: field.long.optional(),
  diamond: field.long.optional(),
  sand_stone: field.long.optional(),
  diamond_stone: field.long.optional(),
  marble: field.long.optional(),
  granite: field.long.optional(),
  limestone: field.long.optional(),
  military: field.int.optional(),
  milhonor: field.int.optional(),
  power: field.int.optional(),
  honor: field.int.optional(),
  alliancepoint: field.long.optional(),
  exp: field.int.optional(),
  expDelta: field.int.optional(),
  goods: z.array(inventoryItemSchema).max(64).optional(),
  equip: z.array(publicEquipmentSchema).max(256).optional(),
  general: z.array(generalInfoSchema).max(256).optional(),
}) satisfies z.ZodType<ActivityRewardResponse>;
