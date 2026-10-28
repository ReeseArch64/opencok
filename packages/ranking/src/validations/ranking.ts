import { z } from "zod";
import type { PlayerRankingResponse } from "../contracts/responses/ranking";
import { field } from "@opencok/messages/validations/response";

export const playerRankingSchema = z.strictObject({
    selfRanking: field.int.optional(),
    myRanking: field.int.optional(),
    serverRanking: z
        .array(
            z
                .strictObject({
                    uid: field.string.optional(),
                    name: field.string.optional(),
                    pic: field.string.optional(),
                    allianceId: field.string.optional(),
                    alliancename: field.string.optional(),
                    abbr: field.string.optional(),
                    icon: field.string.optional(),
                })
                .extend({
                    picVer: z.union([field.int, field.long]).optional(),
                    picfraId: z.union([field.int, field.long]).optional(),
                    power: z.union([field.int, field.long]).optional(),
                    armyKill: z.union([field.int, field.long]).optional(),
                    contributeSum: z.union([field.int, field.long]).optional(),
                    level: z.union([field.int, field.long]).optional(),
                    exp: z.union([field.int, field.long]).optional(),
                    banTime: z.union([field.int, field.long]).optional(),
                    updateTime: z.union([field.int, field.long]).optional(),
                    star: z.union([field.int, field.long]).optional(),
                    buildingPower: z.union([field.int, field.long]).optional(),
                }),
        )
        .max(32767),
}) satisfies z.ZodType<PlayerRankingResponse>;
