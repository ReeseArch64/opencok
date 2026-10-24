import { z } from "zod";
import type { MailDeletedDto, MailSaveDto, MailStatusDto } from "@opencok/dtos/mail";
import { field, dtoRecord } from "./dto.ts";

export const mailDeletedSchema = z.strictObject({
  delete: field.int,
}) satisfies z.ZodType<MailDeletedDto>;

export const mailSaveSchema = z.union([
  z.strictObject({}),
  z.strictObject({ save: field.string.refine((value) => value === "success") }),
  z.strictObject({ cancel: field.string.refine((value) => value === "success") }),
]) satisfies z.ZodType<MailSaveDto>;

export const mailStatusSchema = z.union([
  z.strictObject({}),
  z.strictObject({ total: field.long, unread: field.long }),
  dtoRecord(z.string().regex(/^[1-9]$/), z.strictObject({ total: field.int, unread: field.int })),
]) satisfies z.ZodType<MailStatusDto>;
