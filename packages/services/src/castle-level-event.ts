import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { randomInt, randomUUID } from "node:crypto";
import { num, type Row } from "@opencok/contracts/rows";
import { encode, sfs, str, int, Type, type Fields } from "@opencok/messages/sfs";
import {
  castleEventOpen,
  castleEventFailure,
  castleEventShard,
  castleEventMailWindow,
} from "@opencok/rules/castle-level-event";
import { cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { castleLevelState } from "@opencok/mappings/castle-level-event";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import type { CityDomain, CityProgressionContext } from "./city-progression";
import type { CastleLevelEventRow } from "@opencok/contracts/castle-level-event";

function ruleContext(context: CityProgressionContext) {
  return { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) };
}
function level(row: Row) {
  return num(row, "level") + num(row, "star");
}
function castle(context: CityProgressionContext) {
  return level(context.state.buildings.find((row) => num(row, "itemId") === 400000) ?? {});
}
export function enrollCastleLevel(context: CityProgressionContext, row: Row) {
  if (num(row, "itemId") !== 400000 || !castleEventOpen(context.rules, ruleContext(context)))
    return;
  const current = level(row);
  if (
    [...(context.rules.advanced.castleLevels?.values() ?? [])].some(
      (rule) => cityInteger(rule.castle_lv, 1) === current,
    )
  )
    context.write.castleLevelEnrollments = [
      ...new Set([...(context.write.castleLevelEnrollments ?? []), current]),
    ];
}
function emptyRow(context: CityProgressionContext, current: number): CastleLevelEventRow {
  return {
    uid: context.owner,
    level: current,
    shard: castleEventShard(context.owner),
    lv_reward: 0,
    ...Object.fromEntries(Array.from({ length: 7 }, (_, i) => [`share_reward_${i}`, 0])),
  };
}
export const castleLevelEventDomain: CityDomain = {
  commands: ["castle.ui.state", "castle.level.reward", "castle.share.reward", "castle.event.init"],
  types: [],
  async prepare(context, command, params) {
    const state = context.state.castleLevelEvent;
    if (!state) castleEventFailure();
    const empty = () => ({ response: encode({}), event: null });
    if (!castleEventOpen(context.rules, ruleContext(context))) {
      if (command === "castle.level.reward" || command === "castle.share.reward")
        castleEventFailure();
      return empty();
    }
    const rules = [...(context.rules.advanced.castleLevels?.values() ?? [])];
    if (!rules.length || rules.length > 64) castleEventFailure();
    const current = castle(context),
      rows = state.rows.map((row) => ({ ...row }));
    if (command === "castle.ui.state") {
      enrollCastleLevel(
        context,
        context.state.buildings.find((row) => num(row, "itemId") === 400000) ?? {},
      );
      if (
        context.write.castleLevelEnrollments?.includes(current) &&
        !rows.some((row) => num(row, "level") === current)
      )
        rows.push(emptyRow(context, current));
      const preview = (id: string, paid: boolean) => {
        const catalog = paid ? context.rules.advanced.payRewards : context.rules.reconnect.rewards;
        const rule = catalog?.get(id);
        if (!rule) castleEventFailure();
        return rewardPreviewArray(
          previewRewards(id, context.rules, ruleContext(context), randomInt, rule),
        );
      };
      const table = rules.map((rule) => {
        const fields: Fields = Object.fromEntries(
          javaHashMapOrder(Object.keys(rule)).map((key) => [key, sfs.string(rule[key]!)]),
        );
        fields.lv_reward_arr = preview(rule.lv_reward!, true);
        fields.Shared_reward_arr = preview(
          rule.Shared_reward?.split("|").filter(Boolean).at(-1) ?? "",
          true,
        );
        const exchange = context.rules.advanced.castleExchanges?.get(
          rule.exchange_id?.split("|").filter(Boolean).at(-1) ?? "",
        );
        fields.exchange_reward_arr = exchange?.reward
          ? preview(exchange.reward, false)
          : rewardPreviewArray([]);
        const target = cityInteger(rule.castle_lv, 1);
        fields.LV_Num = sfs.int(
          (state.counts.get(target) ?? 0) +
            (target === current &&
            !state.rows.some((row) => num(row, "level") === target) &&
            rows.some((row) => num(row, "level") === target)
              ? 1
              : 0),
        );
        return sfs.object(fields);
      });
      return {
        response: encode({
          serverOpenTime: sfs.long(state.serverOpenTime),
          castleLVState: sfs.array(
            rules.flatMap((rule) => {
              const row = rows.find((row) => num(row, "level") === cityInteger(rule.castle_lv, 1));
              return row ? [sfs.object(castleLevelState(row))] : [];
            }),
          ),
          castleLVTable: sfs.array(table),
          castleLVPayExchange: { type: Type.StringArray, value: [...state.exchanges] },
        }),
        event: null,
      };
    }
    if (command === "castle.event.init") {
      const writes: CastleLevelEventRow[] = [];
      for (const rule of rules) {
        const target = cityInteger(rule.castle_lv, 1),
          row = rows.find((row) => num(row, "level") === target);
        if (
          !row ||
          current < target ||
          num(row, "lv_reward") > 0 ||
          !castleEventMailWindow(rule, state.serverOpenTime, context.now)
        )
          continue;
        const reward = pinProgressionReward(
          context,
          rule.lv_reward!,
          context.rules.advanced.payRewards,
        );
        const template = context.rules.mail.get("11791"),
          contents = javaMailBytes(template?.message);
        if (!template || !contents) castleEventFailure();
        row.lv_reward = cityInteger(rule.lv_reward, 1);
        writes.push(row);
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
      }
      if (writes.length) context.write.castleLevelEvent = writes;
      return empty();
    }
    const id = str(params, "id"),
      rule = context.rules.advanced.castleLevels?.get(id);
    if (!rule) castleEventFailure();
    const target = cityInteger(rule.castle_lv, 1),
      row = rows.find((row) => num(row, "level") === target);
    if (!row || current < target) castleEventFailure();
    let rewardId = rule.lv_reward!,
      field = "lv_reward";
    if (command === "castle.share.reward") {
      const position = cityInteger(int(params, "pos"), 0, 6),
        thresholds = (rule.Sharing_condition ?? "").split("|"),
        rewards = (rule.Shared_reward ?? "").split("|");
      if (!thresholds[position] || !rewards[position]) castleEventFailure();
      field = `share_reward_${position}`;
      rewardId = rewards[position]!;
      if ((state.counts.get(target) ?? 0) < cityInteger(thresholds[position], 1)) return empty();
    }
    if (num(row, field) > 0) castleEventFailure();
    const pinned = pinProgressionReward(context, rewardId, context.rules.advanced.payRewards);
    const reward = grantNativeProgressionReward(context, pinned);
    row[field] = cityInteger(rewardId, 1);
    context.write.castleLevelEvent = [row];
    return {
      response: encode({
        reward: sfs.array(reward),
        ...(command === "castle.share.reward" ? { reward_id: sfs.string(rewardId) } : {}),
        id: sfs.string(id),
      }),
      event: null,
    };
  },
  async apply() {
    castleEventFailure();
  },
};
