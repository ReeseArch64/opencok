import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num } from "@opencok/contracts/rows";
import { encode, int, sfs, Type } from "@opencok/messages/sfs";
import { serverFeature } from "@opencok/rules/power-context";
import { cityInteger } from "@opencok/rules/city-progression";
import type { CityDomain } from "./city-progression";

export const branchCityDomain: CityDomain = {
  commands: ["branchcity.init", "branchcity.open"],
  types: [],
  async prepare(context, command, params) {
    const saved = context.state.branchCity;
    if (saved === undefined) throw new GameError(errors.unsupported, "city_progression");
    let state = saved === null ? 0 : cityInteger(saved.openstate, 0, 2);
    const feature = (key: string) =>
      serverFeature(context.rules, key, {
        kingdomId: context.rules.kingdomId,
        version: "12.06.0",
        now: Number(context.now),
      });
    if (command === "branchcity.open") {
      const typed = params.branchCityType !== undefined;
      if (typed && params.branchCityType!.type !== Type.Int)
        throw new GameError(errors.invalid, "city_progression");
      const hero = typed && int(params, "branchCityType") === 1;
      const castle = context.state.buildings.find((row) => num(row, "itemId") === 400000);
      const required = context.rules.items.get("subcity_reward")?.[hero ? "k5" : "k4"];
      if (
        !feature("subcity") ||
        !castle ||
        required === undefined ||
        num(castle, "level") + num(castle, "star") < cityInteger(required, 1)
      )
        throw new GameError(errors.invalid, "city_progression");
      const next = hero ? 2 : 1;
      if (saved === null || (typed && state !== 1 && state !== next)) {
        state = next;
        context.write.branchCityOpenState = state;
      }
      return {
        response: encode({ branchcityopen: typed ? sfs.int(state) : sfs.bool(state > 0) }),
        event: null,
      };
    }
    return {
      response: encode({
        branchcityopen: feature("hero_building") ? sfs.int(state) : sfs.bool(state > 0),
      }),
      event: null,
    };
  },
  async apply() {
    throw new GameError(errors.unsupported);
  },
};
