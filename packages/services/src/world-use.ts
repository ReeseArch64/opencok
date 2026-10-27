import { randomInt } from "node:crypto";
import { num } from "@opencok/contracts/rows";
import { encode, int, str, sfs } from "@opencok/messages/sfs";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { worldItemTarget, worldItemFree, worldItemResource } from "@opencok/rules/world-use";
import { worldItemUsed } from "@opencok/mappings/world-use";
import type { CityDomain } from "./city-progression";

export const worldUseCommands = ["world.use"];
export function createWorldUseDomain(size: number): CityDomain {
  return {
    commands: worldUseCommands,
    types: [],
    async prepare(context, _command, params) {
      const state = context.state.worldMutation,
        id = cityInteger(int(params, "point"), 1, size * size),
        uuid = str(params, "itemUUid"),
        item = context.economy.ownedItem?.(uuid);
      if (!state || !item || item.count < 1 || !context.economy.consumeItem) worldMutationFailure();
      const row = state.points.find((row) => num(row, "id") === id),
        rule = context.rules.goods.get(item.itemId);
      if (!row || !worldItemFree(row) || rule?.type !== "11") worldMutationFailure();
      const resource = worldItemResource(context.rules, worldItemTarget(rule, randomInt)),
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
