import { z } from "zod";
import type { ArenaInfoResponse, ArenaArmyResponse } from "@opencok/contracts/responses/arena";
import { field } from "./response";
export const arenaInfoSchema = z.strictObject({
  state: field.int,
  rankScore: field.int,
  time: field.long,
}) satisfies z.ZodType<ArenaInfoResponse>;
export const arenaArmySchema = z.strictObject({
  armyArray: z.array(z.strictObject({ armyId: field.string, count: field.int })).max(128),
}) satisfies z.ZodType<ArenaArmyResponse>;
