import { z } from "zod";
import type {
    MailDeletedResponse,
    MailSaveResponse,
    MailStatusResponse,
} from "@opencok/contracts/responses/mail";
import { field, responseRecord } from "./response.ts";

export const mailDeletedSchema = z.strictObject({
    delete: field.int,
}) satisfies z.ZodType<MailDeletedResponse>;

export const mailSaveSchema = z.union([
    z.strictObject({}),
    z.strictObject({ save: field.string.refine((value) => value === "success") }),
    z.strictObject({ cancel: field.string.refine((value) => value === "success") }),
]) satisfies z.ZodType<MailSaveResponse>;

export const mailStatusSchema = z.union([
    z.strictObject({}),
    z.strictObject({ total: field.long, unread: field.long }),
    responseRecord(
        z.string().regex(/^[1-9]$/),
        z.strictObject({ total: field.int, unread: field.int }),
    ),
]) satisfies z.ZodType<MailStatusResponse>;
