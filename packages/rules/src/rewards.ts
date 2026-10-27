import type { RewardPreview, RewardRandom } from "@opencok/contracts/rewards";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rule, Rules } from "./game.ts";
import type { RuleContext } from "./availability.ts";
import { serverFeature } from "./power-context.ts";
import { hashOrder } from "./power-hash-order.ts";

const resourceTypes = [
  ["exp", 6],
  ["wood", 0],
  ["food", 3],
  ["iron", 2],
  ["stone", 1],
  ["silver", 4],
  ["gold", 5],
  ["crystal", 19],
  ["sandstone", 22],
  ["diamondstone", 23],
  ["marble", 24],
  ["granite", 25],
  ["limestone", 26],
  ["power", 9],
  ["honor", 10],
  ["alliance_point", 11],
  ["casino", 12],
  ["gold_casino", 13],
] as const;

function invalid(): never {
  throw new GameError(errors.unsupported, "reward_preview");
}

function integer(raw: unknown): number {
  if (!/^[+-]?\d+$/.test(String(raw))) return invalid();

  const result = Number(raw);

  if (!Number.isInteger(result) || result < -2147483648 || result > 2147483647) return invalid();

  return result;
}

function split(raw: string | undefined, separator: string): string[] {
  return raw?.split(separator).filter((part) => part !== "") ?? [];
}

function roundedFloat(value: number): number {
  return Math.min(2147483647, Math.max(-2147483648, Math.ceil(Math.fround(value))));
}

function select(rate: string, random: RewardRandom): number {
  const weights = split(rate, ";").map(integer);
  const total = weights.reduce((sum, weight) => (sum + weight) | 0, 0);

  if (total <= 0) return invalid();

  let draw = random(total);

  if (!Number.isInteger(draw) || draw < 0 || draw >= total) return invalid();

  for (let index = 0; index < weights.length; index++) {
    if (draw < weights[index]!) return index;

    draw = (draw - weights[index]!) | 0;
  }

  return 0;
}

function randomItems(rule: Rule, random: RewardRandom): Map<string, number> {
  const result = new Map<string, number>();

  if (rule.rate === undefined) return result;

  const groups = split(rule.item, "|");
  const counts = split(rule.num, "|");
  const circles = split(rule.circle, "|");

  for (const [index, rate] of split(rule.rate, "|").entries()) {
    if (groups[index] === undefined || counts[index] === undefined || circles[index] === undefined)
      return invalid();

    const items = split(groups[index], ";");
    const amounts = split(counts[index], ";");
    const guaranteed = !rate.includes(";") && integer(rate) === 100;
    const loops = integer(circles[index]);
    const iterations = guaranteed ? loops : roundedFloat(loops);

    for (let attempt = 0; attempt < iterations; attempt++) {
      const choice = select(rate, random);
      const id = items[choice];

      if (id === undefined || amounts[choice] === undefined || !id.trim()) continue;

      const count = integer(amounts[choice]);
      const amount = guaranteed ? roundedFloat(count) : count;
      result.set(id, ((result.get(id) ?? 0) + amount) | 0);
    }
  }

  return result;
}

export function previewRewards(
  rewardId: string | undefined,
  rules: Rules,
  context: RuleContext,
  random: RewardRandom,
  rewardRule?: Rule,
): readonly RewardPreview[] {
  if (context.kingdomId !== rules.kingdomId) return invalid();

  const rule = rewardRule ?? rules.reconnect.rewards?.get(rewardId ?? "") ?? {};
  const result: RewardPreview[] = [];
  const add = (key: string, type: number) => {
    if (rule[key] === undefined) return;

    const value = integer(rule[key]);

    if (value > 0) result.push({ kind: "count", type, value });
  };

  for (const [key, type] of resourceTypes) add(key, type);

  if (rule.item !== undefined) {
    const items = randomItems(rule, random);
    const order = rule.item.includes(";") ? hashOrder(items.keys()) : split(rule.item, "|");

    for (const id of order) {
      const count = items.get(id);

      if (count === undefined) continue;

      const item = integer(id);

      if (item < 50) {
        if (item >= 0 && item <= 34) result.push({ kind: "count", type: item, value: count });
      } else {
        const equipment =
          (item >= 1000000 && item <= 1999999) || (item >= 10000004 && item <= 10050555);
        result.push({ kind: "item", type: equipment ? 14 : 7, id, count });
      }
    }
  }

  add("wbskill", 18);

  if (serverFeature(rules, "wr_switch", context)) {
    add("military", 21);
    add("milhonor", 27);
  }

  if (rule.prestige?.trim()) {
    const prestige = new Map<number, number>();

    for (const segment of split(rule.prestige, "|")) {
      const pair = split(segment, ";");

      if (pair.length === 2) prestige.set(integer(pair[0]), integer(pair[1]));
    }

    for (const civilization of hashOrder(prestige.keys()))
      result.push({
        kind: "prestige",
        type: 31,
        currentCivilization: civilization === 0,
        value: prestige.get(civilization)!,
      });
  }

  if (result.length > 32767) return invalid();

  return result;
}
