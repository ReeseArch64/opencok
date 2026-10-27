import { randomInt } from "node:crypto";
import { num, text, long, type Row } from "@opencok/contracts/rows";
import type {
  WorldMonsterRefreshStore,
  WorldMonsterSupplyClock,
  WorldMonsterFamily,
} from "@opencok/contracts/world-monster-refresh";
import type { Rules } from "@opencok/rules/game";
import { cityInteger } from "@opencok/rules/city-progression";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import {
  worldMonsterAreaRanges,
  chooseWorldMonsterCells,
  spawnWorldMonsterCells,
  worldMonsterConfiguration,
} from "@opencok/rules/world-monsters";
import {
  worldMonsterIntervals,
  worldMonsterAreaCount,
  worldMonsterFree,
  worldMonsterBlack,
  worldMonsterQuotas,
  worldBarbarianQuota,
  worldBarbarianChoice,
  worldBarbarianBand,
} from "@opencok/rules/world-monster-refresh";
import { serverFeature } from "@opencok/rules/power-context";

const blank = (): WorldMonsterSupplyClock => ({
  version: 1,
  stage: "idle",
  area: 0,
  nextAt: 0n,
  initial: false,
  quota: {},
  remaining: {},
  pool: [],
  attempts: 0,
});

const blackRanges = [[575, 625, 575, 625]];

function clear(row: Row, field: boolean) {
  return field
    ? {
        ...row,
        pointType: 0,
        pointItem: null,
        monsterInfo: null,
        monsterCurrHP: 0,
        startTime: 0n,
        flushTime: 0n,
        flushFlag: 0,
      }
    : { ...row, pointType: 0, startTime: 0n, flushTime: 0n };
}

async function footprint(store: WorldMonsterRefreshStore, row: Row, size: number) {
  let ids: readonly number[] = [];

  try {
    ids = worldFootprint(num(row, "id"), size, true);
  } catch {
    return [row];
  }

  return store.points(ids);
}

async function expire(
  store: WorldMonsterRefreshStore,
  rules: Rules,
  size: number,
  random: (maximum: number) => number,
) {
  let budget = 64;
  const populations = new Map<number, number>();

  for (const point of await store.expired()) {
    if (budget-- <= 0) {break;}

    const live = (await store.points([num(point, "id")]))[0];

    if (!live || long(live, "flushTime") >= store.now) {continue;}

    const type = num(live, "pointType");

    if (type === 7) {
      if (live.runtimeClaimed || text(live, "ownerId") || text(live, "ownerMarchUUid")) {continue;}

      await store.write([clear(live, false)]);
      continue;
    }

    const four =
        type === 6 ||
        type === 44 ||
        ((type === 9 || type === 15) &&
          rules.world.fieldMonsters?.get(text(live, "pointItem"))?.num === "4"),
      all = four ? await footprint(store, live, size) : [live];

    if (
      all.some((row) => row.runtimeClaimed || text(row, "ownerId") || text(row, "ownerMarchUUid"))
    ) {
      if (type === 44) {await store.defer(all, long(live, "flushTime") + 3600000n);}

      continue;
    }

    const ranges = all.filter(
      (row) =>
        num(row, "id") !== num(live, "id") &&
        num(row, "pointType") === (type === 6 ? 7 : type === 44 ? 45 : 17),
    );

    if (type === 6) {
      const side = cityInteger(rules.items.get("worldmap_explore")?.k1, 1, size),
        area = num(live, "monsterAreaId");

      if (area > 0) {
        const free = (await store.cells(worldMonsterAreaRanges(area, side, size))).filter((row) =>
            worldMonsterFree(row),
          ),
          chosen = chooseWorldMonsterCells(free, true, size, random);

        if (chosen.length) {
          const start = cityInteger(rules.items.get("worldmap_explore")?.k3, 1),
            end = cityInteger(rules.items.get("worldmap_explore")?.k4, start),
            hours = start + random(end - start + 1),
            deadline = store.now + BigInt(hours) * 3600000n;
          await store.write(
            chosen.map((row, index) => ({
              ...row,
              pointType: index ? 7 : 6,
              startTime: store.now,
              flushTime: deadline,
            })),
          );
        }
      }

      await store.write([live, ...ranges].map((row) => clear(row, false)));
    } else if (type === 44) {
      const quota = worldBarbarianQuota(rules),
        black = worldMonsterBlack(live),
        area = black ? 0 : num(live, "areaId"),
        limit = black ? cityInteger(rules.items.get("blackland_resource")?.k2) : quota;

      if (!populations.has(area)) {populations.set(area, await store.population(area));}

      const population = populations.get(area)!;

      if (population > limit) {populations.set(area, population - 1);}

      if (
        num(live, "flushFlag") === 0 &&
        (black || text(live, "pointItem") !== "4800000") &&
        population <= limit
      )
        {await store.ticket(
          num(live, "areaId"),
          "0",
          num(live, "resLevel"),
          store.now + 3600000n,
          1 + ranges.length,
        );}

      const cleared = [live, ...ranges].map((row) => ({
        ...clear(row, true),
        pointItem: null,
        resLevel: 0,
        resInitValue: 0,
        resCostValue: 0,
      }));
      await store.barbarian(cleared);
    } else if (type === 9 || type === 15)
      {await store.write([live, ...ranges].map((row) => clear(row, true)));}
  }
}

