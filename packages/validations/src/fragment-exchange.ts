import { z } from "zod";
import { field, responseValueSchema } from "@opencok/messages/validations/response";
import type {
    FragmentExchangeOfferResponse,
    FragmentExchangeResponse,
} from "@opencok/contracts/responses/fragment-exchange";

export const fragmentExchangeOfferSchema = z.strictObject({
    id: z.array(field.string).min(1).max(64),
    type: field.int,
    same: field.int,
    reward: z.array(responseValueSchema).max(128),
    multiple: field.int,
    allReward: z.array(z.array(responseValueSchema).max(128)).max(128).optional(),
}) satisfies z.ZodType<FragmentExchangeOfferResponse>;

export const fragmentExchangeSchema = z.strictObject({
    info: z.array(fragmentExchangeOfferSchema).min(1).max(64),
    exchangeId: field.string,
    refresh: field.int,
    freeNum: field.int,
    refreshCost: field.int,
    actId: field.string.optional(),
}) satisfies z.ZodType<FragmentExchangeResponse>;
