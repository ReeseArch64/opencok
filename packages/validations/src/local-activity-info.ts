import { z } from "zod";
import type {
  ClosedActivitiesResponse,
  CatalogRewardResponse,
} from "@opencok/contracts/responses/local-activity-info";
import { field } from "./response";
import { rewardPreviewArraySchema } from "./rewards";

export const closedActivitiesSchema = z.strictObject({
  act_close: z.array(z.strictObject({ id: field.string, close: field.string })).max(32767),
}) satisfies z.ZodType<ClosedActivitiesResponse>;

export const catalogRewardSchema = z.strictObject({
  award: rewardPreviewArraySchema,
  rewardId: field.string,
  reward_list: z.strictObject({
    item: field.string.optional(),
    num: field.string.optional(),
    wood: field.string.optional(),
    food: field.string.optional(),
    iron: field.string.optional(),
    stone: field.string.optional(),
    gold: field.string.optional(),
    prestige: field.string.optional(),
  }),
}) satisfies z.ZodType<CatalogRewardResponse>;
