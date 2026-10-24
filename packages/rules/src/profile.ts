import type { PublicAllianceState, PublicProfileState } from "@opencok/contracts/profile";
import { text } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";
import { allianceScienceEffects } from "./power-memberships.ts";

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

export function publicProfileSocial(state: PublicProfileState, kingdomId: number) {
  if (integer(kingdomId) <= 0) return invalid();
  const flowerVal = state.flowers
    ? Number(
        BigInt.asIntN(
          32,
          BigInt(integer(state.flowers.flowerVal)) - BigInt(integer(state.flowers.eggVal)),
        ),
      )
    : 0;
  let officer: string | undefined;
  if (state.office) {
    const positionId = text(state.office, "positionId");
    const ready = positionId === "216000000" && integer(state.office.serverId ?? 0) === kingdomId;
    if (!ready) {
      const ordinal = integer(positionId) % 100;
      if (ordinal >= 0 && ordinal <= 16) officer = String(216000 + ordinal);
    }
  }
  return { flowerVal, officer };
}

export function publicAllianceProgress(state: PublicAllianceState, rules: Rules) {
  const gift = state.alliance.giftlevel;
  const currentlevel =
    gift === null || gift === undefined ? undefined : BigInt(Math.floor(integer(gift) / 1000));
  const nextlevel = currentlevel === undefined ? undefined : (currentlevel + 1n) * 1000n;
  const member = deadline(state.totals.member);
  if (member <= 0n) return invalid();
  let fightpower: bigint | undefined;
  if (state.totals.fightpower !== null && state.totals.fightpower !== undefined) {
    const raw = state.totals.fightpower;
    if ((typeof raw === "number" && !Number.isSafeInteger(raw)) || !/^[+-]?\d+$/.test(String(raw)))
      return invalid();
    fightpower = BigInt(String(raw));
    if (!Number.isFinite(Number(fightpower))) return invalid();
  }
  const expansion = state.withEffects
    ? (allianceScienceEffects(state.sciences, rules).get(500) ?? 0)
    : 0;
  const add = Math.max(-2147483648, Math.min(2147483647, Math.trunc(expansion)));
  const maximum = state.alliance.maxMember;
  const maxMember =
    maximum === null || maximum === undefined
      ? undefined
      : Number(BigInt.asIntN(32, BigInt(integer(maximum)) + BigInt(add)));
  return { currentlevel, nextlevel, member, fightpower, maxMember };
}

export function publicProfileProgress(
  state: PublicProfileState,
  rules: Rules,
  context: RuleContext,
  profileKingdomId = context.kingdomId,
) {
  if (!state.profile || !Number.isSafeInteger(context.now)) return invalid();
  if (context.kingdomId !== rules.kingdomId || context.kingdomId <= 0) return invalid();
  integer(context.kingdomId);
  if (integer(profileKingdomId) <= 0) return invalid();
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
    serverName: rules.profile.servers?.get(String(profileKingdomId))?.name ?? "",
    equipmentStrengthen: serverFeature(rules, "equipment_strengthen", context),
  };
}
