import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { sfs, encode, str, type Fields } from "@opencok/messages/sfs";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import {
  regionalRecallBand,
  regionalRecallEligible,
  regionalRecallFailure,
} from "@opencok/rules/regional-recall";
import { eventTimestamp } from "@opencok/rules/local-events";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { recallTaskView, recallTaskClaim } from "@opencok/mappings/recall-task";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import { applyProgressionStatus } from "./player-effects";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function enabled(context: CityProgressionContext) {
  return serverFeature(context.rules, "recall_quest", {
    kingdomId: context.rules.kingdomId,
    version: "12.06.0",
    now: Number(context.now),
  });
}

function saved(context: CityProgressionContext) {
  if (!context.state.recallTask) regionalRecallFailure();

  return {
    ...context.state.recallTask,
    notes: context.write.recallTask?.notes ?? context.state.recallTask.notes,
    tasks: context.write.recallTask?.tasks ?? context.state.recallTask.tasks,
  };
}

export function recordRecallTask(
  context: CityProgressionContext,
  type: number,
  amount: number | bigint,
  condition = "1",
  at = context.now,
) {
  if (!context.state.recallTask?.notes || !enabled(context) || amount <= 0) return;

  const state = saved(context),
    notes = state.notes!;

  if (
    long(notes, "beginTime") <= 0n ||
    at < long(notes, "beginTime") ||
    at > long(notes, "endTime")
  )
    return;

  const count = cityInteger(
    typeof amount === "bigint"
      ? amount > 2147483647n
        ? 2147483647n
        : amount
      : Math.min(amount, 2147483647),
    1,
  );
  let changed = false;
  const tasks = state.tasks.map((original) => {
    const row = { ...original },
      rule = context.rules.advanced.recallTasks?.get(text(row, "id"));

    if (
      !rule ||
      num(row, "state") > 0 ||
      Number(rule.type) !== type ||
      (type === 16
        ? !rule.extend_type?.split(";").includes(condition)
        : rule.extend_type !== condition)
    )
      return row;

    row.num = Math.min(2147483647, num(row, "num") + count);

    if (num(row, "num") >= num(row, "target_num")) row.state = 1;

    changed = true;

    return row;
  });

  if (changed) context.write.recallTask = { ...context.write.recallTask, tasks };
}

