import { CityCommandDomain } from "./city-command-domain.ts";
import { randomUUID } from "node:crypto";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import { encode, str, int, Type } from "@opencok/messages/sfs";
import { serverFeature } from "@opencok/rules/power-context";
import {
  investmentFailure,
  investmentDays,
  investmentSchedule,
  investmentFlags,
  localActivityConditions,
} from "@opencok/rules/daily-investment";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { javaMailBytes } from "@opencok/rules/avatar-mail";
import { dailyInvestmentView } from "@opencok/mappings/daily-investment";
import type { Rule } from "@opencok/rules/game";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

function mail(context: CityProgressionContext, rule: Rule, key: string) {
  const id = rule[key];

  if (!id?.trim()) return;

  const template = context.rules.mail.get(id);
  const contents = javaMailBytes(
    template?.message &&
      `${template.message}${key === "start_mail" ? `|${rule.gold}|${rule.time}` : ""}`,
  );

  if (!template || !contents) investmentFailure();

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
      rewardId: null,
      rewardStatus: 1,
      reply: 0,
      createTime: context.now,
    },
  ];
}

export class DailyInvestmentDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"] = [
    "invest.add",
    "invest.open.ui",
    "invest.receive",
    "invest.init",
  ];

  public readonly types: CityDomain["types"] = [];

  public readonly prepare: CityDomain["prepare"] = async (context, command, params) => {
    const state = context.state.dailyInvestment;

    if (!state) investmentFailure();

    const empty = () => ({ response: encode({}), event: null });

    if (
      !serverFeature(context.rules, "bank", {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      })
    ) {
      if (["invest.add", "invest.receive"].includes(command)) investmentFailure();

      return empty();
    }

    const before = state.record;
    let row: Row | undefined = before ? { ...before } : undefined;
    const eligible = (rule: Rule) => {
      const castle = context.state.buildings.find((building) => num(building, "itemId") === 400000);
      let vip = 0;

      for (const item of context.rules.power.vip?.values() ?? [])
        if (cityInteger(item.point) <= num(context.state.effects.vip ?? {}, "score"))
          vip = (cityInteger(item.id) % 100) + 1;

      return (
        context.now >= state.serverOpenTime &&
        localActivityConditions(
          rule.condition,
          num(castle ?? {}, "level") + num(castle ?? {}, "star"),
          vip,
          investmentDays(context.now, state.serverOpenTime),
        )
      );
    };

    if (command === "invest.open.ui") {
      const plans = [...(context.rules.advanced.dailyInvestments?.values() ?? [])];

      if (plans.length > 1024) investmentFailure();

      return {
        response: encode({
          id_list: {
            type: Type.StringArray,
            value: plans
              .filter(
                (rule) =>
                  (eligible(rule) && rule.on_sale === "1") ||
                  (row && num(row, "endactive") === 0 && text(row, "tableid") === rule.id),
              )
              .map((rule) => rule.id!),
          },
          ...(row && num(row, "endactive") === 0
            ? dailyInvestmentView({
                id_table: num(row, "tableid"),
                id_receive: text(row, "isreceive"),
                interval_day: investmentDays(context.now, long(row, "beginTime")),
              })
            : {}),
        }),
        event: null,
      };
    }

    if (command === "invest.add") {
      if (row && num(row, "endactive") === 0) investmentFailure();

      const id = str(params, "id"),
        rule = context.rules.advanced.dailyInvestments?.get(id);

      if (!rule || !eligible(rule) || rule.on_sale !== "1") investmentFailure();

      const schedule = investmentSchedule(rule),
        cost = cityAmount(rule.gold);

      if (context.balance("gold") < cost) investmentFailure();

      context.economy.gold(-cost);
      row = {
        uid: context.owner,
        tableid: cityInteger(id, 1),
        level: num(context.state.profile, "level"),
        isreceive: schedule.map(() => "0").join(";"),
        beginTime: context.now,
        receiveTime: 0n,
        endactive: 0,
        promptTime: 0n,
      };
      mail(context, rule, "start_mail");
      context.write.dailyInvestment = row;

      return {
        response: encode(
          dailyInvestmentView({
            id_table: num(row, "tableid"),
            id_receive: text(row, "isreceive"),
          }),
        ),
        event: null,
      };
    }

    if (!row || num(row, "endactive") !== 0) {
      if (command === "invest.init") return empty();

      investmentFailure();
    }

    const rule = context.rules.advanced.dailyInvestments?.get(text(row, "tableid"));

    if (!rule) investmentFailure();

    const schedule = investmentSchedule(rule),
      flags = investmentFlags(text(row, "isreceive")),
      days = investmentDays(context.now, long(row, "beginTime"));

    if (schedule.length !== flags.length) investmentFailure();

    if (command === "invest.init") {
      if (
        long(row, "promptTime") / 86400000n !== context.now / 86400000n &&
        flags.some((flag, i) => flag === "0" && i <= days)
      ) {
        mail(context, rule, "note_mail");
        row.promptTime = context.now;
        context.write.dailyInvestment = row;
      }

      return empty();
    }

    const position = cityInteger(int(params, "pos"), 0, flags.length - 1);

    if (position > days || flags[position] !== "0") investmentFailure();

    const gold = schedule[position]!;
    context.economy.gold(BigInt(gold));
    flags[position] = "1";
    row.isreceive = flags.join(";");
    row.receiveTime = context.now;

    if (flags.every((flag) => flag === "1")) {
      row.endactive = 1;
      mail(context, rule, "end_mail");
    }

    context.write.dailyInvestment = row;

    return {
      response: encode(
        dailyInvestmentView({
          id_table: num(row, "tableid"),
          id_receive: text(row, "isreceive"),
          gold,
        }),
      ),
      event: null,
    };
  };

  public readonly apply: CityDomain["apply"] = async () => {
    investmentFailure();
  };
}

export const dailyInvestmentDomain: CityDomain = new DailyInvestmentDomain();
