import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import type { Rule } from "./game";
export function shippingInvestmentFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}
export function shippingInvestmentAward(rule: Rule, random: (maximum: number) => number): number {
  const weights = (rule.weight ?? "").split("|").map((value) => cityInteger(value));
  const ranges = (rule.Range ?? "").split("|").map((value) => {
    const pair = value.split(";").map((value) => cityInteger(value));
    if (pair.length !== 2 || pair[0] === pair[1]) shippingInvestmentFailure();
    return [Math.min(...pair), Math.max(...pair)] as const;
  });
  if (!weights.length || weights.length > 128 || weights.length !== ranges.length)
    shippingInvestmentFailure();
  const total = cityInteger(
      weights.reduce((sum, value) => sum + value, 0),
      1,
    ),
    draw = cityInteger(random(total), 0, total - 1);
  let sum = 0;
  for (const [index, weight] of weights.entries()) {
    sum += weight;
    if (draw >= sum) continue;
    const [minimum, maximum] = ranges[index]!,
      span = maximum - minimum;
    return cityInteger(
      cityInteger(rule.Needgold, 1) + minimum + cityInteger(random(span), 0, span - 1),
    );
  }
  return shippingInvestmentFailure();
}
