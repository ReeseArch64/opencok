import { createHash, randomInt, randomUUID } from "node:crypto";
import { num, long, text } from "@opencok/contracts/rows";
import {
  sfs,
  encode,
  decode,
  str,
  int,
  fields,
  type Fields,
  type Value,
  Type,
} from "@opencok/messages/sfs";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  targetSchedule,
  selectTargetTasks,
  targetQuantity,
  targetFailure,
} from "@opencok/rules/target-task";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { targetTaskView } from "@opencok/mappings/target-task";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import type { CityDomain, CityProgressionContext } from "./city-progression";
import type { TargetTaskPaymentGateway } from "@opencok/contracts/target-task";

function open(context: CityProgressionContext) {
  return serverFeature(context.rules, "target_quest", {
    kingdomId: context.rules.kingdomId,
    version: "12.06.0",
    now: Number(context.now),
  });
}
function saved(context: CityProgressionContext) {
  const state = context.state.targetTask;
  if (!state) targetFailure();
  return {
    ...state,
    notes: context.write.targetTask?.notes ?? state.notes,
    tasks: context.write.targetTask?.tasks ?? state.tasks,
  };
}
function repeatedReward(context: CityProgressionContext, id: string, times: number): string {
  cityInteger(times, 1, 1000);
  const rows = new Map<string, number>();
  for (let i = 0; i < times; i++)
    for (const row of mailRewardEntries(pinProgressionReward(context, id))) {
      const key = `${row.category},${row.itemId}`;
      rows.set(key, cityInteger((rows.get(key) ?? 0) + row.count));
    }
  return [...rows].map(([key, count]) => `${key},${count}`).join("|");
}
function recover(context: CityProgressionContext, random: (maximum: number) => number) {
  let state = saved(context),
    notes = state.notes ? { ...state.notes } : undefined;
  if (notes && context.now >= long(notes, "endTime") && num(notes, "receive_mode") === 0) {
    let sent = false;
    for (const row of state.tasks) {
      if (num(row, "state") <= 0) continue;
      const rule = context.rules.advanced.targetTasks?.get(text(row, "id")),
        template = context.rules.mail.get("11835"),
        contents = javaMailBytes(template?.message);
      if (!rule || !template || !contents) targetFailure();
      const reward = repeatedReward(
        context,
        rule.rewardall!,
        cityInteger(num(row, "rewardDouble") + 1, 1, 1000),
      );
      const quests = (context.write.quests ??= {});
      quests.mail = [
        ...(quests.mail ?? []),
        {
          uid: randomUUID().replaceAll("-", "") + "00",
          owner: context.owner,
          fromName: template.sender ?? "",
          title: template.title ?? "",
          type: 2,
          contents,
          extra: null,
          rewardId: reward,
          rewardStatus: 0,
          reply: 0,
          createTime: context.now,
        },
      ];
      sent = true;
    }
    Object.assign(notes, { receive_mode: 3, refreshTime: context.now, isMail: sent ? 1 : 0 });
    context.write.targetTask = { ...context.write.targetTask, notes };
  }
  const config = context.rules.items.get("target_quest");
  if (!config) targetFailure();
  const window = targetSchedule(config, context.now, state.openedAt);
  if (
    window.active &&
    (!notes || context.now < long(notes, "beginTime") || context.now >= long(notes, "endTime"))
  ) {
    const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
    const selected = selectTargetTasks(
      context.rules,
      config,
      num(castle ?? {}, "level") + num(castle ?? {}, "star"),
      random,
    );
    notes = {
      uid: context.owner,
      version: "12.06.0",
      receive_mode: 0,
      refreshTime: 0n,
      beginTime: window.start,
      endTime: window.end,
      opendTime: context.now,
      isMail: 0,
    };
    const tasks = selected.map((rule, index) => ({
      uid: context.owner,
      id: rule.id!,
      num: 0,
      target_num: targetQuantity(rule, random),
      state: 0,
      type_level: index,
      rewardDouble: 0,
    }));
    context.write.targetTask = { notes, tasks, reset: true };
  }
  state = saved(context);
  return { ...state, config, window };
}
export function recordTargetTask(
  context: CityProgressionContext,
  type: number,
  amount: number | bigint,
  condition = "1",
  at = context.now,
): void {
  if (!context.state.targetTask || !open(context) || amount <= 0) return;
  const state = saved(context),
    notes = state.notes;
  if (
    !notes ||
    num(notes, "receive_mode") > 0 ||
    at < long(notes, "beginTime") ||
    at >= long(notes, "endTime") ||
    long(notes, "beginTime") <= 0n
  )
    return;
  const day = cityInteger((at - long(notes, "beginTime")) / 86400000n),
    count = cityInteger(
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
      rule = context.rules.advanced.targetTasks?.get(text(row, "id"));
    if (
      !rule ||
      num(row, "state") !== 0 ||
      num(row, "type_level") !== day ||
      Number(rule.type) !== type ||
      (type === 16
        ? !rule.extend_type?.split(";").includes(condition)
        : rule.extend_type !== condition)
    )
      return row;
    row.num = cityInteger(Math.min(2147483647, num(row, "num") + count));
    if (num(row, "num") >= num(row, "target_num")) row.state = 1;
    changed = true;
    return row;
  });
  if (changed) context.write.targetTask = { ...context.write.targetTask, tasks };
}
function grant(context: CityProgressionContext, mode: number): Fields {
  const state = saved(context),
    notes = state.notes ? { ...state.notes } : undefined;
  if (!notes || num(notes, "receive_mode") !== 0) targetFailure();
  const completed = state.tasks.filter((row) => num(row, "state") > 0);
  if (!completed.length) targetFailure();
  const rewards: Value[] = completed.map((row) => {
    const rule = context.rules.advanced.targetTasks?.get(text(row, "id"));
    if (!rule) targetFailure();
    const reward = repeatedReward(
      context,
      rule.rewardall!,
      cityInteger(num(row, "rewardDouble") + 1, 1, 1000),
    );
    return sfs.object({
      id: sfs.string(text(row, "id")),
      reward: sfs.array(grantNativeProgressionReward(context, reward)),
    });
  });
  Object.assign(notes, { receive_mode: mode, refreshTime: context.now, isMail: 0 });
  context.write.targetTask = { ...context.write.targetTask, notes };
  return { rewardlist: sfs.array(rewards), receive_mode: sfs.bool(true) };
}
export function targetTaskPurchaseOperationId(owner: string, eventId: string): string {
  if (!/^[A-Za-z0-9:._-]{1,128}$/.test(eventId)) targetFailure();
  return `targetpaid:${createHash("sha256").update(`${owner}\0${eventId}`).digest("hex")}`;
}
export function createTargetTaskDomain(
  gateway?: TargetTaskPaymentGateway,
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return {
    commands: [
      "target.init",
      "target.task.ui",
      "target.task.item",
      "target.task.receive",
      "target.paid",
    ],
    types: [],
    async prepare(context, command, params) {
      const empty = () => ({ response: encode({}), event: null });
      if (!open(context)) {
        if (command === "target.init") return empty();
        targetFailure();
      }
      let proof: { exchangeId: string; occurredAt: bigint } | undefined;
      if (command === "target.paid") {
        const eventId = str(params, "eventId");
        if (
          !gateway ||
          str(params, "operationId") !== targetTaskPurchaseOperationId(context.owner, eventId)
        )
          targetFailure();
        proof = (await gateway.accepted({ owner: context.owner, eventId })) ?? undefined;
        if (
          !proof ||
          typeof proof.occurredAt !== "bigint" ||
          proof.occurredAt < 0n ||
          proof.occurredAt > context.now
        )
          targetFailure();
      }
      const state = recover(context, random),
        notes = state.notes;
      if (command === "target.init") return empty();
      const begin = notes ? long(notes, "beginTime") : 0n,
        day =
          begin > 0n && context.now >= begin
            ? cityInteger((context.now - begin) / 86400000n)
            : undefined;
      if (command === "target.task.ui") {
        const rows = state.tasks
          .slice()
          .sort((a, b) => num(a, "type_level") - num(b, "type_level"))
          .map((row) => {
            const rule = context.rules.advanced.targetTasks?.get(text(row, "id"));
            if (!rule) targetFailure();
            return {
              reward: rewardPreviewArray(
                previewRewards(
                  rule.rewardall,
                  context.rules,
                  {
                    kingdomId: context.rules.kingdomId,
                    version: "12.06.0",
                    now: Number(context.now),
                  },
                  random,
                ),
              ),
              num: sfs.int(num(row, "num")),
              target_num: sfs.int(num(row, "target_num")),
              state: sfs.bool(num(row, "state") > 0),
              day_type: sfs.int(num(row, "type_level")),
              taskid: sfs.string(text(row, "id")),
              rewardDouble: sfs.int(num(row, "rewardDouble")),
            };
          });
        return {
          response: encode(
            targetTaskView(
              rows,
              state.config.k5 ?? "",
              state.tasks.length + cityInteger(state.config.k4) - 1,
              day,
              !notes || num(notes, "receive_mode") > 0,
            ),
          ),
          event: null,
        };
      }
      if (command === "target.paid") {
        if (proof!.exchangeId !== state.config.k5) targetFailure();
        if (!notes) return empty();
        if (
          num(notes, "receive_mode") > 0 ||
          proof!.occurredAt < begin ||
          proof!.occurredAt >= long(notes, "endTime")
        )
          return empty();
        const body = grant(context, 2);
        return {
          response: encode(body),
          event: encode({ owner: sfs.string(context.owner), body: sfs.object(body) }),
        };
      }
      if (command === "target.task.receive")
        return { response: encode(grant(context, 1)), event: null };
      if (
        !notes ||
        num(notes, "receive_mode") > 0 ||
        context.now < begin ||
        context.now >= long(notes, "endTime")
      )
        targetFailure();
      const action = cityInteger(int(params, "type"), 1, 2),
        index = cityInteger(int(params, "index"), 0, 4),
        itemId = str(params, "itemId"),
        count = cityInteger(int(params, "num"), 1),
        row = state.tasks.find((row) => num(row, "type_level") === index);
      if (!row) targetFailure();
      const next = { ...row };
      if (action === 1) {
        const parts = (state.config.k8 ?? "").split(";");
        if (
          parts.length !== 2 ||
          parts[0] !== itemId ||
          num(row, "state") !== 1 ||
          num(row, "rewardDouble") >= cityInteger(parts[1], 0, 999)
        )
          targetFailure();
        next.rewardDouble = cityInteger(num(row, "rewardDouble") + 1, 0, 999);
      } else {
        if (itemId !== state.config.k9 || num(row, "state") !== 0) targetFailure();
        next.state = 1;
      }
      context.economy.item(itemId, -count);
      context.write.targetTask = {
        ...context.write.targetTask,
        tasks: state.tasks.map((row) => (row.id === next.id ? next : row)),
      };
      return {
        response: encode({
          rewardDouble: sfs.int(num(next, "rewardDouble")),
          state: sfs.bool(num(next, "state") > 0),
        }),
        event: null,
      };
    },
    async apply() {
      targetFailure();
    },
  };
}
export async function publishTargetTaskMutation(
  payload: Uint8Array,
  publish: (owner: string, command: string, body: Fields) => Promise<void>,
) {
  const data = decode(Buffer.from(payload)),
    owner = str(data, "owner"),
    body = fields(data.body);
  if (
    !owner ||
    owner.length > 40 ||
    body.rewardlist?.type !== Type.Array ||
    body.receive_mode?.type !== Type.Bool ||
    body.receive_mode.value !== true
  )
    targetFailure();
  encode(body);
  await publish(owner, "push.target.task", body);
}
