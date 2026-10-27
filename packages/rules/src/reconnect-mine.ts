import type { FriendshipMine, FriendshipMineView } from "@opencok/contracts/reconnect";
import type { Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rules } from "./game.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "reconnect");
}

function signed(value: unknown, bits: 32 | 64): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) {return invalid();}

  if (!/^[+-]?\d+$/.test(String(value))) {return invalid();}

  const result = BigInt(String(value));

  if (BigInt.asIntN(bits, result) !== result) {return invalid();}

  return result;
}

export function initialFriendshipMine(rules: Rules): FriendshipMine {
  const rule = [...(rules.reconnect.treasures?.values() ?? [])].find((item) => item.lv === "1");

  if (!rule) {return invalid();}

  const mine: FriendshipMine = {
    itemId: Number(signed(rule.id, 32)),
    level: 1,
    exp: 0,
    miner: 0,
    mineTime: 0n,
    call: 0,
  };
  friendshipMineView({ ...mine }, rules);

  return mine;
}

export function friendshipMineView(row: Row, rules: Rules): FriendshipMineView {
  const integer = (key: string) => Number(signed(row[key] ?? 0, 32));
  const itemId = integer("itemId");
  const level = integer("level");
  const ruleId = String(Number(BigInt.asIntN(32, BigInt(itemId) + BigInt(level) - 1n)));
  const rule = rules.reconnect.treasures?.get(ruleId);

  if (!rule) {return invalid();}

  return {
    itemId,
    level,
    exp: integer("exp"),
    miner: integer("miner"),
    mineTime: signed(row.mineTime ?? 0, 64),
    call: integer("call"),
    requiredExp: Number(signed(rule.exp, 32)),
    maxMiners: Number(signed(rule.helper, 32)),
  };
}