async function fields(
  store: WorldMonsterRefreshStore,
  rules: Rules,
  size: number,
  kind: "field" | "black",
  random: (maximum: number) => number,
) {
  const side = cityInteger(rules.items.get("monster")?.k1, 1, size),
    count = kind === "black" ? 1 : worldMonsterAreaCount(size, side),
    clock = (await store.clock(kind)) ?? blank();

  if (clock.stage === "idle") {
    if (clock.nextAt > store.now) {return;}

    if (clock.nextAt === 0n && !store.fresh) {
      clock.nextAt = store.now + (kind === "field" ? 9000000n : 60000n);
      await store.save(kind, clock);

      return;
    }

    clock.quota = Object.fromEntries(
      worldMonsterQuotas(rules, store.now - store.monsterStart, kind === "black", random),
    );

    if (!Object.keys(clock.quota).length) {
      clock.nextAt = store.now + worldMonsterIntervals[kind];
      await store.save(kind, clock);

      return;
    }

    clock.area = 1;
    clock.stage = "reset";
    clock.remaining = {};
    clock.pool = [];
    clock.attempts = 0;
  }

  let budget = 64,
    visited = 0;

  while (clock.area <= count && budget > 0 && visited++ < 4) {
    const cells = await store.cells(
      kind === "black" ? blackRanges : worldMonsterAreaRanges(clock.area, side, size),
    );

    if (clock.stage === "reset") {
      const protectedIds = new Set<number>(),
        lookup = new Map(cells.map((row) => [num(row, "id"), row]));

      for (const row of cells) {
        if (
          ![9, 15].includes(num(row, "pointType")) ||
          rules.world.fieldMonsters?.get(text(row, "pointItem"))?.num !== "4"
        )
          {continue;}

        let ids: readonly number[];

        try {
          ids = worldFootprint(num(row, "id"), size, true);
        } catch {
          protectedIds.add(num(row, "id"));
          continue;
        }

        const footprint = ids.every((id) => lookup.has(id))
          ? ids.map((id) => lookup.get(id)!)
          : await store.points(ids);

        if (
          footprint.length !== 4 ||
          footprint.some(
            (point) =>
              point.runtimeClaimed || text(point, "ownerId") || text(point, "ownerMarchUUid"),
          )
        )
          {for (const id of ids) {protectedIds.add(id);}}
      }

      const obsolete = cells
        .filter(
          (row) =>
            [9, 15, 17].includes(num(row, "pointType")) &&
            !protectedIds.has(num(row, "id")) &&
            !row.runtimeClaimed &&
            !text(row, "ownerId") &&
            !text(row, "ownerMarchUUid") &&
            (kind === "black" || num(row, "gridType") === 2) &&
            (num(row, "flushFlag") === 0 || long(row, "flushTime") < store.now),
        )
        .slice(0, Math.min(256, budget));

      if (obsolete.length) {
        await store.write(obsolete.map((row) => clear(row, true)));
        budget -= obsolete.length;

        if (!budget) {
          await store.save(kind, clock);

          return;
        }

        continue;
      }

      clock.remaining = { ...clock.quota };

      for (const row of cells.filter(
        (row) =>
          (row.runtimeClaimed || protectedIds.has(num(row, "id"))) &&
          [9, 15].includes(num(row, "pointType")),
      )) {
        const id = text(row, "pointItem");
        clock.remaining[id] = Math.max(0, (clock.remaining[id] ?? 0) - 1);
      }

      clock.pool = cells
        .filter((row) => worldMonsterFree(row, kind === "black"))
        .map((row) => num(row, "id"));
      clock.attempts = Math.min(
        clock.pool.length,
        Object.values(clock.remaining).reduce((sum, n) => sum + n, 0),
      );
      clock.stage = "fill";
    }

    if (clock.stage === "fill") {
      const lookup = new Map(
        cells
          .filter((row) => worldMonsterFree(row, kind === "black"))
          .map((row) => [num(row, "id"), row]),
      );
      clock.pool = clock.pool.filter((id) => lookup.has(id));

      while (clock.attempts > 0 && clock.pool.length && budget > 0) {
        const ids = Object.keys(clock.remaining).filter((id) => clock.remaining[id]! > 0);

        if (!ids.length) {break;}

        const id = ids[random(ids.length)]!,
          config = worldMonsterConfiguration(rules, id),
          chosen = chooseWorldMonsterCells(
            clock.pool.map((id) => lookup.get(id)!),
            config.four,
            size,
            random,
          );
        clock.remaining[id]!--;
        clock.attempts--;
        budget--;

        if (!chosen.length) {
          clock.pool = [];
          break;
        }

        await store.write(spawnWorldMonsterCells(rules, chosen, id, store.now, 86400));
        const used = new Set(chosen.map((row) => num(row, "id")));
        clock.pool = clock.pool.filter((id) => !used.has(id));
      }

      if (clock.attempts > 0 && clock.pool.length && budget <= 0) {break;}

      clock.area++;
      clock.stage = "reset";
      clock.pool = [];
      clock.remaining = {};
      clock.attempts = 0;
    }
  }

  if (clock.area > count) {
    clock.stage = "idle";
    clock.area = 0;
    clock.nextAt = store.now + worldMonsterIntervals[kind];
    clock.quota = {};
  }

  await store.save(kind, clock);
}

