import { localEventControlOpen, eventTimestamp } from "./local-events";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";
import type { RuleContext } from "./availability";

export function specialEventWindow(rules: Rules, context: RuleContext) {
  const config =
    rules.configuration.payControl?.get("") ?? rules.configuration.payControl?.get("69026");

  if (!config || config.k4 !== "1") return;

  const id = config.id ?? "69026",
    start = eventTimestamp(config.k5),
    end = eventTimestamp(config.k6);

  if (
    start === undefined ||
    end === undefined ||
    start > end ||
    BigInt(context.now) < start ||
    BigInt(context.now) > end ||
    !localEventControlOpen(rules, id, context)
  )
    return;

  return { start, end };
}

export function specialEventProducts(rules: Rules, ui = false) {
  const products = [
    ...((ui ? rules.advanced.specialExchanges : rules.advanced.castleExchanges)?.values() ?? []),
  ].filter((rule) => rule.type === "500");

  if (products.length > 256) throw new Error("Special event product bound exceeded");

  for (const product of products) {
    if (!product.id || product.id.length > 40) throw new Error("Invalid special event product");

    cityInteger(product.buy_limit, 1);
  }

  return products;
}
