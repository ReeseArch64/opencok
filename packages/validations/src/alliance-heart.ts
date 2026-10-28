import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type {
    AllianceHeartResponse,
    AllianceHeartLoginResponse,
    AllianceHeartNotificationResponse,
} from "@opencok/contracts/responses/alliance-heart";

export const allianceHeartSchema = z.strictObject({
    worldpoint: field.string,
}) satisfies z.ZodType<AllianceHeartResponse>;

export const allianceHeartLoginSchema = z.strictObject({
    heart_allsender: field.string,
    heart_effecttype: field.string,
    heart_time: field.long,
}) satisfies z.ZodType<AllianceHeartLoginResponse>;

export const allianceHeartNotificationSchema = z.strictObject({
    point: field.string,
    effecttype: field.string,
    time: field.string,
    name: field.string.optional(),
    receiveuid: field.string,
}) satisfies z.ZodType<AllianceHeartNotificationResponse>;
