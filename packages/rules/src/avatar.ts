import type { AvatarFinishQuery, AvatarFinishPlan } from "@opencok/contracts/files";
import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules, Rule } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";

export function avatarSequence(version: unknown): number {
  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < -2147483648 ||
    version > 2147483647 ||
    version % 1000000 === 999999
  )
    throw new GameError(errors.invalid, "avatar_rule");

  return Math.max(0, version % 1000000) + 1;
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

export function avatarFinishQuery(receipt: string, now: number): AvatarFinishQuery {
  if (
    typeof receipt !== "string" ||
    !/^[1-9][0-9]{0,5}:[a-f0-9]{64}$/.test(receipt) ||
    !Number.isSafeInteger(now) ||
    now < 0
  )
    throw new GameError(errors.invalid, "avatar_rule");

  const [sequence, hash] = receipt.split(":");

  return { sequence: Number(sequence), hash: hash!, now };
}

export function avatarFinishMinimumLevel(rules: Rules): number | undefined {
  if (typeof rules.items.get("function_on5")?.k2 !== "string")
    throw new GameError(errors.unsupported, "avatar_rule");

  return avatarMinimumLevel(rules);
}

export function avatarFinishInterval(rules: Rules): bigint {
  try {
    return BigInt.asIntN(64, javaDecimal(rules.items.get("hero")?.k7, 64) * 1000n);
  } catch {
    throw new GameError(errors.unsupported, "avatar_rule");
  }
}

export function avatarFinishPlan(
  profile: Row,
  query: AvatarFinishQuery,
  moderated: boolean,
  mailTemplate: Rule | undefined,
): AvatarFinishPlan {
  const sequence = avatarSequence(profile.picVer);

  if (sequence !== query.sequence) throw new GameError(errors.invalid, "avatar_rule");

  const metadata = [profile.name, profile.pf];

  if (
    metadata.some(
      (value) =>
        typeof value !== "string" ||
        value.length > 255 ||
        value.includes("\0") ||
        !value.isWellFormed(),
    )
  )
    throw new GameError(errors.invalid, "avatar_rule");

  const template =
    moderated && mailTemplate && Object.keys(mailTemplate).length ? { ...mailTemplate } : null;

  if (
    template &&
    (Object.keys(template).length > 100 ||
      Object.entries(template).some(
        ([key, value]) =>
          !key ||
          key.length > 100 ||
          typeof value !== "string" ||
          !key.isWellFormed() ||
          !value.isWellFormed() ||
          key.includes("\0") ||
          value.includes("\0"),
      ))
  )
    throw new GameError(errors.unsupported, "avatar_rule");

  const effects = JSON.stringify({
    version: 1,
    mail: template,
    profile: {
      userName: profile.name,
      platform: profile.pf,
      updatedAt: String(Math.floor(query.now / 1000)),
    },
  });

  if (new TextEncoder().encode(effects).length > 65535)
    throw new GameError(errors.unsupported, "avatar_rule");

  return {
    picVer: sequence + (moderated ? 0 : 2000000),
    moderated,
    effects,
    pendingEffects: template ? 7 : 6,
  };
}
