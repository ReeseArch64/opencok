import { num, long, text, type Row } from "@opencok/contracts/rows";
import { javaDecimal } from "./java-integer";
import type { Rules } from "./game";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
function invalid(): never {
  throw new GameError(errors.unsupported, "world_point_detail");
}
function integer(value: unknown) {
  if (typeof value === "number") {
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) return invalid();
    return value;
  }
  try {
    return Number(javaDecimal(value, 32));
  } catch {
    return invalid();
  }
}
function cast(value: number) {
  return Number.isNaN(value) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(value)));
}
export function barbarianCurrentHP(point: Row, actor: Row | undefined, rules: Rules, now: bigint) {
  if (!actor) return 0;
  const config = rules.world.barbarians?.get(text(actor, "configId")),
    duration = integer(config?.para2),
    current = integer(actor.currentHP ?? 0);
  if (long(point, "fireTime") <= 0n) return current;
  const rate = integer(config?.para11),
    spent = BigInt(duration) - (long(point, "fireTime") - now) / 1000n,
    nonnegative = spent > 0n ? spent : 0n,
    bounded = nonnegative < BigInt(duration) ? nonnegative : BigInt(duration),
    reduction = Number(BigInt.asIntN(32, bounded * BigInt(rate)));
  return Math.max(0, (current - reduction) | 0);
}
export function scoutCost(
  point: Row,
  targetCastle: Row | undefined,
  rules: Rules,
  expenditure: number,
) {
  if (!Number.isFinite(expenditure)) invalid();
  if (num(point, "pointType") === 44) {
    const config = rules.world.barbarians?.get(text(point, "pointItem"));
    return config?.para4 === undefined ? 1000 : integer(config.para4.split(";").filter(Boolean)[1]);
  }
  const config = rules.items.get("worldmap_city"),
    base = integer(config?.k9),
    divisor = integer(config?.k10),
    scale = integer(config?.k11);
  if (divisor === 0) invalid();
  const ordinary = text(point, "ownerId")
    ? cast(base + Math.pow(num(targetCastle ?? {}, "level") / (divisor * 1.0), 2) * scale)
    : 1000;
  return cast(
    Math.fround(
      Math.fround(ordinary) *
        Math.max(Math.fround(1 - Math.fround(Math.fround(expenditure) / 100)), 0),
    ),
  );
}
