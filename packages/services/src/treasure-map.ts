import { CityCommandDomain } from "./city-command-domain.ts";
import { speedTreasureMarch, worldMarchMutationEvent } from "./world-march-runtime";
import { treasureMapSpeed } from "@opencok/mappings/treasure-map";
import { randomInt, randomUUID } from "node:crypto";
import { num, type Row } from "@opencok/contracts/rows";
import { encode, sfs, str, type Fields } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { chooseWeight } from "@opencok/rules/equipment";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import {
  treasureMapItem,
  treasureMapRules,
  treasureMapCandidates,
  treasureMapFallback,
  treasureMapFree,
} from "@opencok/rules/treasure-map";
import { treasureMapView } from "@opencok/mappings/treasure-map";
import { equipmentItem } from "@opencok/mappings/equipment";
import { treasureMapRoster, writeTreasureMap, deleteTreasureMap } from "./treasure-map-state";
import type { CityDomain } from "./city-domain.ts";
import type { CityProgressionContext } from "./city-progression-context.ts";

async function generate(
  context: CityProgressionContext,
  size: number,
  item: string,
): Promise<Fields> {
  const colour = ["200042", "200043", "200044", "200045", "200046"].indexOf(item) + 1;
  const owned = context.economy.quantity?.(item) ?? 0;

  if (!colour || owned <= 0 || !context.treasurePoints || !context.state.worldMutation)
    {worldMutationFailure();}

  const count = Math.min(
    128,
    owned -
      treasureMapRoster(context).filter(
        (row) => num(row, "state") === 0 && num(row, "colour") === colour,
      ).length,
  );

  if (count <= 0) {return {};}

  const rules = treasureMapRules(context.rules, num(context.state.profile, "level"), colour);
  const hint = rules[0]!,
    origin = num(context.state.worldMutation.world, "pointId");

  if (origin <= 0 || origin > size * size) {worldMutationFailure();}

  const candidates = treasureMapCandidates(
    origin,
    size,
    cityInteger(hint.rangmin),
    cityInteger(hint.rangmax),
  );

  if (!candidates.length) {worldMutationFailure();}

  const planned = Array.from({ length: count }, () => ({
    rule: rules[
      chooseWeight(
        rules.map((row) => cityInteger(row.roll)),
        randomInt,
      )
    ]!,
    point: candidates[randomInt(candidates.length)]!,
  }));
  const points = new Map<number, Row>();
  const read = async (ids: readonly number[]) => {
    const selected = [...new Set(ids)].filter((id) => !points.has(id));

    for (let offset = 0; offset < selected.length; offset += 4096)
      {for (const point of await context.treasurePoints!(selected.slice(offset, offset + 4096)))
        {points.set(num(point, "id"), point);}}
  };
  await read(planned.map((row) => row.point));
  const fallback = new Map<number, readonly number[]>();

  for (const row of planned)
    {if (!treasureMapFree(points.get(row.point)))
      {fallback.set(
        row.point,
        treasureMapFallback(row.point, size, cityInteger(context.rules.items.get("heritage")?.k1)),
      );}}

  await read([...fallback.values()].flat());
  const created = planned.map(({ rule, point }) => {
    const target = treasureMapFree(points.get(point))
      ? point
      : fallback.get(point)?.find((id) => treasureMapFree(points.get(id)));

    if (!target) {worldMutationFailure();}

    if (!context.rules.reconnect.rewards?.has(rule.reward ?? "")) {worldMutationFailure();}

    const row = {
      uuid: randomUUID().replaceAll("-", ""),
      treasureId: rule.id!,
      currentOwner: context.owner,
      originalOwner: context.owner,
      targetId: target,
      time: cityInteger(hint.time, 1),
      colour,
      marchId: "",
      startTime: 0n,
      finishTime: 0n,
      state: 0,
    };
    writeTreasureMap(context, row);

    return row;
  });

  return { treasureMap: sfs.array(created.map((row) => sfs.object(treasureMapView(row)))) };
}

export const treasureMapCommands = [
  "treasuremap.init",
  "treasuremap.get",
  "treasuremap.destroy",
  "treasuremap.spd",
];

export class TreasureMapDomain extends CityCommandDomain {
  public readonly commands: CityDomain["commands"];
  public readonly types: CityDomain["types"];
  public readonly prepare: CityDomain["prepare"];
  public readonly apply: CityDomain["apply"];

  public constructor(size: number) {
    super();

    this.commands = treasureMapCommands;

    this.types = [];

    this.prepare = async (context, command, params) => {
      if (!context.state.worldMutation) {worldMutationFailure();}

      if (command === "treasuremap.init") {
        const rows = treasureMapRoster(context).filter((row) => num(row, "state") === 0);

        return {
          response: encode(
            rows.length
              ? { treasureMap: sfs.array(rows.map((row) => sfs.object(treasureMapView(row)))) }
              : {},
          ),
          event: null,
        };
      }

      if (command === "treasuremap.get")
        {return {
          response: encode(await generate(context, size, str(params, "itemid"))),
          event: null,
        };}

      if (command === "treasuremap.spd") {
        const gold = speedTreasureMarch(context, str(params, "marchid"));

        return {
          response: encode(treasureMapSpeed({ gold })),
          event: encode(worldMarchMutationEvent(context, params)),
        };
      }

      if (command !== "treasuremap.destroy") {worldMutationFailure();}

      const id = str(params, "treasureuuid"),
        row = treasureMapRoster(context).find((row) => row.uuid === id && num(row, "state") === 0);

      if (!row) {worldMutationFailure();}

      const item = treasureMapItem(num(row, "colour")),
        before = context.economy.itemState?.(item);
      context.spendItem(item, 1);
      const count = context.economy.quantity?.(item) ?? 0;
      deleteTreasureMap(context, id);

      return {
        response: encode({
          ...equipmentItem(item, count, before ? { ...before, count } : undefined, context.rules),
          treasureuuid: sfs.string(id),
        }),
        event: null,
      };
    };

    this.apply = async () => {
      worldMutationFailure();
    };
  }
}

export function createTreasureMapDomain(size: number): CityDomain {
  return new TreasureMapDomain(size);
}
