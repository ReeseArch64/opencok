import { z } from "zod";

const text = z
  .string()
  .min(1)
  .refine((value) => value.isWellFormed() && !value.includes("\0"));
export const createCharacterSchema = z
  .object({
    kingdomId: z.int().min(1).max(2147483647),
    deviceUuid: text.max(100),
    country: z.string().regex(/^[A-Z]{2}$/),
    language: z.string().regex(/^[a-z]{2}(?:[-_][A-Za-z]{2,4})?$/),
  })
  .strict();
export const reservationSchema = createCharacterSchema
  .extend({
    identityId: z.uuid(),
    gameUid: z.string().regex(/^[1-9][0-9]{0,19}$/),
    name: text.max(40),
    createdAt: z.int().min(0).max(Number.MAX_SAFE_INTEGER),
    preset: z.literal("normal-v1"),
  })
  .strict();
export const provisionReceiptSchema = z
  .object({
    gameUid: z.string().regex(/^[1-9][0-9]{0,19}$/),
    kingdomId: z.int().min(1).max(2147483647),
    requestHash: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
