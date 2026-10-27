import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, type Row } from "@opencok/contracts/rows";
import { prayerSchema, prayerLoginSchema, prayerItemSchema } from "@opencok/validations/prayer";
import { validateFields } from "./validation";

export function prayerView(
  row: Row,
  free: number,
  maximum: number,
  steelOpen: number,
  steel: number,
): Fields {
  const body: Fields = {};

  for (const key of [
    "prayCount",
    "itemPrayCount",
    "freeFromItem",
    "wood",
    "food",
    "iron",
    "silver",
    "steel",
    "goldwood",
    "goldfood",
    "goldiron",
    "goldsilver",
    "goldsteel",
  ])
    {body[key] = sfs.int(key === "steel" ? steel : num(row, key));}

  Object.assign(body, {
    isFirstFree: sfs.bool(num(row, "isFirstFree") === 1),
    isFirstPay: sfs.bool(num(row, "isFirstPay") === 1),
    prayCountFree: sfs.int(free),
    prayCountMax: sfs.int(maximum - num(row, "itemPrayCount")),
    isSteelOpen: sfs.int(steelOpen),
  });

  return validateFields(prayerSchema, body);
}

export function prayerLogin(row: Row, free: number, maximum: number) {
  return validateFields(prayerLoginSchema, {
    pray: sfs.object({
      prayCount: sfs.int(num(row, "prayCount")),
      freeFromItem: sfs.int(num(row, "freeFromItem")),
      prayCountFree: sfs.int(free),
      prayCountMax: sfs.int(maximum - num(row, "itemPrayCount")),
    }),
  });
}

export function prayerResult(body: Fields) {
  return validateFields(prayerSchema, body);
}

export function prayerItemView(row: Row) {
  return validateFields(prayerItemSchema, {
    prayCount: sfs.int(num(row, "prayCount")),
    freeFromItem: sfs.int(num(row, "freeFromItem")),
  });
}
