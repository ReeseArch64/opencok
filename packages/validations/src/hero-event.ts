import { z } from "zod";
import { field } from "./response";
import { rewardPreviewArraySchema } from "./rewards";
import type {
  HeroEventEntryResponse,
  HeroEventInfoResponse,
  HeroEventRewardResponse,
  HeroPanelResponse,
} from "@opencok/contracts/responses/hero-event";
const score = z.strictObject({
  uid: field.string,
  actId: field.string,
  score: field.int,
  level: field.int,
  finishFlag: field.int,
  rewardFlagList: field.string,
});
export const heroEventEntrySchema = z.strictObject({
  eventId: field.string,
  actId: field.string,
  t: field.int,
  st: field.long,
  et: field.long,
  score: field.string,
  value: field.string,
  reward: z.array(rewardPreviewArraySchema).max(128),
  target: field.string,
  userScore: z.union([score, z.strictObject({})]),
}) satisfies z.ZodType<HeroEventEntryResponse>;
export const heroEventInfoSchema = z.strictObject({
  eventList: z.array(heroEventEntrySchema).max(256),
  type: field.int,
  vsCountry: z
    .array(
      z.strictObject({
        id: field.int,
        rank: field.int,
        name: field.string.optional(),
        banner: field.string.optional(),
      }),
    )
    .max(64)
    .optional(),
  ranking: field.int.optional(),
  rankingAlliance: field.int.optional(),
}) satisfies z.ZodType<HeroEventInfoResponse>;
export const heroEventRewardSchema = z.strictObject({
  reward: z.array(rewardPreviewArraySchema).max(128),
  rewardArr: field.string.optional(),
  levelArr: field.string.optional(),
}) satisfies z.ZodType<HeroEventRewardResponse>;

export const heroPanelSchema = z.strictObject({
  activityid: field.string,
  startTime: field.long,
  endTime: field.long.optional(),
  merge: field.bool.optional(),
  id: field.string,
  reward: rewardPreviewArraySchema.optional(),
  exchange: field.string.optional(),
  res_andmd5: field.string.optional(),
  res_iosmd5: field.string.optional(),
  popup: field.string,
  androidmd5: field.string.optional(),
  iosmd5: field.string.optional(),
}) satisfies z.ZodType<HeroPanelResponse>;
