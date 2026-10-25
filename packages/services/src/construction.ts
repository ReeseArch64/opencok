import { randomInt, randomUUID } from "node:crypto";
import type { ProgressionActivityData } from "@opencok/contracts/city-progression";
import type {
  PreparedActivity,
  TimedActivity,
  ActivityAction,
} from "@opencok/contracts/timed-activity";
import type { Row } from "@opencok/contracts/rows";
import { text, num, long } from "@opencok/contracts/rows";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { building } from "@opencok/mappings/city";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { buildingDisplayParameters } from "@opencok/mappings/building";
import { previewRewards } from "@opencok/rules/rewards";
import {
  cityInteger,
  checkCityPosition,
  checkCityBuildingRequirements,
  cityDuration,
  reducedCityCost,
  cityQueueType,
  cityUnlockCount,
  progressionActivityData,
  cityAssets,
} from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { cityCommands } from "@opencok/rules/city-command";
import { CityProgressionContext, type CityDomain } from "./city-progression";

function definition(context: CityProgressionContext, row: Row) {
  return context.rules.building(
    text(row, "itemId"),
    num(row, "level"),
    num(row, "star"),
    num(row, "progress"),
  );
}
function history(context: CityProgressionContext) {
  let total = 0n;
  for (const row of context.state.buildings) total += buildingExperience(context, row);
  return {
    currentMax:
      context.state.buildingExperience.currentMax === undefined
        ? total
        : long(context.state.buildingExperience, "currentMax"),
    historyMax:
      context.state.buildingExperience.historyMax === undefined
        ? total
        : long(context.state.buildingExperience, "historyMax"),
  };
}
function buildingExperience(context: CityProgressionContext, row: Row) {
  let total = 0n;
  for (let level = 0; level < num(row, "level"); level++)
    total += BigInt(context.rules.building(text(row, "itemId"), level).experience ?? 0);
  if (num(row, "level") === 30)
    for (let star = 0; star <= num(row, "star"); star++) {
      const rule = context.rules.building(text(row, "itemId"), 30, star);
      for (const step of rule.upgrades?.experience ?? [])
        if (star < num(row, "star") || step.progress <= num(row, "progress"))
          total += BigInt(step.value);
    }
  return total;
}
function makeDomainQueue(context: CityProgressionContext, row: Row) {
  const type = cityQueueType(num(row, "itemId"));
  if (
    type === undefined ||
    context.state.queues.some((queue) => num(queue, "type") === type && num(queue, "qid") === 1)
  )
    return;
  context.write.queues = [
    {
      uuid: randomUUID(),
      ownerId: context.owner,
      type,
      qid: 1,
      itemId: "",
      startTime: idleDeadline,
      endTime: idleDeadline,
      updateTime: idleDeadline,
      totalTime: 0n,
      para: 0,
      isHelped: 0,
    },
  ];
}
function complete(
  context: CityProgressionContext,
  row: Row,
  data: ProgressionActivityData | undefined,
): Fields {
  const current = definition(context, row);
  const next =
    data?.target ??
    (() => {
      const rule = context.rules.nextBuilding(
        text(row, "itemId"),
        num(row, "level"),
        num(row, "star"),
        num(row, "progress"),
        Number(context.now),
      );
      return { level: rule.level, star: rule.starLevel, progress: rule.starProgress };
    })();
  const completed = {
    ...row,
    ...next,
    opType: 0,
    unlockFlag: 0,
    costUnlockTimes: next.progress === 0 ? 0 : num(row, "costUnlockTimes"),
    refreshTime: num(row, "level") === 0 ? context.now : long(row, "refreshTime"),
    updateTime: context.now,
    reward: num(row, "itemId") === 400000 ? 1 : 0,
  };
  const after = definition(context, completed);
  const addedPower = BigInt(after.power ?? 0) - BigInt(current.power ?? 0);
  context.power(addedPower, addedPower);
  const previous = history(context),
    earned = BigInt(current.experience ?? 0),
    currentMax = previous.currentMax + earned;
  const experience = currentMax > previous.historyMax ? currentMax - previous.historyMax : 0n;
  context.write.buildingExperience = {
    currentMax,
    historyMax: currentMax > previous.historyMax ? currentMax : previous.historyMax,
  };
  if (experience) context.experience(cityInteger(experience));
  context.write.buildings = [completed];
  makeDomainQueue(context, completed);
  return {
    ...building(completed, context.rules, false, Number(context.now)),
    updateTime: sfs.long(context.now),
    remainGold: sfs.long(context.balance("gold")),
  };
}
function noAssociatedActivity(context: CityProgressionContext, row: Row) {
  const type = cityQueueType(num(row, "itemId"));
  if (
    type !== undefined &&
    context.state.queues.some((queue) => num(queue, "type") === type && text(queue, "itemId"))
  )
    throw new Error("Building has an active domain queue");
}
async function prepare(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  if (command === "buildingUnlock") {
    const request = str(params, "M__REQUEST_ID__H");
    if (request !== "info" && request !== "glory")
      throw new Error("Unknown building unlock request");
    command = `buildingUnlock.${request}`;
  }
  if (command === "miracle.unlock") {
    const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
    if (!castle || num(castle, "level") < 30) throw new Error("Castle level 30 required");
    if (context.state.buildings.some((row) => num(row, "itemId") === 422000))
      throw new Error("Miracle already unlocked");
    const position = context.rules.positions.get("9955");
    if (
      !position?.building ||
      !position.position ||
      context.state.buildings.some((row) => num(row, "pos") === Number(position.position))
    )
      throw new Error("Miracle position unavailable");
    const row: Row = {
      uuid: randomUUID(),
      uid: context.owner,
      itemId: cityInteger(position.building),
      pos: cityInteger(position.position),
      level: 30,
      star: 0,
      progress: 0,
      opType: 0,
      refreshTime: context.now,
      reward: 0,
      unlockFlag: 0,
    };
    context.write.buildings = [row];
    const power = BigInt(definition(context, row).power ?? 0);
    context.power(power, power);
    return { response: encode(building(row, context.rules, false, Number(context.now))) };
  }
  if (command === "build.move") {
    const pos1 = cityInteger(int(params, "pos1")),
      pos2 = cityInteger(int(params, "pos2"));
    if (pos1 === pos2) throw new Error("Building positions are identical");
    const from = context.state.buildings.find((row) => num(row, "pos") === pos1),
      to = context.state.buildings.find((row) => num(row, "pos") === pos2);
    if (!from) throw new Error("Building position is empty");
    context.idleBuilding(from);
    checkCityPosition(context.state, context.rules, pos2, text(from, "itemId"));
    if (to) {
      context.idleBuilding(to);
      checkCityPosition(context.state, context.rules, pos1, text(to, "itemId"));
    }
    const payment = int(params, "gold", 0);
    if (![0, 1].includes(payment)) throw new Error("Invalid building move payment");
    context.spendItem("200032", 1, payment === 1);
    context.write.buildings = [{ ...from, pos: pos2 }, ...(to ? [{ ...to, pos: pos1 }] : [])];
    return {
      response: encode({
        count: sfs.int(context.economy.quantity?.("200032") ?? 0),
        remainGold: sfs.long(context.balance("gold")),
      }),
    };
  }
  if (command === "buildingUnlock.info")
    return {
      response: encode({
        count: sfs.long(
          cityUnlockCount(context.state, context.rules, cityInteger(int(params, "type"))),
        ),
      }),
    };
  if (command === "buildingUnlock.glory") {
    const row = context.ownBuilding(str(params, "uuid"));
    context.idleBuilding(row);
    const rule = definition(context, row),
      conditions = rule.unlockConditions ?? [];
    if (!conditions.length || num(row, "unlockFlag") !== 0)
      throw new Error("Building cannot be unlocked");
    const allowed = conditions.every(
      (condition) =>
        cityUnlockCount(context.state, context.rules, condition.code) >=
        BigInt(condition.value ?? 0),
    );
    if (!allowed) {
      if (int(params, "cost", 0) !== 1 || !rule.unlockPayment)
        throw new Error("Building unlock prerequisite not met");
      const payment = rule.unlockPayment;
      if (payment.paymentId <= 1)
        context.economy.gold(
          -payment.amount * BigInt(payment.paymentId === 1 ? num(row, "costUnlockTimes") + 1 : 1),
        );
      else context.spendItem(String(payment.paymentId), cityInteger(payment.amount));
    }
    const updated = {
      ...row,
      unlockFlag: 1,
      costUnlockTimes: num(row, "costUnlockTimes") + (allowed ? 0 : 1),
    };
    context.write.buildings = [updated];
    return {
      response: encode({
        ...building(updated, context.rules, false, Number(context.now)),
        remainGold: sfs.long(context.balance("gold")),
      }),
    };
  }
  if (command === "building.reward") {
    const row = context.state.buildings.find((value) => num(value, "itemId") === 400000);
    if (!row || num(row, "reward") !== 1) throw new Error("Building reward already claimed");
    const rewardId = buildingDisplayParameters(definition(context, row))[3];
    if (!rewardId || !context.rules.reconnect.rewards?.has(rewardId))
      throw new Error("Missing building reward definition");
    const rewards = previewRewards(
      rewardId,
      context.rules,
      { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
      randomInt,
    );
    for (const reward of rewards) {
      if (reward.kind === "item" && reward.type === 7)
        context.economy.item(reward.id, cityInteger(reward.count, 1));
      else if (reward.kind === "count" && reward.type === 5)
        context.economy.gold(BigInt(cityInteger(reward.value)));
      else if (reward.kind === "count" && reward.type === 6)
        context.experience(cityInteger(reward.value));
      else if (reward.kind === "count" && reward.type >= 0 && reward.type <= 4)
        context.economy.resource(cityAssets[reward.type]!, BigInt(cityInteger(reward.value)));
      else throw new Error("Unsupported building reward asset");
    }
    context.write.buildings = [{ ...row, reward: 0 }];
    return { response: encode({ reward: rewardPreviewArray(rewards) }) };
  }
  const creating = command === "build.create";
  const row: Row = creating
    ? {
        uuid: randomUUID(),
        uid: context.owner,
        itemId: cityInteger(str(params, "itemId")),
        pos: cityInteger(int(params, "pos")),
        level: 0,
        star: 0,
        progress: 0,
        opType: 0,
        refreshTime: context.now,
        updateTime: 0n,
        reward: 0,
        effectTime: 0n,
        unlockFlag: 0,
        costUnlockTimes: 0,
        putId: "",
      }
    : context.ownBuilding(str(params, "uuid"));
  context.idleBuilding(row);
  const current = definition(context, row);
  if (creating) {
    checkCityPosition(context.state, context.rules, num(row, "pos"), text(row, "itemId"));
    if (context.state.buildings.some((building) => num(building, "pos") === num(row, "pos")))
      throw new Error("Building position occupied");
    if (
      context.state.buildings.length >= 256 ||
      (current.maxInstances &&
        context.state.buildings.filter((building) => building.itemId === row.itemId).length >=
          current.maxInstances)
    )
      throw new Error("Building instance limit reached");
  } else noAssociatedActivity(context, row);
  if (command === "build.destroy") {
    if (current.maxInstances === 1 || num(row, "level") === 0)
      throw new Error("Building cannot be destroyed");
    const durationMs = BigInt(cityInteger(current.demolitionSeconds ?? 0, 1)) * 1000n;
    context.write.buildings = [{ ...row, opType: 2 }];
    return {
      type: 0,
      itemId: text(row, "uuid"),
      durationMs,
      data: context.data("destroy"),
      response: encode({}),
    };
  }
  checkCityBuildingRequirements(context.state, current, context.rules);
  if (
    (current.unlockConditions?.length ?? 0) > 0 &&
    num(row, "star") > 0 &&
    num(row, "unlockFlag") !== 1
  )
    throw new Error("Building glory progress locked");
  const next = context.rules.nextBuilding(
    text(row, "itemId"),
    num(row, "level"),
    num(row, "star"),
    num(row, "progress"),
    Number(context.now),
  );
  if (
    next.level === num(row, "level") &&
    next.starLevel === num(row, "star") &&
    next.starProgress === num(row, "progress")
  )
    throw new Error("Maximum building level reached");
  const payment = int(params, "gold", 0);
  if (![0, 1, 2].includes(payment)) throw new Error("Invalid building payment");
  const reduction =
    context.effect(num(row, "level") < 19 ? 772 : num(row, "level") < 30 ? 2078 : 773) * 3600 +
    context.effect(2145);
  const durationMs = cityDuration(
    current.constructionSeconds ?? 0,
    context.effect(68) +
      context.generalEffect(68, num(row, "itemId"), text(row, "uuid")) +
      context.effect(302) +
      context.effect(2144) +
      context.effect(2190),
    reduction,
  );
  const costs: Partial<Record<(typeof cityAssets)[number], bigint>> = {};
  for (const asset of cityAssets)
    costs[asset] = reducedCityCost(
      current.costs?.[asset] ?? 0n,
      asset === "silver"
        ? 0
        : context.effect(({ wood: 752, food: 753, iron: 754, stone: 755 } as const)[asset]),
      context.effect(454) + context.effect(2143),
    );
  context.spend(costs, payment !== 0);
  for (const item of current.requiredItems ?? [])
    context.spendItem(
      String(item.itemId),
      cityInteger(item.quantity ?? 1n),
      payment !== 0 && item.itemId !== 200065,
    );
  const data = context.data("upgrade", {
    target: { level: next.level, star: next.starLevel, progress: next.starProgress },
  });
  if (payment === 1) {
    context.accelerate(durationMs);
    return { response: encode(complete(context, row, data)) };
  }
  const pending = { ...row, opType: 1 };
  context.write.buildings = [pending];
  makeDomainQueue(context, pending);
  return {
    type: 0,
    itemId: text(row, "uuid"),
    durationMs,
    data,
    response: encode(building(pending, context.rules, true, Number(context.now))),
    responseKind: "queue",
  };
}
async function apply(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
): Promise<Fields> {
  const row = context.ownBuilding(activity.itemId),
    data = progressionActivityData(activity.data);
  if (num(row, "opType") !== 1 && num(row, "opType") !== 2)
    throw new Error("Building has no pending operation");
  if (data && data.kind !== (num(row, "opType") === 1 ? "upgrade" : "destroy"))
    throw new Error("Building activity mismatch");
  if (action === "start") throw new Error("Construction requires its domain command");
  if (action === "restore" || action === "reschedule")
    return building(row, context.rules, num(row, "opType") === 1, Number(context.now));
  if (action === "cancel") {
    if (num(row, "opType") === 1) context.refund(data);
    if (num(row, "level") === 0) context.write.deletedBuildings = [text(row, "uuid")];
    else context.write.buildings = [{ ...row, opType: 0 }];
    return { goods: sfs.array([]), resource: sfs.object(context.resource()) };
  }
  if (num(row, "opType") === 1) return complete(context, row, data);
  const power = BigInt(definition(context, row).power ?? 0);
  context.power(-power, -power);
  const previous = history(context);
  context.write.buildingExperience = {
    ...previous,
    currentMax:
      previous.currentMax > buildingExperience(context, row)
        ? previous.currentMax - buildingExperience(context, row)
        : 0n,
  };
  context.write.deletedBuildings = [text(row, "uuid")];
  return { uuid: sfs.string(text(row, "uuid")), opType: sfs.int(2) };
}
export const constructionDomain: CityDomain = {
  commands: cityCommands,
  types: [0],
  prepare,
  apply,
};
