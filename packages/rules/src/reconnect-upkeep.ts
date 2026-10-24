import type { Row } from "@opencok/contracts/rows";
import {
  ruleAvailable,
  switchRealmEnabled,
  versionAtLeast,
  type RuleContext,
} from "./availability.ts";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { javaHashMapOrder } from "./java-hash-map-order.ts";
import { reconnectFoodRates } from "./reconnect-resources.ts";

const int = (value: unknown) => Number(javaDecimal(String(value ?? 0), 32));
const float = Math.fround;
const cast = (value: number) =>
  Number.isNaN(value) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));
export type ReconnectUpkeepEffect = 38 | 64 | 72 | 2024 | 2804 | 2805 | 2806 | 2807;

export function reconnectUpkeep(
  armies: readonly Row[],
  buildings: readonly Row[],
  rules: Rules,
  context: RuleContext,
  environment: {
    specialServer: boolean;
    consumptionRatio: number;
    effect: (id: ReconnectUpkeepEffect) => number;
    cellarGeneralEffect: () => number;
  },
) {
  const byUuid = new Map(buildings.map((row) => [String(row.uuid), row]));
  if (byUuid.size !== buildings.length) throw new Error("Duplicate upkeep building");
  const ordered = javaHashMapOrder(byUuid.keys()).map((key) => byUuid.get(key)!);
  const building = (id: number) => ordered.find((row) => int(row.itemId) === id);
  const configuration = (row: Row) =>
    rules.building(String(int(row.itemId)), int(row.level), int(row.star), int(row.progress));
  const enabled = (key: string) => ruleAvailable(rules.features.get(key), context);
  const glory = enabled("p6_all");
  const consumeBound = glory && enabled("p6_security_resources");
  const rates = reconnectFoodRates(armies, rules, {
    ordinary: environment.effect(64),
    knight: environment.effect(2024),
    knightByArm: new Map(
      [1, 2, 3, 4, 5, 6, 7, 8].map((arm) => [
        arm,
        environment.effect((2804 + Math.floor((arm - 1) / 2)) as 2804 | 2805 | 2806 | 2807),
      ]),
    ),
    consumeBound,
  });
  const protect = int(rules.items.get("account")?.k7) === 1;
  let protectedFood = 0;
  const cellar = building(404000);
  if (protect && cellar) {
    const rule = configuration(cellar);
    const additive = float(environment.effect(72) + environment.cellarGeneralEffect());
    protectedFood = cast(float(float(int(rule.para4)) + additive));
    const multiplier = environment.effect(38);
    if (multiplier > 0) protectedFood = cast(protectedFood * (float(100 + multiplier) / 100));
  }
  const templar = building(439000);
  const unlocked =
    templar !== undefined &&
    (rules.buildings.get(String((int(templar.itemId) + int(templar.level) + int(templar.star)) | 0))
      ?.unlock_type === undefined ||
      int(templar.level) !== 1 ||
      int(templar.unlockFlag) !== 0);
  const weakness = unlocked && glory && enabled("p6_weak");
  const hospital = weakness ? building(441000) : undefined;
  const capacity = hospital ? int(configuration(hospital).para1) : 0;
  const separateBound =
    !environment.specialServer &&
    switchRealmEnabled(rules.items.get("on_trumpet")?.k2, context.kingdomId);
  if (
    !Number.isFinite(environment.consumptionRatio) ||
    environment.consumptionRatio < 0 ||
    environment.consumptionRatio > 1
  )
    throw new Error("Invalid upkeep consumption ratio");
  return {
    rates,
    options: {
      protect,
      protectedFood,
      separateBound,
      consumptionRatio: environment.consumptionRatio,
    },
    weakness,
    capacity,
    showBound:
      separateBound &&
      versionAtLeast(context.version, "2.0.3") &&
      !versionAtLeast("2.0.3", context.version),
  };
}
