import { z } from "zod";
import { field, responseValueSchema } from "./response";
import type {
    RegionalRecallResponse,
    RegionalRecallLoginResponse,
} from "@opencok/contracts/responses/regional-recall";

export const regionalRecallSchema = z.strictObject({
    id: field.string,
    reward: z.array(responseValueSchema),
    receive_num: field.int.optional(),
    RegRec_lastReceiveTime: field.long.optional(),
}) satisfies z.ZodType<RegionalRecallResponse>;

export const regionalRecallLoginSchema = z.strictObject({
    RegRec_endTime: field.long,
    RegRec_lastReceiveTime: field.long.optional(),
}) satisfies z.ZodType<RegionalRecallLoginResponse>;
