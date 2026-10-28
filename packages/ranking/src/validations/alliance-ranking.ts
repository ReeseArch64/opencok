import { z } from "zod";
import type { AllianceRankingResponse } from "../contracts/responses/alliance-ranking";
import { field } from "@opencok/messages/validations/response";

export function createAllianceRankingSchema(
    allianceVideoSchema: z.ZodType<
        NonNullable<AllianceRankingResponse["allianceRanking"][number]["allianceVideo"]>
    >,
)
{
    return z.strictObject({
        selfRanking: field.int.optional(),
        allianceRanking: z
            .array(
                z
                    .strictObject({
                        uid: field.string,
                        alliancename: field.string,
                        abbr: field.string,
                        leader: field.string.optional(),
                        icon: field.string.optional(),
                        curMember: field.int,
                        maxMember: field.int,
                    })
                    .extend({
                        nums: z.union([field.int, field.long]),
                        fightpower: z.union([field.int, field.double]).optional(),
                        armyKill: z.union([field.int, field.double]).optional(),
                        allianceVideo: allianceVideoSchema.optional(),
                    }),
            )
            .max(32767),
    }) satisfies z.ZodType<AllianceRankingResponse>;
}
