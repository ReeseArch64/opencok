import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { eventTimestamp, localEventControlOpen } from "./local-events";
import type { RuleContext } from "./availability";
import type { Rules } from "./game";
export function feedbackFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}
export function feedbackWindow(rules: Rules, context: RuleContext) {
  const rule = rules.configuration.payControl?.get("69025"),
    start = eventTimestamp(rule?.k5),
    end = eventTimestamp(rule?.k6);
  if (!rule || start === undefined || end === undefined || end < start) return undefined;
  return {
    start,
    end,
    active:
      rule.k4 !== "0" &&
      localEventControlOpen(rules, "69025", context) &&
      BigInt(context.now) >= start &&
      BigInt(context.now) <= end,
  };
}
export function feedbackPrice(rules: Rules, productId: string): number | undefined {
  const prices = new Set<number>();
  for (const row of rules.advanced.castleExchanges?.values() ?? []) {
    if (row.product_id !== productId) continue;
    const match = row.dollar?.match(/^(\d+)(?:\.(\d{1,2}))?$/);
    if (!match) return undefined;
    const cents = Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
    if (!Number.isSafeInteger(cents) || cents <= 0 || cents > 2147483647) return undefined;
    prices.add(cents);
  }
  return prices.size === 1 ? [...prices][0] : undefined;
}
