import { newEquipment } from "./equipment";
import { randomInt } from "node:crypto";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { previewRewards } from "@opencok/rules/rewards";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import type { RewardPreview } from "@opencok/contracts/rewards";
import type { CityProgressionContext } from "./city-progression";

const assets = [
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "exp",
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "chip",
  "diamond",
  undefined,
  "dragon_food",
  "dragon_gold",
] as const;
export function pinProgressionReward(context: CityProgressionContext, id: string) {
  if (!context.rules.reconnect.rewards?.has(id))
    throw new GameError(errors.unsupported, "city_progression");
  return previewRewards(
    id,
    context.rules,
    { kingdomId: context.rules.kingdomId, version: "12.06.0", now: Number(context.now) },
    randomInt,
  )
    .map((row) => {
      if (row.kind === "item")
        return `${row.type === 7 ? "goods" : "equip"},${row.id},${row.count}`;
      if (row.kind === "count" && assets[row.type]) return `${assets[row.type]},0,${row.value}`;
      throw new GameError(errors.unsupported, "city_progression");
    })
    .join("|");
}
export function progressionRewardPreview(raw: string): RewardPreview[] {
  return mailRewardEntries(raw).map((row) => {
    if (row.category === "goods" || row.category === "equip")
      return {
        kind: "item",
        type: row.category === "goods" ? 7 : 14,
        id: row.itemId,
        count: row.count,
      };
    const type = assets.indexOf(row.category as (typeof assets)[number]);
    if (type < 0) throw new GameError(errors.unsupported, "city_progression");
    return { kind: "count", type, value: row.count };
  });
}
export function grantPinnedProgressionReward(context: CityProgressionContext, raw: string) {
  const rows = progressionRewardPreview(raw);
  for (const row of rows) {
    if (row.kind === "item") {
      if (row.type === 7) context.economy.item(row.id, row.count);
      else {
        const equipment = [...(context.write.equipment ?? [])];
        for (let i = 0; i < row.count; i++) {
          context.write.equipment = equipment;
          equipment.push(newEquipment(context, row.id));
        }
        context.write.equipment = equipment;
      }
    } else if (row.kind === "count") {
      if (row.type === 5) context.economy.gold(BigInt(row.value));
      else if (row.type === 6) context.experience(row.value);
      else
        context.economy.resource(
          assets[row.type] as
            | "wood"
            | "stone"
            | "iron"
            | "food"
            | "silver"
            | "chip"
            | "diamond"
            | "dragon_food"
            | "dragon_gold",
          BigInt(row.value),
        );
    }
  }
  return rewardPreviewArray(rows);
}
