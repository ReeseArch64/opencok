import { num, long, text } from "@opencok/contracts/rows";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { AnniversaryResponse } from "@opencok/contracts/responses/anniversary";
import { anniversaryStatisticsSchema, anniversarySchema } from "@opencok/validations/anniversary";
import { validateFields } from "./validation";
export function anniversaryView(response: AnniversaryResponse): Fields {
  return validateFields(anniversarySchema, {
    anniversary_array: sfs.array(
      response.anniversary_array.map((week) =>
        sfs.object({
          week_id: sfs.int(week.week_id),
          box_score: sfs.int(week.box_score),
          box_already_taken: sfs.array(week.box_already_taken.map(sfs.int)),
          task_data: sfs.array(
            week.task_data.map((group) =>
              sfs.object({
                master_task_id: sfs.int(group.master_task_id),
                task_array: sfs.array(
                  group.task_array.map((task) =>
                    sfs.object({
                      task_id: sfs.int(task.task_id),
                      task_score: sfs.int(task.task_score),
                      task_score_max: sfs.int(task.task_score_max),
                    }),
                  ),
                ),
              }),
            ),
          ),
        }),
      ),
    ),
    cake_already_taken: sfs.int(response.cake_already_taken),
    curr_week_id: sfs.int(response.curr_week_id),
  });
}

export function anniversaryStatisticsView(
  state: {
    statistics: import("@opencok/contracts/rows").Row;
    alliance: import("@opencok/contracts/rows").Row;
    times: import("@opencok/contracts/rows").Row;
  },
  profile: import("@opencok/contracts/rows").Row,
  rule: import("@opencok/rules/game").Rule,
): Fields {
  const row = state.statistics,
    when = new Date(Number(long(profile, "regTime")));
  if (!Number.isFinite(when.getTime())) throw new Error("Invalid anniversary registration date");
  const result: Fields = {};
  if (long(state.times, "attack") && text(state.times, "name").trim()) {
    result.atkTime = sfs.long(long(state.times, "attack"));
    result.atkName = sfs.string(text(state.times, "name"));
  }
  if (long(state.times, "defend")) result.defTime = sfs.long(long(state.times, "defend"));
  if (long(state.times, "team")) result.teamAtkTime = sfs.long(long(state.times, "team"));
  result.regTime = sfs.string(when.toISOString().slice(0, 10).replaceAll("-", "/"));
  result.regTop = sfs.long(long(row, "regtop"));
  result.power = sfs.long(long(row, "power"));
  result.powerPercent = sfs.double(num(row, "powerpercent"));
  result.food = sfs.long(long(row, "food"));
  result.feedPeople = sfs.long(long(row, "food") / (BigInt(rule.k1 ?? 0) || 1n));
  result.wood = sfs.long(long(row, "wood"));
  result.cutTree = sfs.long(long(row, "wood") / (BigInt(rule.k2 ?? 0) || 1n));
  result.train = sfs.long(long(row, "train"));
  result.armyType = sfs.int(num(row, "armytype"));
  result.maxTrain = sfs.long(long(row, "maxtrain"));
  result.maxTrainPercent = sfs.double(num(row, "maxtrainpercent"));
  result.dead = sfs.long(long(row, "dead"));
  result.deadPercent = sfs.double(num(row, "deadpercent"));
  result.worldWarPercent = sfs.int(Math.trunc(num(row, "deadPercent") / (Number(rule.k3) || 1)));
  result.kill = sfs.long(long(row, "kill"));
  result.killPercent = sfs.string(num(row, "killpercent").toFixed(2));
  result.allianceAllNum = sfs.int(num(state.alliance, "allnum"));
  result.allianceNum = sfs.int(num(state.alliance, "num"));
  return validateFields(anniversaryStatisticsSchema, result);
}
