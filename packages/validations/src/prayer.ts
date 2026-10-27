import { z } from "zod";
import { field } from "./response";
import type {
  PrayerResponse,
  PrayerLoginResponse,
  PrayerItemResponse,
} from "@opencok/contracts/responses/prayer";

export const prayerSchema = z.strictObject({
  prayCount: field.int,
  itemPrayCount: field.int,
  freeFromItem: field.int,
  wood: field.int,
  food: field.int,
  iron: field.int,
  silver: field.int,
  steel: field.int,
  goldwood: field.int,
  goldfood: field.int,
  goldiron: field.int,
  goldsilver: field.int,
  goldsteel: field.int,
  isFirstFree: field.bool,
  isFirstPay: field.bool,
  prayCountFree: field.int,
  prayCountMax: field.int,
  isSteelOpen: field.int,
  resource: field.int.optional(),
  num: field.int.optional(),
  hit: field.int.optional(),
  goldRemain: field.long.optional(),
  WOOD: field.long.optional(),
  STONE: field.long.optional(),
  IRON: field.long.optional(),
  FOOD: field.long.optional(),
  SILVER: field.long.optional(),
}) satisfies z.ZodType<PrayerResponse>;

export const prayerLoginSchema = z.strictObject({
  pray: z.strictObject({
    prayCount: field.int,
    freeFromItem: field.int,
    prayCountFree: field.int,
    prayCountMax: field.int,
  }),
}) satisfies z.ZodType<PrayerLoginResponse>;

export const prayerItemSchema = z.strictObject({
  prayCount: field.int,
  freeFromItem: field.int,
}) satisfies z.ZodType<PrayerItemResponse>;
