import { randomInt } from "node:crypto";
import { num, text } from "@opencok/contracts/rows";
import type { WorldResourceRefreshStore } from "@opencok/contracts/world-resource-refresh";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldMutationFailure } from "@opencok/rules/world-march-runtime";
import {
  worldResourceAreaCount,
  worldResourceBlackLand,
  worldResourceChoice,
  worldResourceDuration,
  worldResourceQuota,
} from "@opencok/rules/world-resource-refresh";

export async function refreshWorldResources(
  store: WorldResourceRefreshStore,
  rules: Rules,
  size: number,
  effects: ReadonlyMap<number, number>,
  random = randomInt,
) {
  const { now } = store;
  const ready = store.opening > 0n && store.opening <= now;

  if (ready && store.clock && store.clock.nextRefreshAt > now) return;

  const quota = ready ? worldResourceQuota(rules) : 0,
    blackMinimum = ready ? cityInteger(rules.items.get("blackland_resource")?.k1) : 0,
    blackMaximum = ready
      ? cityInteger(rules.items.get("blackland_resource")?.k2, blackMinimum, 64)
      : 0;
  const limit = (area: number) => (area === 0 ? blackMaximum : quota);
  const expired = await store.expired();

  for (const point of expired) {
    if (text(point, "ownerMarchUUid") || text(point, "ownerId")) {
      await store.postpone(point, now + worldResourceDuration(rules, num(point, "resLevel")));
      continue;
    }

    const area = worldResourceBlackLand(point) ? 0 : num(point, "areaId");

    if (ready && num(point, "flushFlag") === 0 && (await store.population(area)) <= limit(area))
      await store.ticket(
        area,
        num(point, "resLevel"),
        text(point, "pointItem"),
        now + worldResourceDuration(rules, num(point, "resLevel"), true),
      );

    await store.clear(point);
  }

  if (!ready) return;

  const count = cityInteger(rules.items.get("resources_weight")?.k8, 1, 32),
    interval = BigInt(Math.trunc(Number(rules.items.get("resources_weight")?.k7) * 86400000));

  if (interval <= 0n) worldMutationFailure();

  const clock = store.clock
    ? { ...store.clock }
    : {
        worldId: 0,
        groupStartedAt: now,
        usedGroups: String(random(count)),
        areaCursor: 0,
        nextRefreshAt: 0n,
      };
  let used = clock.usedGroups.split(",").map((id) => cityInteger(id, 0, count - 1));

  if (new Set(used).size !== used.length || used.length > count) worldMutationFailure();

  if (now >= clock.groupStartedAt + interval) {
    const available = Array.from({ length: count }, (_, index) => index).filter(
      (id) => !used.includes(id),
    );
    const next = available.length ? available[random(available.length)]! : random(count);
    used = available.length ? [next, ...used] : [next];
    clock.usedGroups = used.join(",");
    clock.groupStartedAt = now;
  }

  const group = rules.world.resources?.get(used[0] === 0 ? "resources" : `resources${used[0]}`);

  if (!group?.length) worldMutationFailure();

  const areas = worldResourceAreaCount(rules, size);
  const spawn = async (area: number) => {
    const point = await store.free(area);

    if (!point) return undefined;

    const chosen = worldResourceChoice(
      rules,
      group,
      point,
      size,
      now - store.opening,
      effects,
      area !== 0 && store.goldBonusUntil > now,
      random,
      area === 0,
    );

    if (!chosen) return undefined;

    if (chosen.type !== 6)
      await store.spawn(
        point,
        chosen.type,
        chosen.level,
        chosen.amount,
        now + worldResourceDuration(rules, chosen.level),
      );

    return chosen;
  };
  const pending = await store.pending();

  for (const ticket of pending) {
    const area = num(ticket, "areaId");

    if ((await store.population(area)) > limit(area)) {
      await store.removeTicket(ticket);
      continue;
    }

    const chosen = await spawn(area);

    if (chosen && chosen.type !== 6) await store.removeTicket(ticket);
    else await store.retry(ticket, now + worldResourceDuration(rules, num(ticket, "level"), true));
  }

  let blackPopulation = await store.population(0);

  if (blackPopulation <= blackMinimum)
    for (let budget = 0; budget < 64 && blackPopulation < blackMaximum; budget++) {
      const chosen = await spawn(0);

      if (!chosen) break;

      if (chosen.type === 6)
        await store.ticket(0, 1, "0", now + worldResourceDuration(rules, 1, true));

      blackPopulation++;
    }

  let budget = 64;

  for (let visited = 0; visited < 8 && budget > 0 && clock.areaCursor < areas; visited++) {
    const area = clock.areaCursor + 1;
    let population = await store.population(area);

    while (population < quota && budget-- > 0) {
      const chosen = await spawn(area);

      if (!chosen) break;

      if (chosen.type === 6)
        await store.ticket(area, 1, "0", now + worldResourceDuration(rules, 1, true));

      population++;
    }

    if (budget > 0 || population >= quota) clock.areaCursor++;
  }

  if (clock.areaCursor >= areas) {
    clock.areaCursor = 0;
    clock.nextRefreshAt = expired.length === 64 || pending.length === 64 ? now : now + 1800000n;
  }

  await store.save(clock);
}
