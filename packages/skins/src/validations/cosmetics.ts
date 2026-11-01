import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type {
    CityCosmeticResponse,
    CityCosmeticUpdateResponse,
} from "../contracts/responses/cosmetics";

const status = z.strictObject({ sid: field.int, set: field.int, count: field.int.optional() });

export const cityCosmeticSchema = z.strictObject({
    sid: field.int.optional(),
    set: field.int.optional(),
    bubble: status.optional(),
    npavatar: status.optional(),
    castleEffect: status.optional(),
    wings: status.optional(),
    avatarframe: status.optional(),
    aura: status.optional(),
    overlap: status.optional(),
}) satisfies z.ZodType<CityCosmeticResponse>;

export const cityCosmeticUpdateSchema = cityCosmeticSchema.extend({
    uid: field.string,
    worldpointid: field.int,
}) satisfies z.ZodType<CityCosmeticUpdateResponse>;
