import { randomUUID } from "node:crypto";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { encode, sfs, str } from "@opencok/messages/sfs";
import { num, text, type Row } from "@opencok/contracts/rows";
import { expeditionFailure, expeditionOpen, expeditionScore } from "@opencok/rules/new-expedition";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  expeditionInfo,
  expeditionRewardList,
  expeditionRecord,
  expeditionDistribution,
  expeditionTaxRecord,
} from "@opencok/mappings/new-expedition";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import type { CityDomain, CityProgressionContext } from "./city-progression";
function current(context: CityProgressionContext): Row {
  const state = context.state.expedition;
  if (!state?.period || !state.phase) expeditionFailure();
  return {
    ...(context.write.expedition ?? state.progress).find(
      (row) => num(row, "stage") === state.phase!.stage,
    ),
    uid: context.owner,
    periodId: text(state.period, "periodId"),
    stage: state.phase.stage,
  };
}
export function recordExpeditionScore(
  context: CityProgressionContext,
  action: number,
  param = 1,
  count = 1,
  occurredAt = context.now,
) {
  const phase = context.state.expedition?.phase;
  if (
    context.state.expedition?.projectionOnly ||
    !phase ||
    occurredAt < phase.startTime ||
    occurredAt >= phase.endTime ||
    !expeditionOpen(context.rules, context.now) ||
    num(context.state.profile, "crossFightSrcServerId") > 0
  )
    return;
  const delta = expeditionScore(context.rules, phase.stage, action, param, count, context.effect);
  if (!delta) return;
  const row = current(context),
    score = num(row, "score") + delta;
  if (!Number.isFinite(score)) expeditionFailure();
  context.write.expedition = [
    ...(context.write.expedition ?? []).filter((item) => item.stage !== phase.stage),
    { ...row, score },
  ];
}
export const expeditionDomain: CityDomain = {
  commands: [
    "newexpidition.activityinfo",
    "newexpidition.takepersonreward",
    "newexpidition.takealliancereward",
    "expedition.show",
    "distribution.record.show",
    "tax.record.show",
  ],
  types: [],
  async prepare(context, command, params) {
    const state = context.state.expedition;
    if (!state) expeditionFailure();
    if (command === "expedition.show")
      return {
        response: encode({
          victoryCount: sfs.int(num(state.period ?? {}, "victoryTimes")),
          ...(params.currentCount
            ? {
                expeditionRecordList: sfs.array(
                  (state.records ?? []).map((row) => sfs.object(expeditionRecord(row))),
                ),
              }
            : {}),
        }),
        event: null,
      };
    if (command === "distribution.record.show")
      return {
        response: encode({
          disRecordList: sfs.array(
            (state.distributions ?? []).map((row) => sfs.object(expeditionDistribution(row))),
          ),
        }),
        event: null,
      };
    if (command === "tax.record.show")
      return {
        response: encode({
          taxRecordList: sfs.array(
            (state.taxRecords ?? []).map((row) => sfs.object(expeditionTaxRecord(row))),
          ),
        }),
        event: null,
      };
    if (!expeditionOpen(context.rules, context.now)) expeditionFailure();
    if (command === "newexpidition.activityinfo")
      return {
        response: encode(
          expeditionInfo(
            state,
            context.state.profile,
            context.rules.profile.servers?.get(String(context.rules.kingdomId))?.name ?? "",
          ),
        ),
        event: null,
      };
    const id = str(params, "id");
    if (!/^\d{1,9}$/.test(id)) expeditionFailure();
    const definition = context.rules.advanced.expeditionRewards?.get(id),
      row = current(context),
      type = command === "newexpidition.takepersonreward" ? 1 : 2;
    const castle = context.state.buildings.find((building) => num(building, "itemId") === 400000),
      level = num(castle ?? {}, "level") + num(castle ?? {}, "star");
    const claimed = expeditionRewardList(row).map((item) => Number(item.value));
    if (
      !definition ||
      Number(definition.stage) !== state.phase!.stage ||
      Number(definition.type) !== type ||
      level < Number(definition.castle_min) ||
      level > Number(definition.castle_max) ||
      claimed.includes(Number(id)) ||
      num(row, "score") <= (type === 1 ? 0 : cityInteger(context.rules.items.get("17_wk")?.k1)) ||
      (type === 1 ? num(row, "score") : state.allianceScore) < Number(definition.target) ||
      (type === 2 && !text(context.state.profile, "allianceId")) ||
      (definition.science_quest &&
        !context.state.sciences.some(
          (science) =>
            String(science.itemId) === definition.science_quest && num(science, "level") > 0,
        ))
    )
      expeditionFailure();
    const reward = pinProgressionReward(context, definition.reward ?? ""),
      rewardinfo = grantNativeProgressionReward(context, reward);
    const doubleScience = context.rules.items.get("17_wk")?.k12;
    if (
      type === 1 &&
      doubleScience &&
      context.state.sciences.some(
        (science) => String(science.itemId) === doubleScience && num(science, "level") > 0,
      )
    ) {
      const template = context.rules.mail.get("12076"),
        contents = javaMailBytes(template?.message);
      if (!template || !contents) expeditionFailure();
      const mail = {
        uid: randomUUID().replaceAll("-", "") + "00",
        owner: context.owner,
        fromName: template.sender ?? "",
        title: template.title ?? "",
        type: 2 as const,
        contents,
        extra: null,
        rewardId: pinProgressionReward(context, definition.reward ?? ""),
        rewardStatus: 0 as const,
        reply: 0,
        createTime: context.now,
      };
      const quests = (context.write.quests ??= {});
      quests.mail = [...(quests.mail ?? []), mail];
    }
    const takeReward = [...claimed, Number(id)].join("|");
    if (takeReward.length > 500) expeditionFailure();
    const saved = { ...row, takeReward };
    context.write.expedition = [saved];
    return {
      response: encode({
        rewardinfo: sfs.array(rewardinfo),
        rewardlist: sfs.array(expeditionRewardList(saved)),
      }),
    };
  },
  async apply() {
    expeditionFailure();
  },
};
