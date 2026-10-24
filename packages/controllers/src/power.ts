import type { PowerContext } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { decodeStoredJson } from "@opencok/messages/stored-json";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import { powerFeatureContext } from "@opencok/rules/power-context";

export function titleContractExpiries(knight: Row | undefined): ReadonlyMap<string, bigint> {
  const data = knight?.contract_unlock_title;
  if (data === undefined || data === null || (Buffer.isBuffer(data) && !data.length))
    return new Map();
  try {
    if (!Buffer.isBuffer(data)) throw new Error();
    const object = decodeStoredJson(data);
    if (object === null || typeof object !== "object" || Array.isArray(object)) throw new Error();
    const result = new Map<string, bigint>();
    for (const [key, value] of Object.entries(object)) {
      if (
        !/^\d+$/.test(key) ||
        BigInt(key) > 2147483647n ||
        typeof value !== "bigint" ||
        BigInt.asIntN(64, value) !== value
      )
        throw new Error();
      result.set(key, value);
    }
    return result;
  } catch {
    throw new GameError(errors.unsupported, "power_state");
  }
}

export function powerContext(
  rules: Rules,
  knight: Row | undefined,
  context: RuleContext,
  dragonAttackPercent?: number,
): PowerContext {
  return {
    now: context.now,
    ...powerFeatureContext(rules, context),
    contractTitleExpiries: titleContractExpiries(knight),
    dragonAttackPercent,
  };
}
