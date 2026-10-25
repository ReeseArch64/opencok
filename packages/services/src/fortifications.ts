import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, str, int, encode, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import type {
  ActivityAction,
  PreparedActivity,
  TimedActivity,
} from "@opencok/contracts/timed-activity";
import {
  cityInteger,
  cityDuration,
  progressionActivityData,
} from "@opencok/rules/city-progression";
import {
  troopDefinition,
  troopQueueType,
  troopBuilding,
  unitPower,
  troopCosts,
  totalBuildingParameter,
  transferTroops,
} from "@opencok/rules/military";
import { idleDeadline } from "@opencok/rules/timed-activity";
import { CityProgressionContext, type CityDomain } from "./city-progression";
import { militaryBoolean } from "./training";

export function fortificationCapacity(context: CityProgressionContext) {
  return cityInteger(
    Math.max(
      0,
      totalBuildingParameter(context.state, context.rules, 419000, 0) + context.effect(88),
    ),
  );
}
function complete(context: CityProgressionContext, row: Row, count: number) {
  if (count <= 0 || num(row, "build") !== count)
    throw new GameError(errors.invalid, "city_progression");
  const [, free] = transferTroops(count, num(row, "num"), count);
  context.write.forts = [{ ...row, num: free, build: 0, finishTime: 0n }];
  context.power(unitPower(troopDefinition(context.rules, text(row, "armyId")), count));
  return { armyId: sfs.string(text(row, "armyId")), free: sfs.int(free) };
}
async function prepare(
  context: CityProgressionContext,
  command: string,
  params: Fields,
): Promise<PreparedActivity> {
  const armyId = str(params, "id"),
    rule = troopDefinition(context.rules, armyId);
  if (troopQueueType(rule) !== 2) throw new GameError(errors.invalid, "city_progression");
  const count = cityInteger(
    int(params, "num"),
    command === "fort.destory" || command === "fort.destroy" ? 0 : 1,
  );
  const row = context.state.forts.find((fort) => fort.armyId === armyId) ?? {
    uid: context.owner,
    armyId,
    level: 1,
    num: 0,
    build: 0,
    finishTime: 0n,
  };
  if (command === "fort.destory" || command === "fort.destroy") {
    const [free] = transferTroops(num(row, "num"), 0, count);
    context.write.forts = [{ ...row, num: free }];
    context.power(-unitPower(rule, count));
    return { response: encode({ id: sfs.string(armyId), free: sfs.int(free) }) };
  }
  const building = troopBuilding(context.state, rule);
  context.checkPower(unitPower(rule, count));
  const reserved = context.state.forts.reduce(
    (sum, fort) =>
      sum + BigInt(cityInteger(num(fort, "num"))) + BigInt(cityInteger(num(fort, "build"))),
    0n,
  );
  if (reserved + BigInt(count) > BigInt(fortificationCapacity(context)))
    throw new GameError(errors.fortCapacity, "fortification_capacity");
  if (
    num(row, "build") !== 0 ||
    context.state.queues.some((queue) => num(queue, "type") === 2 && text(queue, "itemId"))
  )
    throw new GameError(errors.occupied, "city_progression");
  if (
    !context.state.queues.some(
      (queue) =>
        num(queue, "type") === 2 &&
        long(queue, "updateTime") === idleDeadline &&
        long(queue, "endTime") >= context.now,
    )
  )
    throw new GameError(errors.full, "city_progression");
  const durationMs = cityDuration(
    (cityInteger(rule.time) * count) /
      (1 + totalBuildingParameter(context.state, context.rules, 416000, 1) / 100),
    context.effect(67) + context.generalEffect(67, num(building, "itemId")),
  );
  const direct = command === "fort.cd",
    purchase = direct ? Object.hasOwn(params, "max") : militaryBoolean(params, "gold");
  context.spend(troopCosts(rule, count), purchase);
  if (direct) context.accelerate(durationMs);
  context.write.forts = [
    { ...row, build: count, finishTime: direct ? context.now : context.now + durationMs },
  ];
  return {
    type: 2,
    itemId: armyId,
    durationMs: direct ? 0n : durationMs,
    ready: direct,
    responseKind: "nested",
    data: context.data("fort", { units: { [armyId]: count } }),
    item: encode({ itemId: sfs.string(armyId) }),
    response: encode({
      resource: sfs.object(context.resource()),
      ...(purchase || direct ? { gold: sfs.long(context.balance("gold")) } : {}),
    }),
  };
}
async function apply(
  context: CityProgressionContext,
  action: ActivityAction,
  activity: TimedActivity,
): Promise<Fields> {
  const row = context.state.forts.find((fort) => fort.armyId === activity.itemId),
    data = progressionActivityData(activity.data),
    saved = context.state.queues.find((queue) => queue.uuid === activity.queueId);
  if (
    !row ||
    !saved ||
    saved.itemId !== activity.itemId ||
    num(row, "build") <= 0 ||
    long(row, "finishTime") !== long(saved, "updateTime") ||
    (data && (data.kind !== "fort" || data.units?.[activity.itemId] !== num(row, "build")))
  )
    throw new GameError(errors.queue, "city_progression");
  if (troopQueueType(troopDefinition(context.rules, activity.itemId)) !== 2 || action === "start")
    throw new GameError(errors.invalid, "city_progression");
  if (action === "restore" || action === "reschedule") {
    context.write.forts = [{ ...row, finishTime: activity.dueAt }];
    return { itemId: sfs.string(activity.itemId) };
  }
  if (action === "cancel") {
    context.refund(data);
    context.write.forts = [{ ...row, build: 0, finishTime: 0n }];
    return { resource: sfs.object(context.resource()) };
  }
  return complete(context, row, num(row, "build"));
}
export const fortificationDomain: CityDomain = {
  commands: ["fort.build", "fort.cd", "fort.destory", "fort.destroy"],
  types: [2],
  prepare,
  apply,
};
