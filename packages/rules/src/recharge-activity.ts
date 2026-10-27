import type { Rules } from "./game";
import type { RuleContext } from "./availability";
import { localEventControlOpen, eventTimestamp } from "./local-events";
import { cityAmount, cityInteger } from "./city-progression";
export function rechargeActivityWindow(rules: Rules, openedAt: bigint, context: RuleContext) {
  const control = rules.configuration.payControl?.get("69023");
  if (!control) return undefined;
  const start = control.k5 === "1" ? openedAt : eventTimestamp(control.k7);
  const end =
    control.k5 === "1"
      ? openedAt + BigInt(cityInteger(control.k6)) * 86400000n
      : eventTimestamp(control.k8);
  if (start === undefined || end === undefined || start < 0n || end < start) return undefined;
  cityAmount(end);
  const now = BigInt(context.now);
  return {
    control,
    start,
    end,
    active: localEventControlOpen(rules, "69023", context) && now >= start && now <= end,
  };
}