async function exploration(
  store: WorldMonsterRefreshStore,
  rules: Rules,
  size: number,
  random: (maximum: number) => number,
) {
  const kind: WorldMonsterFamily = "exploration",
    side = cityInteger(rules.items.get("worldmap_explore")?.k1, 1, size),
    count = worldMonsterAreaCount(size, side),
    clock = (await store.clock(kind)) ?? blank();

  if (clock.stage === "idle") {
    if (clock.nextAt > 0n) {return;}

    if (!store.fresh) {
      clock.nextAt = store.now + 900000n;
      await store.save(kind, clock);

      return;
    }

    clock.stage = "fill";
    clock.area = 1;
  }

  let budget = 32;

  for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++, clock.area++) {
    const cells = await store.cells(worldMonsterAreaRanges(clock.area, side, size));

    if (
      cells.filter((row) => num(row, "gridType") === 2).length <
      cityInteger(rules.items.get("worldmap_explore")?.k6)
    )
      {continue;}

    const quota = cityInteger(rules.items.get("worldmap_explore")?.k2, 0, 64),
      existing = cells.filter((row) => num(row, "pointType") === 6).length,
      free = cells.filter((row) => worldMonsterFree(row));
    let created = 0;

    for (let index = existing; index < quota && budget > 0; index++, budget--) {
      const chosen = chooseWorldMonsterCells(free, true, size, random);

      if (!chosen.length) {break;}

      const first = cityInteger(rules.items.get("worldmap_explore")?.k3, 1),
        last = cityInteger(rules.items.get("worldmap_explore")?.k4, first),
        duration = BigInt(first + random(last - first + 1)) * 3600000n;
      await store.write(
        chosen.map((row, index) => ({
          ...row,
          pointType: index ? 7 : 6,
          startTime: index ? long(row, "startTime") : store.now,
          flushTime: index ? duration : store.now + duration,
          flushFlag: index ? num(row, "flushFlag") : 0,
        })),
      );
      created++;
      const ids = new Set(chosen.map((row) => num(row, "id")));

      for (let index = free.length - 1; index >= 0; index--)
        {if (ids.has(num(free[index]!, "id"))) {free.splice(index, 1);}}
    }

    if (!budget && existing + created < quota) {
      await store.save(kind, clock);

      return;
    }
  }

  if (clock.area > count) {
    clock.stage = "idle";
    clock.nextAt = store.now + worldMonsterIntervals.exploration;
  }

  await store.save(kind, clock);
}

