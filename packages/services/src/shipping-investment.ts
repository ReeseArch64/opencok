import { CityCommandDomain } from "./city-command-domain.ts";
import { randomInt } from "node:crypto";
import { num, long } from "@opencok/contracts/rows";
import { encode, str } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { localEventControlOpen } from "@opencok/rules/local-events";
import {
  shippingInvestmentAward,
  shippingInvestmentFailure,
} from "@opencok/rules/shipping-investment";
import { shippingInvestmentView } from "@opencok/mappings/shipping-investment";
import type { CityDomain } from "./city-domain.ts";

export class ShippingInvestmentDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(random: (maximum: number) => number = randomInt) {
    super();

    this.commands = ["shipping.trade.invest.ui", "shipping.trade.invest.reward"];

    this.types = [];

    this.prepare = async (context, command, params) => {
      const empty = () => ({ response: encode({}), event: null });

      if (
        !localEventControlOpen(context.rules, "69027", {
          kingdomId: context.rules.kingdomId,
          version: "12.06.0",
          now: Number(context.now),
        })
      )
        {return empty();}

      const mixed = context.state.quests?.mixed;

      if (!mixed || mixed.uid !== context.owner) {return empty();}

      const plans = [...(context.rules.advanced.shippingInvestments?.values() ?? [])];

      if (
        !plans.length ||
        plans.length > 1024 ||
        new Set(plans.map((rule) => cityInteger(rule.Seq, 1))).size !== plans.length
      )
        {shippingInvestmentFailure();}

      let count = cityInteger(mixed.shippingTradeInvest ?? 0),
        gold = cityInteger(mixed.shippingTradeInvestGold ?? 0);

      if (command === "shipping.trade.invest.reward") {
        const id = str(params, "id"),
          rule = context.rules.advanced.shippingInvestments?.get(id);

        if (!rule) {shippingInvestmentFailure();}

        if (cityInteger(rule.Seq, 1) !== count + 1) {return empty();}

        const vip = context.state.effects.vip;
        let vipLevel = 0;

        if (vip && long(vip, "vipEndTime") > context.now)
          {for (const item of context.rules.power.vip?.values() ?? [])
            {if (cityInteger(item.point) <= num(vip, "score"))
              {vipLevel = (cityInteger(item.id) % 100) + 1;}}}

        if (vipLevel < cityInteger(rule.vip)) {return empty();}

        const cost = cityInteger(rule.Needgold, 1);

        if (context.balance("gold") < BigInt(cost)) {shippingInvestmentFailure();}

        gold = shippingInvestmentAward(rule, random);
        context.economy.gold(-BigInt(cost));
        context.economy.gold(BigInt(gold));
        count = cityInteger(count + 1);
        context.write.shippingInvestment = { count, gold };
      }

      const next = plans.find((rule) => cityInteger(rule.Seq, 1) === count + 1);

      return {
        response: encode(
          shippingInvestmentView({
            count,
            sum_count: plans.length,
            gold,
            ...(next ? { gold_reward: next } : {}),
          }),
        ),
        event: null,
      };
    };

    this.apply = async () => {
      shippingInvestmentFailure();
    };
  }
}

export function createShippingInvestmentDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  return new ShippingInvestmentDomain(random);
}
