import { z } from "zod";
import type { ExpeditionActivityResponse } from "@opencok/contracts/responses/new-expedition";
import { field } from "./response";
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
