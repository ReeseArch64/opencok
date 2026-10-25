import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, long, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import { cityInteger, cityAmount } from "./city-progression";
import type { RewardRandom } from "@opencok/contracts/rewards";
export type TalentTree = Record<string, string | number | null>;
const invalid = () => {
  throw new GameError(errors.locked, "city_progression");
};
export function validateTalentTrees(trees: readonly TalentTree[], rules: Rules, maximum: number) {
  let used = 0;
  if (trees.length > 8 || new Set(trees.map((tree) => tree.id)).size !== trees.length) invalid();
  for (const tree of trees) {
    if (tree.ids !== undefined) continue;
    const root = rules.progression.abilities?.get(String(tree.id));
    if (!root) invalid();
    const allowed = new Set(root!.skill?.split("|") ?? []);
    for (const [id, raw] of Object.entries(tree)) {
      if (id === "id") continue;
      if (!allowed.has(id)) invalid();
      const rule = rules.power.generalSkills?.get(id);
      const points = cityInteger(raw, 0, cityInteger(rule?.max_lv));
      if (!points) continue;
      if (
        rule?.condition_skill &&
        !rule.condition_skill.split("|").some((pair) => {
          const [key, count] = pair.split(";");
          return typeof tree[key!] === "number" && Number(tree[key!]) >= cityInteger(count);
        })
      )
        invalid();
      used += points;
    }
  }
  if (used > maximum) invalid();
  return cityInteger(maximum - used);
}
export function vipMutation(
  previous: Row | undefined,
  rules: Rules,
  owner: string,
  now: bigint,
  effect: number,
  value: number,
): Row {
  const row: Row = {
    uid: owner,
    score: 0,
    level: -1,
    loginDays: 0,
    lastLoginTime: 0n,
    vipEndTime: 0n,
    sPoint: 0,
    sLevel: 0,
    vip_switch: 1,
    shop_level: 0,
    shop_exp: 0,
    ...previous,
  };
  const ratio = cityInteger(rules.items.get("vip2svip")?.k1 ?? 100, 1);
  const superVip = num(row, "sLevel") > 0;
  const levelBefore = num(row, "level"),
    superBefore = num(row, "sLevel");
  if (effect === 70 || effect === 250) {
    let duration = BigInt(value) * 1000n;
    const key = duration <= 259200000n ? "k1" : duration < 2592000000n ? "k2" : "k3";
    const conversion = Number(rules.items.get("vip2sviptime")?.[key] ?? 24);
    if (!Number.isFinite(conversion) || conversion <= 0) invalid();
    if (superVip && effect === 70) duration = BigInt(Math.ceil(Number(duration) / conversion));
    if (!superVip && effect === 250) duration = BigInt(Math.ceil(Number(duration) * conversion));
    row.vipEndTime = cityAmount(
      (long(row, "vipEndTime") > now ? long(row, "vipEndTime") : now) + duration,
    );
  } else {
    if (superVip)
      row.sPoint = cityInteger(
        num(row, "sPoint") + (effect === 249 ? value : Math.ceil(value / ratio)),
      );
    else row.score = cityInteger(num(row, "score") + (effect === 249 ? value * ratio : value));
    for (const rule of rules.power.vip?.values() ?? [])
      if (num(row, "score") >= Number(rule.point)) row.level = Number(rule.id) - 7000;
    const threshold = cityInteger(rules.power.superVip?.get("7010")?.point ?? 2147483647);
    if (num(row, "score") > threshold) {
      row.sPoint = cityInteger(
        num(row, "sPoint") + Math.ceil((num(row, "score") - threshold) / ratio),
      );
      row.score = threshold;
    }
    for (const rule of rules.power.superVip?.values() ?? [])
      if (num(row, "sPoint") >= Number(rule.spoint ?? 0) && num(row, "score") >= threshold)
        row.sLevel = Number(rule.id) - 7009;
    if (num(row, "level") !== levelBefore || num(row, "sLevel") !== superBefore)
      row.vipEndTime = cityAmount(
        (long(row, "vipEndTime") > now ? long(row, "vipEndTime") : now) + 86400000n,
      );
  }
  return row;
}
export function temporaryEffect(
  rows: readonly Row[],
  rules: Rules,
  owner: string,
  id: string,
  now: bigint,
  count: number,
  random: RewardRandom,
) {
  const rule = rules.power.statuses?.get(id);
  if (!rule) invalid();
  if (rule!.rate && random(1000) >= cityInteger(rule!.rate)) return { states: [], deleted: [] };
  const group = rule!.group ?? "",
    family = group.slice(0, -2);
  const prior = rows.find(
    (row) =>
      long(row, "endTime") > now &&
      (String(row.stateId) === id ||
        (family &&
          String(rules.power.statuses?.get(String(row.stateId))?.group ?? "").slice(0, -2) ===
            family)),
  );
  const oldRule = prior ? rules.power.statuses?.get(String(prior.stateId)) : undefined;
  const overlap = rule!.overlap;
  if (prior && overlap === "5" && String(prior.stateId) !== id) invalid();
  if (prior && Number(group) % 100 < Number(oldRule?.group ?? 0) % 100 && overlap === "0")
    invalid();
  const extend =
    prior &&
    (overlap === "1" ||
      overlap === "5" ||
      (overlap === "2" &&
        Math.floor((Number(group) % 100) / 10) ===
          Math.floor((Number(oldRule?.group ?? 0) % 100) / 10)) ||
      (["3", "4"].includes(overlap ?? "") && overlap === oldRule?.overlap));
  const duration = BigInt(cityInteger(rule!.time ?? 0)) * 1000n * BigInt(cityInteger(count, 1));
  let end =
    rule!.time === undefined
      ? 9223372036854775807n
      : (extend ? long(prior!, "endTime") : now) + duration;
  if (rule!.autoend)
    end = (now / 86400000n) * 86400000n + BigInt(cityInteger(rule!.autoend)) * 86400000n;
  cityAmount(end);
  const state: Row = {
    uid: owner,
    stateId: extend ? num(prior!, "stateId") : Number(id),
    startTime: extend ? long(prior!, "startTime") : now,
    endTime: end,
    type: 0,
    type2: cityInteger(rule!.type2 ?? 0),
    groupType: cityInteger(group || 0),
    ranEffId: extend ? num(prior!, "ranEffId") : -1,
    ranEffValue: extend ? num(prior!, "ranEffValue") : 0,
    count: 1,
  };
  if (!extend && rule!.random === "1") {
    const choices = (rule!.effect ?? "").split("|").filter(Boolean);
    const [effect, value] = choices[random(choices.length)]!.split(";");
    state.ranEffId = cityInteger(effect);
    state.ranEffValue = cityInteger(value);
  }
  return { states: [state], deleted: prior && !extend ? [num(prior, "stateId")] : [] };
}
