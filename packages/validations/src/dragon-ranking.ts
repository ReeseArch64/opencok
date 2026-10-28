import { z } from "zod";
import type { DragonRankingResponse } from "@opencok/contracts/responses/dragon-ranking";
import { field } from "@opencok/messages/validations/response";

export const dragonRankingSchema = z.strictObject({
    rank: z
        .array(
            z
                .strictObject({
                    teamId: field.string,
                    allianceId: field.string,
                    name: field.string,
                    leader: field.string,
                    kingName: field.string,
                    icon: field.string,
                    abbr: field.string,
                    teamState: field.int,
                    score: field.int,
                    kingId: field.int,
                    wins2: field.int,
                    curmember: field.int,
                    maxmember: field.int,
                    fighting: field.int,
                    rankNum: field.int,
                    type: field.int,
                    fightPower: field.long,
                })
                .extend({ wins: z.union([field.int, field.double]) }),
        )
        .max(32767),
}) satisfies z.ZodType<DragonRankingResponse>;
