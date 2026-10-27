import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { encode, sfs } from "@opencok/messages/sfs";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import {
  luckyDayFeatureOpen,
  luckyDayPanel,
  luckyDayEffects,
} from "@opencok/rules/power-lucky-day";
import { luckyFailure, luckyChoice } from "@opencok/rules/lucky-day";
import { cityInteger } from "@opencok/rules/city-progression";
import { luckyDayView } from "@opencok/mappings/lucky-day";
import type { CityDomain } from "./city-domain.ts";

export class LuckyDayDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["luckyday.effect", "luckyday.init"];

    this.types = [];

    this.prepare = async (context, command) => {
      const state = context.state.luckyDay;

      if (!state) luckyFailure();

      const ruleContext = {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      };
      const empty = () => ({ response: encode({}), event: null });

      if (!luckyDayFeatureOpen(context.state.profile, context.rules, ruleContext) || !state.server)
        return empty();

      const panel = luckyDayPanel(state.server, context.rules, ruleContext);

      if (!panel) return empty();

      const ids = (panel.para1 ?? "").split(";").filter(Boolean);

      if (!ids.length || ids.length > 128) return empty();

      const id = ids[cityInteger(random(ids.length), 0, ids.length - 1)]!,
        rule = context.rules.advanced.luckyDays?.get(id);

      if (!rule) luckyFailure();

      const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);

      if (
        command !== "luckyday.init" &&
        num(castle ?? {}, "level") < cityInteger(rule.open_level, 1)
      )
        return empty();

      const row: Row = state.day
        ? { ...state.day }
        : {
            uid: context.owner,
            unluckyCount: 0,
            status: 0,
            time: 0n,
            effectId: "",
            luckyCount: 0,
            lucky_id: 0,
          };
      const sameDay = (at: bigint) => at / 86400000n === context.now / 86400000n;
      const active =
        num(row, "status") === 1 && context.now < long(row, "time") && num(row, "lucky_id") > 0;

      if (command === "luckyday.init") {
        if (!state.day) context.write.luckyDay = row;

        const activeRule = active
          ? context.rules.advanced.luckyDays?.get(text(row, "lucky_id"))
          : rule;

        if (!activeRule) luckyFailure();

        return {
          response: encode({
            luckyday: sfs.object(
              luckyDayView({
                luckyeffectId: active ? text(row, "effectId") : "-1",
                getEffectTimes: sameDay(long(row, "time")) ? num(row, "luckyCount") : 0,
                totalTimes: cityInteger(activeRule.times_24hr, 1),
                effectEndTime: long(row, "time"),
                lucky_id: active ? text(row, "lucky_id") : "-1",
              }),
            ),
          }),
          event: null,
        };
      }

      if (active) return empty();

      if (!sameDay(long(row, "time"))) row.luckyCount = 0;

      const maximum = cityInteger(rule.times_24hr, 1);

      if (num(row, "luckyCount") >= maximum) return empty();

      if (
        num(row, "status") !== 1 &&
        context.now < long(row, "time") + BigInt(cityInteger(rule.open_time)) * 60000n
      )
        return empty();

      const draw = cityInteger(random(100), 0, 99) + 1;
      let effect = "-1";

      if (
        num(row, "unluckyCount") < cityInteger(rule.rnd_times) &&
        draw > cityInteger(rule.open_rate, 0, 100)
      )
        Object.assign(row, {
          unluckyCount: cityInteger(num(row, "unluckyCount") + 1),
          time: context.now,
          status: 0,
        });
      else {
        effect = luckyChoice(rule, context.rules, random);
        const end = context.now + BigInt(cityInteger(rule.life_time, 1)) * 60000n;
        Object.assign(row, {
          unluckyCount: 0,
          status: 1,
          effectId: effect,
          time: end,
          lucky_id: cityInteger(id, 1),
          luckyCount: sameDay(end) ? cityInteger(num(row, "luckyCount") + 1) : 0,
        });
        luckyDayEffects(context.state.profile, row, state.server, context.rules, ruleContext);
      }

      context.write.luckyDay = row;

      return {
        response: encode(
          luckyDayView({
            luckyeffectId: effect,
            getEffectTimes: num(row, "luckyCount"),
            totalTimes: maximum,
            effectEndTime: long(row, "time"),
            lucky_id: effect === "-1" ? "-1" : id,
          }),
        ),
        event: null,
      };
    };

    this.apply = async () => {
      luckyFailure();
    };
  }
}

export function createLuckyDayDomain(random: (maximum: number) => number = randomInt): CityDomain {
  return new LuckyDayDomain(random);
}
