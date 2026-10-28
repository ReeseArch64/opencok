import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import { rewardPreviewArraySchema } from "@opencok/economy/validations/rewards";
import type {
    ReconnectTaskResponse,
    ReconnectTasksResponse,
} from "../contracts/responses/reconnect";

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
