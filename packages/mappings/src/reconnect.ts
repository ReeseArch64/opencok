import { signed } from "@opencok/mappings/reconnect-values";
import { invalid } from "@opencok/mappings/reconnect-values";
import {
  reconnectQueuesSchema,
  reconnectResourcesSchema,
  reconnectTasksSchema,
  reconnectTaskSchema,
} from "@opencok/validations/reconnect";
import { validateValue } from "./validation.ts";
import { building, queue } from "./city.ts";
import type { Rules } from "@opencok/rules/game";
import { mailBlank } from "@opencok/rules/mail";
import { text } from "@opencok/contracts/rows";
import type { ReconnectTask, ReconnectTaskPlan } from "@opencok/contracts/reconnect";
import type { RewardRandom } from "@opencok/contracts/rewards";
import type { RuleContext } from "@opencok/rules/availability";
import { visibleReconnectTasks } from "@opencok/rules/reconnect-tasks";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "./rewards.ts";
import { validateFields } from "./validation.ts";
import {
  reconnectBalancesSchema,
  reconnectArmySchema,
  reconnectArmiesSchema,
  reconnectMineSchema,
} from "@opencok/validations/reconnect";
import type { Row } from "@opencok/contracts/rows";

import { sfs, type Fields } from "@opencok/messages/sfs";
import type { FriendshipMineView } from "@opencok/contracts/reconnect";

function serializeReconnectBalances(profile: Row): Fields {
  const free = signed(profile.gold, 64);
  const paid = signed(profile.paidGold, 64);
  const special = signed(profile.paidSpecialGold, 64);

  return {
    gold: sfs.long(BigInt.asIntN(64, free + paid + special)),
    dmmGold: sfs.long(signed(profile.dmmGold, 64)),
    dmmPaidGold: sfs.long(signed(profile.dmmPaidGold, 64)),
    dmmPaidSpecialGold: sfs.long(signed(profile.dmmPaidSpecialGold, 64)),
    freeGold: sfs.long(free),
    paidGold: sfs.long(paid),
    paidSpecialGold: sfs.long(special),
  };
}

function serializeReconnectArmy(row: Row): Fields {
  if (typeof row.armyId !== "string" || !row.armyId || row.armyId.length > 20) return invalid();

  const result: Fields = {
    id: sfs.string(row.armyId),
    free: sfs.int(Number(signed(row.free, 32))),
    march: sfs.int(Number(signed(row.march, 32))),
    level: sfs.int(Number(signed(row.level, 32))),
  };
  const train = Number(signed(row.train, 32));

  if (train !== 0) {
    result.train = sfs.int(train);
    result.finish = sfs.long(signed(row.finishTime, 64));
  }

  return result;
}

function serializeReconnectArmies(rows: readonly Row[]): Fields {
  if (rows.length > 32767) return invalid();

  const seen = new Set<string>();

  return {
    army: sfs.array(
      rows.map((row) => {
        const army = reconnectArmy(row);
        const id = row.armyId as string;

        if (seen.has(id)) return invalid();

        seen.add(id);

        return sfs.object(army);
      }),
    ),
  };
}

function serializeReconnectMine(mine: FriendshipMineView): Fields {
  return {
    mine: sfs.object({
      itemId: sfs.int(mine.itemId),
      level: sfs.int(mine.level),
      exp: sfs.int(mine.exp),
      miner: sfs.int(mine.miner),
      mineTime: sfs.long(mine.mineTime),
      call: sfs.int(mine.call),
      xml_exp: sfs.int(mine.requiredExp),
      xml_miner: sfs.int(mine.maxMiners),
    }),
  };
}

export function reconnectBalances(...args: Parameters<typeof serializeReconnectBalances>): Fields {
  return validateFields(reconnectBalancesSchema, serializeReconnectBalances(...args));
}

export function reconnectArmy(...args: Parameters<typeof serializeReconnectArmy>): Fields {
  return validateFields(reconnectArmySchema, serializeReconnectArmy(...args));
}

export function reconnectArmies(...args: Parameters<typeof serializeReconnectArmies>): Fields {
  return validateFields(reconnectArmiesSchema, serializeReconnectArmies(...args));
}

export function reconnectMine(...args: Parameters<typeof serializeReconnectMine>): Fields {
  return validateFields(reconnectMineSchema, serializeReconnectMine(...args));
}

