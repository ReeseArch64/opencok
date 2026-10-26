import { randomInt } from "node:crypto";
import { encode, decode, sfs, str, type Value } from "@opencok/messages/sfs";
import { campaignFailure } from "@opencok/rules/local-campaign";
import { cityInteger } from "@opencok/rules/city-progression";
import { createFragmentExchangeDomain } from "./fragment-exchange";
import { createMonsterExchangeDomain } from "./monster-exchange";
import type { CityDomain } from "./city-progression";
export function createExchangeActivityDomain(
  random: (maximum: number) => number = randomInt,
): CityDomain {
  const fragments = createFragmentExchangeDomain(random),
    tokens = createMonsterExchangeDomain(random);
  return {
    commands: fragments.commands,
    types: [],
    async prepare(context, command, params) {
      if (command === "act.exchange") {
        const ids = str(params, "ids").split("|").filter(Boolean),
          exchange: Value[] = [];
        if (ids.length > 64) campaignFailure();
        for (const id of new Set(ids)) {
          cityInteger(id, 1);
          const domain =
            context.rules.power.activityPanels?.get(id)?.exchange === "1" ? tokens : fragments;
          const result = await domain.prepare(context, command, { ...params, ids: sfs.string(id) });
          if (result.event !== null) throw new Error("Unexpected exchange projection event");
          exchange.push(...(decode(Buffer.from(result.response)).exchange!.value as Value[]));
        }
        return { response: encode({ exchange: sfs.array(exchange) }), event: null };
      }
      const id = str(params, command === "act.ex.flush" ? "actId" : "id");
      const domain =
        context.rules.power.activityPanels?.get(id)?.exchange === "1" ? tokens : fragments;
      return domain.prepare(context, command, params);
    },
    async apply() {
      campaignFailure();
    },
  };
}
