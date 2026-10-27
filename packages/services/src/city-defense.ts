import { num, long, text } from "@opencok/contracts/rows";
import { encode, sfs, int } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { cityFireSpeed, settleCityFire } from "@opencok/rules/city-defense";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { extinguishedCity, repairedCity } from "@opencok/mappings/city-defense";
import type { CityDomain, CityProgressionContext } from "./city-progression";

export function cityDefenseMaximum(context: CityProgressionContext) {
  const wall = context.state.buildings.find((building) => num(building, "itemId") === 419000);
  if (!wall) worldMutationFailure();
  const definition = context.rules.building(
    "419000",
    num(wall, "level"),
    num(wall, "star"),
    num(wall, "progress"),
  );
  return cityInteger(
    Math.trunc(Number(definition.clientParameters?.[1]?.value) + context.effect(125)),
  );
}

export const cityDefenseCommands = ["buy.citydef", "world.user.rcd"];
export const cityDefenseDomain: CityDomain = {
  commands: cityDefenseCommands,
  types: [],
  async prepare(context, command, params) {
    const state = context.state.worldMutation;
    if (!state) worldMutationFailure();
    const point = state.points.find((row) => num(row, "id") === num(state.world, "pointId"));
    if (
      !point ||
      num(point, "pointType") !== 1 ||
      text(point, "ownerId") !== context.owner ||
      num(point, "worldId") !== 0
    )
      worldMutationFailure();
    if (
      command === "world.user.rcd" &&
      int(params, "repairType", 0) === 1 &&
      num(point, "x") >= 574 &&
      num(point, "x") <= 626 &&
      num(point, "y") >= 574 &&
      num(point, "y") <= 626
    )
      return { response: encode({ recover: sfs.string("isBlackLand") }), event: null };
    const burning = long(point, "fireTime") !== 0n;
    if (command === "buy.citydef" && !burning) worldMutationFailure();
    const rule = context.rules.items.get("world_fire1");
    if (!rule) worldMutationFailure();
    if (
      command === "world.user.rcd" &&
      context.now - long(state.world, "lastCityDefTime") < BigInt(cityInteger(rule.k2)) * 60000n
    )
      worldMutationFailure();
    const row = settleCityFire(
      point,
      context.now,
      cityFireSpeed(point, state.cityBosses ?? [], context.rules, context.effect),
    );
    let response;
    if (command === "buy.citydef") {
      const cost = cityAmount(rule.k4);
      if (cost > 2147483647n) worldMutationFailure();
      context.economy.gold(-cost);
      row.startOccupyTime = 0n;
      row.fireTime = 0n;
      response = extinguishedCity({
        remainGold: context.balance("gold"),
        cityDef: num(row, "cityDefValue"),
      });
    } else if (command === "world.user.rcd") {
      const maximum = cityDefenseMaximum(context);
      row.cityDefValue = Math.min(
        maximum,
        cityInteger(num(row, "cityDefValue") + cityInteger(rule.k3)),
      );
      (context.write.worldMutation ??= {}).world = { ...state.world, lastCityDefTime: context.now };
      response = repairedCity({
        lastCityDefTime: context.now,
        cityDefValue: num(row, "cityDefValue"),
      });
    } else worldMutationFailure();
    (context.write.worldMutation ??= {}).points = [row];
    return {
      response: encode(response),
      event: encode({
        owner: sfs.string(context.owner),
        origin: sfs.int(num(row, "id")),
        points: sfs.array([sfs.object({ id: sfs.int(num(row, "id")) })]),
      }),
    };
  },
  async apply() {
    worldMutationFailure();
  },
};
