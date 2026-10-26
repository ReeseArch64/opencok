import { z } from "zod";
import type {
  AnniversaryResponse,
  CampaignTriggerResponse,
} from "@opencok/contracts/responses/anniversary";
import { field } from "./response";
export const anniversarySchema = z.strictObject({
  anniversary_array: z.array(
    z.strictObject({
      week_id: field.int,
      box_score: field.int,
      box_already_taken: z.array(field.int),
      task_data: z.array(
        z.strictObject({
          master_task_id: field.int,
          task_array: z.array(
            z.strictObject({
              task_id: field.int,
              task_score: field.int,
              task_score_max: field.int,
            }),
          ),
        }),
      ),
    }),
  ),
  cake_already_taken: field.int,
  curr_week_id: field.int,
}) satisfies z.ZodType<AnniversaryResponse>;

export const anniversaryStatisticsSchema = z.strictObject({
  atkTime: field.long.optional(),
  atkName: field.string.optional(),
  defTime: field.long.optional(),
  teamAtkTime: field.long.optional(),
  regTime: field.string,
  regTop: field.long,
  power: field.long,
  powerPercent: field.double,
  food: field.long,
  feedPeople: field.long,
  wood: field.long,
  cutTree: field.long,
  train: field.long,
  armyType: field.int,
  maxTrain: field.long,
  maxTrainPercent: field.double,
  dead: field.long,
  deadPercent: field.double,
  worldWarPercent: field.int,
  kill: field.long,
  killPercent: field.string,
  allianceAllNum: field.int,
  allianceNum: field.int,
}) satisfies z.ZodType<
  import("@opencok/contracts/responses/anniversary").AnniversaryStatisticsResponse
>;

export const campaignTriggerSchema = z.strictObject({
  type: field.int,
}) satisfies z.ZodType<CampaignTriggerResponse>;
