import type { WorldPowerEffect } from "@opencok/contracts/power";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";
import { effectInteger, effectLong, effectFloat, invalidEffect } from "./power-values.ts";

export function worldPowerEffects(
  records: readonly WorldPowerEffect[],
  rules: Rules,
  context: RuleContext,
  crossThrone = false,
): ReadonlyMap<number, number> {
  if (!Number.isSafeInteger(context.now)) return invalidEffect();
  const effects = new Map<number, number>();
  const special = crossThrone || serverFeature(rules, "server_buff", context);
  for (const record of records) {
    const id = effectInteger(record.id);
    if (id < 0) return invalidEffect();
    if (record.endTime !== undefined && effectLong(record.endTime) <= BigInt(context.now)) continue;
    const value = effectFloat(record.value);
    if (!special && ((id >= 307 && id <= 310) || id === 400 || (id >= 2143 && id <= 2159)))
      continue;
    effects.set(id, value);
  }
  return effects;
}
