import { createHash } from "node:crypto";
import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { expeditionRankingLimit } from "./expedition-ranking";
import type { Rules } from "./game";

export function expeditionAwardId(periodId: string, stage: number, owner: string, kind = "bundle") {
  return createHash("sha256")
    .update(JSON.stringify([periodId, stage, owner, kind]))
    .digest("hex")
    .slice(0, 32);
}

export function expeditionAwardOperation(id: string) {
  return `expedition-award:${id}`;
}

function rangeReward(value: string, rank: number) {
  let found: string | undefined;

  for (const entry of value.split("|").filter(Boolean)) {
    const match = /^(\d+)-(\d+);(\d+)$/.exec(entry);

    if (!match || Number(match[1]) > Number(match[2]))
      {throw new Error("Invalid expedition reward range");}

    if (rank >= Number(match[1]) && rank <= Number(match[2])) {
      if (found) {throw new Error("Ambiguous expedition reward range");}

      found = match[3];
    }
  }

  return found;
}

export function expeditionStagePrizes(
  closure: Row,
  member: Row,
  standing: Row | undefined,
  rules: Rules,
) {
  const stage = cityInteger(closure.stage, 2, 8),
    definition = [...(rules.advanced.expeditionStages?.values() ?? [])].find(
      (row) => Number(row.stage) === stage,
    );

  if (!definition) {throw new Error("Missing expedition stage reward definition");}

  const plans: { kind: string; reward: string; template: string; parameters: string[] }[] = [],
    claims: number[] = [];

  if (!member.eligibility) {return { plans, claims };}

  const eligibility: unknown = JSON.parse(text(member, "eligibility"));

  if (
    !eligibility ||
    typeof eligibility !== "object" ||
    !("home" in eligibility) ||
    typeof eligibility.home !== "boolean" ||
    !("level" in eligibility) ||
    !("sciences" in eligibility) ||
    !Array.isArray(eligibility.sciences) ||
    eligibility.sciences.length > 8192 ||
    eligibility.sciences.some((id) => typeof id !== "string" || id.length > 20)
  )
    {throw new Error("Invalid expedition reward eligibility");}

  if (!eligibility.home) {return { plans, claims };}

  const level = cityInteger(eligibility.level, 0, 4095),
    sciences = new Set(eligibility.sciences as string[]),
    score = num(member, "score"),
    taken = new Set(text(member, "takeReward").split("|").filter(Boolean).map(Number));

  if (
    text(member, "takeReward")
      .split("|")
      .filter(Boolean)
      .some((id) => !/^\d{1,9}$/.test(id))
  )
    {throw new Error("Invalid sealed expedition claim flags");}

  if (!Number.isFinite(score) || score < 0)
    {throw new Error("Invalid sealed expedition reward score");}

  const rank = num(standing ?? {}, "rank");

  if (
    !Number.isInteger(rank) ||
    rank < 0 ||
    !Number.isFinite(num(standing ?? {}, "allianceScore")) ||
    num(standing ?? {}, "allianceScore") < 0
  )
    {throw new Error("Invalid sealed expedition standing");}

  if (score > 0 && rank > 0 && rank <= expeditionRankingLimit(rules) + 1) {
    const reward = rangeReward(definition.rankreward ?? "", rank);

    if (reward)
      {plans.push({
        kind: "rank",
        reward,
        template: "12057",
        parameters: [String(Math.min(2147483647, Math.floor(score))), String(rank)],
      });}
  }

  const threshold = cityInteger(rules.items.get("17_wk")?.k1),
    kingdomThreshold = Number(rules.items.get("17_wk")?.k2);

  if (!Number.isFinite(kingdomThreshold) || kingdomThreshold < 0)
    {throw new Error("Invalid expedition kingdom reward threshold");}

  for (const rule of rules.advanced.expeditionRewards?.values() ?? []) {
    const id = cityInteger(rule.id, 1),
      type = cityInteger(rule.type, 1, 2);

    if (
      Number(rule.stage) !== stage ||
      taken.has(id) ||
      level < Number(rule.castle_min) ||
      level > Number(rule.castle_max) ||
      score <= (type === 1 ? 0 : threshold) ||
      (type === 2 && !text(member, "allianceId")) ||
      (type === 1 ? score : num(standing ?? {}, "allianceScore")) < Number(rule.target) ||
      (rule.science_quest && !sciences.has(rule.science_quest))
    )
      {continue;}

    if (!rule.reward) {throw new Error("Missing expedition target reward");}

    claims.push(id);
    plans.push({
      kind: `target:${id}`,
      reward: rule.reward,
      template: type === 1 ? "12055" : "12056",
      parameters: [],
    });
    const double = rules.items.get("17_wk")?.k12;

    if (type === 1 && double && sciences.has(double))
      {plans.push({ kind: `double:${id}`, reward: rule.reward, template: "12076", parameters: [] });}
  }

  if (num(closure, "winner") === rules.kingdomId && score >= kingdomThreshold) {
    const reward = rangeReward(definition.statereward ?? "", level);

    if (reward)
      {plans.push({
        kind: "kingdom",
        reward,
        template: "12061",
        parameters: [String(stage), String(kingdomThreshold)],
      });}
  }

  if (plans.length > 128 || [...taken, ...claims].join("|").length > 500)
    {throw new Error("Expedition reward population bound exceeded");}

  return { plans, claims };
}
