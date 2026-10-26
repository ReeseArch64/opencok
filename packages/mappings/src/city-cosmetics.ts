import { sfs, type Fields } from "@opencok/messages/sfs";
import type { CityCosmeticResponse } from "@opencok/contracts/responses/city-cosmetics";
import { cityCosmeticSchema, cityCosmeticUpdateSchema } from "@opencok/validations/city-cosmetics";
import { validateFields } from "./validation";
export function cityCosmeticFields(value: CityCosmeticResponse): Fields {
  const body: Fields = {};
  if (value.sid !== undefined) body.sid = sfs.int(value.sid);
  if (value.set !== undefined) body.set = sfs.int(value.set);
  for (const key of ["bubble", "overlap"] as const) {
    const status = value[key];
    if (status)
      body[key] = sfs.object({
        sid: sfs.int(status.sid),
        set: sfs.int(status.set),
        ...(status.count === undefined ? {} : { count: sfs.int(status.count) }),
      });
  }
  return validateFields(cityCosmeticSchema, body);
}
export function cityCosmeticUpdate(
  value: CityCosmeticResponse,
  uid: string,
  point: number,
): Fields {
  return validateFields(cityCosmeticUpdateSchema, {
    ...cityCosmeticFields(value),
    uid: sfs.string(uid),
    worldpointid: sfs.int(point),
  });
}
