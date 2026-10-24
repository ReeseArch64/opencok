import type { PublicProfileState } from "@opencok/contracts/profile";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";

function invalid(): never {
  throw new GameError(errors.unsupported, "public_profile");
}

function integer(value: unknown): number {
  if (!/^[+-]?\d+$/.test(String(value))) return invalid();
  const number = Number(value);
  if (!Number.isInteger(number) || number < -2147483648 || number > 2147483647) return invalid();
  return number;
}

function deadline(value: unknown): bigint {
  if (typeof value === "number" && !Number.isSafeInteger(value)) return invalid();
  if (!/^[+-]?\d+$/.test(String(value))) return invalid();
  const number = BigInt(String(value));
  if (BigInt.asIntN(64, number) !== number) return invalid();
  return number;
}

export function publicProfileProgress(
  state: PublicProfileState,
  rules: Rules,
  context: RuleContext,
) {
  if (!state.profile || !Number.isSafeInteger(context.now)) return invalid();
  if (context.kingdomId !== rules.kingdomId || context.kingdomId <= 0) return invalid();
  integer(context.kingdomId);
  const level = integer(state.profile.level ?? 0);
  const roleId = String(Number(BigInt.asIntN(32, 100100n + BigInt(level))));
  const maxExp = integer(rules.roles.get(roleId)?.player_exp);
  let vip = 0;
  const vipEndTime = deadline(state.vip?.vipEndTime ?? 0);
  if (state.vip && vipEndTime > BigInt(context.now)) {
    if (!rules.power.vip?.size) return invalid();
    const score = integer(state.vip.score ?? 0);
    let selected: string | undefined;
    for (const rule of rules.power.vip.values())
      if (integer(rule.point) <= score) selected = rule.id;
    if (selected !== undefined) vip = (integer(selected) % 100) + 1;
  }
  const count = state.completedAchievements;
  const total = rules.profile.achievementCount ?? 0;
  if (
    ![count, total].every((value) => Number.isInteger(value) && value >= 0 && value <= 2147483647)
  )
    return invalid();
  const achieveNum = total === 0 ? 1 : Math.fround(Math.fround(count) / Math.fround(total));
  const rank = integer(state.military?.militaryRank ?? 0);
  const armedLevel = rank > 0 ? integer(rules.profile.militaryRanks?.get(String(rank))?.level) : 1;
  if (state.taverns.length > 1) return invalid();
  const market = integer(state.taverns[0]?.level ?? 0) === 0 ? 0 : 1;
  return {
    maxExp,
    vip,
    vipEndTime: Number(BigInt.asIntN(32, vipEndTime / 1000n)),
    achieveNum,
    armedLevel,
    market,
    serverName: rules.profile.servers?.get(String(context.kingdomId))?.name ?? "",
    equipmentStrengthen: serverFeature(rules, "equipment_strengthen", context),
  };
}