export class RecallTaskDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = [
    "recall.task.init",
    "recall.task.ui",
    "recall.task.receive",
  ];

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
    if (!enabled(context)) return { response: encode({}), event: null };

    let state = saved(context);
    const rule = [...(context.rules.advanced.recallActivities?.values() ?? [])].find(
      (rule) => rule.k10 === state.country && state.country !== "",
    );

    if (command === "recall.task.init") {
      if (!rule) return { response: encode({}), event: null };

      const start = eventTimestamp(rule.k3),
        end = eventTimestamp(rule.k4),
        castle = context.state.buildings.find((row) => num(row, "itemId") === 400000),
        level = num(castle ?? {}, "level");

      if (start === undefined || end === undefined || end < start) regionalRecallFailure();

      if (context.now <= start || context.now >= end || level < cityInteger(rule.k11))
        return { response: encode({}), event: null };

      if (!state.notes) {
        const ladder = regionalRecallBand(rule, level + num(castle ?? {}, "star")),
          ids = rule.k7?.split("|")[ladder]?.split(";").filter(Boolean);

        if (!ids?.length || ids.length > 64 || new Set(ids).size !== ids.length)
          regionalRecallFailure();

        const notes: Row = {
          uid: context.owner,
          version: text(context.state.profile, "appVersion"),
          receive_mode: 0,
          refreshTime: 0n,
          beginTime: context.now,
          endTime: context.now + BigInt(cityInteger(rule.k5, 1)) * 86400000n,
          opendTime: regionalRecallEligible(rule, context.state.profile, level, context.now)
            ? context.now
            : 0n,
          country: state.country,
          lastLoginTime: context.now,
        };
        const tasks = ids.map((id) => {
          const task = context.rules.advanced.recallTasks?.get(id),
            values = task?.num?.split(";").map((value) => cityInteger(value, 1));

          if (!task || !values?.length || values.length > 2) regionalRecallFailure();

          const target =
            values.length === 1
              ? values[0]!
              : values[0]! + randomInt(cityInteger(values[0]! - values[1]!, 1));

          return {
            uid: context.owner,
            id,
            num: 0,
            target_num: target,
            state: 0,
            type_level: level + num(castle ?? {}, "star"),
            receive: 0,
          };
        });
        context.write.recallTask = { notes, tasks, reset: true };
      } else {
        recordRecallTask(context, 26, 1);

        if (long(state.notes, "lastLoginTime") / 86400000n !== context.now / 86400000n)
          recordRecallTask(context, 27, 1);

        context.write.recallTask = {
          ...context.write.recallTask,
          notes: { ...state.notes, lastLoginTime: context.now },
        };
      }

      return { response: encode({}), event: null };
    }

    if (command === "recall.task.ui") {
      const rows = state.tasks.map((row) => {
        const task = context.rules.advanced.recallTasks?.get(text(row, "id"));

        if (!task) regionalRecallFailure();

        return {
          reward: rewardPreviewArray(
            previewRewards(
              task.rewardall!,
              context.rules,
              { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
              randomInt,
            ),
          ),
          num: sfs.int(num(row, "num")),
          target_num: sfs.int(num(row, "target_num")),
          state: sfs.bool(num(row, "state") > 0),
          taskid: sfs.string(text(row, "id")),
          receive: sfs.bool(num(row, "receive") > 0),
        };
      });

      return {
        response: encode(
          recallTaskView(rows, state.notes ? long(state.notes, "opendTime") : undefined),
        ),
        event: null,
      };
    }

    const id = str(params, "id"),
      original = state.tasks.find((row) => row.id === id);

    if (!original || num(original, "state") <= 0 || num(original, "receive") > 0 || !state.notes)
      return { response: encode({}), event: null };

    const task = context.rules.advanced.recallTasks?.get(id);

    if (!task) regionalRecallFailure();

    const body: Fields = {
      id: sfs.string(id),
      reward: sfs.array(
        grantNativeProgressionReward(context, pinProgressionReward(context, task.rewardall!)),
      ),
    };
    context.write.recallTask = {
      tasks: state.tasks.map((row) => (row.id === id ? { ...row, receive: 1 } : row)),
      notes: { ...state.notes, refreshTime: context.now },
    };
    state = saved(context);

    if (rule) {
      const completed = state.tasks.filter((row) => num(row, "state") > 0).length;
      let milestone = "0";
      const statuses = (rule.k8 ?? "").split("|");

      for (let index = statuses.length - 1; index > 0; index--) {
        const [threshold, status] = statuses[index]!.split(";");

        if (status && cityInteger(threshold) <= completed) {
          milestone = status;
          break;
        }
      }

      const rewards = (rule.k9 ?? "").split("|");

      for (let index = rewards.length - 1; index > 0; index--) {
        const [threshold, reward] = rewards[index]!.split(";");

        if (reward && cityInteger(threshold) > completed) {
          milestone = reward;
          break;
        }
      }

      if (milestone !== "0" && Number(milestone) !== num(state.notes!, "receive_mode")) {
        if (context.rules.power.statuses?.has(milestone)) {
          applyProgressionStatus(context, milestone);
          body.status = sfs.string(milestone);
        } else
          body.receive_reward = sfs.array(
            grantNativeProgressionReward(context, pinProgressionReward(context, milestone)),
          );

        context.write.recallTask.notes = {
          ...state.notes!,
          receive_mode: cityInteger(milestone),
          refreshTime: context.now,
        };
      }
    }

    return { response: encode(recallTaskClaim(body)), event: null };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    regionalRecallFailure();
  };
}

export const recallTaskDomain: CityDomain = new RecallTaskDomain();
