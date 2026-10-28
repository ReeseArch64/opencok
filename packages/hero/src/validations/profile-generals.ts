import { z } from "zod";
import type {
    GeneralInfoResponse,
    PublicGeneralsResponse,
} from "@opencok/hero/contracts/responses/profile-generals";
import { field, responseRecord } from "@opencok/validations/response";

export const generalInfoSchema = z.strictObject({
    uuid: field.string,
    generalId: field.string,
    level: field.int,
    status: field.int,
    att: field.int,
    defence: field.int,
    ability: z
        .array(responseRecord(z.string(), z.union([field.null, field.string, field.int])))
        .max(32767),
    skill: z
        .array(
            z.strictObject({
                uuid: field.string,
                ownerId: field.string,
                skillId: field.string,
                startTime: field.long,
                endTime: field.long,
                actTime: field.long,
                stat: field.int,
                param1: field.int,
                param2: field.int,
            }),
        )
        .max(32767),
}) satisfies z.ZodType<GeneralInfoResponse>;

export const publicGeneralsSchema = z.strictObject({
    skillPoint: field.int,
    userGenerals: z.array(generalInfoSchema).max(32767),
}) satisfies z.ZodType<PublicGeneralsResponse>;
