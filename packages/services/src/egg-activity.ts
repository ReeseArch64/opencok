import type { AvatarSystemMail } from "@opencok/contracts/files";
import { createHash, randomInt } from "node:crypto";
import { sfs, encode, str, Type, type Fields } from "@opencok/messages/sfs";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import {
  eggActivityIdle,
  eggActivityFailure,
  eggActivityOpen,
  eggActivityWindow,
  eggActivityRule,
  eggActivityDraw,
  eggActivityRecord,
  eggActivityCollection,
  eggActivityGoods,
  eggActivityThresholds,
  eggActivityClearCost,
  eggActivityMissing,
} from "@opencok/rules/egg-activity";
import { eggActivityView, eggCollectionView } from "@opencok/mappings/egg-activity";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { avatarMailPush } from "@opencok/mappings/avatar-mail";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { pinGoldEggRewards } from "./gold-eggs-rewards";
import { grantNativeProgressionReward } from "./progression-rewards";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import type { CityDomain, CityProgressionContext } from "./city-progression";
function charge(context: CityProgressionContext, value: number) {
  if (context.balance("gold") < BigInt(value)) throw new GameError(errors.gold, "city_progression");
  if (value) context.economy.gold(-BigInt(value));
}
export function createEggActivityDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return {
    commands: [
      "egg.act.info",
      "egg.act.open",
      "egg.act.reward",
      "egg.act.cd",
      "egg.exp.reward",
      "egg.goods.full",
      "egg.activity.init",
    ],
    types: [],
    async prepare(context, command, params) {
      const state = context.state.eggActivity,
        opened = eggActivityOpen(context.rules, context.now),
        empty = () => ({ response: encode({}), event: null });
      if (!state) eggActivityFailure();
      if (num(context.state.profile, "crossFightSrcServerId") > 0) {
        if (command === "egg.activity.init") return empty();
        eggActivityFailure();
      }
      const saved = state.record;
      const pinned = (id: string) => pinGoldEggRewards(context, [id], 1, random);
      const grant = (id: string) => grantNativeProgressionReward(context, pinned(id));
      if (command === "egg.activity.init") {
        if (
          !eggActivityWindow(context.rules) ||
          opened ||
          !saved ||
          long(saved, "eggCd") <= 0n ||
          long(saved, "eggCd") === eggActivityIdle ||
          long(saved, "eggCd") > context.now
        )
          return empty();
        const row = { ...eggActivityRecord(saved, context.owner) },
          rule = eggActivityRule(context.rules, text(row, "curEgg")),
          template = context.rules.mail.get("11724"),
          contents = javaMailBytes(template?.message);
        if (!template || !contents) eggActivityFailure();
        const mail: AvatarSystemMail = {
          uid:
            createHash("sha256")
              .update(`egg-closure:${context.owner}:${text(row, "curEgg")}:${long(row, "eggCd")}`)
              .digest("hex")
              .slice(0, 32) + "00",
          owner: context.owner,
          fromName: template.sender ?? "",
          title: template.title ?? "",
          type: 2,
          contents,
          extra: null,
          rewardId: pinned(rule.reward ?? ""),
          rewardStatus: 0,
          reply: 0,
          createTime: context.now,
        };
        const quests = (context.write.quests ??= {});
        quests.mail = [...(quests.mail ?? []), mail];
        row.eggCd = eggActivityIdle;
        context.write.eggActivity = { record: row };
        if (!context.economy.event) eggActivityFailure();
        context.economy.event({
          id: "egg-closure-mail",
          type: "egg.activity.mail",
          payload: encode({
            owner: sfs.string(context.owner),
            mail: sfs.object(
              avatarMailPush(
                mail,
                context.rules.items.get("chat_switch")?.k3?.split("|").includes("1") ?? false,
              ),
            ),
          }),
        });
        return empty();
      }
      if (!opened) {
        if (command === "egg.act.info")
          return { response: encode({ opened: sfs.bool(false) }), event: null };
        eggActivityFailure();
      }
      const row: Row = saved
        ? { ...eggActivityRecord(saved, context.owner) }
        : {
            uid: context.owner,
            curEgg: eggActivityDraw(context.rules, random),
            eggCd: eggActivityIdle,
            exp: 0,
            curExpStage: 0,
          };
      const collections = state.collections.map((value) => ({
        ...eggActivityCollection(value, context.owner),
      }));
      let body: Fields;
      if (command === "egg.act.info")
        body = {
          opened: sfs.bool(true),
          eggAct: sfs.object(eggActivityView(row)),
          eggGoods: sfs.array(collections.map((value) => sfs.object(eggCollectionView(value)))),
        };
      else if (command === "egg.act.open") {
        if (params.eggId?.type !== Type.String || long(row, "eggCd") !== eggActivityIdle)
          eggActivityFailure();
        const id = str(params, "eggId"),
          rule = eggActivityRule(context.rules, id);
        if (id !== text(row, "curEgg")) charge(context, cityInteger(rule.cost, 1));
        row.curEgg = id;
        row.eggCd = cityAmount(context.now + BigInt(cityInteger(rule.time, 1)) * 1000n);
        body = {
          eggAct: sfs.object(eggActivityView(row)),
          gold: sfs.long(context.balance("gold")),
        };
      } else if (command === "egg.act.cd") {
        charge(context, eggActivityClearCost(row, context.rules, context.now));
        row.eggCd = cityAmount(context.now - 3000n);
        body = {
          gold: sfs.long(context.balance("gold")),
          eggAct: sfs.object(eggActivityView(row)),
        };
      } else if (command === "egg.act.reward") {
        if (long(row, "eggCd") === eggActivityIdle || long(row, "eggCd") > context.now)
          eggActivityFailure();
        const id = text(row, "curEgg"),
          rule = eggActivityRule(context.rules, id),
          raw = pinned(rule.reward ?? ""),
          reward = grantNativeProgressionReward(context, raw),
          goods = javaHashMapOrder([
            ...new Set(
              raw
                .split("|")
                .filter((value) => value.startsWith("goods,"))
                .map((value) => value.split(",")[1]!),
            ),
          ]);
        let eggGoods: Fields = {};
        if (goods.length) {
          const existing = collections.find((value) => value.eggId === id) ?? {
              uid: context.owner,
              eggId: id,
              goods: "",
              reward: 0,
            },
            all = [...new Set([...eggActivityGoods(existing.goods), ...goods])];
          existing.goods = all.join("|");
          eggActivityGoods(existing.goods);
          context.write.eggActivity = { collection: existing };
          eggGoods = eggCollectionView(existing);
        }
        row.exp = cityInteger(num(row, "exp") + cityInteger(rule.exp_finish));
        row.curEgg = eggActivityDraw(context.rules, random);
        row.eggCd = eggActivityIdle;
        body = {
          eggAct: sfs.object(eggActivityView(row)),
          eggGoods: sfs.object(eggGoods),
          reward: sfs.array(reward),
        };
      } else if (command === "egg.exp.reward") {
        const thresholds = eggActivityThresholds(context.rules),
          index = Math.min(num(row, "curExpStage"), thresholds.length - 1),
          threshold = thresholds[index]!;
        if (num(row, "exp") < threshold.exp) eggActivityFailure();
        const reward = grant(threshold.reward);
        row.exp = num(row, "exp") - threshold.exp;
        row.curExpStage = Math.min(index + 1, thresholds.length - 1);
        body = { eggAct: sfs.object(eggActivityView(row)), reward: sfs.array(reward) };
      } else {
        if (params.eggId?.type !== Type.String) eggActivityFailure();
        const id = str(params, "eggId"),
          rule = eggActivityRule(context.rules, id),
          collection = collections.find((value) => value.eggId === id);
        if (!collection || num(collection, "reward") === 1 || eggActivityMissing(collection, rule))
          eggActivityFailure();
        const reward = grant(rule.full ?? "");
        row.exp = cityInteger(num(row, "exp") + cityInteger(rule.exp));
        collection.reward = 1;
        context.write.eggActivity = { collection };
        body = {
          eggAct: sfs.object(eggActivityView(row)),
          reward: sfs.array(reward),
          eggGoods: sfs.object(eggCollectionView(collection)),
        };
      }
      (context.write.eggActivity ??= {}).record = row;
      return { response: encode(body), event: null };
    },
    async apply() {
      eggActivityFailure();
    },
  };
}
