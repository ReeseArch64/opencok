import { randomInt } from "node:crypto";
import { long, num, text } from "@opencok/contracts/rows";
import type { WorldResourceNewStore } from "@opencok/contracts/world-resource-new";
import type { Rules } from "@opencok/rules/game";
import { worldResourceAreaCount } from "@opencok/rules/world-resource-refresh";
import { worldResourceNewSettings, worldResourceNewSlots } from "@opencok/rules/world-resource-new";

export async function refreshWorldResourceNew(
  store: WorldResourceNewStore,
  rules: Rules,
  size: number,
  random = randomInt,
) {
  const settings = worldResourceNewSettings(rules, store.now);
  if (!settings || (store.clock && BigInt(store.clock.nextRefreshAt) > store.now)) return;
  const expired = await store.expired();
  for (const point of expired) {
    if (await store.occupied(point)) {
      await store.postpone(point, long(point, "flushTime") + settings.lifetime);
      continue;
    }
    const item = text(point, "pointItem");
    if (
      num(point, "flushFlag") === 0 &&
      (!item || /^[0-5]$/.test(item)) &&
      (await store.population(num(point, "areaId"))) <= settings.quota
    )
      await store.ticket(point);
    await store.clear(point);
  }
  const orphans = await store.clearOrphans(),
    pending = await store.pending();
  for (const ticket of pending) {
    const area = num(ticket, "areaId");
    if ((await store.population(area)) > settings.quota) {
      await store.removeTicket(ticket);
      continue;
    }
    if (
      settings.open &&
      (await store.spawn(
        area,
        settings.amount,
        worldResourceNewSlots(rules, random),
        store.now + settings.lifetime,
      ))
    )
      await store.removeTicket(ticket);
    else await store.retry(ticket);
  }
  const areas = worldResourceAreaCount(rules, size),
    clock = store.clock
      ? { ...store.clock }
      : { version: 1 as const, areaCursor: 1, nextRefreshAt: "0" };
  let budget = 64;
  if (settings.open && settings.quota > 0)
    for (let visited = 0; visited < 8 && clock.areaCursor <= areas && budget > 0; visited++) {
      let population = await store.population(clock.areaCursor);
      while (population < settings.quota && budget > 0) {
        budget--;
        if (
          !(await store.spawn(
            clock.areaCursor,
            settings.amount,
            worldResourceNewSlots(rules, random),
            store.now + settings.lifetime,
          ))
        )
          break;
        population++;
      }
      if (budget > 0 || population >= settings.quota) clock.areaCursor++;
    }
  if (!settings.open || settings.quota === 0 || clock.areaCursor > areas) {
    clock.areaCursor = 1;
    clock.nextRefreshAt = String(
      expired.length === 64 || orphans === 64 || pending.length === 64
        ? store.now
        : store.now + 1800000n,
    );
  }
  await store.save(clock);
}
