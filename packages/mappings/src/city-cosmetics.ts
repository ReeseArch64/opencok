import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "@opencok/rules/game";
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

export function avatarActivationResponse(row: Row, rules: Rules, previous?: number): Fields {
  const rule = rules.power.statuses?.get(String(row.stateId)),
    end = row.endTime === 9223372036854775807n ? 2147000000000n : BigInt(String(row.endTime)),
    effects =
      rule?.random === "1"
        ? [[Number(row.ranEffId), Number(row.ranEffValue)]]
        : (rule?.effect ?? "")
            .split("|")
            .filter(Boolean)
            .map((pair) => pair.split(";").map(Number));

  return {
    effectState: sfs.object({
      [String(row.stateId)]: sfs.long(end),
      startTime: sfs.long(BigInt(String(row.startTime))),
    }),
    statusId: sfs.int(Number(row.stateId)),
    endTime: sfs.long(end),
    ...(effects.length
      ? {
          status: sfs.array(
            effects.map(([id, value]) =>
              sfs.object({
                effNum: sfs.int(id!),
                effVal: sfs.int(value!),
                stateId: sfs.int(Number(row.stateId)),
              }),
            ),
          ),
        }
      : {}),
    ...(previous === undefined ? {} : { oldStatus: sfs.string(String(previous)) }),
    ...(rule?.type === "4"
      ? { group: sfs.string(rule.group ?? ""), count: sfs.int(Number(row.count)) }
      : {}),
  };
}
