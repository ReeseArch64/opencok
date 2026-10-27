import { randomInt } from "node:crypto";
import { javaHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import { pinProgressionReward } from "./progression-rewards";
import type { CityProgressionContext } from "./city-progression-context.ts";

export function sharedResourceRewards(
  context: Pick<CityProgressionContext, "rules" | "now">,
  elapsed: bigint,
  random = randomInt,
) {
  const rule = context.rules.items.get("on_event2"),
    seconds = cityInteger(rule?.k5, 1),
    ids = rule?.k6?.split(";") ?? [],
    weights = rule?.k7?.split(";").map((value) => cityInteger(value)) ?? [];

  if (!ids.length || ids.length !== weights.length) worldMutationFailure();

  const total = cityInteger(
    weights.reduce((sum, value) => sum + value, 0),
    1,
  );
  const spent = cityInteger(elapsed / 1000n),
    rolls = cityInteger(
      Math.trunc(spent / seconds) + (random(seconds) < spent % seconds ? 1 : 0),
      0,
      4096,
    ),
    counts = new Map<string, number>();

  for (let index = 0; index < rolls; index++) {
    let choice = random(total);
    const selected = ids.find((_id, index) => {
      choice -= weights[index]!;

      return choice < 0;
    });

    if (!selected) worldMutationFailure();

    counts.set(selected, (counts.get(selected) ?? 0) + 1);
  }

  const order = javaHashMapOrder(counts.keys());

  if (!order.length) return { reward: "", counts: [] };

  const stored = order.map((id) => ({ id, count: counts.get(id)! }));
  const reward = pinStoredSharedResourceRewards(context, stored);

  return { reward, counts: order.map((id) => ({ id, count: counts.get(id)! })) };
}

export function pinStoredSharedResourceRewards(
  context: Pick<CityProgressionContext, "rules" | "now">,
  counts: readonly { id: string; count: number }[],
) {
  if (
    counts.length > 4096 ||
    counts.some((row) => typeof row.id !== "string" || !row.id || row.id.length > 255)
  )
    worldMutationFailure();

  const rolls = cityInteger(
    counts.reduce((sum, row) => sum + cityInteger(row.count, 1), 0),
    0,
    4096,
  );

  if (!rolls) return "";

  const awards = new Map<string, number>();

  for (let index = 0; index < rolls; index++)
    for (const row of mailRewardEntries(pinProgressionReward(context, counts[0]!.id))) {
      const key = `${row.category},${row.itemId}`;
      awards.set(key, cityInteger((awards.get(key) ?? 0) + row.count, 1));
    }

  return [...awards].map(([key, count]) => `${key},${count}`).join("|");
}
