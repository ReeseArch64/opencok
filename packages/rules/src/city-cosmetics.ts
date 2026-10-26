import { num, long, type Row } from "@opencok/contracts/rows";
import type {
  CityCosmeticResponse,
  CosmeticStatusResponse,
} from "@opencok/contracts/responses/city-cosmetics";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
export function cityCosmeticProjection(
  states: readonly Row[],
  rules: Rules | undefined,
  now: bigint,
): CityCosmeticResponse {
  const active = states.filter((row) => long(row, "endTime") > now);
  const select = (type: number): CosmeticStatusResponse | undefined => {
    const group = active.filter((row) => num(row, "type2") === type);
    const special = group.find((row) =>
        ["3", "4"].includes(rules?.power.statuses?.get(String(row.stateId))?.overlap ?? ""),
      ),
      row = special ?? group[0];
    if (!row) return;
    let end = long(row, "endTime");
    if (end === 9223372036854775807n) end = now > 2147000000000n ? now + 86400000n : 2147000000000n;
    return {
      sid: cityInteger(row.stateId, 1),
      set: Number(BigInt.asIntN(32, end / 1000n)),
      ...(type === 200 && !special ? { count: cityInteger(row.count ?? 1) } : {}),
    };
  };
  const skin = select(100),
    bubble = select(105),
    overlap = select(200);
  return {
    ...(skin ? { sid: skin.sid, set: skin.set } : {}),
    ...(bubble ? { bubble } : {}),
    ...(overlap ? { overlap } : {}),
  };
}
