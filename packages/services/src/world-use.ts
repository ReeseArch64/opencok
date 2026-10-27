import { randomInt } from "node:crypto";
import { num } from "@opencok/contracts/rows";
import { encode, int, str, sfs } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { worldItemTarget, worldItemFree, worldItemResource } from "@opencok/rules/world-use";
import {
  worldMonsterProp,
  reusableWorldMonster,
  worldMonsterConfiguration,
  chooseWorldMonsterCells,
  spawnWorldMonsterCells,
} from "@opencok/rules/world-monsters";
import { worldItemUsed } from "@opencok/mappings/world-use";
import type { CityDomain } from "./city-progression";

export const worldUseCommands = ["world.use", "world.get.monster", "get.act.boss.point"];
export function createWorldUseDomain(size: number): CityDomain {
  return {
    commands: worldUseCommands,
    types: [],
    async prepare(context, command, params) {
      if (command === "get.act.boss.point") {
        const world = context.state.worldMutation?.world,
          reader = context.state.worldMonsters;
        if (!world || !reader || num(world, "worldId") !== 0) worldMutationFailure();
        return {
          response: encode({ id: sfs.int(await reader.nearestBoss(num(world, "pointId"))) }),
          event: null,
        };
      }
      if (command === "world.get.monster") {
        const world = context.state.worldMutation?.world,
          reader = context.state.worldMonsters;
        if (
          !world ||
          !reader ||
          num(world, "worldId") !== 0 ||
          num(context.state.profile, "serverId") !== context.rules.kingdomId
        )
          worldMutationFailure();
        const config = context.rules.items.get("world_barbarion"),
          radius = cityInteger(config?.k5, 1, 32),
          target = config?.k8 ?? "",
          minimum = BigInt(cityInteger(config?.k7 ?? 0)) * 60000n,
          minutes = cityInteger(config?.k9, 1),
          nearby = await reader.nearby(num(world, "pointId"), radius),
          reusable = nearby.filter((row) =>
            reusableWorldMonster(row, target, minimum, context.now, context.rules),
          );
        const targetConfig = worldMonsterConfiguration(context.rules, target);
        if (reusable.length)
          return {
            response: encode({
              pointId: sfs.int(num(reusable[randomInt(reusable.length)]!, "id")),
            }),
            event: null,
          };
        const free = nearby.filter(worldItemFree);
        if (!free.length) return { response: encode({ pointId: sfs.int(-1) }), event: null };
        const selected = free[randomInt(free.length)]!,
          primary = {
            ...selected,
            pointType: 9,
            pointItem: target,
            flushTime: context.now + BigInt(minutes) * 60000n,
          },
          refill = await reader.area(
            num(selected, "areaId"),
            cityInteger(context.rules.items.get("monster")?.k1, 1, size),
          );
        const points = [primary],
          chosen = chooseWorldMonsterCells(refill, targetConfig.four, size, randomInt);
        if (chosen.length)
          for (const row of spawnWorldMonsterCells(
            context.rules,
            chosen,
            target,
            context.now,
            86400,
          )) {
            if (num(row, "id") === num(primary, "id")) points[0] = row;
            else points.push(row);
          }
        (context.write.worldMutation ??= {}).points = points;
        return {
          response: encode({ pointId: sfs.int(num(primary, "id")) }),
          event: encode({
            owner: sfs.string(context.owner),
            origin: sfs.int(num(primary, "id")),
            points: sfs.array(points.map((row) => sfs.object({ id: sfs.int(num(row, "id")) }))),
          }),
        };
      }
      const state = context.state.worldMutation,
        id = cityInteger(int(params, "point"), 1, size * size),
        uuid = str(params, "itemUUid"),
        item = context.economy.ownedItem?.(uuid);
      if (!state || !item || item.count < 1 || !context.economy.consumeItem) worldMutationFailure();
      const row = state.points.find((row) => num(row, "id") === id),
        rule = context.rules.goods.get(item.itemId);
      if (!row || !worldItemFree(row) || !["11", "12"].includes(rule?.type ?? ""))
        worldMutationFailure();
      const target = worldItemTarget(rule!, randomInt);
      if (rule!.type === "12") {
        const points = worldMonsterProp(context.rules, state.points, id, target, size, context.now),
          response = worldItemUsed({ pointId: id, itemid: item.itemId });
        context.economy.consumeItem(uuid, 1);
        (context.write.worldMutation ??= {}).points = points;
        return {
          response: encode(response),
          event: encode({
            owner: sfs.string(context.owner),
            origin: sfs.int(id),
            points: sfs.array(points.map((row) => sfs.object({ id: sfs.int(num(row, "id")) }))),
            used: sfs.object(response),
          }),
        };
      }
      const resource = worldItemResource(context.rules, target),
        point = {
          ...row,
          pointType: 3,
          pointItem: String(resource.type),
          resLevel: resource.level,
          resInitValue: resource.amount,
          resCostValue: 0,
          flushTime: context.now + resource.duration,
          flushFlag: 1,
        },
        response = worldItemUsed({ pointId: id, itemid: item.itemId });
      context.economy.consumeItem(uuid, 1);
      (context.write.worldMutation ??= {}).points = [point];
      return {
        response: encode(response),
        event: encode({
          owner: sfs.string(context.owner),
          origin: sfs.int(id),
          points: sfs.array([sfs.object({ id: sfs.int(id) })]),
          used: sfs.object(response),
        }),
      };
    },
    async apply() {
      worldMutationFailure();
    },
  };
}
