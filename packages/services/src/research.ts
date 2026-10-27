import { recordTargetTask } from "./target-task";
import { recordExpeditionScore } from "./new-expedition";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { randomUUID } from "node:crypto";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type {
  ActivityAction,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import type { ProgressionActivityData } from "@opencok/contracts/city-progression";
import { research, researchData } from "@opencok/mappings/research";
import {
  researchDefinition,
  checkResearchRequirements,
  researchCosts,
} from "@opencok/rules/research";
import {
  cityInteger,
  cityAmount,
  cityDuration,
  progressionActivityData,
} from "@opencok/rules/city-progression";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { CityProgressionContext, type CityDomain } from "./city-progression";

const commands = ["science.data.init", "science.research", "science.directly"];
function current(context: CityProgressionContext, itemId: string): Row {
  return (
    context.state.sciences.find((row) => row.itemId === itemId) ?? {
      uid: context.owner,
      itemId,
      level: 0,
      cd: idleDeadline,
    }
  );
}
function complete(context: CityProgressionContext, row: Row, data?: ProgressionActivityData) {
  const level = data?.target?.level ?? num(row, "level") + 1;
  if (level !== num(row, "level") + 1) throw new GameError(errors.invalid, "city_progression");
  const before = researchDefinition(context.rules, text(row, "itemId"), num(row, "level")),
    after = researchDefinition(context.rules, text(row, "itemId"), level);
  const completed = { ...row, level, cd: idleDeadline };
  context.write.sciences = [completed];
  if (!context.completing) recordTargetTask(context, 12, 1);
  const delta = cityAmount(after.power ?? 0) - cityAmount(before.power ?? 0);
  context.power(delta);
  context.recordHero(6, "2", delta);
  if (delta > 0n) recordExpeditionScore(context, 3, 2, cityInteger(delta));
  if (["army", "trap", "up"].includes(after.para1 ?? "")) {
    const id = cityInteger(after.para2),
      armyId = String(Math.trunc(id / 10) * 10),
      unlocked = after.para1 === "up" ? level : (id % 10) + 1;
    if (!context.rules.arms.has(armyId))
      throw new GameError(errors.unsupported, "city_progression");
    if (after.para1 === "trap") {
      const saved = context.state.forts.find((fort) => fort.armyId === armyId);
      context.write.forts = [
        {
          uid: context.owner,
          armyId,
          num: 0,
          build: 0,
          finishTime: 0n,
          ...saved,
          level: Math.max(num(saved ?? {}, "level"), unlocked),
        },
      ];
    } else {
      const saved = context.state.armies.find((army) => army.armyId === armyId);
      context.write.armies = [
        {
          uid: context.owner,
          armyId,
          free: 0,
          defence: 0,
          pve: 0,
          march: 0,
          train: 0,
          finishTime: 0n,
          foodCostTime: context.now,
          ...saved,
          level: Math.max(num(saved ?? {}, "level"), unlocked),
        },
      ];
    }
  }
  if (after.skill) {
    if (!["622800", "622900"].includes(after.skill) || !context.state.effects.generals.length)
      throw new GameError(errors.invalid, "city_progression");
    const saved = context.state.skills.find((skill) => skill.skillId === after.skill);
    context.write.skills = [
      {
        uuid: randomUUID(),
        ownerId: context.owner,
        skillId: after.skill,
        startTime: idleDeadline,
        endTime: idleDeadline,
        actTime: 0n,
        param1: 0,
        param2: 0,
        ...saved,
        stat: 0,
      },
    ];
  }
  const power =
    context.state.sciences.reduce(
      (sum, science) =>
        sum +
        cityAmount(
          researchDefinition(context.rules, text(science, "itemId"), num(science, "level")).power ??
            0,
        ),
      0n,
    ) +
    cityAmount(after.power ?? 0) -
    cityAmount(before.power ?? 0);
  return { ...research(completed, context.rules), sciencePower: sfs.int(cityInteger(power)) };
}
async function prepare(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  if (command === "science.data.init")
    return {
      event: null,
      response: encode({
        science: researchData(context.state.sciences, context.state.queues, context.rules),
      }),
    };
  const itemId = str(params, "itemId"),
    row = current(context, itemId),
    rule = researchDefinition(context.rules, itemId, num(row, "level"));
  const maximum = cityInteger(rule.max_lv, 0, 99);
  if (num(row, "level") >= maximum) throw new GameError(errors.researchMax, "city_progression");
  researchDefinition(context.rules, itemId, num(row, "level") + 1);
  if (
    context.state.queues.some((queue) => num(queue, "type") === 6 && queue.itemId === itemId) ||
    long(row, "cd") !== idleDeadline
  )
    throw new GameError(errors.occupied, "city_progression");
  const academy = context.state.buildings.find(
    (building) => num(building, "itemId") === 403000 && num(building, "level") > 0,
  );
  if (!academy) throw new GameError(errors.troopBuilding, "city_progression");
  context.idleBuilding(academy);
  checkResearchRequirements(context.state, context.rules, rule);
  const payment = int(params, "gold", 0);
  if (![0, 1].includes(payment)) throw new GameError(errors.invalid, "city_progression");
  const durationMs = cityDuration(
    cityInteger(rule.time_research ?? 0),
    context.effect(69) +
      context.generalEffect(69, 403000) +
      context.effect(303) +
      context.effect(2147) +
      context.effect(2191),
    context.effect(774) * 3600 + context.effect(2148),
  );
  const direct = command === "science.directly";
  context.checkPower(
    cityAmount(researchDefinition(context.rules, itemId, num(row, "level") + 1).power ?? 0) -
      cityAmount(rule.power ?? 0),
  );
  context.spend(researchCosts(rule, context.effect), direct || payment === 1);
  for (const pair of rule.science_point?.split("|").filter(Boolean) ?? []) {
    const [id, rawCount, ...extra] = pair.split(";");
    if (!id || extra.length) throw new GameError(errors.invalid, "city_progression");
    const count = Math.max(0, cityInteger(rawCount) - (id === "210090" ? context.effect(756) : 0));
    context.spendItem(id, cityInteger(Math.trunc(count)));
  }
  const data = context.data("research", {
    target: { level: num(row, "level") + 1, star: 0, progress: 0 },
  });
  const costItem = sfs.array(
    Object.keys(data.items).map((id) =>
      sfs.object({ itemId: sfs.string(id), count: sfs.int(context.economy.quantity?.(id) ?? 0) }),
    ),
  );
  if (direct) {
    context.accelerate(durationMs);
    return {
      response: encode({
        ...complete(context, row, data),
        resource: sfs.object(context.resource()),
        gold: sfs.long(context.balance("gold")),
        costItem,
      }),
    };
  }
  const pending = { ...row, cd: context.now + durationMs };
  context.write.sciences = [pending];
  return {
    type: 6,
    itemId,
    durationMs,
    data,
    responseKind: "nested",
    item: encode({ itemId: sfs.string(itemId) }),
    response: encode({
      costItem,
      resource: sfs.object(context.resource()),
      gold: sfs.long(context.balance("gold")),
    }),
  };
}
async function apply(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
) {
  const row = context.state.sciences.find((science) => science.itemId === activity.itemId),
    data = progressionActivityData(activity.data);
  if (!row || (data && data.kind !== "research"))
    throw new GameError(errors.queue, "city_progression");
  const queues = context.state.queues.filter(
    (queue) => num(queue, "type") === 6 && queue.itemId === activity.itemId,
  );
  if (queues.length !== 1 || queues[0]!.uuid !== activity.queueId)
    throw new GameError(errors.invalid, "city_progression");
  researchDefinition(context.rules, activity.itemId, num(row, "level") + 1);
  if (action === "start") throw new GameError(errors.invalid, "city_progression");
  if (action === "restore" || action === "reschedule") {
    context.write.sciences = [{ ...row, cd: activity.dueAt }];
    return research(row, context.rules, activity.dueAt);
  }
  if (action === "cancel") {
    context.refund(data);
    context.write.sciences = [{ ...row, cd: idleDeadline }];
    return { resource: sfs.object(context.resource()) };
  }
  return complete(context, row, data);
}
export const researchDomain: CityDomain = { commands, types: [6], prepare, apply };
