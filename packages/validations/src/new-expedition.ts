import { z } from "zod";
import type { ExpeditionActivityResponse } from "@opencok/contracts/responses/new-expedition";
import { field } from "@opencok/messages/validations/response";
import type { ExpeditionPanelResponse } from "@opencok/contracts/responses/new-expedition";
import { rewardPreviewArraySchema } from "./rewards";

export const expeditionActivitySchema = z.strictObject({
    state: field.int,
    score: field.string,
    alliancescore: field.double,
    rank: field.int,
    kingdominfolist: z
        .array(
            z.strictObject({
                serverid: field.int,
                score: field.string,
                name: field.string.optional(),
                banner: field.string.optional(),
            }),
        )
        .max(2),
    startTime: field.long,
    endTime: field.long,
    count: field.int,
    rewardlist: z.array(field.int).max(100).optional(),
}) satisfies z.ZodType<ExpeditionActivityResponse>;

export const expeditionPanelSchema = expeditionActivitySchema.extend({
    id: field.string,
    activityid: field.string.optional(),
    exchange: field.string.optional(),
    res_andmd5: field.string.optional(),
    res_iosmd5: field.string.optional(),
    popup: field.string,
    androidmd5: field.string.optional(),
    iosmd5: field.string.optional(),
    merge: field.bool.optional(),
    reward: rewardPreviewArraySchema.optional(),
}) satisfies z.ZodType<ExpeditionPanelResponse>;
