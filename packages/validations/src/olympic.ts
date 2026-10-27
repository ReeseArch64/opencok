import { z } from "zod";
import { field } from "./response";
import type {
  OlympicQuestionResponse,
  OlympicBetResponse,
} from "@opencok/contracts/responses/olympic";

export const olympicQuestionSchema = z.strictObject({
  id: field.string,
  startBetTime: field.long,
  startTime: field.long,
  betCount: field.long,
  resourceType: field.int,
  resourceNum: field.long,
}) satisfies z.ZodType<OlympicQuestionResponse>;

export const olympicBetSchema = z.strictObject({
  uid: field.string,
  questionId: field.string,
  resourceType: field.int,
  betNum: field.int,
  betCountry: field.string,
  result: field.string,
  ended: field.int,
  rewarded: field.int,
  reward: field.int,
  endTime: field.long.optional(),
  betCount: field.long.optional(),
}) satisfies z.ZodType<OlympicBetResponse>;
