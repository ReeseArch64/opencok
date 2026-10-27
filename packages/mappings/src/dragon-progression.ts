import { sfs, type Fields } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  dragonDefinition,
  dragonPower,
  dragonFeature,
  dragonJson,
  emptyDragonTravel,
} from "@opencok/rules/dragon-progression";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";

export function dragonSkillView(row: Row): Fields {
  const result: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    skillId: sfs.string(text(row, "skillId")),
    level: sfs.int(num(row, "level")),
    strengthenLevel: sfs.int(num(row, "strengthenLevel")),
    exp: sfs.int(num(row, "exp")),
    totalExp: sfs.int(num(row, "totalExp")),
  };

  if (num(row, "ownerId") !== 0) {
    result.ownerId = sfs.int(num(row, "ownerId"));
    result.index = sfs.int(num(row, "index1"));
  }

  return result;
}

export function dragonView(
  row: Row,
  skills: readonly Row[],
  rules: Rules,
  now: bigint,
  marching: boolean,
  effect: (id: number) => number,
  rewardItems?: ReturnType<typeof sfs.array>,
): Fields {
  const { base, level } = dragonDefinition(rules, row),
    global = rules.items.get("dragon_new")!;
  const hatch = long(row, "clickEggTime") + BigInt(cityInteger(base.hatch_time)) * 1000n;
  const result: Fields = {
    uuid: sfs.string(text(row, "uuid")),
    itemId: sfs.string(level.id!),
    dragonState: sfs.byte(num(row, "dragonState")),
    friendly: sfs.int(num(row, "friendly")),
    leftClickBubbleTimes: sfs.int(
      Math.max(0, cityInteger(global.k3) - num(row, "clickBubbleTimesForDay")),
    ),
    incubateEndTime: sfs.long(hatch),
    nextClickBubbleTime: sfs.long(
      num(row, "dragonState") === 3
        ? long(row, "lastClickBubbleTime") + BigInt(cityInteger(global.k2)) * 1000n
        : 0n,
    ),
    useFlag: sfs.byte(num(row, "useFlag")),
    exp: sfs.int(num(row, "exp")),
    power: sfs.long(dragonPower(row, rules)),
    skillInfo: sfs.string(
      skills
        .filter((skill) => num(skill, "ownerId") === num(row, "itemId"))
        .sort((a, b) => num(a, "index1") - num(b, "index1"))
        .map((skill) => text(skill, "uuid"))
        .join("|"),
    ),
  };

  if (row.nickName !== null && row.nickName !== undefined)
    {result.nickName = sfs.string(text(row, "nickName"));}

  if (dragonFeature(rules, "dragon_battle", now)) {result.inMarch = sfs.byte(marching ? 1 : 0);}

  if (dragonFeature(rules, "dragon_friendship", now)) {
    const timestamps = dragonJson(row.communicateData, {
      communicateTimestamps: {} as Record<string, number>,
    }).communicateTimestamps;
    result.nextFriendShipDecreaseTime = sfs.long(
      long(row, "friendShipDecreaseTime") +
        BigInt(cityInteger(level.friendship_decrease_time)) * 1000n,
    );
    result.communicateInfo = sfs.object({
      endTimeArray: sfs.array(
        Object.entries(timestamps).map(([kind, time]) => {
          const cd = Number(level.communicate_cooltime?.split("|")[Number(kind)] ?? 0);
          const reduced = Math.max(
            0,
            Math.trunc(
              Math.fround(cd) * Math.fround(1 - Math.max(effect(490 + Number(kind)) / 100, 0)),
            ),
          );

          return sfs.object({
            commType: sfs.int(Number(kind)),
            endTime: sfs.long(BigInt(time) + BigInt(reduced) * 1000n),
          });
        }),
      ),
    });
  }

  if (dragonFeature(rules, "dragon_travel", now)) {
    const travel = dragonJson(row.travelData, emptyDragonTravel);
    const travelRule = rules.advanced.dragonTravel?.get(String(travel.travelItemId));
    const view: Fields = {
      travelState: sfs.byte(travel.travelState),
      travelType: sfs.byte((level.travel?.split("|") ?? []).indexOf(String(travel.travelType)) + 1),
      travelEndTime: sfs.long(
        travel.travelState === 1
          ? BigInt(travel.travelStartTime) + BigInt(cityInteger(travelRule?.time)) * 1000n
          : 0n,
      ),
    };

    if (rewardItems) {view.rewardItems = rewardItems;}

    result.travelInfo = sfs.object(view);
  }

  return result;
}