async function barbarians(
  store: WorldMonsterRefreshStore,
  rules: Rules,
  size: number,
  random: (maximum: number) => number,
) {
  const kind: WorldMonsterFamily = "barbarian",
    side = cityInteger(rules.items.get("world_barbarion")?.k2, 1, size),
    count = worldMonsterAreaCount(size, side),
    quota = worldBarbarianQuota(rules),
    clock = (await store.clock(kind)) ?? blank(),
    open = serverFeature(rules, "barbarion_switch", {
      kingdomId: rules.kingdomId,
      version: "12.06.0",
      now: Number(store.now),
    });

  if (clock.stage === "idle") {
    if (clock.nextAt > store.now) {return;}

    if (clock.nextAt === 0n) {
      clock.initial = store.fresh;
      clock.stage = store.fresh ? "seed" : "fill";
      clock.area = 1;

      if (!store.fresh) {
        clock.stage = "idle";
        clock.nextAt = store.now + 1200000n;
        await store.save(kind, clock);

        return;
      }
    } else {
      clock.stage = "fill";
      clock.area = 1;
    }
  }

  const spawn = async (area: number) => {
    const cells = (
        await store.cells(area === 0 ? blackRanges : worldMonsterAreaRanges(area, side, size))
      ).filter((row) => worldMonsterFree(row, area === 0)),
      chosen = chooseWorldMonsterCells(cells, true, size, random);

    if (!chosen.length) {return false;}

    const actor = worldBarbarianChoice(rules, chosen[0]!, size, random);

    if (!actor) {return false;}

    const points = chosen.map((row, index) => ({
      ...row,
      pointType: index ? 45 : 44,
      pointItem: actor.configId,
      flushTime: store.now + actor.duration,
    }));
    await store.barbarian(points, actor);

    return true;
  };
  let budget = 32;

  if (clock.stage === "seed") {
    for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++) {
      const ranges = worldMonsterAreaRanges(clock.area, side, size),
        band = worldBarbarianBand(rules, { x: ranges[0]![0]!, y: ranges[0]![2]! }, size);

      if (
        ![...(rules.world.barbarians?.values() ?? [])].some(
          (row) => Number(row.area_level) === band,
        )
      ) {
        clock.area++;
        clock.pool = [];
        clock.remaining = {};
        clock.attempts = 0;
        continue;
      }

      const cells = await store.cells(ranges),
        lookup = new Map(
          cells.filter((row) => worldMonsterFree(row)).map((row) => [num(row, "id"), row]),
        );

      if (!clock.remaining["0"]) {
        clock.pool = [...lookup.keys()];
        clock.attempts = quota;
        clock.remaining["0"] = 1;
      }

      clock.pool = clock.pool.filter((id) => lookup.has(id));

      while (clock.attempts > 0 && budget > 0 && clock.pool.length) {
        const chosen = chooseWorldMonsterCells(
          clock.pool.map((id) => lookup.get(id)!),
          true,
          size,
          random,
        );

        if (!chosen.length) {
          clock.pool = [];
          break;
        }

        await store.ticket(clock.area, "0", 0, store.now + 3600000n, 4);
        const ids = new Set(chosen.map((row) => num(row, "id")));
        clock.pool = clock.pool.filter((id) => !ids.has(id));
        clock.attempts--;
        budget--;
      }

      if (clock.attempts && clock.pool.length && !budget) {break;}

      clock.area++;
      clock.pool = [];
      clock.remaining = {};
      clock.attempts = 0;
    }

    if (clock.area > count) {
      clock.stage = "idle";
      clock.area = 0;
      clock.nextAt = store.now + 1200000n;
    }

    await store.save(kind, clock);

    return;
  }

  if (!open) {return;}

  for (const ticket of await store.tickets()) {
    if (!budget--) {break;}

    const area = ticket.blackLand ? 0 : num(ticket, "areaId"),
      limit = area === 0 ? cityInteger(rules.items.get("blackland_resource")?.k2) : quota;

    if ((await store.population(area)) > limit) {
      await store.remove(ticket);
      continue;
    }

    if (await spawn(area)) {await store.remove(ticket);}
    else {await store.retry(ticket, store.now + 3600000n);}
  }

  if ((await store.population(0)) <= cityInteger(rules.items.get("blackland_resource")?.k1)) {
    const maximum = cityInteger(rules.items.get("blackland_resource")?.k2);

    while (budget > 0 && (await store.population(0)) < maximum) {
      budget--;

      if (!(await spawn(0))) {break;}
    }
  }

  for (let visited = 0; clock.area <= count && visited < 4 && budget > 0; visited++) {
    while (budget > 0 && (await store.population(clock.area)) < quota) {
      budget--;

      if (!(await spawn(clock.area))) {break;}
    }

    if (budget > 0) {clock.area++;}
    else {break;}
  }

  if (clock.area > count) {
    clock.stage = "idle";
    clock.area = 0;
    clock.nextAt = store.now + worldMonsterIntervals.barbarian;
  }

  await store.save(kind, clock);
}

export async function refreshWorldMonsters(
  store: WorldMonsterRefreshStore,
  rules: Rules,
  size: number,
  random = randomInt,
) {
  await expire(store, rules, size, random);

  if (store.opening <= 0n || store.opening > store.now) {return;}

  await exploration(store, rules, size, random);
  await barbarians(store, rules, size, random);

  if (store.monsterStart > 0n && store.monsterStart <= store.now) {
    await fields(store, rules, size, "field", random);
    await fields(store, rules, size, "black", random);
  }
}