function serializeReconnectQueues(
  rows: readonly Row[],
  buildings: readonly Row[],
  equipment: readonly Row[],
  rules: Rules,
  now: number,
): Fields {
  if (rows.length > 32767) return invalid();

  const buildingIndex = new Map(buildings.map((row) => [text(row, "uuid"), row]));
  const equipmentIndex = new Map(equipment.map((row) => [text(row, "uuid"), row]));
  const seen = new Set<string>();

  return {
    queue: sfs.array(
      rows.map((row) => {
        const id = text(row, "uuid");

        if (!id || seen.has(id)) return invalid();

        seen.add(id);
        const type = Number(signed(row.type, 32));
        const itemId = text(row, "itemId");
        let item: Fields = {};

        if (!mailBlank(itemId)) {
          if (type < 0 || type > 41) return invalid();

          if (type === 0) {
            const target = buildingIndex.get(itemId);

            if (target) item = building(target, rules, true, now);
          } else if ([1, 8, 9, 10, 17].includes(type)) {
            const first = itemId.split("|").filter(Boolean)[0];
            const selected = first === undefined ? "" : first.split(";").filter(Boolean)[0];

            if (selected === undefined) return invalid();

            item = { itemId: sfs.string(selected), allId: sfs.string(itemId) };
          } else if (type === 11) {
            const target = equipmentIndex.get(itemId);

            if (target)
              item = {
                itemId: sfs.string(String(signed(target.itemId, 32))),
                cost: sfs.string(text(target, "cost")),
              };
          } else if (type === 12) {
            const parts = itemId.split(";").filter(Boolean);
            const index = Number(signed(row.para, 32));
            const selected = parts[index < parts.length ? index : 0];

            if (selected === undefined) return invalid();

            item = {
              itemId: sfs.string(selected),
              para: sfs.int(index),
              allId: sfs.string(itemId),
            };
          } else item = { itemId: sfs.string(itemId) };
        }

        for (const key of ["qid", "type", "isHelped"]) signed(row[key], 32);

        for (const key of ["startTime", "endTime", "updateTime", "totalTime"]) signed(row[key], 64);

        const totalTime =
          signed(row.totalTime, 64) ||
          BigInt.asIntN(64, signed(row.updateTime, 64) - signed(row.startTime, 64));
        const result = queue({ ...row, totalTime }, item);

        return sfs.object(result);
      }),
    ),
  };
}

function serializeReconnectResources(row: Row, showBound: boolean): Fields {
  const result: Fields = {};

  if (showBound)
    for (const key of ["wood", "iron", "stone", "food"])
      result[`${key}_bind`] = sfs.long(signed(row[`${key}bind`], 64));

  for (const key of ["wood", "stone", "iron", "food"]) {
    const amount = signed(row[key], 64);
    result[key] = sfs.long(
      showBound
        ? amount < 0n
          ? 0n
          : amount
        : BigInt.asIntN(64, amount + signed(row[`${key}bind`], 64)),
    );
  }

  result.silver = sfs.int(Number(signed(row.silver, 32)));

  for (const key of ["chip", "diamond"])
    result[key] = sfs.int(Math.max(0, Number(signed(row[key], 32))));

  result.dragonFood = sfs.int(Number(signed(row.dragon_food, 32)));
  result.dragonGold = sfs.int(Number(signed(row.dragon_gold, 32)));

  for (const key of ["sandstone", "diamondstone", "marble", "granite", "limestone"])
    result[key] = sfs.int(Math.max(0, Number(signed(row[key], 32))));

  return { resource: sfs.object(result) };
}

function serializeReconnectTasks(
  plan: ReconnectTaskPlan,
  rules: Rules,
  context: RuleContext,
  random: RewardRandom,
): { fields: Fields; pushes: readonly { command: string; fields: Fields }[] } {
  const taskObject = (task: ReconnectTask, reward: boolean) => {
    const fields: Fields = {
      id: sfs.string(task.id),
      num: sfs.int(Number(signed(task.num, 32))),
      state: sfs.int(Number(signed(task.state, 32))),
      type: sfs.int(Number(signed(task.type, 32))),
    };

    if (task.type === 3) {
      const maximum = rules.items.get("wb_info")?.k4;

      if (maximum === undefined) return invalid();

      fields.currPhase = sfs.int(Number(signed(task.phase, 32)));
      fields.maxPhase = sfs.int(Number(signed(maximum, 32)));
    }

    if (reward)
      fields.reward = rewardPreviewArray(previewRewards(task.reward, rules, context, random));

    return validateValue(reconnectTaskSchema, sfs.object(fields));
  };
  const group = (tasks: readonly ReconnectTask[], reward: boolean): Fields => {
    if (tasks.length > 32767) return invalid();

    return {
      task: sfs.array(
        tasks.filter((task) => task.type !== 3).map((task) => taskObject(task, reward)),
      ),
      ckfTask: sfs.array(
        tasks.filter((task) => task.type === 3).map((task) => taskObject(task, reward)),
      ),
    };
  };
  const pushes = plan.pushes.map((push) => {
    if (push.command === "push.task.new")
      return { command: push.command, fields: group(push.tasks, true) };

    if (push.command === "push.ckf.task.complete") {
      const fields = group(push.tasks, false);

      if (!push.tasks.some((task) => task.type === 1)) delete fields.task;

      return { command: push.command, fields };
    }

    return {
      command: push.command,
      fields: { task: sfs.array(push.tasks.map((task) => taskObject(task, false))) },
    };
  });

  return {
    fields: {
      ...group(visibleReconnectTasks(plan.tasks), true),
      taskCompleteNum: sfs.int(
        plan.tasks.filter((task) => !task.accepted && task.state === 2).length,
      ),
    },
    pushes,
  };
}

export function reconnectQueues(...args: Parameters<typeof serializeReconnectQueues>): Fields {
  return validateFields(reconnectQueuesSchema, serializeReconnectQueues(...args));
}

export function reconnectResources(
  ...args: Parameters<typeof serializeReconnectResources>
): Fields {
  return validateFields(reconnectResourcesSchema, serializeReconnectResources(...args));
}

export function reconnectTasks(
  ...args: Parameters<typeof serializeReconnectTasks>
): ReturnType<typeof serializeReconnectTasks> {
  const result = serializeReconnectTasks(...args);
  validateFields(reconnectTasksSchema, result.fields);

  return result;
}
