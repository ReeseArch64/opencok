import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { num, text } from "@opencok/contracts/rows";
import { encode, sfs, str, int, type Fields } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import {
  boxFailure,
  boxWords,
  boxWord,
  setBoxWord,
  boxCounter,
  setBoxCounter,
  boxSelection,
} from "@opencok/rules/ordinary-box";
import { localActivityConditions, investmentDays } from "@opencok/rules/daily-investment";
import { serverFeature } from "@opencok/rules/power-context";
import { ordinaryBoxPreview } from "@opencok/mappings/ordinary-box";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { previewRewards } from "@opencok/rules/rewards";
import { pinProgressionReward, grantNativeProgressionReward } from "./progression-rewards";
import type { CityDomain } from "./city-domain.ts";

export class OrdinaryBoxDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["get.table.value", "ordinary.box.open", "ordinary.box.init"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const ruleContext = {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        },
        mixed = context.state.quests?.mixed ?? {};

      if (command === "ordinary.box.init") {
        if (num(mixed, "ordinaryBoxGold") !== 0) context.write.ordinaryBox = { gold: false };

        return { response: encode({}), event: null };
      }

      const type = command === "get.table.value" ? int(params, "type") : 0;
      const goldEnabled = serverFeature(context.rules, "box_ordinary_money", ruleContext);

      if (type === 2) {
        const gold = goldEnabled && str(params, "params").toLowerCase() === "true";
        context.write.ordinaryBox = { gold };

        return { response: encode({ state: sfs.bool(gold) }), event: null };
      }

      if (command === "get.table.value" && type !== 1 && type !== 2)
        return { response: encode({}), event: null };

      const itemId = str(params, type === 1 ? "params" : "itemId"),
        rule = context.rules.goods.get(itemId);

      if (!rule || rule.type !== "36") boxFailure();

      const slot = cityInteger(rule.para1, 1, 12),
        words = boxWords(text(mixed, "mdata")),
        opened = context.state.ordinaryBoxServer?.openedAt ?? 0n;
      const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
      let vip = 0;

      for (const row of context.rules.power.vip?.values() ?? [])
        if (cityInteger(row.point) <= num(context.state.effects.vip ?? {}, "score"))
          vip = (cityInteger(row.id) % 100) + 1;

      const pin = () => {
        const result = boxSelection(
          context.rules,
          slot,
          (table) =>
            context.now >= opened &&
            localActivityConditions(
              table.condition,
              num(castle ?? {}, "level") + num(castle ?? {}, "star"),
              vip,
              investmentDays(context.now, opened),
            ),
          context.effect(455) > 0,
          random,
        );
        setBoxWord(words, slot, 1, 31, result.id);
        setBoxWord(words, 18, slot, 1, result.special);
      };
      let reward = boxWord(words, slot, 1, 31);

      if (!reward) {
        pin();
        reward = boxWord(words, slot, 1, 31);
      }

      let gold = type === 0 && goldEnabled && num(mixed, "ordinaryBoxGold") === 1;
      const body: Fields = {};

      if (type === 0) {
        if (cityInteger(int(params, "count"), 1) !== 1) boxFailure();

        if (gold) {
          const cost = cityInteger(rule.para5, 1);

          if (context.balance("gold") < BigInt(cost)) boxFailure();

          context.economy.gold(-BigInt(cost));
        } else if (rule.para4?.trim()) context.economy.item(rule.para4, -1);

        body.reward = sfs.array(
          grantNativeProgressionReward(
            context,
            pinProgressionReward(context, String(reward), context.rules.advanced.payRewards),
          ),
        );

        if (rule.para2?.trim()) {
          let count = boxCounter(words, slot) + 1;
          const guarantee = cityInteger(rule.para2, 1, 127);

          if (count >= guarantee) {
            count = 0;

            if (rule.para3?.trim())
              body.baodi_reward = sfs.array(
                grantNativeProgressionReward(context, pinProgressionReward(context, rule.para3)),
              );
          }

          setBoxCounter(words, slot, count);
        }

        pin();
        reward = boxWord(words, slot, 1, 31);
        body.gold = sfs.long(context.balance("gold"));
      } else gold = false;

      const pay = context.rules.advanced.payRewards?.get(String(reward));

      if (!pay) boxFailure();

      const ids = (pay.item ?? "").split(";").filter(Boolean),
        amounts = (pay.num ?? "").split(";").filter(Boolean);

      if (ids.length !== amounts.length) boxFailure();

      const preview = ordinaryBoxPreview({
        reward_info: ids.map((id, i) => ({ id, num: amounts[i]! })),
        baodi_num: boxCounter(words, slot),
        special: boxWord(words, 18, slot, 1),
        ...(rule.para5?.trim() ? { para5: cityInteger(rule.para5) } : {}),
      });
      Object.assign(body, preview);

      if (type === 1 && rule.para3?.trim())
        body.baodi_reward = rewardPreviewArray(
          previewRewards(rule.para3, context.rules, ruleContext, random),
        );

      context.write.ordinaryBox = { mdata: words.join(",") + ",", gold };

      return {
        response: encode(type === 1 ? { params: sfs.object(body), type: sfs.int(1) } : body),
        event: null,
      };
    };

    this.apply = async () => {
      boxFailure();
    };
  }
}

export function createOrdinaryBoxDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return new OrdinaryBoxDomain(random);
}
