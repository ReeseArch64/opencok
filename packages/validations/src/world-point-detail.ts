import { z } from "zod";
import type {
    WorldPointOwnerResponse,
    WorldCityFieldsResponse,
} from "@opencok/contracts/responses/world-point-detail";
import { field } from "./response.ts";

export const worldPointOwnerSchema = z.strictObject({
    uid: field.string.optional(),
    pic: field.string.optional(),
    afn: field.string.optional(),
    registerTime: field.long.optional(),
    power: field.long.optional(),
    killArmy: field.long.optional(),
    rank: field.int.optional(),
    vl: field.int.optional(),
}) satisfies z.ZodType<WorldPointOwnerResponse>;

export const worldCityFieldsSchema = z.strictObject({
    slowDown: field.bool,
    targetTooStrong: field.bool,
    targetPower: field.long,
    lastBeDuelTime: field.long,
}) satisfies z.ZodType<WorldCityFieldsResponse>;
