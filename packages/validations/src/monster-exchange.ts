import { z } from "zod";
import { field, responseValueSchema } from "./response";
import type { MonsterExchangeResponse } from "@opencok/contracts/responses/monster-exchange";
export const monsterExchangeSchema = z.strictObject({
  level: field.int,
  refreshTime: field.long,
  flushTimes: field.int,
  rewards: z
    .array(
      z.strictObject({
        rewardId: field.string,
        level: field.int,
        needNum: field.int,
        color: field.int,
        reward: z.array(responseValueSchema).max(128),
      }),
    )
    .min(1)
    .max(16),
  receiveLevels: field.string,
}) satisfies z.ZodType<MonsterExchangeResponse>;
