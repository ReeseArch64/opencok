import { randomInt } from "node:crypto";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import { encode, sfs, str, type Fields, type Value } from "@opencok/messages/sfs";
import {
  lotteryCondition,
  lotterySlots,
  lotteryFailure,
  lotteryResourceAmount,
} from "@opencok/rules/lottery";
import { chooseWeight } from "@opencok/rules/equipment";
import { cityInteger } from "@opencok/rules/city-progression";
import { lotteryInfo } from "@opencok/mappings/lottery";
import { equipment, equipmentItem } from "@opencok/mappings/equipment";
import type { Rule } from "@opencok/rules/game";
import {
  grantPinnedProgressionReward,
  pinProgressionReward,
  progressionRewardPreview,
} from "./progression-rewards";
import { refreshQuests } from "./quests";
import type { CityDomain, CityProgressionContext } from "./city-progression";

const resourceAssets = [
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "exp",
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "chip",
  "diamond",
] as const;
const number32 = (value: bigint) => Number(BigInt.asIntN(32, value));
const day = (at: bigint) => at / 86400000n;
const castleLevel = (context: CityProgressionContext) =>
  num(context.state.buildings.find((row) => num(row, "itemId") === 400000) ?? {}, "level");
function config(context: CityProgressionContext, id: string): Rule {
  const rule = context.rules.items.get(id);
  if (!rule) lotteryFailure();
  return rule;
}
function daily(context: CityProgressionContext, id: string) {
  const row = context.state.lottery?.history.find((row) => row.lotteryId === id);
  return row && day(long(row, "updateTime")) === day(context.now) ? num(row, "times") : 0;
}
function single(context: CityProgressionContext, id: string) {
  const raw = pinProgressionReward(context, id),
    rewards = progressionRewardPreview(raw);
  if (rewards.length !== 1) lotteryFailure();
  const reward = rewards[0]!;
  if (reward.kind === "item") return `${reward.id}:${reward.count}`;
  if (reward.kind === "count") return `${reward.type}:${reward.value}`;
  return lotteryFailure();
}
function outerGrid(context: CityProgressionContext, mode: string) {
  const rule = config(context, mode),
    level = castleLevel(context),
    base = config(context, "building_base");
  const resources = [
    0,
    3,
    ...(level >= cityInteger(base.k3) ? [2] : []),
    ...(level >= cityInteger(base.k4) ? [1] : []),
  ];
  return Array.from({ length: 9 }, (_, index) => {
    const [reward] = String(rule[`k${index + 1}`] ?? "").split("|");
    if (reward === "0") return `${resources[randomInt(resources.length)]}:0`;
    if (reward === "100") return "100:1";
    return single(context, reward ?? "");
  }).join("|");
}
function display(row: Row) {
  const values = text(row, "lotteryInfo2").split("|");
  if (values.length !== 9) lotteryFailure();
  for (let i = 0; i < values.length; i++) {
    const j = i + randomInt(values.length - i);
    [values[i], values[j]] = [values[j]!, values[i]!];
  }
  return values.join("|");
}
function pay(
  context: CityProgressionContext,
  asset: "chip" | "diamond",
  cost: number,
  useGold: boolean,
  factor: string | undefined,
) {
  const available = context.balance(asset),
    required = BigInt(cityInteger(cost)),
    spend = available < required ? available : required,
    deficit = required - spend;
  if (deficit) {
    const amount = Number(deficit) * Number(factor);
    if (!useGold || !Number.isFinite(amount) || amount <= 0) lotteryFailure();
    context.economy.gold(
      -BigInt(
        cityInteger(
          Math.ceil(Math.fround(Math.fround(Number(deficit)) * Math.fround(Number(factor)))),
          1,
        ),
      ),
    );
  }
  if (spend) context.economy.resource(asset, -spend);
}
function grant(context: CityProgressionContext, raw: string): Value[] {
  const rewards = progressionRewardPreview(raw),
    result: Value[] = [];
  for (const reward of rewards) {
    const before = context.write.equipment?.length ?? 0;
    const encoded =
      reward.kind === "item"
        ? `${reward.type === 7 ? "goods" : "equip"},${reward.id},${reward.count}`
        : reward.kind === "count" && resourceAssets[reward.type]
          ? `${resourceAssets[reward.type]},0,${reward.value}`
          : lotteryFailure();
    grantPinnedProgressionReward(context, encoded);
    if (reward.kind === "item") {
      result.push(
        sfs.object({
          type: sfs.int(reward.type),
          value:
            reward.type === 7
              ? sfs.object({
                  ...equipmentItem(
                    reward.id,
                    context.economy.quantity?.(reward.id) ?? 0,
                    context.economy.itemState?.(reward.id),
                    context.rules,
                  ),
                  rewardAdd: sfs.int(reward.count),
                })
              : sfs.array(
                  (context.write.equipment ?? [])
                    .slice(before)
                    .map((row) => sfs.object(equipment(row))),
                ),
        }),
      );
    } else if (reward.kind === "count") {
      const asset = resourceAssets[reward.type];
      result.push(
        sfs.object({
          type: sfs.int(reward.type),
          value: sfs.int(reward.value),
          ...(asset && asset !== "exp"
            ? {
                total: sfs.int(
                  number32(
                    context.balance(asset) +
                      (asset === "wood" || asset === "stone" || asset === "iron" || asset === "food"
                        ? context.balance(`${asset}bind`)
                        : 0n),
                  ),
                ),
              }
            : {}),
        }),
      );
    }
  }
  return result;
}
function innerGrant(context: CityProgressionContext, id: string, count: number) {
  cityInteger(count, 1);
  const n = cityInteger(id),
    asset = resourceAssets[n];
  const raw =
    n < 50
      ? asset
        ? `${asset},0,${count}`
        : lotteryFailure()
      : `${(n >= 1000000 && n <= 1999999) || (n >= 10000004 && n <= 10050555) ? "equip" : "goods"},${id},${count}`;
  return grant(context, raw)[0]!;
}
function chest(context: CityProgressionContext, row: Row): string {
  row.times4 = num(row, "times4") + 1;
  const first = config(context, "lottery_cost").k10?.split(";").filter(Boolean);
  let strategy: string;
  if (num(row, "times1") === 0 && first?.length) strategy = first[randomInt(first.length)]!;
  else {
    const choices = [1, 2, 3]
      .map((index) => config(context, "strategy_mode")[`k${index}`]?.split("|"))
      .filter((pair): pair is string[] => Boolean(pair));
    strategy =
      choices[
        chooseWeight(
          choices.map((pair) => cityInteger(pair[1])),
          randomInt,
        )
      ]![0]!;
  }
  const choices = [...(context.rules.advanced.lotteries?.values() ?? [])].filter(
    (rule) =>
      rule.strategy === strategy &&
      lotteryCondition(
        rule,
        castleLevel(context),
        num(context.state.profile, "level"),
        num(row, "times3"),
        num(row, "times4"),
        daily(context, rule.id ?? ""),
        context.now,
      ),
  );
  const selected =
    choices[
      chooseWeight(
        choices.map((rule) => {
          const probabilities = (rule.probability ?? "").split(";");
          return cityInteger(
            probabilities[Math.min(daily(context, rule.id ?? ""), probabilities.length - 1)],
          );
        }),
        randomInt,
      )
    ];
  if (!selected?.id) lotteryFailure();
  const used = new Set<number>(),
    slots: string[] = [];
  for (let i = 1; i <= 9; i++) {
    const group = (selected.pickmode ?? "")
      .split("|")
      .map((segment) => segment.split(";").map(Number))
      .find((group) => group.includes(i));
    const remaining = group?.filter((index) => !used.has(index));
    if (!remaining?.length) lotteryFailure();
    const position = remaining[randomInt(remaining.length)]!;
    used.add(position);
    const id = selected[`site${position}`];
    if (!id) lotteryFailure();
    slots.push(Number(id) >= 200 && Number(id) <= 205 ? `${id}:1` : single(context, id));
  }
  row.type = 2;
  row.lotteryId = selected.id;
  row.lotteryInfo2 = slots.join("|");
  const write = (context.write.lottery ??= { record: row });
  write.history = [
    {
      uid: context.owner,
      lotteryId: selected.id,
      times: daily(context, selected.id) + 1,
      updateTime: context.now,
    },
  ];
  return display(row);
}
function outer(context: CityProgressionContext, row: Row, superMode: boolean) {
  const first = num(row, "times1") === 0;
  if (superMode && num(row, "times1") < 5) lotteryFailure();
  const rule = config(context, superMode ? "super_lottery" : "normal_lottery"),
    costRule = config(context, "lottery_cost");
  const pairs = Array.from({ length: 9 }, (_, i) => String(rule[`k${i + 1}`] ?? "").split("|"));
  const index = first
    ? 8
    : chooseWeight(
        pairs.map((pair) => cityInteger(pair[1])),
        randomInt,
      );
  const id = first ? "100" : pairs[index]![0]!;
  let result: Fields = { rewardId: sfs.string(id) };
  if (id === "0") {
    const grid = lotterySlots(text(row, "lotteryInfo1").split(";")[superMode ? 1 : 0] ?? ""),
      type = Number(grid[index]!.id);
    const base = (
      { 0: costRule.k3, 3: costRule.k4, 2: costRule.k5, 1: costRule.k6 } as Record<
        number,
        string | undefined
      >
    )[type];
    if (!base) lotteryFailure();
    const spread = cityInteger(costRule.k8),
      value = lotteryResourceAmount(
        cityInteger(base),
        castleLevel(context),
        cityInteger(costRule.k7),
        spread,
        randomInt(spread * 2 + 1),
      );
    const reward = innerGrant(context, String(type), value);
    result = { ...result, ...(reward.value as Fields) };
  } else if (id !== "100")
    result.items = sfs.array(grant(context, pinProgressionReward(context, id)));
  return { id, result };
}
export const lotteryDomain: CityDomain = {
  commands: [
    "lottery.init",
    "lottery.start",
    "lottery.buy",
    "lottery.batch",
    "lottery.b.use",
    "lottery.cancel",
  ],
  types: [],
  async prepare(context, command, params) {
    if (command === "lottery.init" && !context.rules.advanced.lotteries?.size)
      return { response: encode({}), event: null };
    if (!context.state.lottery || !context.rules.advanced.lotteries?.size) lotteryFailure();
    const row: Row = {
      uid: context.owner,
      type: 1,
      superMode: 0,
      step: 0,
      times1: 0,
      times2: 0,
      multiple: 0,
      result: "",
      lotteryId: "",
      lotteryInfo1: "",
      lotteryInfo2: "",
      updateTime: 0n,
      times3: 0,
      times4: 0,
      boxTimes: 0,
      ...context.state.lottery.record,
    };
    context.write.lottery = { record: row };
    if (!text(row, "lotteryInfo1"))
      row.lotteryInfo1 = `${outerGrid(context, "normal_lottery")};${outerGrid(context, "super_lottery")}`;
    if (command === "lottery.init") {
      if (num(row, "step") >= 9) row.type = 1;
      return {
        response: encode({
          lottery: sfs.object(lotteryInfo(row, num(row, "type") === 2 ? display(row) : undefined)),
        }),
        event: null,
      };
    }
    if (command === "lottery.cancel") {
      row.type = 1;
      return { response: encode({}), event: null };
    }
    const cost = config(context, "lottery_cost"),
      cost2 = config(context, "lottery_cost2");
    const superMode = str(params, "super", "0") === "1",
      useGold = str(params, "useGold", "0") === "1";
    const newDay = day(context.now) !== day(long(row, "updateTime"));
    let body: Fields = {};
    if (command === "lottery.buy") {
      const price = newDay ? 0 : cityInteger(superMode ? cost.k2 : cost.k1);
      const deficit = BigInt(price) - context.balance("chip");
      if (deficit <= 0n) lotteryFailure();
      pay(context, "chip", price, true, cost2.k10);
      context.economy.resource("chip", BigInt(price));
      body = {
        gold: sfs.long(context.balance("gold")),
        chip: sfs.int(number32(context.balance("chip"))),
      };
    } else if (command === "lottery.b.use") {
      if (num(row, "type") === 2 || num(row, "boxTimes") < 1) lotteryFailure();
      body.lottery = sfs.string(chest(context, row));
      row.boxTimes = num(row, "boxTimes") - 1;
      row.step = 0;
      row.multiple = 0;
      row.result = "100";
      row.updateTime = context.now;
      body.boxTimes = sfs.int(num(row, "boxTimes"));
    } else if (command === "lottery.batch") {
      if (num(row, "type") === 2) lotteryFailure();
      const count = 10;
      pay(context, "chip", cityInteger(cost.k1) * (newDay ? count - 1 : count), false, cost2.k10);
      row.times3 = newDay ? count : num(row, "times3") + count;
      if (newDay) row.times4 = 0;
      const results: Value[] = [];
      for (let i = 0; i < count; i++) {
        const reward = outer(context, row, false);
        if (reward.id === "100") {
          row.boxTimes = num(row, "boxTimes") + 1;
          results.push(sfs.object({ type: sfs.int(1), result: sfs.object({ value: sfs.int(1) }) }));
        } else if (reward.id === "0") {
          const { rewardId: _, ...fields } = reward.result;
          fields.total = sfs.long(context.balance(resourceAssets[Number(fields.type!.value)]!));
          results.push(sfs.object({ type: sfs.int(0), result: sfs.object(fields) }));
        } else {
          const values = reward.result.items!.value as Value[];
          results.push(sfs.object({ type: sfs.int(2), result: values[0]! }));
        }
        row.times1 = num(row, "times1") + 1;
      }
      row.updateTime = context.now;
      body = {
        batchResult: sfs.array(results),
        boxTimes: sfs.int(num(row, "boxTimes")),
        chip: sfs.int(number32(context.balance("chip"))),
      };
      refreshQuests(context, { legacy: 9, daily: 34, main: 38, count });
    } else if (command === "lottery.start") {
      const type = str(params, "type");
      if (type !== "1" && type !== "2") lotteryFailure();
      const times = cityInteger(str(params, "times"));
      if (times !== num(row, type === "1" ? "times1" : "times2"))
        return {
          response: encode({
            [type === "1" ? "times1" : "times2"]: sfs.int(
              num(row, type === "1" ? "times1" : "times2"),
            ),
          }),
          event: null,
        };
      if (type === "1") {
        pay(
          context,
          "chip",
          newDay ? 0 : cityInteger(superMode ? cost.k2 : cost.k1),
          useGold,
          cost2.k10,
        );
        row.times3 = newDay ? 1 : num(row, "times3") + 1;
        if (newDay) row.times4 = 0;
        const reward = outer(context, row, superMode);
        row.type = 1;
        row.superMode = superMode ? 1 : 0;
        row.lotteryId = "";
        row.lotteryInfo2 = "";
        if (reward.id === "100") body.lottery = sfs.string(chest(context, row));
        row.times1 = num(row, "times1") + 1;
        row.step = 0;
        row.multiple = 0;
        row.result = reward.id;
        row.updateTime = context.now;
        body.rewards = sfs.object(reward.result);
      } else {
        if (num(row, "type") !== 2 || num(row, "step") >= 9) lotteryFailure();
        const position = cityInteger(str(params, "position"), 0, 8),
          step = num(row, "step") + 1;
        const previous = num(row, "step") === 0 ? [] : text(row, "result").split("|");
        if (previous.some((entry) => entry.split(":")[1] === String(position))) lotteryFailure();
        const slots = lotterySlots(text(row, "lotteryInfo2")),
          reward = slots[step - 1]!;
        pay(context, "diamond", cityInteger(cost2[`k${step}`]), useGold, cost2.k11);
        const multipliers: Record<string, number> = {
          200: 2,
          201: 3,
          202: 5,
          203: 10,
          204: 15,
          205: 20,
        };
        const multiple = multipliers[reward.id];
        let result: Fields = { rewardId: sfs.string(reward.id) };
        if (multiple) {
          row.multiple = num(row, "multiple") + multiple;
          result.multiple = sfs.int(1);
        } else {
          const multiplier = num(row, "multiple") || 1;
          result = {
            ...result,
            ...(innerGrant(context, reward.id, cityInteger(reward.count * multiplier, 1))
              .value as Fields),
            multiple: sfs.int(multiplier),
          };
          row.multiple = 0;
        }
        row.step = step;
        row.times2 = num(row, "times2") + 1;
        row.result = [...previous, `${step}:${position}`].join("|");
        body.rewards = sfs.object(result);
      }
      body.resource = sfs.object({
        [type === "1" ? "chip" : "diamond"]: sfs.int(
          number32(context.balance(type === "1" ? "chip" : "diamond")),
        ),
        ...(useGold ? { gold: sfs.long(context.balance("gold")) } : {}),
      });
      body.times1 = sfs.int(num(row, "times1"));
      body.times2 = sfs.int(num(row, "times2"));
      body.updatetime = sfs.long(long(row, "updateTime"));
      refreshQuests(context, { legacy: 9, daily: 34, main: 38, count: 1 });
    } else lotteryFailure();
    return { response: encode(body) };
  },
  async apply() {
    lotteryFailure();
  },
};
