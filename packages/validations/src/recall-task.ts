import { z } from "zod";
import { field, responseValueSchema } from "./response";
import type {
  RecallTaskResponse,
  RecallTaskClaimResponse,
} from "@opencok/contracts/responses/recall-task";

export const recallTaskSchema = z.strictObject({
  targetList: z
    .array(
      z.strictObject({
        reward: z.array(responseValueSchema),
        num: field.int,
        target_num: field.int,
        state: field.bool,
        taskid: field.string,
        receive: field.bool,
      }),
    )
    .max(64),
  opentime: field.long.optional(),
}) satisfies z.ZodType<RecallTaskResponse>;

export const recallTaskClaimSchema = z.strictObject({
  id: field.string,
  reward: z.array(responseValueSchema),
  status: field.string.optional(),
  receive_reward: z.array(responseValueSchema).optional(),
}) satisfies z.ZodType<RecallTaskClaimResponse>;
