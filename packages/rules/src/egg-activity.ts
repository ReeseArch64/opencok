import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { long, type Row } from "@opencok/contracts/rows";
import type { Rule, Rules } from "./game";
import { cityAmount, cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { goldEggsDraw } from "./gold-eggs";

export const eggActivityIdle = 9223372036854775807n;

export function eggActivityFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function eggActivityWindow(rules: Rules) {
  const config = rules.configuration.payControl?.get("69007"),
    start = eventTimestamp(config?.k8),
    end = eventTimestamp(config?.k9);

  return start !== undefined && end !== undefined && end > start ? { start, end } : undefined;
}

export function eggActivityOpen(rules: Rules, now: bigint) {
  const period = eggActivityWindow(rules);

  return !!period && now >= period.start && now <= period.end;
}

export function eggActivityId(value: unknown) {
  const id = String(value ?? "");

  if (!/^\d{1,10}$/.test(id)) eggActivityFailure();

  return id;
}

export function eggActivityRule(rules: Rules, id: string): Rule {
  eggActivityId(id);
  const row = rules.advanced.eggs?.get(id);

  if (!row) eggActivityFailure();

  return row;
}

export function eggActivityDraw(rules: Rules, random: (maximum: number) => number) {
  const config = rules.configuration.payControl?.get("69007"),
    ids = (config?.k2 ?? "").split("|"),
    weights = (config?.k3 ?? "").split("|");

  if (
    !ids.length ||
    ids.length > 32 ||
    ids.length !== weights.length ||
    new Set(ids).size !== ids.length
  )
    eggActivityFailure();

  return goldEggsDraw(
    ids.map((id, index) => {
      eggActivityRule(rules, id);

      return { value: id, weight: cityInteger(weights[index]) };
    }),
    random,
  );
}

export function eggActivityGoods(raw: unknown) {
  const value = String(raw ?? "");

  if (value.length > 200 || (value && !/^\d+(?:\|\d+)*$/.test(value))) eggActivityFailure();

  const ids = value ? value.split("|") : [];

  if (new Set(ids).size !== ids.length) eggActivityFailure();

  return ids;
}

export function eggActivityRecord(row: Row, owner: string) {
  if (row.uid !== owner) eggActivityFailure();

  eggActivityId(row.curEgg);
  const cd = cityAmount(row.eggCd);

  if (cd <= 0n) eggActivityFailure();

  cityInteger(row.exp ?? 0);
  cityInteger(row.curExpStage ?? 0);

  return row;
}

export function eggActivityCollection(row: Row, owner: string) {
  if (row.uid !== owner) eggActivityFailure();

  eggActivityId(row.eggId);
  eggActivityGoods(row.goods);
  cityInteger(row.reward ?? 0, 0, 1);

  return row;
}

export function eggActivityThresholds(rules: Rules) {
  const config = rules.configuration.payControl?.get("69007"),
    exp = (config?.k4 ?? "").split(";"),
    rewards = (config?.k5 ?? "").split(";");

  if (!exp.length || exp.length > 64 || exp.length !== rewards.length) eggActivityFailure();

  return exp.map((value, index) => ({
    exp: cityInteger(value, 1),
    reward: eggActivityId(rewards[index]),
  }));
}

export function eggActivityClearCost(row: Row, rules: Rules, now: bigint) {
  const cd = long(row, "eggCd"),
    rate = Number(rules.configuration.payControl?.get("69007")?.k7);

  if (cd === eggActivityIdle || cd <= now || !Number.isFinite(rate) || rate <= 0)
    eggActivityFailure();

  const seconds = Number((cd - now) / 1000n);

  if (!Number.isSafeInteger(seconds)) eggActivityFailure();

  return cityInteger(Math.ceil(seconds / rate));
}

export function eggActivityMissing(row: Row, rule: Rule) {
  const existing = eggActivityGoods(row.goods),
    required = `${rule.dark ?? ""};${rule.question_mark ?? ""}`.split(";").filter(Boolean);

  if (!required.length || required.length > 32 || required.some((id) => !/^\d+$/.test(id)))
    eggActivityFailure();

  return !existing.length || required.some((id) => !existing.includes(id));
}
