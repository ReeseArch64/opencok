import { z } from "zod";
import type { TargetTaskResponse } from "../contracts/responses/target-task";
import { field, responseValueSchema } from "@opencok/messages/validations/response";

export const targetTaskSchema = z.strictObject({
    targetList: z
        .array(
            z.strictObject({
                reward: z.array(responseValueSchema),
                num: field.int,
                target_num: field.int,
                state: field.bool,
                day_type: field.int,
                taskid: field.string,
                rewardDouble: field.int,
            }),
        )
        .max(64),
    exchangeid: field.string,
    day_sum: field.int,
    day_now: field.int.optional(),
    receive_mode: field.bool,
}) satisfies z.ZodType<TargetTaskResponse>;
