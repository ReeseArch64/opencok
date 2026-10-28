import { z } from "zod";
import type { ExpeditionRankingResponse } from "@opencok/contracts/responses/expedition-ranking";
import { field } from "@opencok/messages/validations/response";

export const expeditionRankingSchema = z.union([
    z.strictObject({}),
    z.strictObject({
        selfRanking: field.int,
        serverRanking: z
            .array(
                z
                    .strictObject({
                        uid: field.string,
                        name: field.string,
                        pic: field.string,
                        abbr: field.string,
                        score: field.int,
                        rank: field.int,
                        picVer: field.int,
                        serverId: field.int,
                    })
                    .extend({ power: z.union([field.int, field.long]) }),
            )
            .max(32767),
    }),
]) satisfies z.ZodType<ExpeditionRankingResponse>;
