import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";

export function allianceHeartFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function allianceHeartRule(rules: Rules, itemId: string) {
  const item = rules.goods.get(itemId);

  if (item?.type !== "20" || !item.para1 || item.para1.length > 2) allianceHeartFailure();

  return { effect: item.para1, duration: cityInteger(item.para2, 1) };
}
