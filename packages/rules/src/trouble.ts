import type { Rules } from "./game";
import { cityInteger, citySpeedGold } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";

export function troubleItem(rules: Rules, item: string) {
  const goods = rules.goods.get(item),
    status = goods?.para1 ? rules.power.statuses?.get(goods.para1) : undefined;

  if (
    goods?.type !== "26" ||
    !status ||
    !["3", "4"].includes(status.overlap ?? "") ||
    status.type2 !== "100" ||
    status.effect ||
    !goods.para1
  )
    {worldMutationFailure();}

  cityInteger(status.time, 1);

  return { id: goods.para1, status };
}

export function troubleRemovalGold(rules: Rules, end: bigint, now: bigint) {
  const seconds = (end - now) / 1000n;

  return citySpeedGold(
    rules,
    (seconds <= 0n ? 0n : seconds > 2147483647n ? 2147483647n : seconds) * 1000n,
  );
}
