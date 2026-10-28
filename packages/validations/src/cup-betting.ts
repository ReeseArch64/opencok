import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type { CupMatchResponse, CupBetResponse } from "@opencok/contracts/responses/cup-betting";

export const cupMatchSchema = z.strictObject({
    id: field.string,
    startBetTime: field.long,
    startTime: field.long,
    vs: field.string,
    odds: field.string,
    timeFormat: field.string,
    betCount: field.int,
}) satisfies z.ZodType<CupMatchResponse>;

export const cupBetSchema = z.strictObject({
    uuid: field.string,
    uid: field.string,
    matchId: field.string,
    resourceType: field.int,
    betNum: field.int,
    betSide: field.string,
    winner: field.string,
    ended: field.int,
    rewarded: field.int,
    odds: field.float,
    vs: field.string,
    timeFormat: field.string.optional(),
}) satisfies z.ZodType<CupBetResponse>;
