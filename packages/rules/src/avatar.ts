import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";

export function avatarSequence(version: unknown): number {
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 0 ||
    version > 2147483647 ||
    version % 1000000 === 999999
  )
    throw new GameError(errors.invalid, "avatar_rule");
  return (version % 1000000) + 1;
}
export function avatarMinimumLevel(rules: Rules): number | undefined {
  const settings = rules.items.get("function_on5");
  if (!settings) throw new GameError(errors.unsupported, "avatar_rule");
  if (settings.k2 === "0") return undefined;
  try {
    return Number(javaDecimal(rules.items.get("hero")?.k9, 32));
  } catch {
    throw new GameError(errors.unsupported, "avatar_rule");
  }
}
export function checkAvatarLevel(level: number, minimum: number): void {
  if (!Number.isInteger(level) || level < -2147483648 || level > 2147483647)
    throw new GameError(errors.invalid, "avatar_rule");
  if (level < minimum) throw new GameError(errors.avatarLevel);
}
export function checkAvatarRecord(rules: Rules, record: Row | undefined, now: number): void {
  if (!Number.isSafeInteger(now) || now < 0) throw new GameError(errors.invalid, "avatar_rule");
  if (!record) return;
  let interval: bigint;
  try {
    interval = BigInt.asIntN(64, javaDecimal(rules.items.get("hero")?.k7, 64) * 1000n);
  } catch {
    throw new GameError(errors.unsupported, "avatar_rule");
  }
  const updated = record.updateTime ?? 0n;
  const banned = record.banTime ?? 0n;
  if (
    typeof updated !== "bigint" ||
    typeof banned !== "bigint" ||
    BigInt.asIntN(64, updated) !== updated ||
    BigInt.asIntN(64, banned) !== banned
  )
    throw new GameError(errors.invalid, "avatar_rule");
  if (BigInt.asIntN(64, BigInt(now) - updated) < interval)
    throw new GameError(errors.avatarCooldown);
  if (banned > BigInt(now)) throw new GameError(errors.avatarReported);
}
